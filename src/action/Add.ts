import SoundActionInterface from "./Action";
import ActionTypes from "./types";

import SoundInterface from "../audio/Sound";

export default function addSoundAction(sound: SoundInterface): SoundActionInterface {
    return {
        type: ActionTypes.ADD_SOUND,
        sound
    };
}
