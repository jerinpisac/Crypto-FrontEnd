import React, { useState } from "react";
import Header from "../components/Header";
import { useRouter } from "next/router";

const forgotPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [newpassword, setNewpassword] = useState("");

  const forgetBtn = async (e) => {
    console.log(username, email, newpassword);
    const response = await fetch(
      `http://localhost:5000/api/auth/forgotpassword`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          newpassword,
        }),
      }
    );
    const json = await response.json();
    console.log(json);
    if (json.success) {
      alert("Password reset successfully");
      router.push("/loginPage");
    } else {
      console.log(json.error);
    }
  };

  return (
    <>
      <Header />
      <div className="fp-container">
        <div className="fp-box">
        <h1>Forgot Password</h1>
        <p>Enter your correct username and email to reset your password.</p>
        <form method="POST" onSubmit={forgetBtn}>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username..."
              required
            />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email..."
              required
            />
            <input
              id="newpassword"
              type="password"
              value={newpassword}
              onChange={(e) => setNewpassword(e.target.value)}
              placeholder="Enter the new password..."
              required
            />
          <button type="submit">Reset Password</button>
        </form>
        </div>
      </div>
    </>
  );
};

export default forgotPage;
