export const HDRI = {
  hero: "/hdri/kloppenheim_06_puresky.hdr",
  growth: "/hdri/rural_landscape.hdr",
  underground: "/hdri/dikhololo_night.hdr",
  harvest: "/hdri/autumn_field.hdr",
} as const;

export type HdriKey = keyof typeof HDRI;
