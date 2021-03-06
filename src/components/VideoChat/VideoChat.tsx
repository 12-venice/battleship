/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable consistent-return */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable prefer-destructuring */
/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/media-has-caption */
import { useEffect, useState, useRef, LegacyRef, MutableRefObject } from 'react';
import { useSelector } from 'react-redux';
import { AllStateTypes } from 'src/store/reducers';
import { notificationService } from 'src/store/services/notificationService';
import { Button } from '../Button';
import styles from './VideoChat.scss';
import { Icon } from '../Icon/Icon';
import { getPeer } from './utils';
import { fakeVideo, videoConstraints } from './config';

export const VideoChat = () => {
    const userVideo = useRef() as MutableRefObject<HTMLVideoElement>;
    const partnerVideo = useRef() as MutableRefObject<HTMLVideoElement>;
    const [videoOptions, setVideoOptions] = useState(false);
    const [audioOptions, setAudioOptions] = useState(false);
    const [screenOptions, setScreenOptions] = useState(false);
    const [facingMode, setFacingMode] = useState(true);
    const [facingCam, setFacingCam] = useState(false);
    const [sharing, setSharing] = useState(false);
    const [isInitialize, setIsInitialize] = useState(false);
    const [isPlay, setIsplay] = useState(true);
    const { signal, stream, status } = useSelector((state: AllStateTypes) => state.videocall);

    console.log(stream?.getTracks(), signal?.getTracks());

    const initialize = async () => {
        try {
            const mediaUser = await navigator.mediaDevices.getUserMedia({
                video: videoConstraints(facingMode),
            });
            const videoTrack = mediaUser.getVideoTracks()[0];
            videoTrack.stop();
            setFacingCam(videoTrack.getCapabilities()!.facingMode!.length > 0);
            if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                setSharing(true);
            }
            setIsInitialize(true);
        } catch (err) {
            console.log(err);
        }
    };

    const updateStream = (newTrack: MediaStreamTrack) => {
        try {
            if (!isInitialize) {
                initialize();
            }
            const oldTrack = getPeer()?.streams[0]?.getVideoTracks()[0];
            if (oldTrack) {
                signal?.removeTrack(signal?.getVideoTracks()[0]);
            }
            signal?.addTrack(newTrack);
            if (userVideo.current) {
                userVideo.current.srcObject = signal;
            }
            console.log(getPeer()?.streams[0].getAudioTracks()[0], oldTrack);
            if (oldTrack) {
                oldTrack.stop();
                getPeer()?.replaceTrack(oldTrack, newTrack, getPeer()?.streams[0]!);
            } else {
                getPeer()?.replaceTrack(oldTrack, newTrack, getPeer()?.streams[0]!);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleAudio = async () => {
        try {
            getPeer()!.streams[0]!.getAudioTracks()[0]!.enabled = !audioOptions;
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
            const mediaUser = await navigator.mediaDevices.getUserMedia({
                video: videoConstraints(facingMode),
            });
            const realVideo = mediaUser.getVideoTracks()[0];
            if (videoOptions) {
                updateStream(fakeVideo());
            } else {
                updateStream(realVideo);
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
                video: videoConstraints(!facingMode),
            });
            const realVideo = mediaUser.getVideoTracks()[0];
            updateStream(realVideo);
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
                updateStream(getDisplayTrack);
                setScreenOptions(true);
            } else {
                const mediaUser = await navigator.mediaDevices.getUserMedia({
                    video: videoConstraints(facingMode),
                });
                const realVideo = mediaUser.getVideoTracks()[0];
                if (!videoOptions) {
                    updateStream(fakeVideo());
                } else {
                    updateStream(realVideo);
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
        if (stream) {
            handleAudio();
        }
    }, [stream]);

    useEffect(() => {
        if (partnerVideo && partnerVideo.current) {
            partnerVideo.current.srcObject = stream;
        }
    }, [stream]);

    useEffect(() => {
        if (userVideo && userVideo.current) {
            userVideo.current.srcObject = signal;
        }
    }, [signal]);

    return (
        <div className={styles.videochat__block}>
            <video
                className={styles.videochat__video}
                playsInline
                muted={!isPlay}
                ref={partnerVideo as unknown as LegacyRef<HTMLVideoElement>}
                autoPlay
            />
            <div>
                <video
                    className={status === ('calling' && 'live') ?
                        styles.videochat__video__user : styles.videochat__video}
                    playsInline
                    muted
                    ref={userVideo as unknown as LegacyRef<HTMLVideoElement>}
                    autoPlay
                />
            </div>
            <div className={styles.videochat__controls}>
                {status === 'calling' ? 'Calling ...' : (
                    <>
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
                    </>
                )}
            </div>
            <Button
                onClick={() => setIsplay(!isPlay)}
                color={isPlay ? 'green' : 'red'}
                skin="quad"
            >
                <Icon type="speaker" />
            </Button>
        </div>
    );
};
