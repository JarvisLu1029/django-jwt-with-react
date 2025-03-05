import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const RequireAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const token = localStorage.getItem("access_token");

    useEffect(() => {
        const verifyToken = async () => {
            // If no token exists, immediately set not authenticated
            if (!token) {
                setIsAuthenticated(false);
                setIsLoading(false);
                return;
            }

            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/verify_token`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    // Token is valid
                    setIsAuthenticated(true);
                } else {
                    // Token is invalid - clear it
                    console.log("Token validation failed, clearing token");
                    localStorage.removeItem("access_token");
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error("Token 驗證失敗:", error);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        verifyToken();
    }, [token]); // Only re-run if token changes

    // Show loading state during verification
    if (isLoading) {
        return <div>驗證中...</div>;
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default RequireAuth;
