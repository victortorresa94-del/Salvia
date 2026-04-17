// drei Environment presets — no local files needed, served from drei CDN
// Swap to local paths once /public/hdri/ has valid .hdr files
export const HDRI = {
  hero:        { preset: "dawn"   } as const,
  growth:      { preset: "park"   } as const,
  underground: { preset: "night"  } as const,
  harvest:     { preset: "sunset" } as const,
} as const;

export type HdriKey = keyof typeof HDRI;
