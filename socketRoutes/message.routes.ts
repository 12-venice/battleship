/* eslint-disable no-console */
/* eslint-disable import/no-default-export */
import { io } from 'src/server';
import { ISocket } from 'src/server/types';
import Message from '../serverModels/message';
import User from '../serverModels/user';
import Room from '../serverModels/room';

export default async (socket: ISocket) => {
    const sentMessage = async ({
        room,
        message,
    }: {
        room: string;
        message: string;
    }) => {
        const user = await User.findOne(
            {
                _id: socket.userID,
            },
            { password: 0 },
        );
        const newMessage = new Message({
            text: message,
            user,
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
