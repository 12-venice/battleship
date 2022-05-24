export default (socket) => {
    const createMessage = (room, message) => {
        // ...
    };

    socket.on('message:create', createMessage);
};
