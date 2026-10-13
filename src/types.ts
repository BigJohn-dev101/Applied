export type Stage = "wishlist" | "applied" | "interview" | "offer" | "closed";

export interface Application {
  id: string;
  company: string;
  role: string;
  link?: string;
  dateSent: string; // YYYY-MM-DD
  stage: Stage;
  notes?: string;
  createdAt: string; // ISO timestamp
}

export type StageFilter = Stage | "all";