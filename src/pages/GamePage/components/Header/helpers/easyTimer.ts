export class Timer {
    counter;

    constructor(
        public count: number,
        public setTimer: (counter: number) => void,
        public callback: () => void,
    ) {
        this.count = count;
        this.callback = callback;
        this.setTimer = setTimer;
    }

    start(count = 30) {
        this.stop();
        this.count = count;
        this.counter = setInterval(() => {
            this.count -= 1;
            this.setTimer(this.count);
            if (this.count <= 0) {
                this.callback();
                clearInterval(this.counter);
            }
        }, 1000);
    }

    stop() {
        clearInterval(this.counter);
    }
}
