(window as any).electronAPI.onUpdateAddress(
  (_event: unknown, value: string) => {
    window.document.body.innerText = value;
  }
);
