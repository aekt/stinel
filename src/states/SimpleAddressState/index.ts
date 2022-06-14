import { Input } from "electron";

export interface State {
  editing: boolean;
  address: string;
}

export interface Action {
  input: Input;
}

export interface Effect {
  LoadUrl: (url: string) => void;
}

export type StateListener = (state: State) => void;

export function Create(): State {
  return {
    editing: false,
    address: "",
  };
}

export function Mutate(state: State, action: Action, effects: Effect): State {
  const { editing, address } = state;
  const { input } = action;
  switch (true) {
    case editing && input.key === "Enter":
      effects.LoadUrl(address);
      return {
        editing: false,
        address: "",
      };
    case editing && input.key === "Escape":
      return {
        editing: false,
        address: "",
      };
    case editing && input.key === "Backspace":
      return {
        editing,
        address: address.slice(0, -1),
      };
    case editing &&
      (input.key === "Shift" || input.key === "Alt" || input.key === "Ctrl"):
      return {
        editing,
        address,
      };
    case editing:
      return {
        editing,
        address: address + input.key,
      };
    case input.key == ":":
      return {
        editing: true,
        address,
      };
    default:
      return {
        editing,
        address,
      };
  }
}
