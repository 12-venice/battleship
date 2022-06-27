// @ts-nocheck
/* eslint-disable indent */
import styles from './Icon.scss';
import chats from '../../../images/chats.svg';
import close from '../../../images/close.svg';
import exit from '../../../images/exit.svg';
import fs from '../../../images/fs.svg';
import fsexit from '../../../images/fs_exit.svg';
import login from '../../../images/login.svg';
import plus from '../../../images/plus.svg';
import profile from '../../../images/profile.svg';
import registration from '../../../images/registration.svg';
import roundarrow from '../../../images/round_arrow.svg';
import search from '../../../images/search.svg';
import send from '../../../images/send.svg';
import video from '../../../images/video.svg';
import slashcall from '../../../images/slashcall.svg';
import call from '../../../images/call.svg';
import mic from '../../../images/mic.svg';
import monitor from '../../../images/monitor.svg';
import changecam from '../../../images/changecam.svg';
import gallery from '../../../images/gallery.svg';
import camera from '../../../images/camera.svg';
import { IconType } from './types';

export const Icon = ({ type }: IconType): JSX.Element => {
    const icons = () => {
        switch (type) {
            case 'chats':
                return chats;
            case 'close':
                return close;
            case 'exit':
                return exit;
            case 'fs':
                return fs;
            case 'fsexit':
                return fsexit;
            case 'login':
                return login;
            case 'plus':
                return plus;
            case 'profile':
                return profile;
            case 'registration':
                return registration;
            case 'roundarrow':
                return roundarrow;
            case 'search':
                return search;
            case 'send':
                return send;
            case 'video':
                return video;
            case 'slashcall':
                return slashcall;
            case 'call':
                return call;
            case 'mic':
                return mic;
            case 'monitor':
                return monitor;
            case 'changecam':
                return changecam;
            case 'gallery':
                return gallery;
            case 'camera':
                return camera;
            default:
                return null;
        }
    };
    return <img className={styles.icon} src={icons()} alt={type} />;
};
