"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import {
  getRoster,
  fitsInMetadata,
  MAX_DRIVERS,
  saveRoster,
  vehicles,
  type Driver,
  type Vehicle,
} from "@/lib/roster";

type DriverFields = Omit<Driver, "id">;

function parseDriver(formData: FormData): DriverFields | null {
  const nameValue = formData.get("name");
  const phoneValue = formData.get("phone");
  const vehicleValue = formData.get("vehicle");

  if (
    typeof nameValue !== "string" ||
    (phoneValue !== null && typeof phoneValue !== "string") ||
    typeof vehicleValue !== "string"
  ) {
    return null;
  }

  const name = nameValue.trim();
  const phone = typeof phoneValue === "string" ? phoneValue.trim() : "";

  if (
    name.length < 1 ||
    name.length > 80 ||
    phone.length > 30 ||
    !vehicles.includes(vehicleValue as Vehicle)
  ) {
    return null;
  }

  return {
    name,
    phone,
    vehicle: vehicleValue as Vehicle,
    active: formData.get("active") === "on",
  };
}

export async function addDriver(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const fields = parseDriver(formData);
  if (!fields) return;

  const roster = await getRoster(userId);
  if (roster.length >= MAX_DRIVERS) redirect("/roster?error=full");

  const newRoster = [...roster, { id: crypto.randomUUID(), ...fields }];
  if (!fitsInMetadata(newRoster)) redirect("/roster?error=full");

  await saveRoster(userId, newRoster);
  revalidatePath("/roster");
  redirect("/roster");
}

export async function updateDriver(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const id = formData.get("id");
  const fields = parseDriver(formData);
  if (typeof id !== "string" || !fields) return;

  const roster = await getRoster(userId);
  const driverIndex = roster.findIndex((driver) => driver.id === id);
  if (driverIndex === -1) return;

  const newRoster = roster.map((driver, index) =>
    index === driverIndex ? { ...driver, ...fields } : driver,
  );
  if (!fitsInMetadata(newRoster)) {
    redirect(`/roster?edit=${encodeURIComponent(id)}&error=full`);
  }

  await saveRoster(userId, newRoster);
  revalidatePath("/roster");
  redirect("/roster");
}

export async function removeDriver(formData: FormData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const id = formData.get("id");
  if (typeof id !== "string") return;

  const roster = await getRoster(userId);
  const updatedRoster = roster.filter((driver) => driver.id !== id);
  if (updatedRoster.length === roster.length) return;

  await saveRoster(userId, updatedRoster);
  revalidatePath("/roster");
  redirect("/roster");
}
