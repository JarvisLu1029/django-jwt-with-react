import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const RequireAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const token = localStorage.getItem("access_token");

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/verify_token`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                    localStorage.removeItem("access_token"); // 移除無效 token
                }
            } catch (error) {
                console.error("Token 驗證失敗:", error);
                setIsAuthenticated(false);
            }
        };

        if (token) {
            verifyToken();
        } else {
            setIsAuthenticated(false);
        }
    }, [token]);

    if (isAuthenticated === null) {
        return <div>驗證中...</div>; // 顯示加載畫面
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default RequireAuth;
