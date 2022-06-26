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
import { socket as socketForRef } from '../utils/Socket/Socket';
import styles from './VideoChat.scss';
import { Preloader } from '../Preloader';

export const VideoChat = () => {
    const { _id } = useSelector((state: AllStateTypes) => state.user.item!);
    const { room } = useParams() as { room: string };
    const [users, setUsers] = useState([]);
    const [receivingCall, setReceivingCall] = useState(false);
    const [caller, setCaller] = useState('');
    const [callerSignal, setCallerSignal] = useState();
    const [callAccepted, setCallAccepted] = useState(false);
    const { token } = useContext(AuthContext);
    const { request, loading } = useHttp();
    const userVideo = useRef() as MutableRefObject<HTMLVideoElement>;
    const partnerVideo = useRef() as MutableRefObject<HTMLVideoElement>;
    const stream = useRef(new MediaStream()) as MutableRefObject<MediaStream>;
    const peer = useRef() as MutableRefObject<Peer.Instance>;
    const socket = useRef(socketForRef).current;
    const [videoOptions, setVideoOptions] = useState(false);
    const [audioOptions, setAudioOptions] = useState(false);
    const [screenOptions, setScreenOptions] = useState(false);
    const [facingMode, setFacingMode] = useState(true);

    const videoConstraints = {
        frameRate: 30,
        noiseSuppression: true,
        width: { min: 640, ideal: 1280, max: 1920 },
        height: { min: 480, ideal: 720, max: 1080 },
        facingMode: facingMode ? 'user' : 'environment',
    };

    function addMedia() {
        peer.current.addStream(stream.current);
    }

    const updateStream = (newTrack: MediaStreamTrack, oldTrack?: MediaStreamTrack) => {
        if (peer.current !== undefined) {
            if (oldTrack) {
                peer.current.replaceTrack(oldTrack, newTrack, stream.current);
            } else {
                peer.current.addTrack(newTrack, stream.current);
            }
        }
        if (oldTrack) {
            oldTrack.stop();
            stream.current.removeTrack(oldTrack);
        }
        stream.current.addTrack(newTrack);

        if (userVideo.current) {
            userVideo.current.srcObject = stream.current;
        }
    };

    const handleAudio = async () => {
        try {
            let oldTrack;
            if (stream.current.getAudioTracks().length > 0) {
                oldTrack = stream.current.getAudioTracks()[0];
            }
            if (audioOptions && oldTrack) {
                stream.current.getAudioTracks()[0].stop();
                stream.current.removeTrack(oldTrack);
                if (userVideo.current) {
                    userVideo.current.srcObject = stream.current;
                }
                setAudioOptions(false);
            } else {
                const track = await navigator.mediaDevices.getUserMedia({ audio: true });
                const getAudioTrack = track.getAudioTracks()[0];
                updateStream(getAudioTrack);
                setAudioOptions(true);
            }
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
            let oldTrack;
            if (stream.current.getVideoTracks().length > 0) {
                oldTrack = stream.current.getVideoTracks()[0];
            }
            if (videoOptions && oldTrack) {
                stream.current.getVideoTracks()[0].stop();
                stream.current.removeTrack(oldTrack);
                if (userVideo.current) {
                    userVideo.current.srcObject = stream.current;
                }
                setVideoOptions(false);
            } else {
                const track = await navigator.mediaDevices.getUserMedia({
                    video: videoConstraints,
                });
                const getVideoTrack = track.getVideoTracks()[0];
                updateStream(getVideoTrack);
                setVideoOptions(true);
            }
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
            let oldTrack;
            videoConstraints.facingMode = !facingMode ? 'user' : 'environment';
            if (stream.current.getVideoTracks().length > 0) {
                oldTrack = stream.current.getVideoTracks()[0];
            }
            const track = await navigator.mediaDevices.getUserMedia({ video: videoConstraints });
            const getCameraTrack = track.getVideoTracks()[0];
            updateStream(getCameraTrack, oldTrack);
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
            let oldTrack;
            if (stream.current.getVideoTracks().length > 0) {
                oldTrack = stream.current.getVideoTracks()[0];
            }
            if (!screenOptions) {
                const track = await navigator.mediaDevices.getDisplayMedia();
                const getDisplayTrack = track.getVideoTracks()[0];
                updateStream(getDisplayTrack, oldTrack);
                setScreenOptions(true);
            } else {
                if (!videoOptions && oldTrack) {
                    stream.current.getVideoTracks()[0].stop();
                    stream.current.removeTrack(oldTrack);
                    if (userVideo.current) {
                        userVideo.current.srcObject = stream.current;
                    }
                } else {
                    const track = await navigator.mediaDevices.getUserMedia({
                        video: videoConstraints,
                    });
                    const getDisplayTrack = track.getVideoTracks()[0];
                    updateStream(getDisplayTrack, oldTrack);
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
    }, []);

    function callPeer(id: string) {
        peer.current = new Peer({
            initiator: true,
            answerOptions: {},
            offerOptions: {
                iceRestart: true,
                offerToReceiveAudio: true,
                offerToReceiveVideo: true,
            },
            trickle: false,
            config: {
                iceServers: freeice(),
            },
            stream: stream.current,
        });
        peer.current.on('signal', (data) => {
            console.log('<<<CALL>>>  \n', data);
            socket.emit('call:sent', {
                userToCall: id,
                signalData: data,
                from: _id,
            });
        });

        peer.current.on('stream', (partnerStream: MediaStream) => {
            if (partnerVideo.current) {
                partnerVideo.current.srcObject = partnerStream;
            }
        });
        socket.on('call:accept', (signal) => {
            console.log('<<<SOCKET ACCEPT>>>  \n', signal);
            setCallAccepted(true);
            peer.current.signal(signal);
        });
    }

    function acceptCall() {
        setCallAccepted(true);
        peer.current = new Peer({
            initiator: false,
            trickle: false,
            offerOptions: {
                iceRestart: true,
                offerToReceiveAudio: true,
                offerToReceiveVideo: true,
            },
            stream: stream.current,
        });
        peer.current.on('signal', (data: SignalData) => {
            console.log('<<<ACCEPT>>>  \n', data);
            socket.emit('call:accept', { signal: data, to: caller });
        });

        peer.current.on('stream', (partnerStream: MediaStream) => {
            if (partnerVideo.current) {
                partnerVideo.current.srcObject = partnerStream;
            }
        });

        peer.current.signal(callerSignal as unknown as SignalData);
    }

    socket.on('call:recived', (data) => {
        console.log('<<<SOCKET RECIVED>>>  \n', data);
        setReceivingCall(true);
        setCaller(data.from);
        setCallerSignal(data.signal);
    });

    let incomingCall;
    if (receivingCall && !callAccepted) {
        incomingCall = <Button onClick={() => acceptCall()} title="INCOMING CALL..." />;
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
                <Button
                    onClick={() => handleAudio()}
                    title="A"
                    color={audioOptions ? 'green' : 'red'}
                    skin="quad"
                />
                <Button
                    onClick={() => handleVideo()}
                    title="V"
                    color={videoOptions ? 'green' : 'red'}
                    skin="quad"
                />
                {videoOptions && (
                    <Button
                        onClick={() => handleCamera()}
                        title="C"
                        color="blue"
                        skin="quad"
                    />
                )}
                <Button
                    onClick={() => handleDisplay()}
                    title="D"
                    color={screenOptions ? 'green' : 'red'}
                    skin="quad"
                />
            </div>
            <div>
                {users.map((user: User) => {
                    if (user._id === _id) {
                        return null;
                    }
                    return (
                        !receivingCall && (
                            <Button
                                key={user._id}
                                onClick={() => callPeer(user._id)}
                                title={user.display_name}
                            />
                        )
                    );
                })}
                {incomingCall}
            </div>
            <video
                className={callAccepted ? styles.videochat__video__user : styles.videochat__video}
                playsInline
                muted
                ref={userVideo as unknown as LegacyRef<HTMLVideoElement>}
                autoPlay
            />
        </div>
    );
};
