export interface StringArray {
    [key: string]: string;
}

const usersOnline: StringArray = {};

const addUserOnline = (socketId: string, id: string) => {
    usersOnline[socketId] = id;
};

const removeUserOnline = (socketId: string) => {
    delete usersOnline[socketId];
};

const getUserOnline = (socketId: string) => {
    const user = usersOnline[socketId];
    return user;
};

const getSocketUserOnline = (id: string) => {
    const socket = Object.keys(usersOnline).find((key) => usersOnline[key] === id);
    return socket;
};

const getUsersOnline = () => {
    return usersOnline;
};

export {
    addUserOnline,
    removeUserOnline,
    getUserOnline,
    getSocketUserOnline,
    getUsersOnline,
};
