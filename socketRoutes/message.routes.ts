/* eslint-disable import/no-default-export */
import { Socket } from 'socket.io';
import { io } from 'src/server';
import Message from '../serverModels/message';
import User from '../serverModels/user';
import Room from '../serverModels/room';
import { getUserOnline } from './usersOnline';

export default (socket: Socket) => {
    const sentMessage = async ({
        room,
        message,
    }: {
        room: string;
        message: string;
    }) => {
        const createdUserId = getUserOnline(socket.id);
        const createdUser = await User.findOne({ _id: createdUserId });
        const newMessage = new Message({
            text: message,
            user: createdUser,
            room,
        });
        await newMessage.save((err: string, obj: object) => {
            if (err) {
                console.log(err);
            }
            io.in(room).emit('messages:recive', obj);
        });
        await Room.updateOne(
            { _id: room },
            { $push: { messages: newMessage } },
        );
    };
    socket.on('messages:sent', sentMessage);
};
