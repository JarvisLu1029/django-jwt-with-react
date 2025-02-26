import { useNavigate } from "react-router-dom";

export const handleLogout = async (navigate) => {
    try {
        const refreshToken = localStorage.getItem("refresh_token");

        if (!refreshToken) {
            throw new Error("無效的 Refresh Token");
        }

        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh_token: refreshToken }), // 傳遞 Refresh Token 在 body
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "登出失敗");
        }

        // 清除 Token
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        alert("登出成功");
        navigate("/login");
    } catch (error) {
        console.error("登出錯誤:", error);
        alert(error.message || "登出失敗");
    }
};

function Logout() {
    const navigate = useNavigate();

    return <button onClick={() => handleLogout(navigate)}>登出</button>;
}

export default Logout;
