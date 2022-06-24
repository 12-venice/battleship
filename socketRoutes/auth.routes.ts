// @ts-nocheck
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-unused-expressions */
/* eslint-disable import/no-default-export */
import { io } from 'src/server';
import { ISocket } from 'src/server/types';
import User from '../serverModels/user';

let _users: { socket: ISocket; id: string; inGame: boolean }[] = [];

export const addUser = (socket: ISocket) => {
    _users.push({ socket, id: socket.userID!, inGame: false });
};

export const getUsers = () => _users;

export const setGameStatus = ({ socket, userID, status }) => {
    _users = _users.map((user) => {
        if (user.id === userID) {
            user.inGame = status;
        }
        return user;
    });
    socket.emit(
        'users:set',
        getUsers().map((userOnline) => ({
            id: userOnline.socket.userID,
            inGame: userOnline.inGame,
        })),
    );
};

export const deleteUser = (socket: ISocket) => {
    _users = _users.filter((obj) => obj.id !== socket.userID!);
};

export default async (socket: ISocket) => {
    io.to(socket.id).emit(
        'users:set',
        getUsers().map((userOnline) => ({
            id: userOnline.socket.userID,
            inGame: userOnline.inGame,
        })),
    );
    addUser(socket);
    const user = await User.findOne({ _id: socket.userID }).populate('rooms');

    const joinToRoom = async (room: { _id: string }) => {
        socket.join(room._id.toString());
        socket.broadcast.to(room._id.toString()).emit('users:add', {
            id: socket.userID,
            inGame: false,
        });
        console.log(`${socket.userID} JOIN to room: ${room._id.toString()}`);
    };

    if (user && user.rooms) {
        await user.rooms.forEach(joinToRoom);
    }

    socket.on('disconnect', async () => {
        deleteUser(socket);
        const disconnectUser = await User.findOne({
            _id: socket.userID,
        }).populate('rooms');
        const leaveFromRoom = (room: { _id: string }) => {
            socket.leave(room._id.toString());
            socket.broadcast
                .to(room._id.toString())
                .emit('users:remove', socket.userID);
            console.log(
                `${socket.userID} LEAVE from room: ${room._id.toString()}`,
            );
        };
        if (disconnectUser && disconnectUser.rooms) {
            disconnectUser.rooms.forEach(leaveFromRoom);
        }
    });
};
