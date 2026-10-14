import { seedApplications } from "../data/seed";
import type { Application, NewApplication } from "../types";

const STORAGE_KEY = "applied.applications";
const DELAY_MS = 300; // deliberate, so loading states are visible

const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

function writeAll(applications: Application[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
}

function readAll(): Application[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === null) {
    writeAll(seedApplications);
    return seedApplications;
  }
  
  return JSON.parse(raw) as Application[];
}

export async function fetchApplications(): Promise<Application[]> {
  await delay(DELAY_MS);
  return readAll();
}

export async function createApplication(
  input: NewApplication,
): Promise<Application> {
  await delay(DELAY_MS);
  const created: Application = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  writeAll([created, ...readAll()]);
  return created;
}

export async function updateApplication(
  id: string,
  changes: Partial<Application>,
): Promise<Application> {
  await delay(DELAY_MS);
  const applications = readAll();
  const existing = applications.find((a) => a.id === id);
  if (!existing) throw new Error(`Application ${id} not found`);

 
  const updated: Application = {
    ...existing,
    ...changes,
    id: existing.id,
    createdAt: existing.createdAt,
  };
  writeAll(applications.map((a) => (a.id === id ? updated : a)));
  return updated;
}

export async function deleteApplication(id: string): Promise<void> {
  await delay(DELAY_MS);
  writeAll(readAll().filter((a) => a.id !== id));
}