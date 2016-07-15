import * as React from "react";
import {Button} from "react-bootstrap";

import audioManager from "../audio/Manager";
import * as request from "../util/request";

interface SoundInterface {
    name: string;
    url: string;
    duration: number;
}

const Soundboard = React.createClass({
    getInitialState: function () {
        return {
            playing: false,
            sounds: new Array<SoundInterface>(),
        };
    },

    componentDidMount: function () {
        audioManager.events.playing.on(this.handleOnPlaying);
        audioManager.events.stopped.on(this.handleOnStopped);

        request
            .getJSON<Array<SoundInterface>>("audio/index.json")
            .then(function (sounds) {
                return Promise.all(sounds.map(function (sound) {
                    return audioManager.load(sound.url).then(() => sound);
                }));
            })
            .then((sounds) => this.setState({playing: this.state.playing, sounds}))
            .catch(function (err) {
                console.log(err);
            });
    },

    componentWillUnmount: function () {
        audioManager.events.playing.off(this.handleOnPlaying);
        audioManager.events.stopped.off(this.handleOnStopped);
    },

    handleOnPlaying: function () {
        if (this.state.playing) {
            return;
        }

        this.setState({playing: true, sounds: this.state.sounds});
    },

    handleOnStopped: function () {
        this.setState({playing: false, sounds: this.state.sounds});
    },

    handlePlaySoundClick: function (sound: SoundInterface) {
        this.setState({playing: true, sounds: this.state.sounds});
        audioManager
            .load(sound.url)
            .then(function (sample) {
                audioManager.play(sample);
            })
            .catch((err) => {
                console.error(err);
                this.setState({playing: false, sounds: this.state.sounds});
            });
    },

    handleStopClick: function () {
        audioManager.stop();
    },

    render: function () {
        const buttons = this.state.sounds.map((sound: SoundInterface) => {
            return (
                <div className="col-sm-4 text-center" key={sound.name}>
                    <span>{sound.name} ({`${sound.duration}s`})</span>
                    <Button block disabled={this.state.playing} onClick={this.handlePlaySoundClick.bind(this, sound)}>
                        <span className="glyphicon glyphicon-play" aria-hidden="true"></span> Play
                    </Button>
                </div>
            );
        });

        return (
            <div className="container-fluid soundboard">
                <div className="row well">
                    <Button disabled={!this.state.playing} onClick={this.handleStopClick}>
                        <span className="glyphicon glyphicon-stop" aria-hidden="true"></span> Stop
                    </Button>
                </div>

                <div className="row">
                    {buttons}
                </div>
            </div>
        );
    }

});

export default Soundboard;
