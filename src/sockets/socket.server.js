const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const { generateResponse } = require("../services/ai.service");

const messageModel = require("../models/message.model");

function initSocketServer(httpServer) {
    const io = new Server(httpServer, {});

    //middleware for authentication
    io.use(async (socket, next) => {

        const cookiesData = cookie.parse(socket.handshake.headers?.cookie || "");
        if (!cookiesData.token) {
            return next(new Error("Authentication error"));
        }

        // verify token
        try {
            const decoded = jwt.verify(cookiesData.token, process.env.JWT_SECRET);
            const user = await userModel.findById(decoded.id)
            socket.user = user;
            next();
        } catch (err) {
            return next(new Error("Authentication error"));
        }
    });

    // socket connection
    io.on("connection", (socket) => {
        socket.on("ai-message", async (messagePayload) => {
            console.log("messagePayload", messagePayload)

            await messageModel.create({
                user: socket.user._id,
                chat: messagePayload.chat,
                content: messagePayload.content,
                role: "user",
            });
            const response = await generateResponse(messagePayload?.content);

            await messageModel.create({
                user: socket.user._id,
                chat: messagePayload.chat,
                content: response,
                role: "model",
            });



            try {
                socket.emit("ai-response", {
                    content: response,
                    chat: messagePayload.chat
                });

            } catch (error) {
                console.error("AI Service Error:", error.message);

                socket.emit("ai-response", {
                    content: "⚠️ Sorry, something went wrong while generating AI response.",
                    chat: messagePayload.chat,
                });
            }
        });
        socket.on("disconnect", () => {
            console.log("❌ User disconnected:", socket.user?.email || socket.user?._id);
        });
    });
    return io;
}

module.exports = { initSocketServer };