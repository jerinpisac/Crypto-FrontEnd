import Options from "../components/Options";
import Dltoggle from "../components/Dltoggle";
import React, { useContext, useState } from "react";
import ModalContext from "../context/modalContext";
import UserContext from "../context/userContext";
import LoadingSpinner from "../components/LoadingSpinner";
import Link from "next/link";
import { useRouter } from "next/router";

function Register() {
  const router = useRouter();
  const { userData, setUserData, authtoken, setAuthtoken } =
    useContext(UserContext);

  const { setShowModal, setIsLogin } = useContext(ModalContext);
  const [isLoading, setIsLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const onUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const onEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const onPasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const goToSignup = () => {
    setIsLogin(true);
  };

  const signupBtn = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    const response = await fetch(`http://localhost:5000/api/auth/createuser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
      }),
    });
    const json = await response.json();
    setIsLoading(false);
    if (json.success) {
      localStorage.setItem("token", json.authToken);
      setAuthtoken(json.authToken);
      setShowModal(false);
      setUsername("");
      setEmail("");
      setPassword("");
      router.push("/explorePage");
    } else {
      if (json.errors) {
        console.log(error);
        setError(json.errors[0].msg);
      } else {
        setError(json.error.msg);
      }
    }
  };

  const goToLogin = () => {
    setIsLogin(false);
  };

  const loginBtn = (e) => {
    e.preventDefault();
    loginUser();
  };

  const loginUser = async (guest = false) => {
    setIsLoading(true);

    let bodyObj;
    bodyObj = JSON.stringify({
      username: username,
      password: password,
    });

    const response = await fetch(`http://localhost:5000/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: bodyObj,
    });
    const json = await response.json();
    setIsLoading(false);
    if (json.success) {
      localStorage.setItem("token", json.authToken);
      setAuthtoken(json.authToken);
      setShowModal(false);
      setUsername("");
      setPassword("");
      router.push("/explorePage");
    } else {
      setError(json.error);
    }
  };

  const guestLogin = (e) => {
    e.preventDefault();
    loginUser(true);
  };

  const [isActive, setIsActive] = useState(false);

  const handleRegisterClick1 = () => {
    setIsActive(false);
    // router.push("/RegisterPage");
  };

  const handleLoginClick1 = () => {
    setIsActive(true);
    // router.push("/loginPage");
  };

  return (
    <>
      <Dltoggle />
      <div className="logreg">
        <div className={`main ${isActive ? "active" : ""}`}>
          <div className="toggle-box">
            <div className="toggle-panel toggle-left">
              <label>
                Welcome to RVesting! <br />
                Already have an account?
              </label>
              <button className="login-btn" onClick={handleLoginClick1}>
                Login
              </button>
            </div>
            <div className="toggle-panel toggle-right">
              <label>Hi there! Are you new?</label>
              <button className="register-btn" onClick={handleRegisterClick1}>
                Register
              </button>
            </div>
          </div>
          <div className="form-box">
            <div className="form-box register1">
              <div className="regbody">
                <form
                  method="POST"
                  onSubmit={signupBtn}
                  // style={{ paddingTop: "1px" }}
                >
                  {error && (
                    <div
                      role="alert"
                      style={{
                        color: "red",
                        backgroundColor: "#ffe6e6",
                        padding: "10px",
                        border: "1px solid red",
                        borderRadius: "5px",
                        fontWeight: "bold",
                      }}
                    >
                      {alert(error)}
                    </div>
                  )}
                  <div className="regpage">
                    <div className="regacc">Create an account</div>
                    <div className="set">Setup a new account in a minute</div>
                    <div className="reguser">
                      <input
                        type="text"
                        name="username"
                        id="username"
                        placeholder="Enter username"
                        required
                        onChange={onUsernameChange}
                        value={username}
                      />
                    </div>
                    <div className="regemail">
                      <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Enter your email address"
                        required
                        onChange={onEmailChange}
                        value={email}
                      />
                    </div>
                    <div className="regpwd">
                      <input
                        type="password"
                        name="password"
                        id="password"
                        required
                        placeholder="Enter your password"
                        onChange={onPasswordChange}
                        value={password}
                      />
                    </div>
                    <div className="regcpwd">
                      <input
                        type="password"
                        placeholder="Confirm Password"
                        required
                      />
                    </div>

                    {!isLoading ? (
                      <button type="submit" className="regbutton">
                        Create account
                      </button>
                    ) : (
                      <LoadingSpinner />
                    )}
                    {/* Register{" "} */}
                    <div className="fp">
                      <Link href="/forgotPage">Forgot Password?</Link>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="form-box login1">
              <div className="logbody">
                <form method="POST" onSubmit={loginBtn}>
                  <div className="logpage">
                    <div className="logacc">Login into account</div>
                    <div className="use">
                      Use your credentials to access your account
                    </div>
                    <div className="loguser">
                      <input
                        type="text"
                        name="username"
                        id="username"
                        placeholder="Enter your username"
                        required
                        onChange={onUsernameChange}
                        value={username}
                      />
                    </div>
                    <div className="logpwd">
                      <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Enter your Password"
                        required
                        onChange={onPasswordChange}
                        value={password}
                      />
                    </div>

                    {!isLoading ? (
                      <button
                        className="logbutton"
                        type="submit"
                        onClick={guestLogin}
                      >
                        Login
                      </button>
                    ) : (
                      <LoadingSpinner />
                    )}

                    <div className="fp">
                      <Link href="/forgotPage">Forgot Password?</Link>
                    </div>
                    {/* <div className="logother">
                      <label>Or login with</label>
                    </div>
                    <Options /> */}
                  </div>
                </form>
                {isLoading && (
                  <div className="mt-2 p-2 border border-zinc-600 text-xs text-zinc-400 bg-zinc-750/75 rounded-md">
                    This may take a few seconds to load due to inactivity.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;
