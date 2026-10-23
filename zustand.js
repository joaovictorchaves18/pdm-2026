import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useThemeStore = create(
  persist(
    (set) => ({
      modoEscuro: true,
      toggleModoEscuro: () =>
        set((state) => ({ modoEscuro: !state.modoEscuro })),
      filtroCategoriaSkill: "Todas",
      setFiltroCategoriaSkill: (categoria) =>
        set({ filtroCategoriaSkill: categoria }),
    }),
    {
      name: "joao-curriculo-theme-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
