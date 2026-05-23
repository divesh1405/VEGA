import { create } from 'zustand';

export const useGameStore = create((set, get) => ({
  // --- Game State ---
  gameState: 'MENU', // MENU | PLAYING | PAUSED | LEVEL_COMPLETE | GAMEOVER

  // --- Player Health ---
  health: 100,
  maxHealth: 100,

  // --- Level ---
  level: 1,
  kills: 0,
  totalKills: 0,

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
      const newHealth = Math.max(0, state.health - amount);
      if (newHealth <= 0) {
        return { health: 0, gameState: 'GAMEOVER' };
      }
      return { health: newHealth };
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

  nextLevel: () =>
    set((state) => ({
      level: state.level + 1,
      kills: 0,
      gameState: 'PLAYING',
    })),

  reset: () =>
    set({
      health: 100,
      maxHealth: 100,
      level: 1,
      kills: 0,
      totalKills: 0,
      gameState: 'PLAYING',
      mouseYaw: 0,
      mousePitch: 0,
      playerPosition: [0, 1, 0],
    }),
}));
