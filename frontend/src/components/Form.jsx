import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import Login from "../pages/Login";
import "../styles/Login.css";
import TopBar from "./TopBar.jsx";

function extractErrorMessage(error) {
  const data = error.response?.data;
  if (!data) return error.message;
  if (typeof data === "string") return data;
  return Object.values(data).flat().join(" ");
}

export default function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const name = method === "login" ? "Login" : "Register";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post(route, { username, password });
      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/explore-page");
      } else {
        navigate("/login");
      }
    } catch (error) {
      setError(extractErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="form-container-container">
        <form onSubmit={handleSubmit} className="form-container">
          <h1>{name}</h1>
          {error && <div className="form-error">{error}</div>}
          <input
            className="form-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
          />
          <input
            className="form-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
          />
          <button className="form-button" type="submit" disabled={loading}>
            {name}
          </button>
        </form>
      </div>
    </>
  );
}
