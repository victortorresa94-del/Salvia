// TODO: swap plant to "/models/plant_fejka.glb" once downloaded from Sketchfab
// See BLOCKERS.md — model ID d7403cd19c1f4955802b0f57cb2b249d
export const MODELS = {
  plant: "/models/avocado_demo.glb",
  plantFinal: "/models/plant_fejka.glb",
  avocadoDemo: "/models/avocado_demo.glb",
} as const;

export type ModelKey = keyof typeof MODELS;
