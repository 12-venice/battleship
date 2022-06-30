/* eslint-disable consistent-return */
export const videoConstraints = (facingMode: boolean) => ({
    frameRate: { max: 30, ideal: 20 },
    width: { min: 640, ideal: 1280, max: 1920 },
    height: { min: 480, ideal: 720, max: 1080 },
    facingMode: facingMode ? 'user' : 'environment',
});

export const audioConstraints = {
    echoCancellation: true,
    autoGainControl: true,
    noiseSuppression: true,
};

export const fakeAudio = () => {
    try {
        let ctx;
        if (typeof window !== 'undefined') {
            const AudioContext =
                window.AudioContext || window.webkitAudioContext;
            ctx = new AudioContext();
        }
        const oscillator = ctx.createOscillator();
        const dst = oscillator.connect(ctx.createMediaStreamDestination());
        oscillator.start();
        return Object.assign(dst.stream.getAudioTracks()[0], {
            enabled: false,
        });
    } catch (err: any) {
        console.log(err.toString());
    }
};

export const fakeVideo = ({ width = 640, height = 480 } = {}) => {
    const canvas = Object.assign(document.createElement('canvas'), {
        width,
        height,
    });
    canvas.style.backgroundColor = '#ffffff50';
    canvas.getContext('2d')?.fillRect(0, 0, width, height);
    const streamFake = canvas.captureStream();
    return Object.assign(streamFake.getVideoTracks()[0], { enabled: false });
};
