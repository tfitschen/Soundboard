import SoundActionInterface from "./Action";
import ActionTypes from "./types";

import SoundInterface from "../audio/Sound";

export default function playSoundAction(sound: SoundInterface): SoundActionInterface {
    return {
        type: ActionTypes.PLAY_SOUND,
        sound
    };
}
