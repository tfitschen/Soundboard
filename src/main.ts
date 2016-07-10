import * as fastclick from "fastclick";
import * as React from "react";
import * as ReactDOM from "react-dom";

import SoundboardComponent from "./component/Soundboard";

export function attachFastclick(body: HTMLBodyElement) {
    fastclick.FastClick.attach(body);
}

export function init(dom: HTMLElement) {
    ReactDOM.render(React.createElement(SoundboardComponent, null), dom);
}
