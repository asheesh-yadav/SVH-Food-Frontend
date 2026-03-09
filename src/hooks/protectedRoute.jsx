"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";

import { setVerified } from "@/store/home_Slices/emailLogin";
import LoadingSpinner from "@/components/loadin-spinner";

function ProtectedRoute({ children }) {
    const dispatch = useDispatch();
    const router = useRouter();

    const isVerified = useSelector((state) => state.emailLogin.isVerified);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const verifyUser = async () => {
            try {
                // Get user data from localStorage
                const userStr = localStorage.getItem('svh_user');
                
                if (!userStr) {
                    throw new Error("No user found");
                }
    
                // Parse the user object to get the ID
                const userData = JSON.parse(userStr);
                const userId = userData._id;
    
                if (!userId) {
                    throw new Error("Invalid user data");
                }
    
                const response = await fetch(
                    `https://svh-food-project.onrender.com/api/auth/me`,
                    {
                        method: "GET",
                        credentials: "include",
                        headers: {
                            Authorization: `Bearer ${userId}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
    
                if (!response.ok) {
                    throw new Error("Unauthorized");
                }
    
                const Data = await response.json();
    
                if (Data?.success) {
                    dispatch(setVerified(true));
                } else {
                    dispatch(setVerified(false));
                    localStorage.removeItem('svh_user');
                    router.push("/");
                }
            } catch (error) {
                console.log("Verify failed:", error.message);
                dispatch(setVerified(false));
                localStorage.removeItem('svh_user');
                router.push("/");
            } finally {
                setIsChecking(false);
            }
        };
    
        verifyUser();
    }, [dispatch, router]);
    // Show loading while checking auth
    if (isChecking) {
        return <LoadingSpinner />;
    }

    if (!isVerified) {
        return <LoadingSpinner />;
    }
 
    return children;
}

export default ProtectedRoute;