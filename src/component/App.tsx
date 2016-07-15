import * as React from "react";
import ReactCSSTransitionGroup from "react-addons-css-transition-group";
import * as ReactDOM from "react-dom";
import {Provider} from "react-redux";
import {IndexRoute, Router, Route, hashHistory} from "react-router";
import {applyMiddleware, createStore} from "redux";

import Soundboard from "./Soundboard";
import Settings from "./Settings";

import audioManager from "../audio/Manager";
import SoundActionInterface from "../action/Action";
import SoundActionTypes from "../action/types";

import soundboardApp from "../reducer/index";

const playSound = (store: any) => (next: (data: any) => any) => (action: SoundActionInterface) => {
    if (!action || action.type !== SoundActionTypes.PLAY_SOUND) {
        return next(action);
    }

    audioManager.load(action.sound.url).then((sample) => audioManager.play(sample));

    return next(action);
};

const stopSound = (store: any) => (next: any) => (action: SoundActionInterface) => {
    if (!action || action.type !== SoundActionTypes.STOP_SOUND) {
        return next(action);
    }

    audioManager.stop();

    return next(action);
};

class App extends React.Component<any, any> {

    render() {
        const path = location.hash.replace(/^#\/|\?.*$/g, "") || "root";

        return (
            <ReactCSSTransitionGroup
                component="div"
                transitionName={path === "root" ? "example-out" : "example-in"}
                transitionEnterTimeout={500}
                transitionLeaveTimeout={500}
            >
                {React.cloneElement(this.props.children, {key: path})}
            </ReactCSSTransitionGroup>
        );
    }

}

export default function render(dom: HTMLElement): void {
    const createStoreWithMiddleware = applyMiddleware(playSound, stopSound)(createStore);
    const store = createStoreWithMiddleware(soundboardApp, {});

    ReactDOM.render(
        <Provider store={store}>
            <Router history={hashHistory}>
                <Route path="/" component={App}>
                    <IndexRoute component={Soundboard} />
                    <Route path="settings" component={Settings} />
                </Route>
            </Router>
        </Provider>,
        dom
    );
}
