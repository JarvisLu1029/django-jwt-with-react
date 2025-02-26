import { useState } from "react";
import "../main.css";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error("Login failed");
            }

            const data = await response.json();
            localStorage.setItem("access_token", data.access);
            localStorage.setItem("refresh_token", data.refresh);
            alert("Login successful!");
            window.location.href = "/"; // 登入成功後導向首頁

        } catch (error) {
            alert("Login failed, please check your username and password");
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <input type="text" placeholder="帳號" onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="密碼" onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}

export default Login;
