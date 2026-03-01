export const BOOT_STATUS_MESSAGES = [
  "Loading system",
  "Connecting AI brain",
  "Preparing avatar",
  "Loading memory",
  "Almost ready",
] as const;

export const BOOT_TIMING = {
  totalDuration: 6000,
  fadeOutDuration: 800,
  statusRotationInterval: 1200,
  statusFadeDuration: 200,
} as const;

export const PARTICLE_COUNT = 25;
export const HEX_GRID_SPACING = 60;
