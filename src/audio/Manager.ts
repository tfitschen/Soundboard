import AudioSample from "./Sample";
import EventEmitter from "../util/EventEmitter";
import * as request from "../util/request";

interface AudioManagerEvents {
    playing: EventEmitter<void>;
    stopped: EventEmitter<void>;
}

class AudioManager {

    private _ctx: AudioContext = new AudioContext();
    private _current: AudioBufferSourceNode = null;
    private _loading: Map<string, Promise<AudioSample>> = new Map();
    private _samples: Map<string, AudioSample> = new Map();

    events: AudioManagerEvents = {
        playing: new EventEmitter<void>(),
        stopped: new EventEmitter<void>(),
    };

    load(url: string): Promise<AudioSample> {
        if (this._samples.has(url)) {
            return Promise.resolve(this._samples.get(url));
        } else if (this._loading.has(url)) {
            return this._loading.get(url);
        }

        const load =  request
            .getRaw(url)
            .then(this._createAudioSample.bind(this))
            .then((sample: AudioSample) => {
                this._samples.set(url, sample);
                this._loading.delete(url);

                return sample;
            });

        this._loading.set(url, load);

        return load;
    }

    play(sample: AudioSample): void {
        this.stop();

        this._current = this._ctx.createBufferSource();
        this._current.addEventListener("ended", () => this.stop());

        this._current.buffer = sample.buffer;
        this._current.connect(this._ctx.destination);
        this._current.start();
        this.events.playing.emit(null);
    }

    stop(): void {
        if (this._current) {
            this._current.stop();
            this._current.disconnect();
            this._current = null;
            this.events.stopped.emit(null);
        }
    }

    private _createAudioSample(data: ArrayBuffer): Promise<AudioSample> {
        return new Promise<AudioSample>((resolve, reject) => {
            this._ctx.decodeAudioData(data, (buffer) => resolve(new AudioSample(buffer)), reject);
        });
    }

}

const audioManagerInstance = new AudioManager();
export default audioManagerInstance;
