export default class EventEmitter<T> {

    emit(payload: T): void {
        for (let callback of this._listeners) {
            try {
                callback(payload);
            } catch (ex) {
                console.error(ex);
            }
        }
    }

    off(callback: (payload: T) => void): void {
        const index = this._listeners.indexOf(callback);
        if (index !== -1) {
            this._listeners.splice(index, 1);
        }
    }

    on(callback: (payload: T) => void): void {
        const index = this._listeners.indexOf(callback);
        if (index === -1) {
            this._listeners.push(callback);
        }
    }

    private _listeners: Array<(payload: T) => void> = new Array();
}
