import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface ConfigStore {
  cloud: boolean;
  bar: boolean;
  rotation: boolean;
  heat: boolean;
  mode: boolean;
  toggle: (key: keyof Omit<ConfigStore, "toggle">) => void;
}

export const useConfigStore = create<ConfigStore>()(
  subscribeWithSelector((set) => ({
    cloud: true,
    bar: true,
    rotation: true,
    heat: true,
    mode: true,
    toggle: (key) => set((s) => ({ [key]: !s[key] })),
  }))
);
