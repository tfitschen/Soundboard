import SoundActionInterface from "../action/Action";
import SoundActionTypes from "../action/types";
import SoundInterface from "../audio/Sound";

export interface SoundboardState {
    playing: boolean;
    sounds: Array<SoundInterface>;
}

const INITIAL_STATE: SoundboardState = {playing: false, sounds: new Array<SoundInterface>()};

const soundboard = (state: SoundboardState = INITIAL_STATE, action: SoundActionInterface): SoundboardState => {
    switch (action && action.type) {
        case SoundActionTypes.ADD_SOUND:
            return {
                playing: state.playing,
                sounds: state.sounds.concat(action.sound)
            };

        case SoundActionTypes.PLAY_SOUND:
            return {
                playing: true,
                sounds: state.sounds.slice()
            };

        case SoundActionTypes.STOP_SOUND:
            return {
                playing: false,
                sounds: state.sounds.slice()
            };

        default:
            return state;
    }
};

export default soundboard;
