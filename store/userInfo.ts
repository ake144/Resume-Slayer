import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserInfoState {
  id: string;
 setId: (id: string) => void;
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  role: string;
  setRole: (role: string) => void;
  avatarUrl: string;
  setAvatarUrl: (url: string) => void;
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
      role: '',
      setRole: (role) => set({ role: role }),
      avatarUrl: '',
      setAvatarUrl: (url) => set({ avatarUrl: url }),
      clearUserInfo: () => set({ name: '', email: '', avatarUrl: '', role: '' }),
    }),
    {
      name: 'user-info-storage', // key in local storage
    }
  )
);
