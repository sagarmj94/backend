const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const { generateResponse, generateVector } = require("../services/ai.service");

const messageModel = require("../models/message.model");
const { createMemory, queryMemory } = require("../services/vector.service");

function initSocketServer(httpServer) {
    const io = new Server(httpServer, {});

    io.use(async (socket, next) => {

        const cookiesData = cookie.parse(socket.handshake.headers?.cookie || "");
        if (!cookiesData.token) {
            return next(new Error("Authentication error"));
        }

        try {
            const decoded = jwt.verify(cookiesData.token, process.env.JWT_SECRET);
            const user = await userModel.findById(decoded.id)
            socket.user = user;
            next();
        } catch (err) {
            return next(new Error("Authentication error"));
        }
    });

    io.on("connection", (socket) => {
        socket.on("ai-message", async (messagePayload) => {

            await messageModel.create({
                chat: messagePayload.chat,
                user: socket.user._id,
                content: messagePayload.content,
                role: "user",
            });


            const vectors = await generateVector(messagePayload.content);

            const chatHistory = (await messageModel.find({
                chat: messagePayload.chat
            }).sort({
                createdAt: -1
            }).limit(20).lean()).reverse()

            const response = await generateResponse(chatHistory.map(item => {
                return { role: item.role, parts: [{ text: item.content }] }
            }));

            await messageModel.create({
                user: socket.user._id,
                chat: messagePayload.chat,
                content: response,
                role: "model",
            });

            socket.emit("ai-response", {
                content: response,
                chat: messagePayload.chat,
                history: chatHistory
            });

        });
    });
    return io;
}

module.exports = { initSocketServer };