import * as React from "react";
import * as ReactDOM from "react-dom";
import {Provider} from "react-redux";
import {applyMiddleware, createStore} from "redux";

import Soundboard from "./Soundboard";
import soundboardApp from "../reducer/index";

import audioManager from "../audio/Manager";
import SoundActionInterface from "../action/Action";
import SoundActionTypes from "../action/types";
const playSound = (store: any) => (next: (data: any) => any) => (action: SoundActionInterface) => {
    if (!action || action.type !== SoundActionTypes.PLAY_SOUND) {
        return next(action);
    }

    audioManager.load(action.sound.url).then((sample) => audioManager.play(sample));

    return next(action);
};

const stopSound = (store: any) => (next: any) => (action: SoundActionInterface) => {
    if (!action || action.type !== SoundActionTypes.STOP_SOUND) {
        return next(action);
    }

    audioManager.stop();

    return next(action);
};

export default function render(dom: HTMLElement): void {
    const createStoreWithMiddleware = applyMiddleware(playSound, stopSound)(createStore);
    const store = createStoreWithMiddleware(soundboardApp, {});

    ReactDOM.render(
        <Provider store={store}>
            <Soundboard />
        </Provider>,
        dom
    );
}
