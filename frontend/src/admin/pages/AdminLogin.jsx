import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { MainContext } from "../../Context";
import { login } from "../../redux/reducers/adminSlice";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { API_BASE_URL, ADMIN_URL, notify, adminToken, setAdminToken } = useContext(MainContext);

  useEffect(() => {
    if (adminToken) {
      navigate("/admin");
    }
  }, [adminToken, navigate]);


  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    try {
      const res = await axios.post(`${API_BASE_URL}${ADMIN_URL}/login`, {
        email,
        password,
      });

      const data = res.data;
      if (data.status === true) {
        const decoded = jwtDecode(data.token);
        if (decoded.exp * 1000 < Date.now()) {
          notify("Token is expired. Please login again.", false);
          return;
        }
        localStorage.setItem("admin", JSON.stringify({ data: data.admin, token: data.token }));
        localStorage.setItem("adminToken", data.token);
        setAdminToken(data.token);
        dispatch(login({ data: data.admin, token: data.token }));
        notify(data.msg, true);
        navigate("/admin");
      }
      else {
        setError(data.msg || "Login failed");
        notify(data.msg || "Login failed", false);
      }
    } catch (err) {
      console.error(err);
      setError("Internal server error");
      notify("Internal server error", false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded shadow-md w-full max-w-sm"
      >
        <h2 className="text-xl font-semibold mb-4 text-center">Admin Login</h2>
        {error && (
          <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-3 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition"
        >          Login
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          Forgot your password?{" "}
          <a href="/admin/login" className="text-blue-500 hover:underline">
            Reset here
          </a>
        </p>
      </form>
    </div>
  );
};

export default AdminLogin;
