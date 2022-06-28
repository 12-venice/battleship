/* eslint-disable consistent-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable prefer-destructuring */
/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/media-has-caption */
import { useEffect, useState, useRef, LegacyRef, MutableRefObject, useContext } from 'react';
import { useSelector } from 'react-redux';
import Peer from 'simple-peer';
import { AllStateTypes } from 'src/store/reducers';
import { notificationService } from 'src/store/services/notificationService';
import { Button } from '../Button';
import styles from './VideoChat.scss';
import { Icon } from '../Icon/Icon';
import { CancelCall } from './utils';
import { AuthContext } from '../utils/Context/AuthContext';

export const VideoChat = () => {
    const { socket } = useContext(AuthContext);
    const userVideo = useRef() as MutableRefObject<HTMLVideoElement>;
    const partnerVideo = useRef() as MutableRefObject<HTMLVideoElement>;
    const peer = useRef() as MutableRefObject<Peer.Instance>;
    const [videoOptions, setVideoOptions] = useState(false);
    const [audioOptions, setAudioOptions] = useState(true);
    const [screenOptions, setScreenOptions] = useState(false);
    const [facingMode, setFacingMode] = useState(true);
    const [facingCam, setFacingCam] = useState(false);
    const [sharing, setSharing] = useState(false);
    const [message, setMessage] = useState('');

    const { signal, stream, status } = useSelector((state: AllStateTypes) => state.videocall);
    useEffect(() => {
        if (stream) {
            partnerVideo.current.srcObject = stream;
        }
    }, []);
    console.log(signal, stream, status);

    const videoConstraints = {
        frameRate: { max: 30, ideal: 20 },
        width: { min: 640, ideal: 1280, max: 1920 },
        height: { min: 480, ideal: 720, max: 1080 },
        facingMode: facingMode ? 'user' : 'environment',
    };

    const audioConstraints = {
        echoCancellation: true,
        autoGainControl: true,
        noiseSuppression: true,
    };

    const updateStream = (newTrack: MediaStreamTrack, oldTrack: MediaStreamTrack) => {
        if (peer.current !== undefined) {
            console.log(oldTrack);
            peer.current.replaceTrack(oldTrack, newTrack, signal!);
        }
        oldTrack.stop();
        signal?.removeTrack(oldTrack);
        signal?.addTrack(newTrack);

        if (userVideo.current) {
            userVideo.current.srcObject = signal;
        }
    };

    const fakeAudio = () => {
        try {
            let ctx;
            if (typeof window !== 'undefined') {
                const AudioContext = window.AudioContext
                    || window.webkitAudioContext;
                ctx = new AudioContext();
            } else {
                const AT = signal?.getAudioTracks()[0];
                if (AT) AT.enabled = false;
                return AT;
            }
            const oscillator = ctx.createOscillator();
            const dst = oscillator.connect(ctx.createMediaStreamDestination());
            oscillator.start();
            return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
        } catch (err) {
            setMessage(err.toString());
        }
    };

    const fakeVideo = ({ width = 640, height = 480 } = {}) => {
        const canvas = Object.assign(document.createElement('canvas'), { width, height });
        canvas.getContext('2d')?.fillRect(0, 0, width, height);
        const streamFake = canvas.captureStream();
        return Object.assign(streamFake.getVideoTracks()[0], { enabled: false });
    };

    const initializeStream = async () => {
        try {
            const mediaUser = await navigator.mediaDevices.getUserMedia({
                video: videoConstraints,
                audio: audioConstraints,
            });
            const audioTrack = mediaUser.getAudioTracks()[0];
            signal?.addTrack(audioTrack);
            const videoTrack = mediaUser.getVideoTracks()[0];
            videoTrack.stop();
            signal?.addTrack(fakeVideo());
            if (userVideo.current) {
                userVideo.current.srcObject = signal;
            }
            console.log(signal?.getTracks());
            setFacingCam(videoTrack.getCapabilities()!.facingMode!.length > 0);
            if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                setSharing(true);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleAudio = async () => {
        try {
            if (audioOptions) {
                updateStream(fakeAudio(), signal!.getAudioTracks()[0]);
            } else {
                const mediaUser = await navigator.mediaDevices.getUserMedia({
                    audio: audioConstraints,
                });
                const realAudio = mediaUser.getAudioTracks()[0];
                updateStream(realAudio, signal!.getAudioTracks()[0]);
            }
            setAudioOptions(!audioOptions);
        } catch (err) {
            if ((err as object).toString() === 'NotAllowedError: Permission denied') {
                notificationService.addNotification({
                    message: 'It is necessary to allow the use of a mic',
                    type: 'danger',
                });
            }
            console.log(err);
        }
    };

    const handleVideo = async () => {
        try {
            if (videoOptions) {
                updateStream(fakeVideo(), signal!.getVideoTracks()[0]);
            } else {
                const mediaUser = await navigator.mediaDevices.getUserMedia({
                    video: videoConstraints,
                });
                const realVideo = mediaUser.getVideoTracks()[0];
                updateStream(realVideo, signal!.getVideoTracks()[0]);
            }
            setVideoOptions(!videoOptions);
            setScreenOptions(false);
        } catch (err) {
            if ((err as object).toString() === 'NotAllowedError: Permission denied') {
                notificationService.addNotification({
                    message: 'It is necessary to allow the use of a camera',
                    type: 'danger',
                });
            }
            console.log(err);
        }
    };

    const handleCamera = async () => {
        try {
            const mediaUser = await navigator.mediaDevices.getUserMedia({
                video: videoConstraints,
            });
            const realVideo = mediaUser.getVideoTracks()[0];
            videoConstraints.facingMode = !facingMode ? 'user' : 'environment';
            updateStream(realVideo, signal!.getVideoTracks()[0]);
            setFacingMode((cur: boolean) => !cur);
            if (!videoOptions) {
                setVideoOptions((cur: boolean) => !cur);
            }
        } catch (err) {
            if ((err as object).toString() === 'NotAllowedError: Permission denied') {
                notificationService.addNotification({
                    message: 'It is necessary to allow the use of a camera',
                    type: 'danger',
                });
            }
            console.log(err);
        }
    };

    const handleDisplay = async () => {
        try {
            if (!screenOptions) {
                const trackDisplay = await navigator.mediaDevices.getDisplayMedia();
                const getDisplayTrack = trackDisplay.getVideoTracks()[0];
                updateStream(getDisplayTrack, signal!.getVideoTracks()[0]);
                setScreenOptions(true);
            } else {
                const mediaUser = await navigator.mediaDevices.getUserMedia({
                    video: videoConstraints,
                });
                const realVideo = mediaUser.getVideoTracks()[0];
                if (!videoOptions) {
                    updateStream(fakeVideo(), signal!.getVideoTracks()[0]!);
                    realVideo.stop();
                } else {
                    updateStream(realVideo, signal!.getVideoTracks()[0]);
                }
                setScreenOptions(false);
            }
        } catch (err) {
            if ((err as object).toString() === 'NotAllowedError: Permission denied') {
                notificationService.addNotification({
                    message: 'It is necessary to allow the use of a display sharing',
                    type: 'danger',
                });
            }
            console.log(err);
        }
    };

    useEffect(() => {
        initializeStream();
    }, []);

    return (
        <div className={styles.videochat__block}>
            <video
                className={styles.videochat__video}
                playsInline
                ref={partnerVideo as unknown as LegacyRef<HTMLVideoElement>}
                autoPlay
            />
            <div>
                <video
                    className={status === ('accept' || 'live') ?
                        styles.videochat__video__user : styles.videochat__video}
                    playsInline
                    muted
                    ref={userVideo as unknown as LegacyRef<HTMLVideoElement>}
                    autoPlay
                />
            </div>
            <div className={styles.videochat__controls}>
                <div>
                    <Button
                        onClick={() => handleAudio()}
                        color={audioOptions ? 'green' : 'red'}
                        skin="quad"
                    >
                        <Icon type="mic" />
                    </Button>
                    <Button
                        onClick={() => handleVideo()}
                        color={videoOptions ? 'green' : 'red'}
                        skin="quad"
                    >
                        <Icon type="camera" />
                    </Button>
                    {videoOptions && facingCam && (
                        <Button
                            onClick={() => handleCamera()}
                            color="blue"
                            skin="quad"
                        >
                            <Icon type="changecam" />
                        </Button>
                    )}
                    {sharing && (
                        <Button
                            onClick={() => handleDisplay()}
                            color={screenOptions ? 'green' : 'red'}
                            skin="quad"
                        >
                            <Icon type="monitor" />
                        </Button>
                    )}
                </div>
                <div>
                    <Button onClick={() => CancelCall(socket)} skin="quad" color="red"><Icon type="slashcall" /></Button>
                </div>
            </div>
            {message}
        </div>
    );
};
