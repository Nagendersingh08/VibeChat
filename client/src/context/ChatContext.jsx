import { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContextValue";
import { ChatContext } from "./ChatContextValue";
import toast from "react-hot-toast";

export const ChatProvider = ({ children }) => {

    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({});
    const [hiddenUsers, setHiddenUsers] = useState([]);

    const {socket, axios} = useContext(AuthContext);

    // Function to get all users for sidebar

    const getUsers = useCallback(async () =>{
        try {
            const { data } = await axios.get("/api/messages/users");
            if(data.success){
                const nextHiddenUsers = data.hiddenUsers || [];
                setHiddenUsers(nextHiddenUsers)
                setUsers(data.users)
                setUnseenMessages(data.unseenMessages)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }, [axios])

    // Function to get messages for selected user

    const getMessages = useCallback(async (userId)=>{
        try {
            const { data } = await axios.get(`/api/messages/${userId}`);
            if(data.success){
                setMessages(data.messages)
                setUnseenMessages((prevUnseenMessages)=> ({
                    ...prevUnseenMessages,
                    [userId]: 0
                }))
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }, [axios])

    // Function to send message to selected user

    const sendMessage = useCallback(async (messageData)=>{
        if(!selectedUser) return;

        try {
            const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
            if(data.success){
                setMessages((prevMessages)=>[...prevMessages, data.newMessage])
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }, [axios, selectedUser])

    // Function to delete chat messages with selected user

    const deleteConversation = useCallback(async ()=>{
        if(!selectedUser) return;

        try {
            const { data } = await axios.delete(`/api/messages/conversation/${selectedUser._id}`);
            if(data.success){
                setMessages([]);
                setUnseenMessages((prevUnseenMessages)=> ({
                    ...prevUnseenMessages,
                    [selectedUser._id]: 0
                }))
                toast.success(data.message);
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }, [axios, selectedUser])

    // Function to remove a user from sidebar

    const deleteFriend = useCallback(async (userId)=>{
        try {
            const { data } = await axios.delete(`/api/messages/friend/${userId}`);
            if(data.success){
                const removedUserId = data.removedUserId || userId;
                setHiddenUsers((prevHiddenUsers)=> prevHiddenUsers.includes(removedUserId) ? prevHiddenUsers : [...prevHiddenUsers, removedUserId]);
                setUnseenMessages((prevUnseenMessages)=> {
                    const nextUnseenMessages = {...prevUnseenMessages};
                    delete nextUnseenMessages[removedUserId];
                    return nextUnseenMessages;
                })
                if(selectedUser?._id === removedUserId){
                    setSelectedUser(null);
                    setMessages([]);
                }
                toast.success(data.message);
            }else{
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }, [axios, selectedUser])

    // Function to show a removed user again when they are selected from search

    const restoreFriend = useCallback(async (userId)=>{
        if(!hiddenUsers.includes(userId)) return true;

        try {
            const { data } = await axios.put(`/api/messages/friend/${userId}`);
            if(data.success){
                const restoredUserId = data.restoredUserId || userId;
                setHiddenUsers((prevHiddenUsers)=> prevHiddenUsers.filter((hiddenUserId)=> hiddenUserId !== restoredUserId));
                return true;
            }

            toast.error(data.message);
        } catch (error) {
            toast.error(error.message);
        }

        return false;
    }, [axios, hiddenUsers])

    // Function to subscribe to messages for selected user

    const subscribeToMessages = useCallback(()=>{
        if(!socket) return;

        socket.on("newMessage", (newMessage)=>{
            const senderId = newMessage.senderId?.toString?.() || newMessage.senderId;

            if(selectedUser && senderId === selectedUser._id){
                newMessage.seen = true;
                setMessages((prevMessages)=> [...prevMessages, newMessage]);
                setUnseenMessages((prevUnseenMessages)=> ({
                    ...prevUnseenMessages,
                    [senderId]: 0
                }))
                axios.put(`/api/messages/mark/${newMessage._id}`);
            }else{
                setUnseenMessages((prevUnseenMessages)=>({
                    ...prevUnseenMessages, [senderId] : prevUnseenMessages[senderId] ? prevUnseenMessages[senderId] + 1 : 1
                }))
            }
        })
    }, [axios, selectedUser, socket])

    // Function to unsubscribe from messages

    const unsubscribeFromMessages = useCallback(()=>{
        if(socket) socket.off("newMessage");
    }, [socket])

    useEffect(()=>{
        subscribeToMessages();
        return ()=> unsubscribeFromMessages();
    },[subscribeToMessages, unsubscribeFromMessages])


    const value = {
        messages, users, selectedUser, hiddenUsers, getUsers, getMessages, sendMessage, deleteConversation, deleteFriend, restoreFriend, setSelectedUser, unseenMessages, setUnseenMessages
    }

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}
