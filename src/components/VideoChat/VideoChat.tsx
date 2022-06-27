/* eslint-disable consistent-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable prefer-destructuring */
/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/media-has-caption */
import { useEffect, useState, useRef, useCallback, useContext, LegacyRef, MutableRefObject } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Peer, { SignalData } from 'simple-peer';
import { useHttp } from 'src/hooks/http.hook';
import { AllStateTypes } from 'src/store/reducers';
import freeice from 'freeice';
import { User } from 'src/store/reducers/user';
import { notificationService } from 'src/store/services/notificationService';
import { Button } from '../Button';
import { AuthContext } from '../utils/Context/AuthContext';
import styles from './VideoChat.scss';
import { Preloader } from '../Preloader';
import { Icon } from '../Icon/Icon';

export const VideoChat = () => {
    const { _id } = useSelector((state: AllStateTypes) => state.user.item!);
    const { room } = useParams() as { room: string };
    const [users, setUsers] = useState([]);
    const [receivingCall, setReceivingCall] = useState(false);
    const [caller, setCaller] = useState('');
    const [callerSignal, setCallerSignal] = useState();
    const [callAccepted, setCallAccepted] = useState(false);
    const { token, socket } = useContext(AuthContext);
    const { request, loading } = useHttp();
    const userVideo = useRef() as MutableRefObject<HTMLVideoElement>;
    const partnerVideo = useRef() as MutableRefObject<HTMLVideoElement>;
    const stream = useRef(new MediaStream()) as MutableRefObject<MediaStream>;
    const peer = useRef() as MutableRefObject<Peer.Instance>;
    const [videoOptions, setVideoOptions] = useState(false);
    const [audioOptions, setAudioOptions] = useState(true);
    const [screenOptions, setScreenOptions] = useState(false);
    const [facingMode, setFacingMode] = useState(true);
    const [facingCam, setFacingCam] = useState(false);
    const [sharing, setSharing] = useState(false);
    const [message, setMessage] = useState('');

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
            peer.current.replaceTrack(oldTrack, newTrack, stream.current);
        }
        oldTrack.stop();
        stream.current.removeTrack(oldTrack);
        stream.current.addTrack(newTrack);

        if (userVideo.current) {
            userVideo.current.srcObject = stream.current;
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
                const AT = stream.current.getAudioTracks()[0];
                AT.enabled = false;
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
            stream.current.addTrack(audioTrack);
            const videoTrack = mediaUser.getVideoTracks()[0];
            videoTrack.stop();
            stream.current.addTrack(fakeVideo());
            if (userVideo.current) {
                userVideo.current.srcObject = stream.current;
            }
            console.log(stream.current.getTracks());
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
                updateStream(fakeAudio(), stream.current.getAudioTracks()[0]);
            } else {
                const mediaUser = await navigator.mediaDevices.getUserMedia({
                    audio: audioConstraints,
                });
                const realAudio = mediaUser.getAudioTracks()[0];
                updateStream(realAudio, stream.current.getAudioTracks()[0]);
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
                updateStream(fakeVideo(), stream.current.getVideoTracks()[0]);
            } else {
                const mediaUser = await navigator.mediaDevices.getUserMedia({
                    video: videoConstraints,
                });
                const realVideo = mediaUser.getVideoTracks()[0];
                updateStream(realVideo, stream.current.getVideoTracks()[0]);
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
            updateStream(realVideo, stream.current.getVideoTracks()[0]);
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
                updateStream(getDisplayTrack, stream.current.getVideoTracks()[0]);
                setScreenOptions(true);
            } else {
                const mediaUser = await navigator.mediaDevices.getUserMedia({
                    video: videoConstraints,
                });
                const realVideo = mediaUser.getVideoTracks()[0];
                if (!videoOptions) {
                    updateStream(fakeVideo(), stream.current.getVideoTracks()[0]);
                    realVideo.stop();
                } else {
                    updateStream(realVideo, stream.current.getVideoTracks()[0]);
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

    const getRoom = useCallback(async () => {
        const data = await request(
            '/api/room/findusers',
            'POST',
            { room },
            {
                Authorization: `Bearer ${token}`,
            },
        );
        setUsers(data);
    }, [request, room, token]);

    useEffect(() => {
        getRoom();
        initializeStream();
    }, []);

    function callPeer(id: string) {
        peer.current = new Peer({
            initiator: true,
            trickle: false,
            config: { iceServers: freeice() },
            stream: stream.current,
            offerOptions: { offerToReceiveAudio: true, offerToReceiveVideo: true },
        });
        peer.current.on('signal', (data) => {
            socket.emit('call:sent', {
                userToCall: id,
                signalData: data,
                from: _id,
            });
        });
        peer.current.on('stream', (partnerStream: MediaStream) => {
            if (partnerVideo.current) {
                partnerVideo.current.srcObject = partnerStream;
                partnerVideo.current.play();
            }
        });
        peer.current.on('close', () => {
            console.log('CLOSE');
        });
        peer.current.on('error', (err) => {
            console.log('PEER ERROR: ', err);
        });
        socket.on('call:accept', (signal) => {
            setCallAccepted(true);
            peer.current.signal(signal);
        });
    }

    function acceptCall() {
        setCallAccepted(true);
        peer.current = new Peer({
            initiator: false,
            trickle: false,
            config: { iceServers: freeice() },
            stream: stream.current,
            offerOptions: { offerToReceiveAudio: true, offerToReceiveVideo: true },
        });
        peer.current.on('signal', (data: SignalData) => {
            socket.emit('call:accept', { signal: data, to: caller });
        });

        peer.current.on('stream', (partnerStream: MediaStream) => {
            if (partnerVideo.current) {
                partnerVideo.current.srcObject = partnerStream;
                partnerVideo.current.play();
            }
        });
        peer.current.on('close', () => {
            console.log('CLOSE');
        });
        peer.current.on('error', (err) => {
            console.log('PEER ERROR: ', err);
        });
        peer.current.signal(callerSignal as unknown as SignalData);
    }

    socket.on('call:recived', (data) => {
        setReceivingCall(true);
        setCaller(data.from);
        setCallerSignal(data.signal);
    });

    let incomingCall;
    if (receivingCall && !callAccepted) {
        incomingCall = <Button onClick={() => acceptCall()} title="CALLING..." />;
    }

    if (loading) {
        return <Preloader />;
    }

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
                    className={callAccepted ?
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
                    {users.map((user: User) => {
                        if (user._id === _id) {
                            return null;
                        }
                        return (
                            !receivingCall && (
                                !callAccepted ?
                                    <Button key={user._id} onClick={() => callPeer(user._id)} skin="quad" color="green"><Icon type="call" /></Button> :
                                    <Button key={user._id} onClick={() => console.log('OFF')} skin="quad" color="red"><Icon type="slashcall" /></Button>
                            ));
                    })}
                </div>
            </div>
            {incomingCall}
            {message}
        </div>
    );
};
