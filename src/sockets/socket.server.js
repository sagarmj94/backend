const { Server } = require("socket.io");
const cookie = require("cookie");

function initSocketServer(httpServer) {
    const io = new Server(httpServer, {});

    //middleware for authentication
    io.use((socket, next) => {
        const cookiesData = cookie.parse(socket.handshake.headers.cookie);
        if (!cookiesData.token) {
            return next(new Error("Authentication error"));
        }
        socket.token = cookiesData.token;
        next();
    });

    io.on("connection", (socket) => {
        console.log("a user connected", socket.id);
        socket.on("disconnect", () => {
            console.log("user disconnected");
        });
    });
    return io;
}

module.exports = { initSocketServer };