export const LANGS = ["en", "es", "fr", "ro"] as const;
export type Lang = typeof LANGS[number];