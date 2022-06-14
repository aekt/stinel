import { app, App, BrowserWindow, Input } from "electron";

import * as Constant from "./configs/Constant";
import * as Main from "./windows/Main";
import * as SimpleAddressState from "./states/SimpleAddressState";

function StartMain(): void {
  const main = Main.Create();
  let state = SimpleAddressState.Create();
  const stateListeners: SimpleAddressState.StateListener[] = [];

  // This is the ugly part
  const HandleInput = (input: Input) => {
    state = SimpleAddressState.Mutate(
      state,
      { input },
      {
        LoadUrl: (url: string) => {
          Main.LoadUrl(main, url);
        },
      }
    );
    for (let listener of stateListeners) {
      listener(state);
    }
  };

  const ListenState = (listener: SimpleAddressState.StateListener) => {
    stateListeners.push(listener);
  };

  Main.Bind(main, { HandleInput, ListenState });
  Main.Load(main);
}

function RegisterAppEvents(app: App) {
  app.on("ready", () => {
    StartMain();
  });
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      StartMain();
    }
  });
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });
}

app.setName(Constant.APP_NAME);
RegisterAppEvents(app);
