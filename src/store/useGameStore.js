import { create } from 'zustand';

export const useGameStore = create((set) => ({
  // --- Game State ---
  gameState: 'MENU', // MENU | PLAYING | PAUSED | LEVEL_COMPLETE | GAMEOVER

  // --- Player Health ---
  health: 100,
  maxHealth: 100,
  lastDamageTime: 0,

  // --- Melee ---
  lastMeleeSwingTime: 0,

  // --- Level ---
  level: 1,
  kills: 0,
  totalKills: 0,
  timeRemaining: 60,
  levelDuration: 60,

  // --- Mouse Look ---
  mouseYaw: 0,
  mousePitch: 0,

  // --- Player position (written by Player, read by Camera) ---
  playerPosition: [0, 1, 0],

  // --- Actions ---
  setGameState: (state) => set({ gameState: state }),

  setMouseRotation: (yaw, pitch) => set({ mouseYaw: yaw, mousePitch: pitch }),

  setPlayerPosition: (pos) => set({ playerPosition: pos }),

  takeDamage: (amount) =>
    set((state) => {
      if (state.gameState !== 'PLAYING') return {};
      const now = performance.now() / 1000;
      if (state.lastDamageTime && now - state.lastDamageTime < 0.5) {
        return {};
      }
      const newHealth = Math.max(0, state.health - amount);
      if (newHealth <= 0) {
        // Exit pointer lock on game over
        document.exitPointerLock?.();
        return { health: 0, gameState: 'GAMEOVER', lastDamageTime: now };
      }
      return { health: newHealth, lastDamageTime: now };
    }),

  addKill: () =>
    set((state) => ({
      kills: state.kills + 1,
      totalKills: state.totalKills + 1,
    })),

  healBetweenLevels: () =>
    set((state) => ({
      health: state.maxHealth,
    })),

  scaleHealthForLevel: (level) =>
    set(() => {
      const newMax = Math.floor(100 * (1 + (level - 1) * 0.1));
      return { maxHealth: newMax, health: newMax };
    }),

  tickTimer: (delta) =>
    set((state) => {
      if (state.gameState !== 'PLAYING') return {};
      const nextTime = Math.max(0, state.timeRemaining - delta);
      if (nextTime <= 0) {
        document.exitPointerLock?.();
        return { timeRemaining: 0, gameState: 'LEVEL_COMPLETE' };
      }
      return { timeRemaining: nextTime };
    }),

  nextLevel: () =>
    set((state) => {
      const nextLvl = state.level + 1;
      const duration = 60 + (nextLvl - 1) * 15;
      const nextMaxHP = Math.floor(100 * (1 + (nextLvl - 1) * 0.1));
      return {
        level: nextLvl,
        kills: 0,
        levelDuration: duration,
        timeRemaining: duration,
        maxHealth: nextMaxHP,
        health: nextMaxHP,
        gameState: 'PLAYING',
      };
    }),

  reset: () =>
    set({
      health: 100,
      maxHealth: 100,
      lastDamageTime: 0,
      lastMeleeSwingTime: 0,
      level: 1,
      kills: 0,
      totalKills: 0,
      levelDuration: 60,
      timeRemaining: 60,
      gameState: 'PLAYING',
      mouseYaw: 0,
      mousePitch: 0,
      playerPosition: [0, 1, 0],
    }),
}));
