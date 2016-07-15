import {combineReducers} from "redux";

import soundboard, {SoundboardState} from "./soundboard";

const soundboardApp = combineReducers({
    soundboard
});

export default soundboardApp;
