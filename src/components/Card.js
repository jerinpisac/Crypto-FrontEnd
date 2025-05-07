const Card = ({ ticker, price, name, logo, description, position }) => {
  return (
    <div className="item" style={{ "--position": position }}>
      <div className="card-container">
        <div className={`card${position}`}>
          <div className="card-front">
            <img
              src={
                logo ||
                "https://img.freepik.com/free-vector/colorful-bird-illustration-gradient_343694-1741.jpg"
              }
            />
            <h2>{ticker}</h2>
            <h4>{name}</h4>
            <h4>
              <span>&#36;</span>
              {price}
            </h4>
          </div>
          <div className="card-back">
            <h4>{description}</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
