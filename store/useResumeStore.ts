import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ResumeState {
  resumeText: string;
  setResumeText: (text: string) => void;
  clearResumeText: () => void;
}

export const useResumeStore = create<ResumeState>()(
  persist(
    (set) => ({
      resumeText: '',
      setResumeText: (text) => set({ resumeText: text }),
      clearResumeText: () => set({ resumeText: '' }),
    }),
    {
      name: 'resume-storage', // key in local storage
    }
  )
);
