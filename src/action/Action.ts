import ActionTypes from "./types";

import SoundInterface from "../audio/Sound";

interface SoundActionInterface {
    type: ActionTypes;
    sound: SoundInterface;
}

export default SoundActionInterface;
