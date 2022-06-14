import { BrowserWindow, Input } from "electron";
import * as path from "path";

import * as Constant from "../../configs/Constant";
import * as SimpleAddressState from "../../states/SimpleAddressState";
import * as StatusBar from "../../views/StatusBar";

const STATUS_BAR_OFFSET_Y = 16;

export type InputHandler = (input: Input) => void;

function DeriveStatusBarBounds(res: Resources) {
  const [winContentWidth, winContentHeight] = res.win.getContentSize();
  return {
    x: 0,
    y: winContentHeight - StatusBar.HEIGHT - STATUS_BAR_OFFSET_Y,
    width: winContentWidth,
    height: StatusBar.HEIGHT,
  };
}

export interface Resources {
  win: BrowserWindow;
  statusBar: StatusBar.Resources;
}

export function Create(): Resources {
  const win = new BrowserWindow();
  const statusBar = StatusBar.Create();
  win.setTitle(Constant.APP_NAME);
  win.setBrowserView(statusBar.view);
  const res = {
    win,
    statusBar,
  };
  return res;
}

export function LoadUrl(res: Resources, url: string): void {
  res.win.loadURL(url);
}

interface IBindArgs {
  HandleInput: InputHandler;
  ListenState: (listener: SimpleAddressState.StateListener) => void;
}
export function Bind(res: Resources, args: IBindArgs): void {
  const { HandleInput, ListenState } = args;
  res.win.webContents.on("before-input-event", (event, input) => {
    HandleInput(input);
    event.preventDefault();
  });
  res.win.on("resize", () => {
    StatusBar.SetBounds(res.statusBar, DeriveStatusBarBounds(res));
  });
  StatusBar.Bind(res.statusBar, { ListenState });
}

export function Load(res: Resources): void {
  res.win.loadFile(path.join(__dirname, "./html/index.html"));
  StatusBar.SetBounds(res.statusBar, DeriveStatusBarBounds(res));
  StatusBar.Load(res.statusBar);
}
