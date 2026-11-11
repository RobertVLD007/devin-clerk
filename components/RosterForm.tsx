import Link from "next/link";
import { addDriver, updateDriver } from "@/app/roster/actions";
import { vehicles, type Driver } from "@/lib/roster";

export function RosterForm({ driver }: { driver?: Driver }) {
  return (
    <form
      action={driver ? updateDriver : addDriver}
      className="flex flex-col gap-5 rounded-2xl border border-black/10 bg-white p-5 shadow-sm"
    >
      {driver && <input type="hidden" name="id" value={driver.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium">
          Name
          <input
            type="text"
            name="name"
            required
            maxLength={80}
            defaultValue={driver?.name}
            className="rounded-lg border border-black/15 px-3 py-2 font-normal"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium">
          Phone
          <input
            type="tel"
            name="phone"
            maxLength={30}
            defaultValue={driver?.phone}
            className="rounded-lg border border-black/15 px-3 py-2 font-normal"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium">
          Vehicle
          <select
            name="vehicle"
            required
            defaultValue={driver?.vehicle ?? vehicles[0]}
            className="rounded-lg border border-black/15 bg-white px-3 py-2 font-normal"
          >
            {vehicles.map((vehicle) => (
              <option key={vehicle} value={vehicle}>
                {vehicle[0].toUpperCase() + vehicle.slice(1)}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 self-end pb-2 text-sm font-medium">
          <input
            type="checkbox"
            name="active"
            defaultChecked={driver?.active ?? true}
            className="size-4 accent-accent"
          />
          Active
        </label>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="submit"
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
        >
          {driver ? "Save changes" : "Add delivery person"}
        </button>
        {driver && (
          <Link href="/roster" className="text-sm hover:text-accent">
            Cancel
          </Link>
        )}
      </div>
    </form>
  );
}
