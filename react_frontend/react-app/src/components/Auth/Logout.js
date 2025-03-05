import { useNavigate } from "react-router-dom";

export const handleLogout = async (navigate) => {
    try {
        const accessToken = localStorage.getItem("access_token");

        // Only attempt to call logout API if we have tokens
        if (accessToken) {
            await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/logout`, {
                method: "POST",
                credentials: "include", // 確保包含 cookies
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }

        // 清除所有身份驗證相關數據
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");

        alert("登出成功");
        navigate("/login");

    } catch (error) {
        console.error("登出錯誤:", error);
        // 即使 logout API 失敗，也清除 local storage
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        
        navigate("/login");
    }
};

function Logout() {
    const navigate = useNavigate();

    // Convert to button click rather than auto-logout
    return <button onClick={() => handleLogout(navigate)}>登出</button>;
}

export default Logout;
