import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import { io, userSocketMap } from "../server.js";

const getHiddenUserIds = (user) => (user.hiddenUsers || []).map((id) => id.toString());

// Get all users except the logged in user
export const getUsersForSidebar = async (req, res) =>{
    try {
        const userId = req.user._id;
        const hiddenUsers = getHiddenUserIds(req.user);
        const filteredUsers = await User.find({_id: {$ne: userId}}).select("-password -hiddenUsers");
        const visibleUsers = filteredUsers.filter((user)=> !hiddenUsers.includes(user._id.toString()));

        // Count number of messages not seen
        const unseenMessages = {}
        const promises = visibleUsers.map(async (user) =>{
            const messages = await Message.find({senderId: user._id, receiverId: userId, seen: false})
            if(messages.length > 0){
                unseenMessages[user._id] = messages.length;
            }
        })
        await Promise.all(promises);
        res.json({success: true, users: filteredUsers, unseenMessages, hiddenUsers})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}


// Get all messages for selected user
export const getMessages = async (req, res) =>{
    try{
        const { id: selectedUserId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                {senderId: myId, receiverId: selectedUserId},
                {senderId: selectedUserId, receiverId: myId},
            ]
        })
        await Message.updateMany({senderId: selectedUserId, receiverId: myId}, {seen: true});

        res.json({success: true, messages})


    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// api to mark message as seen using message id
export const markMessageAsSeen = async (req, res)=>{
    try {
        const { id } = req.params;
        await Message.findByIdAndUpdate(id, {seen: true})
        res.json({success: true})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Send message to selected user
export const sendMessage = async (req, res) =>{
    try {
        const {text, image} = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })

        // Emit the new message to the receiver's socket
        const receiverSocketIds = userSocketMap[receiverId];
        if (receiverSocketIds) {
            receiverSocketIds.forEach((socketId)=> {
                io.to(socketId).emit("newMessage", newMessage)
            })
        }

        res.json({success: true, newMessage});

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Delete all messages between logged in user and selected user
export const deleteConversation = async (req, res) =>{
    try {
        const { id: selectedUserId } = req.params;
        const myId = req.user._id;

        await Message.deleteMany({
            $or: [
                {senderId: myId, receiverId: selectedUserId},
                {senderId: selectedUserId, receiverId: myId},
            ]
        });

        res.json({success: true, message: "Chat deleted"});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Hide a user from the logged in user's sidebar and delete the local conversation
export const deleteFriend = async (req, res) =>{
    try {
        const { id: selectedUserId } = req.params;
        const myId = req.user._id;

        await User.findByIdAndUpdate(myId, {
            $addToSet: { hiddenUsers: selectedUserId }
        });

        await Message.deleteMany({
            $or: [
                {senderId: myId, receiverId: selectedUserId},
                {senderId: selectedUserId, receiverId: myId},
            ]
        });

        res.json({success: true, message: "Friend removed", removedUserId: selectedUserId});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Show a removed user in the logged in user's sidebar again
export const restoreFriend = async (req, res) =>{
    try {
        const { id: selectedUserId } = req.params;
        const myId = req.user._id;

        await User.findByIdAndUpdate(myId, {
            $pull: { hiddenUsers: selectedUserId }
        });

        res.json({success: true, message: "Friend restored", restoredUserId: selectedUserId});
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}
