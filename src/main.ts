import * as fastclick from "fastclick";
import * as React from "react";
import * as ReactDOM from "react-dom";

import render from "./component/App";

export function attachFastclick(body: HTMLBodyElement) {
    fastclick.FastClick.attach(body);
}

export function init(dom: HTMLElement) {
    render(dom);
}
