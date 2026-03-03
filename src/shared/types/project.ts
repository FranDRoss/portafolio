export type ProjectCharacter = {
  id: string; // uuid
  product_id: string;
  character_id: string;
  avatar_src?: string;
  image_src?: string;
  title?: Record<string, string>;
  subtitle?: Record<string, string>;
  description?: Record<string, string>;
  sort_order: number;
};

export type ProjectData = {
  id: string;
  active: boolean;
  sort_order: number;
  type?: string;
  status?: string;
  src_cover?: string;
  title?: Record<string, string>;
  subtitle?: Record<string, string>;
  description?: Record<string, string>;
  publisher?: string;
  isbn?: string;
  publish_date?: string;
  format?: string;
  banner_accent_color?: string;
  banner_desktop?: string;
  banner_tablet?: string;
  banner_mobile?: string;

  characters?: ProjectCharacter[];
};

export type ProjectType = "graphic-novel" | "collaboration-comic" | "other";