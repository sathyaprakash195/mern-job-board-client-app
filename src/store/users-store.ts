import type { IUser } from "@/interfaces";
import { create } from "zustand";
import { apiRoutes } from "@/constants/api-routes";
import axios from "axios";
axios.defaults.withCredentials = true;

export interface UsersStore {
  user: IUser | null;
  fetchAndStoreUser: () => void;
  loading: boolean;
}

export const useUsersStore = create<UsersStore>((set) => ({
  user: null,
  loading: false,
  fetchAndStoreUser: async () => {
    try {
      set({ loading: true });
      const response = await axios.get(apiRoutes.profile);
      set({ user: response.data.user });
    } catch (error: any) {
      console.error("Failed to fetch user data", error);
      set({ user: null });
    } finally {
      set({ loading: false });
    }
  },
}));
