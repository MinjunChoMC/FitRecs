import "../styles/TopBar.css";
import { Navigate, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { useState, useEffect } from "react";
import AccountIcon from "../assets/accountIcon.svg?react";

export default function TopBar() {
  const [isAuthorized, setIsAuthorized] = useState(null);
  let navigate = useNavigate();
  useEffect(() => {
    auth().catch(() => setIsAuthorized(false));
  }, []);

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
      const res = await api.post("/api/token/refresh/", {
        refresh: refreshToken,
      });
      if (res.status === 200) {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.log(error);
      setIsAuthorized(false);
    }
  };

  const auth = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setIsAuthorized(false);
      return;
    }
    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp;
    const now = Date.now() / 1000;

    if (tokenExpiration < now) {
      await refreshToken();
    } else {
      setIsAuthorized(true);
    }
  };
  const topRightButtons = isAuthorized ? (
    <div className="top-right">
      <button
        className="btn btn-icon user-account-button"
        onClick={() => {
          navigate("/user-account");
        }}
      >
        <AccountIcon />
      </button>
      <div className="to-upload">
        <a
          href="http://localhost:5173/upload-page"
          className="btn btn-primary to-upload-link"
        >
          Upload Image
        </a>
      </div>
    </div>
  ) : (
    <div className="top-right">
      <button
        className="btn btn-secondary"
        onClick={() => {
          navigate("/login");
        }}
      >
        Login
      </button>
      <button
        className="btn btn-primary"
        onClick={() => {
          navigate("/register");
        }}
      >
        Register
      </button>
    </div>
  );
  return (
    <>
      <div className="TopBar">
        <a className="logo" href="http://localhost:5173/explore-page">
          FitRecs
        </a>
        {topRightButtons}
      </div>
    </>
  );
}
