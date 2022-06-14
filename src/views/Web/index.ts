import { BrowserView } from "electron";

function CreateBrowserView(): BrowserView {
  return new BrowserView();
}

export const Web = {
  CreateBrowserView,
};
