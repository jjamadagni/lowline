import { useEffect } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getLesson, patternMinutes, skippedIds, type Experience, type Step } from "@/lib/bass/lessons";
import { todayKey, yesterdayKey } from "@/lib/bass/stats";

export type Data = {
  onboarded: boolean;
  name: string;
  experience: Experience;
  dailyGoal: number;
  completed: string[];
  xp: number;
  streak: number;
  longest: number;
  lastDay: string | null;
  minutes: Record<string, number>;
  drillCorrect: number;
  drillAttempts: number;
  grooveLogged: string[];
  grooveDay: Record<string, string>;
  drillXpDay: string | null;
  drillXp: number;
  minuteXpDay: string | null;
  minuteXp: number;
  bpm: number;
  beats: 3 | 4;
  sound: boolean;
  showInstall: boolean;
  bestRuns: Record<string, number>;
};

type Actions = {
  start: (input: { name: string; experience: Experience; dailyGoal: number }) => void;
  setName: (name: string) => void;
  setGoal: (goal: number) => void;
  setBpm: (bpm: number) => void;
  setBeats: (beats: 3 | 4) => void;
  setSound: (sound: boolean) => void;
  dismissInstall: () => void;
  completeLesson: (id: string) => void;
  logGroove: (id: string, steps: Step[], bpm: number) => void;
  recordDrill: (correct: number, total: number) => void;
  finishRun: (id: string, score: number, hits: number, total: number) => void;
  logMinutes: (mins: number) => void;
  reset: () => void;
};

const initial: Data = {
  onboarded: false,
  name: "",
  experience: "new",
  dailyGoal: 15,
  completed: [],
  xp: 0,
  streak: 0,
  longest: 0,
  lastDay: null,
  minutes: {},
  drillCorrect: 0,
  drillAttempts: 0,
  grooveLogged: [],
  grooveDay: {},
  drillXpDay: null,
  drillXp: 0,
  minuteXpDay: null,
  minuteXp: 0,
  bpm: 76,
  beats: 4,
  sound: true,
  showInstall: true,
  bestRuns: {},
};

function touchStreak(data: Data, today = todayKey()): Data {
  if (data.lastDay === today) return data;
  const streak = data.lastDay === yesterdayKey() ? data.streak + 1 : 1;
  return {
    ...data,
    streak,
    longest: Math.max(data.longest, streak),
    lastDay: today,
  };
}

function grantMinutes(data: Data, mins: number): Data {
  const amount = Math.max(0, Math.round(mins));
  if (amount <= 0) return data;
  const today = todayKey();
  const touched = touchStreak(data, today);
  const minuteXp = touched.minuteXpDay === today ? touched.minuteXp : 0;
  const grant = Math.min(amount, Math.max(0, 15 - minuteXp));
  return {
    ...touched,
    xp: touched.xp + grant,
    minuteXp: minuteXp + grant,
    minuteXpDay: today,
    minutes: {
      ...touched.minutes,
      [today]: (touched.minutes[today] ?? 0) + amount,
    },
  };
}

export const useProgress = create<Data & Actions>()(
  persist(
    (set) => ({
      ...initial,
      start: ({ name, experience, dailyGoal }) =>
        set((state) => {
          const skipped = skippedIds(experience);
          return {
            name: name.trim().slice(0, 24),
            experience,
            dailyGoal,
            onboarded: true,
            completed: skipped,
            xp: skipped.length * 10,
          };
        }),
      setName: (name) => set({ name: name.slice(0, 24) }),
      setGoal: (dailyGoal) => set({ dailyGoal }),
      setBpm: (bpm) => set({ bpm: Math.min(200, Math.max(40, Math.round(bpm))) }),
      setBeats: (beats) => set({ beats }),
      setSound: (sound) => set({ sound }),
      dismissInstall: () => set({ showInstall: false }),
      completeLesson: (id) =>
        set((state) => {
          if (state.completed.includes(id)) return {};
          const lesson = getLesson(id);
          return grantMinutes(
            {
              ...state,
              completed: [...state.completed, id],
              xp: state.xp + 25,
            },
            lesson?.minutes ?? 4,
          );
        }),
      logGroove: (id, steps, bpm) =>
        set((state) => {
          const today = todayKey();
          if (state.grooveDay[id] === today) return {};
          const first = !state.grooveLogged.includes(id);
          return grantMinutes(
            {
              ...state,
              xp: state.xp + (first ? 8 : 0),
              grooveLogged: first ? [...state.grooveLogged, id] : state.grooveLogged,
              grooveDay: { ...state.grooveDay, [id]: today },
            },
            patternMinutes(steps, bpm),
          );
        }),
      recordDrill: (correct, total) =>
        set((state) => {
          const today = todayKey();
          const used = state.drillXpDay === today ? state.drillXp : 0;
          const add = Math.min(Math.max(0, 20 - used), correct * 2);
          return grantMinutes(
            {
              ...state,
              xp: state.xp + add,
              drillXp: used + add,
              drillXpDay: today,
              drillCorrect: state.drillCorrect + correct,
              drillAttempts: state.drillAttempts + total,
            },
            2,
          );
        }),
      finishRun: (id, score, hits, total) =>
        set((state) => {
          const today = todayKey();
          const used = state.drillXpDay === today ? state.drillXp : 0;
          const add = Math.min(Math.max(0, 20 - used), hits * 2);
          const best = state.bestRuns[id] ?? 0;
          return grantMinutes(
            {
              ...state,
              xp: state.xp + add,
              drillXp: used + add,
              drillXpDay: today,
              drillCorrect: state.drillCorrect + hits,
              drillAttempts: state.drillAttempts + total,
              bestRuns: score > best ? { ...state.bestRuns, [id]: score } : state.bestRuns,
            },
            2,
          );
        }),
      logMinutes: (mins) => set((state) => grantMinutes(state, mins)),
      reset: () => set({ ...initial }),
    }),
    {
      name: "lowline",
      version: 1,
      skipHydration: true,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        onboarded: state.onboarded,
        name: state.name,
        experience: state.experience,
        dailyGoal: state.dailyGoal,
        completed: state.completed,
        xp: state.xp,
        streak: state.streak,
        longest: state.longest,
        lastDay: state.lastDay,
        minutes: state.minutes,
        drillCorrect: state.drillCorrect,
        drillAttempts: state.drillAttempts,
        grooveLogged: state.grooveLogged,
        grooveDay: state.grooveDay,
        drillXpDay: state.drillXpDay,
        drillXp: state.drillXp,
        minuteXpDay: state.minuteXpDay,
        minuteXp: state.minuteXp,
        bpm: state.bpm,
        beats: state.beats,
        sound: state.sound,
        showInstall: state.showInstall,
        bestRuns: state.bestRuns,
      }),
    },
  ),
);

export function useHydrateProgress() {
  useEffect(() => {
    void useProgress.persist.rehydrate();
  }, []);
}
