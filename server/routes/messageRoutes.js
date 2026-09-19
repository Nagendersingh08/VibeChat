import express from "express";
import { protectRoute } from "../middleware/auth.js";
import { deleteConversation, deleteFriend, getMessages, getUsersForSidebar, markMessageAsSeen, restoreFriend, sendMessage } from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.get("/users", protectRoute, getUsersForSidebar);
messageRouter.get("/:id", protectRoute, getMessages);
messageRouter.put("/mark/:id", protectRoute, markMessageAsSeen);
messageRouter.post("/send/:id", protectRoute, sendMessage)
messageRouter.put("/friend/:id", protectRoute, restoreFriend);
messageRouter.delete("/conversation/:id", protectRoute, deleteConversation);
messageRouter.delete("/friend/:id", protectRoute, deleteFriend);

export default messageRouter;
