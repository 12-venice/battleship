/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/extensions */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-undef */
const User = require('../serverModels/user.ts');

const users = {};

const getSocket = async (value) => {
    const id = Object.keys(users).find((key) => users[key] === value);
    return id;
};

const getUser = async (socketId) => {
    const user = await User.findOne({ id: users[socketId] });
    return user;
};

const getUsers = async () => {
    const onlineUsers = [];
    for (const key in users) {
        if (Object.hasOwnProperty.call(users, key)) {
            const user = await User.findOne({ id: users[key] });
            onlineUsers.push(user);
        }
    }
    return onlineUsers;
};

module.exports = { users, getUsers, getUser, getSocket };
