import * as React from "react";
import {Button} from "react-bootstrap";
import {connect} from "react-redux";

import addSoundAction from "../action/Add";
import playSoundAction from "../action/Play";
import stopSoundAction from "../action/Stop";
import SoundActionInterface from "../action/Action";

import audioManager from "../audio/Manager";
import SoundInterface from "../audio/Sound";
import * as request from "../util/request";
import {SoundboardState} from "../reducer/soundboard";

interface SoundboardProps extends React.Props<any> {
    playing?: boolean;
    sounds?: Array<SoundInterface>;
    add?(sound: SoundInterface): any;
    play?(sound: SoundInterface): any;
    stop?(): any;
}

function mapStateToProps({soundboard}: {soundboard: SoundboardState}): SoundboardState {
    return soundboard;
}

function mapDispatchToProps(dispatch: (action: any) => any): Object {
    return {
        add: (sound: SoundInterface) => dispatch(addSoundAction(sound)),
        play: (sound: SoundInterface) => dispatch(playSoundAction(sound)),
        stop: () => dispatch(stopSoundAction())
    };
}

class Soundboard extends React.Component<SoundboardProps, void> {

    componentWillMount() {
        request
            .getJSON<Array<SoundInterface>>("audio/index.json")
            .then(sounds =>
                Promise.all(sounds.map(sound =>
                    audioManager.load(sound.url).then(() =>
                        this.props.add(Object.assign({playCount: 0}, sound))
                    )
                ))
            );

        this._onSoundStopedListener = this._onSoundStopedHandler.bind(this);
        audioManager.events.stopped.on(this._onSoundStopedListener);
    }

    componentWillUnmount() {
        if (this._onSoundStopedListener) {
            audioManager.events.stopped.off(this._onSoundStopedListener);
            this._onSoundStopedListener = null;
        }
    }

    render() {
        const {playing, sounds, play, stop} = this.props;
        const buttons = sounds.map((sound: SoundInterface) => {
            return (
                <div className="col-sm-4 text-center" key={sound.name}>
                    <span>{sound.name} ({`${sound.duration}s`}) <span className="badge">{sound.playCount}</span></span>
                    <Button block disabled={playing} onClick={() => play(sound)}>
                        <span className="glyphicon glyphicon-play" aria-hidden="true"></span> Play
                    </Button>
                </div>
            );
        });

        return (
            <div className="container-fluid soundboard">
                <div className="row well">
                    <Button disabled={!playing} onClick={() => stop()}>
                        <span className="glyphicon glyphicon-stop" aria-hidden="true"></span> Stop
                    </Button>
                </div>

                <div className="row">
                    {buttons}
                </div>
            </div>
        );
    }

    private _onSoundStopedListener: () => void;

    private _onSoundStopedHandler(): void {
        this.props.stop();
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(Soundboard);
