import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../main.css";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent form submission refresh
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/login`, {
                method: "POST",
                credentials: "include", // For cookies
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || "Login failed");
            }

            // Store tokens securely
            if (data.access) {
                localStorage.setItem("access_token", data.access);
            }
            
            // Store user info if available
            if (data.user_id) {
                localStorage.setItem("user", JSON.stringify({
                    user_id: data.user_id,
                    username: data.username,
                    email: data.email,
                    role: data.role,
                }));
            }

            console.log("Login successful, redirecting...");
            
            // Use navigate instead of window.location for React Router
            navigate("/");
        } catch (error) {
            console.error("Login error:", error);
            setError("Login failed. Please check your credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input 
                    type="text" 
                    placeholder="帳號" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)} 
                    disabled={isLoading}
                    required
                />
                <input 
                    type="password" 
                    placeholder="密碼" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                    disabled={isLoading}
                    required
                />
                {error && <div className="error-message">{error}</div>}
                <button type="submit" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
}

export default Login;
