import "server-only";

import { clerkClient } from "@clerk/nextjs/server";

export const vehicles = ["bike", "motorbike", "car", "van"] as const;
export type Vehicle = (typeof vehicles)[number];
export type Driver = {
  id: string;
  name: string;
  phone: string;
  vehicle: Vehicle;
  active: boolean;
};

export const MAX_DRIVERS = 50;
export const ROSTER_BYTE_LIMIT = 7000;

export function fitsInMetadata(roster: Driver[]): boolean {
  return (
    new TextEncoder().encode(JSON.stringify({ roster })).length <=
    ROSTER_BYTE_LIMIT
  );
}

function isVehicle(value: unknown): value is Vehicle {
  return typeof value === "string" && vehicles.includes(value as Vehicle);
}

function isDriver(value: unknown): value is Driver {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const driver = value as Record<string, unknown>;

  return (
    typeof driver.id === "string" &&
    driver.id.length > 0 &&
    typeof driver.name === "string" &&
    driver.name.trim().length > 0 &&
    driver.name.length <= 80 &&
    typeof driver.phone === "string" &&
    driver.phone.length <= 30 &&
    isVehicle(driver.vehicle) &&
    typeof driver.active === "boolean"
  );
}

export async function getRoster(userId: string): Promise<Driver[]> {
  const client = await clerkClient();
  const roster = (await client.users.getUser(userId)).privateMetadata.roster;

  if (
    !Array.isArray(roster) ||
    roster.length > MAX_DRIVERS ||
    !roster.every(isDriver)
  ) {
    return [];
  }

  return roster;
}

export async function saveRoster(
  userId: string,
  roster: Driver[],
): Promise<void> {
  const client = await clerkClient();
  await client.users.updateUserMetadata(userId, {
    privateMetadata: { roster },
  });
}
