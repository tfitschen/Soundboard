import ActionTypes from "./types";

import SoundInterface from "../audio/Sound";

interface SoundActionInterface {
    type: ActionTypes;
    sound: SoundInterface;
}

export default SoundActionInterface;


function createAction(type: ActionTypes, sound: SoundInterface): SoundActionInterface {
    return {type: type, sound: sound};
}

export const addSoundAction = (sound: SoundInterface) => createAction(ActionTypes.ADD_SOUND, sound);
export const hideSoundAction = (sound: SoundInterface) => createAction(ActionTypes.HIDE_SOUND, sound);
export const playSoundAction = (sound: SoundInterface) => createAction(ActionTypes.PLAY_SOUND, sound);
export const showSoundAction = (sound: SoundInterface) => createAction(ActionTypes.SHOW_SOUND, sound);
export const stopSoundAction = () => createAction(ActionTypes.STOP_SOUND, undefined);
