import { useState, useEffect } from "react";
import Logout from "./Auth/Logout";

function UserInfo() {
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/user_info`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Error getting user info");
                }

                const data = await response.json();
                setUserInfo(data);
            } catch (error) {
                console.error("Failed to fetch user info:", error);
            }
        };

        fetchUserInfo();
    }, []);

    return (
        <div>
            {userInfo ? (
                <div className="info-container">
                    <h3>使用者資訊：</h3>
                    <p><strong>ID:</strong> {userInfo.id}</p>
                    <p><strong>名稱:</strong> {userInfo.name}</p>
                    <p><strong>Email:</strong> {userInfo.email}</p>
                    <Logout />
                </div>
            ) : (
                <p>載入中...</p>
            )}
        </div>
    );
}

export default UserInfo;
