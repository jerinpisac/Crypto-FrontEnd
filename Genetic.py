import yfinance as yf
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
import matplotlib.pyplot as plt
from datetime import datetime, timedelta
import streamlit as st

# --- Core Data and Optimization Functions ---

def get_crypto_data(symbols, start_date, end_date):
    try:
        data = yf.download(symbols, start=start_date, end=end_date)['Adj Close']
        return data
    except Exception as e:
        st.error(f"Error downloading data: {e}")  # Display error in Streamlit
        return pd.DataFrame()  # Return empty DataFrame to avoid further errors


def fitness_function(individual, scaled_data):
    weights = np.array(individual)
    weights /= weights.sum()
    portfolio_returns = (scaled_data * weights).sum(axis=1)
    total_return = (portfolio_returns[-1] / portfolio_returns[0] - 1) * 100
    return total_return

def create_individual(num_symbols):
    individual = np.random.rand(num_symbols)
    return individual.tolist()

def mutate(individual, mutation_rate):  # Add mutation rate parameter
    for i in range(len(individual)):
        individual[i] += np.random.uniform(-mutation_rate, mutation_rate)
    return individual

def crossover(parent1, parent2):
    child = [(p1 + p2) / 2 for p1, p2 in zip(parent1, parent2)]
    return child

def genetic_algorithm(population_size, generations, mutation_rate, scaled_data):  # Add mutation rate
    num_symbols = len(scaled_data.columns)  # Get from scaled data
    population = [create_individual(num_symbols) for _ in range(population_size)]

    for generation in range(generations):
        fitness_scores = [fitness_function(individual, scaled_data) for individual in population]
        selected_parents = []
        tournament_size = max(2, population_size // 10)  # Ensure tournament size is at least 2
        for _ in range(population_size):
            tournament_indices = np.random.choice(population_size, tournament_size, replace=False)
            tournament_fitness = [fitness_scores[i] for i in tournament_indices]
            winner_index = tournament_indices[np.argmax(tournament_fitness)]
            selected_parents.append(population[winner_index])

        new_population = []
        for i in range(0, population_size, 2):
            parent1 = selected_parents[i]
            parent2 = selected_parents[i+1] if i+1 < population_size else selected_parents[i]
            child1 = crossover(parent1, parent2)
            child2 = crossover(parent2, parent1)
            new_population.extend([mutate(child1, mutation_rate), mutate(child2, mutation_rate)]) # Pass mutation rate

        population = new_population

    fitness_scores = [fitness_function(individual, scaled_data) for individual in population]
    best_individual = population[np.argmax(fitness_scores)]
    return best_individual



# --- Streamlit Frontend ---
st.title("Portfolio Optimizer")

# --- Input Options ---
all_crypto_symbols = ["BTC-USD", "ETH-USD", "ADA-USD", "DOGE-USD", "SOL-USD", "XRP-USD"]
selected_symbols = st.multiselect("Select stocks for your portfolio", all_crypto_symbols, default=["BTC-USD", "ETH-USD"])

if not selected_symbols:
    st.warning("Please select at least one cryptocurrency.")
    st.stop()

budget = st.number_input("Enter your budget (optional)", value=1000000, min_value=0)

col1, col2, col3 = st.columns(3)

population_size = col1.slider("Population size", min_value=50, max_value=500, value=100, step=50)
generations = col2.slider("Number of generations", min_value=50, max_value=500, value=100, step=50)
mutation_rate = col3.slider("Mutation rate", min_value=0.01, max_value=0.50, value=0.10, step=0.01)


col4, col5 = st.columns(2)
start_date_str = col4.date_input("Backtest start date", value=datetime(2021, 1, 1))
end_date_str = col5.date_input("Backtest end date", value=datetime(2024, 12, 31))

start_date = pd.to_datetime(start_date_str)
end_date = pd.to_datetime(end_date_str)

if start_date >= end_date:
    st.error("Error: Start date must be before end date.")
    st.stop()

# --- Run Optimization ---
if st.button("Optimize Portfolio"):
    with st.spinner("Optimizing portfolio..."):
        try:
            crypto_data = get_crypto_data(selected_symbols, start_date, end_date)
            if crypto_data.empty:
                st.error("No data could be retrieved for the selected symbols and date range.")
                st.stop()

            crypto_data.fillna(method='ffill', inplace=True)
            scaler = MinMaxScaler()
            scaled_data = pd.DataFrame(scaler.fit_transform(crypto_data), columns=selected_symbols, index=crypto_data.index) # Fit and transform in one step

            best_weights = genetic_algorithm(population_size, generations, mutation_rate, scaled_data)

            best_weights = np.array(best_weights)
            best_weights /= best_weights.sum()

            selected_cryptos = [selected_symbols[i] for i, weight in enumerate(best_weights) if weight > 0]

            if not selected_cryptos:
                st.warning("No cryptocurrencies were selected. Try adjusting parameters.")
                st.stop()

            selected_data = get_crypto_data(selected_cryptos, start_date, end_date)

            portfolio_returns = (selected_data * best_weights[best_weights > 0]).sum(axis=1)
            total_return = (portfolio_returns[-1] / portfolio_returns[0] - 1) * 100
            annualized_return = (1 + total_return / 100)**(252/len(portfolio_returns.index)) - 1


            st.subheader("Optimization Results")
            st.write("Selected stocks:", ", ".join(selected_cryptos))
            st.write("Budget (optional):", f"${budget:,.2f}")

            st.subheader("Performance Metrics")
            st.write("Total Return:", f"{total_return:.2f}%")
            st.write("Annualized Return:", f"{annualized_return:.2f}%")

            st.subheader("Portfolio Cumulative Returns")
            fig, ax = plt.subplots(figsize=(10, 6))
            ax.plot(portfolio_returns.index, (portfolio_returns / portfolio_returns[0]), label='Portfolio Cumulative Returns')
            ax.set_xlabel('Date')
            ax.set_ylabel('Cumulative Returns')
            ax.set_title('Portfolio Cumulative Returns')
            ax.grid(True)
            ax.legend()
            st.pyplot(fig)

        except Exception as e:
            st.error(f"An error occurred during optimization: {e}")