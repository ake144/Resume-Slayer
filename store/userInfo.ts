import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserInfoState {
  id: string;
  setId: (id: string) => void;
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  clearUserInfo: () => void;
}

export const useUserInfoStore = create<UserInfoState>()(
  persist(
    (set) => ({
      id: '',
      setId: (id) => set({ id: id }),
      name: '',
      setName: (name) => set({ name: name }),
      email: '',
      setEmail: (email) => set({ email: email }),
      clearUserInfo: () => set({ id: '', name: '', email: '' }),
    }),
    {
      name: 'user-info-storage', // key in local storage
    }
  )
);
