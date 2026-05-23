import { create } from 'zustand';

// Weapon definitions
export const WEAPONS = {
  pistol: {
    name: 'Pistol',
    damage: 10,
    fireRate: 0.4,      // seconds between shots
    magSize: 12,
    reloadTime: 1.5,
    accuracy: 0.02,      // bullet spread in radians
    bulletSpeed: 40,
  },
  smg: {
    name: 'SMG',
    damage: 8,
    fireRate: 0.1,
    magSize: 30,
    reloadTime: 2.0,
    accuracy: 0.04,
    bulletSpeed: 35,
  },
  assault: {
    name: 'Assault Rifle',
    damage: 15,
    fireRate: 0.15,
    magSize: 25,
    reloadTime: 2.5,
    accuracy: 0.03,
    bulletSpeed: 45,
  },
  shotgun: {
    name: 'Shotgun',
    damage: 40,
    fireRate: 0.8,
    magSize: 6,
    reloadTime: 3.0,
    accuracy: 0.08,
    bulletSpeed: 30,
  },
  heavy: {
    name: 'Heavy Rifle',
    damage: 50,
    fireRate: 1.0,
    magSize: 5,
    reloadTime: 3.5,
    accuracy: 0.01,
    bulletSpeed: 50,
  },
};

// Weapon unlock order by level
export const WEAPON_ORDER = ['pistol', 'smg', 'assault', 'shotgun', 'heavy'];

export const useWeaponStore = create((set, get) => ({
  // Current weapon
  currentWeaponKey: 'pistol',
  currentMag: WEAPONS.pistol.magSize,
  reserveAmmo: 36,         // starting reserve
  isReloading: false,
  lastFireTime: 0,

  // Bullets in flight
  bullets: [],
  nextBulletId: 0,

  getWeapon: () => WEAPONS[get().currentWeaponKey],

  shoot: (position, direction) => {
    const state = get();
    const weapon = WEAPONS[state.currentWeaponKey];

    // Can't shoot if reloading or empty mag
    if (state.isReloading || state.currentMag <= 0) return false;

    // Fire rate check
    const now = performance.now() / 1000;
    if (now - state.lastFireTime < weapon.fireRate) return false;

    // Apply accuracy spread
    const spread = (Math.random() - 0.5) * weapon.accuracy;
    const spreadY = (Math.random() - 0.5) * weapon.accuracy;
    const dir = {
      x: direction.x + spread,
      y: direction.y + spreadY,
      z: direction.z,
    };
    // Normalize
    const len = Math.sqrt(dir.x * dir.x + dir.y * dir.y + dir.z * dir.z);
    dir.x /= len;
    dir.y /= len;
    dir.z /= len;

    const bullet = {
      id: state.nextBulletId,
      position: [position.x, position.y, position.z],
      velocity: [
        dir.x * weapon.bulletSpeed,
        dir.y * weapon.bulletSpeed,
        dir.z * weapon.bulletSpeed,
      ],
      damage: weapon.damage,
      createdAt: now,
    };

    set({
      currentMag: state.currentMag - 1,
      lastFireTime: now,
      bullets: [...state.bullets, bullet],
      nextBulletId: state.nextBulletId + 1,
    });
    return true;
  },

  removeBullet: (id) => {
    set((state) => ({
      bullets: state.bullets.filter((b) => b.id !== id),
    }));
  },

  reload: () => {
    const state = get();
    const weapon = WEAPONS[state.currentWeaponKey];
    if (state.isReloading || state.currentMag === weapon.magSize) return;
    if (state.reserveAmmo <= 0) return;

    set({ isReloading: true });

    setTimeout(() => {
      const s = get();
      const w = WEAPONS[s.currentWeaponKey];
      const needed = w.magSize - s.currentMag;
      const toLoad = Math.min(needed, s.reserveAmmo);
      set({
        currentMag: s.currentMag + toLoad,
        reserveAmmo: s.reserveAmmo - toLoad,
        isReloading: false,
      });
    }, weapon.reloadTime * 1000);
  },

  addAmmo: (amount) => {
    set((state) => ({ reserveAmmo: state.reserveAmmo + amount }));
  },

  upgradeWeapon: (level) => {
    const idx = Math.min(level - 1, WEAPON_ORDER.length - 1);
    const key = WEAPON_ORDER[idx];
    const weapon = WEAPONS[key];
    set({
      currentWeaponKey: key,
      currentMag: weapon.magSize,
      reserveAmmo: weapon.magSize * 3,
      isReloading: false,
    });
  },

  reset: () => {
    set({
      currentWeaponKey: 'pistol',
      currentMag: WEAPONS.pistol.magSize,
      reserveAmmo: 36,
      isReloading: false,
      lastFireTime: 0,
      bullets: [],
      nextBulletId: 0,
    });
  },
}));
