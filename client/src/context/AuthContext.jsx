import { useCallback, useEffect, useMemo, useState } from "react";
import axiosClient from 'axios'
import toast from "react-hot-toast";
import {io} from "socket.io-client"
import { AuthContext } from "./AuthContextValue";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const api = axiosClient.create({ baseURL: backendUrl });

const withAuthHeaders = (token, config = {}) => ({
    ...config,
    headers: {
        ...config.headers,
        ...(token ? { token } : {}),
    },
});

export const AuthProvider = ({ children })=>{

    const [token, setToken ] = useState(() => {
        localStorage.removeItem("token");
        return sessionStorage.getItem("token");
    });
    const [authUser, setAuthUser ] = useState(null);
    const [onlineUsers, setOnlineUsers ] = useState([]);
    const [socket, setSocket ] = useState(null);

    // Login function to handle user authentication and socket connection

    const login = async (state, credentials)=>{
        try {
            const { data } = await api.post(`/api/auth/${state}`, credentials);
            if (data.success){
                setAuthUser(data.userData);
                connectSocket(data.userData);
                setToken(data.token);
                sessionStorage.setItem("token", data.token)
                toast.success(data.message)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Logout function to handle user logout and socket disconnection

    const logout = async () =>{
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");
        setToken(null);
        setAuthUser(null);
        setOnlineUsers([]);
        toast.success("Logged out successfully");
        setSocket((currentSocket) => {
            currentSocket?.disconnect();
            return null;
        });
    }

    // Update profile function to handle user profile updates

    const updateProfile = async (body)=>{
        try {
            const { data } = await api.put("/api/auth/update-profile", body, withAuthHeaders(token));
            if(data.success){
                setAuthUser(data.user);
                toast.success("Profile updated successfully")
                return true;
            }
            toast.error(data.message)
            return false;
        } catch (error) {
            toast.error(error.message)
            return false;
        }
    }


    // Connect socket function to handle socket connection and online users updates
    const connectSocket = useCallback((userData)=>{
        if(!userData) return;

        setSocket((currentSocket) => {
            if(currentSocket?.connected) return currentSocket;

            const newSocket = io(backendUrl, {
                query: {
                    userId: userData._id,
                }
            });
            newSocket.connect();

            newSocket.on("getOnlineUsers", (userIds)=>{
                setOnlineUsers(userIds.map((userId)=> userId.toString()));
            })

            return newSocket;
        });
    }, [])

    useEffect(()=>{
        if(!token) return;

        let isMounted = true;

        const checkAuth = async () => {
            try {
                const { data } = await api.get("/api/auth/check", withAuthHeaders(token));
                if (isMounted && data.success) {
                    setAuthUser(data.user)
                    connectSocket(data.user)
                }
            } catch (error) {
                toast.error(error.message)
            }
        }

        checkAuth();

        return () => {
            isMounted = false;
        }
    },[connectSocket, token])

    const axios = useMemo(() => ({
        get: (url, config) => api.get(url, withAuthHeaders(token, config)),
        post: (url, data, config) => api.post(url, data, withAuthHeaders(token, config)),
        put: (url, data, config) => api.put(url, data, withAuthHeaders(token, config)),
        delete: (url, config) => api.delete(url, withAuthHeaders(token, config)),
    }), [token])


    const value = {
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
