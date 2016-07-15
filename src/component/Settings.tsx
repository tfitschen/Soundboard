import * as React from "react";
import {Button} from "react-bootstrap";
import {connect} from "react-redux";
import {Link} from "react-router";

import {addSoundAction, hideSoundAction, showSoundAction} from "../action/Action";
import audioManager from "../audio/Manager";
import SoundInterface from "../audio/Sound";
import {SoundboardState} from "../reducer/soundboard";
import * as request from "../util/request";

interface SettingsProps extends React.Props<any> {
    playing?: boolean;
    sounds?: Array<SoundInterface>;
    add(sound: SoundInterface): any;
    hide(sound: SoundInterface): any;
    show(sound: SoundInterface): any;
}

function mapStateToProps({soundboard}: {soundboard: SoundboardState}): Object {
    return {
        sounds: soundboard.sounds
    };
}

function mapDispatchToProps(dispatch: (action: any) => any): Object {
    return {
        add: (sound: SoundInterface) => dispatch(addSoundAction(sound)),
        hide: (sound: SoundInterface) => dispatch(hideSoundAction(sound)),
        show: (sound: SoundInterface) => dispatch(showSoundAction(sound))
    };
}

class Settings extends React.Component<SettingsProps, any> {

    componentWillMount() {
        if (this.props.sounds.length === 0) {
            request
                .getJSON<Array<SoundInterface>>("audio/index.json")
                .then(sounds =>
                    Promise.all(sounds.map(sound =>
                        audioManager.load(sound.url).then(() =>
                            this.props.add(Object.assign({playCount: 0, show: true}, sound))
                        )
                    ))
                );
        }
    }

    render() {
        const sounds = this.props.sounds.map(sound => (
            <li key={sound.name}>
                <span>{sound.name} </span>
                <Button bsStyle={sound.show ? "success" : "danger"} onClick={() => this._toogleVisibillity(sound)}>
                    {sound.show ? "Shown" : "Hidden"}
                </Button>
            </li>
        ));

        return (
            <div className="container-fluid settings">
                <div className="row well">
                    <Link className="btn btn-default" to="/">
                        <span className="glyphicon glyphicon-arrow-left" aria-hidden="true"></span> Soundboard
                    </Link>
                </div>

                <div className="row">
                    <ul>
                        {sounds}
                    </ul>
                </div>
            </div>
        );
    }

    private _toogleVisibillity(sound: SoundInterface): void {
        if (sound.show) {
            this.props.hide(sound);
        } else {
            this.props.show(sound);
        }
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
