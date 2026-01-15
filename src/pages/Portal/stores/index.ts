import type { MenuMode } from "@/types/map";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface MapStyleStore {
  newStyle: boolean;
  pureMode: boolean;
  menuMode: MenuMode;
  toggleMapStyle: () => void;
  togglePureMode: () => void;
  toggleMenuMode: (v: MenuMode) => void;
}

export const useMapStyleStore = create<MapStyleStore>()(
  subscribeWithSelector((set) => ({
    newStyle: false,
    pureMode: false,
    menuMode:"overview",
    toggleMapStyle: () => set((s) => ({ newStyle: !s.newStyle })),
    togglePureMode: () => set((s) => ({ pureMode: !s.pureMode })),
    toggleMenuMode: (v: MenuMode) => set(() => ({ menuMode: v })),
  }))
);
