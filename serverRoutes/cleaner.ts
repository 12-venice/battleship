// @ts-nocheck
/* eslint-disable no-console */
import User from '../serverModels/user';
import Topic from '../serverModels/topic';
import Comment from '../serverModels/comment';
import Message from '../serverModels/message';
import Room from '../serverModels/room';
import Move from '../serverModels/move';

export const cleanerBase = async () => {
    User.remove({}, (err) => {
        if (err) {
            console.log(err);
        }
        console.log('User collection removed');
    });
    Topic.remove({}, (err) => {
        if (err) {
            console.log(err);
        }
        console.log('Topic collection removed');
    });
    Comment.remove({}, (err) => {
        if (err) {
            console.log(err);
        }
        console.log('Comment collection removed');
    });
    Message.remove({}, (err) => {
        if (err) {
            console.log(err);
        }
        console.log('Message collection removed');
    });
    Move.remove({}, (err) => {
        if (err) {
            console.log(err);
        }
        console.log('Room collection removed');
    });
    Room.remove({}, (err) => {
        if (err) {
            console.log(err);
        }
        console.log('Room collection removed');
    });
};
