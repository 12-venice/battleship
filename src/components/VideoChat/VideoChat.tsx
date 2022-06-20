import { useEffect, useState, useRef, useCallback, useContext } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Peer from 'simple-peer';
import { useHttp } from 'src/hooks/http.hook';
import { AllStateTypes } from 'src/store/reducers';
import { User } from 'src/store/reducers/user';
import { Button } from '../Button';
import { AuthContext } from '../utils/Context/AuthContext';
import { socket } from '../utils/Socket/Socket';
import styles from './VideoChat.scss';

export const VideoChat = () => {
    const { _id } = useSelector((state: AllStateTypes) => state.user.item!);
    const { room } = useParams() as { room: string };
    const [users, setUsers] = useState([]);
    const [stream, setStream] = useState();
    const [receivingCall, setReceivingCall] = useState(false);
    const [caller, setCaller] = useState('');
    const [callerSignal, setCallerSignal] = useState();
    const [callAccepted, setCallAccepted] = useState(false);
    const { token } = useContext(AuthContext);
    const { request, loading } = useHttp();
    const userVideo = useRef();
    const partnerVideo = useRef();

    const getRooms = useCallback(async () => {
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
        getRooms();
    }, []);

    useEffect(() => {
        if (
            navigator &&
            navigator.mediaDevices &&
            navigator.mediaDevices.getUserMedia
        ) {
            navigator.mediaDevices
                .getUserMedia({ video: true, audio: true })
                .then((stream) => {
                    setStream(stream);
                    if (userVideo.current) {
                        userVideo.current.srcObject = stream;
                    }
                });

            socket.on('call:recived', (data) => {
                console.log(data.from, _id);
                setReceivingCall(true);
                setCaller(data.from);
                setCallerSignal(data.signal);
            });
        }
    }, []);

    function callPeer(id: string) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            config: {
                iceServers: [
                    {
                        urls: 'stun:numb.viagenie.ca',
                        username: 'sultan1640@gmail.com',
                        credential: '98376683',
                    },
                    {
                        urls: 'turn:numb.viagenie.ca',
                        username: 'sultan1640@gmail.com',
                        credential: '98376683',
                    },
                ],
            },
            stream,
        });

        peer.on('signal', (data) => {
            socket.emit('call:sent', {
                userToCall: id,
                signalData: data,
                from: _id,
            });
        });

        peer.on('stream', (stream) => {
            if (partnerVideo.current) {
                partnerVideo.current.srcObject = stream;
            }
        });

        socket.on('call:accept', (signal) => {
            setCallAccepted(true);
            peer.signal(signal);
        });
    }

    function acceptCall() {
        setCallAccepted(true);
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        });
        peer.on('signal', (data) => {
            socket.emit('call:accept', { signal: data, to: caller });
        });

        peer.on('stream', (stream) => {
            partnerVideo.current.srcObject = stream;
        });

        peer.signal(callerSignal);
    }

    let UserVideo;
    if (stream) {
        UserVideo = (
            <video
                className={styles.videochat__video}
                playsInline
                muted
                ref={userVideo}
                autoPlay
            />
        );
    }

    let PartnerVideo;
    if (callAccepted) {
        PartnerVideo = (
            <video
                className={styles.videochat__video}
                playsInline
                muted
                ref={partnerVideo}
                autoPlay
            />
        );
    }

    let incomingCall;
    if (receivingCall) {
        incomingCall = (
            <div>
                <h1>{`${caller} is calling you`}</h1>
                <Button onClick={() => acceptCall()} title="Accept" />
            </div>
        );
    }
    return (
        <div className={styles.videochat__block}>
            <div>
                {UserVideo}
                {PartnerVideo}
            </div>
            <div>
                {users.map((user: string) => {
                    if (user._id === _id) {
                        return null;
                    }
                    return (
                        <Button
                            onClick={() => callPeer(user._id)}
                            title={user.display_name}
                        />
                    );
                })}
            </div>
            <div>{incomingCall}</div>
        </div>
    );
};
