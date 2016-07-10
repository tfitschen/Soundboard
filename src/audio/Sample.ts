export default class AudioSample {

    constructor(private _buffer: AudioBuffer) { }

    get buffer(): AudioBuffer {
        return this._buffer;
    }

}
