import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { removeDriver } from "@/app/roster/actions";
import { RosterForm } from "@/components/RosterForm";
import { getRoster } from "@/lib/roster";

export default async function RosterPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string | string[] }>;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const [{ edit }, roster] = await Promise.all([
    searchParams,
    getRoster(userId),
  ]);
  const editId = Array.isArray(edit) ? edit[0] : edit;
  const editingDriver = roster.find((driver) => driver.id === editId);

  return (
    <section className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Delivery team roster</h1>
        <p className="text-black/70">
          Manage your delivery people, contact details, and vehicles.
        </p>
      </div>
      <RosterForm driver={editingDriver} />
      {roster.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-black/15 px-5 py-8 text-center text-sm text-black/60">
          No delivery people yet — add your first one above.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-black/10 bg-white">
          <table className="w-full min-w-[700px] divide-y divide-black/10 text-left text-sm">
            <thead className="bg-black/[0.02] text-xs uppercase tracking-wide text-black/55">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Phone</th>
                <th className="px-5 py-3 font-medium">Vehicle</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {roster.map((driver) => (
                <tr key={driver.id}>
                  <td className="px-5 py-4 font-medium">{driver.name}</td>
                  <td className="px-5 py-4 text-black/70">
                    {driver.phone || "—"}
                  </td>
                  <td className="px-5 py-4 capitalize">{driver.vehicle}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        driver.active
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-black/5 text-black/60"
                      }`}
                    >
                      {driver.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-4">
                      <Link
                        href={`/roster?edit=${encodeURIComponent(driver.id)}`}
                        className="hover:text-accent"
                      >
                        Edit
                      </Link>
                      <form action={removeDriver}>
                        <input type="hidden" name="id" value={driver.id} />
                        <button
                          type="submit"
                          className="text-red-700 hover:underline"
                        >
                          Remove
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
