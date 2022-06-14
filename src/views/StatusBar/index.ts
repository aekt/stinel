import { BrowserView, Rectangle } from "electron";
import * as path from "path";

import * as SimpleAddressState from "../../states/SimpleAddressState";

export const HEIGHT = 20;

export interface Resources {
  view: BrowserView;
}

export function Create(): Resources {
  const view = new BrowserView({
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  const res = {
    view,
  };
  return res;
}

interface IBindArgs {
  ListenState: (listener: SimpleAddressState.StateListener) => void;
}
export function Bind(res: Resources, args: IBindArgs): void {
  const { ListenState } = args;
  res.view.webContents.on("before-input-event", (event, input) => {
    event.preventDefault();
  });
  ListenState((state: SimpleAddressState.State) => {
    res.view.webContents.send("update-address", state.address);
  });
}

interface ISetBoundsArgs extends Rectangle {}
export function SetBounds(res: Resources, args: ISetBoundsArgs): void {
  const { x, y, width, height } = args;
  res.view.setBounds({ x, y, width, height });
}

export function Load(res: Resources): void {
  res.view.webContents.loadFile(path.join(__dirname, "./html/index.html"));
}
