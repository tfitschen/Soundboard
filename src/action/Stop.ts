import SoundActionInterface from "./Action";
import ActionTypes from "./types";

import SoundInterface from "../audio/Sound";

export default function stopSoundAction(): SoundActionInterface {
    return {
        type: ActionTypes.STOP_SOUND,
        sound: null
    };
}
