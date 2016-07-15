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
                sounds: state.sounds
                    .map(sound => Object.assign({}, sound))
                    .concat(Object.assign({}, action.sound))
            };

        case SoundActionTypes.HIDE_SOUND:
            return {
                playing: state.playing,
                sounds: state.sounds.map(sound => {
                    const newSound = Object.assign({}, sound);

                    if (sound.name === action.sound.name) {
                        newSound.show = false;
                    }

                    return newSound;
                })
            };

        case SoundActionTypes.PLAY_SOUND:
            return {
                playing: true,
                sounds: state.sounds.map(sound => {
                    const newSound = Object.assign({}, sound);

                    if (sound.name === action.sound.name) {
                        newSound.playCount++;
                    }

                    return newSound;
                })
            };

        case SoundActionTypes.SHOW_SOUND:
            return {
                playing: state.playing,
                sounds: state.sounds.map(sound => {
                    const newSound = Object.assign({}, sound);

                    if (sound.name === action.sound.name) {
                        newSound.show = true;
                    }

                    return newSound;
                })
            };

        case SoundActionTypes.STOP_SOUND:
            return {
                playing: false,
                sounds: state.sounds.map(sound => Object.assign({}, sound))
            };

        default:
            return state;
    }
};

export default soundboard;
