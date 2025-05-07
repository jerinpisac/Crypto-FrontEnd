import React, { useContext, useState } from "react";
import InnerHeader from "../components/InnerHeader";
import UserContext from "../context/userContext";

function ProfilePage() {
  const { userData, setUserData } = useContext(UserContext);
  const [cashToAdd, setCashToAdd] = useState("");
  const [message, setMessage] = useState("");

  const handleAddCash = async (e) => {
    e.preventDefault();
    setCashToAdd(parseFloat(cashToAdd));
    if (!cashToAdd) return;

    try {
      const response = await fetch(
        "http://localhost:5000/api/exchange/updateCash",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
          body: JSON.stringify({ cash: parseFloat(cashToAdd) }),
        }
      );
      // console.log(response);

      if (response.ok) {
        setCashToAdd(parseFloat(cashToAdd));
        setMessage("Cash Updated successfully!");
        window.location.reload();
      } else {
        const errorData = await response.json();
        setMessage(`Failed to add cash: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error adding cash:", error);
      setMessage("Failed to add cash: Network error");
    }
  };

  return (
    <>
      <InnerHeader />
      <div
        className="profmain"
        style={{
          margin: "0px auto",
          border: "1px solid var(--text_color)",
          borderRadius: "10px",
          color: "var(--text_color)",
          marginTop: "150px",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "50px" }}>
          Profile Page
        </h1>
        {userData ? (
          <div className="profbody">
            <p>
              <strong>Userame:</strong> {userData.name}
            </p>
            <p>
              <strong>Email:</strong> {userData.email}
            </p>
            <p>
              <strong>Cash Balance:</strong> ₹
              {userData.cash.toLocaleString("en-IN")}
            </p>
            <div style={{ marginTop: "20px" }}>
              <input
                type="number"
                value={cashToAdd}
                onChange={(e) => setCashToAdd(e.target.value)}
                placeholder="Enter amount to add"
                style={{
                  width: "100%",
                  padding: "10px",
                  marginBottom: "10px",
                  borderRadius: "5px",
                  border: "1px solid var(--text_color)",
                  backgroundColor: "var(--bg_color)",
                  color: "var(--text_color)",
                }}
              />
              <button
                onClick={handleAddCash}
                style={{
                  width: "100%",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  border: "2px solid #0070f3",
                  backgroundColor: "var(--bg_color)",
                  color: "#0070f3",
                  cursor: "pointer",
                }}
              >
                Add Cash
              </button>
            </div>
            {message && (
              <p style={{ marginTop: "20px", color: "red" }}>{message}</p>
            )}
          </div>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>
    </>
  );
}

export default ProfilePage;
