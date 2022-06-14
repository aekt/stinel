import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  onUpdateAddress: (
    callback: (event: IpcRendererEvent, ...args: any[]) => void
  ) => ipcRenderer.on("update-address", callback),
});
