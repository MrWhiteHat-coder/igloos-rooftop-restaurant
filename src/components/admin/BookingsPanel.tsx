import { useCallback, useEffect, useState } from "react";
import {
  fetchBookingEvents,
  fetchBookingStats,
  fetchBookings,
  updateBookingStatus,
  type BookingFilters,
} from "../../lib/adminData";
import type { Booking, BookingEvent, BookingStatus } from "../../lib/types";
import { useStaffAuth } from "../../admin/auth";
import { Button } from "../ui/Button";
import { Input, Select } from "../ui/form";
import { EmptyState, Modal, Spinner } from "../ui/misc";

const STATUS_TONE: Record<BookingStatus, "gold" | "green" | "red" | "neutral"> = {
  pending: "gold",
  confirmed: "green",
  seated: "green",
  cancelled: "red",
  no_show: "neutral",
};

const NEXT_ACTIONS: Record<BookingStatus, { to: BookingStatus; label: string; adminOnly?: boolean }[]> = {
  pending: [
    { to: "confirmed", label: "Confirm" },
    { to: "cancelled", label: "Cancel" },
  ],
  confirmed: [
    { to: "seated", label: "Mark seated" },
    { to: "cancelled", label: "Cancel" },
    { to: "no_show", label: "No-show", adminOnly: true },
  ],
  seated: [{ to: "cancelled", label: "Cancel", adminOnly: true }],
  cancelled: [{ to: "pending", label: "Re-open", adminOnly: true }],
  no_show: [],
};

export default function BookingsPanel() {
  const { profile } = useStaffAuth();
  const [filters, setFilters] = useState<BookingFilters>({
    search: "",
    status: "all",
    date: null,
    page: 1,
    pageSize: 20,
  });
  const [rows, setRows] = useState<Booking[] | null>(null);
  const [count, setCount] = useState(0);
  const [stats, setStats] = useState<Awaited<ReturnType<typeof fetchBookingStats>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [history, setHistory] = useState<{ booking: Booking; events: BookingEvent[] } | null>(null);

  const load = useCallback(
    async (f: BookingFilters) => {
      setLoading(true);
      setError(null);
      try {
        const [{ rows: r, count: c }, s] = await Promise.all([
          fetchBookings(f),
          fetchBookingStats(),
        ]);
        setRows(r);
        setCount(c);
        setStats(s);
      } catch (e) {
        setError(
          e instanceof Error && e.message === "NOT_CONFIGURED"
            ? "NOT_CONFIGURED"
            : e instanceof Error
              ? e.message
              : "Failed to load bookings."
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    void load(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.status, filters.date, filters.page, filters.search, load]);

  function patch(p: Partial<BookingFilters>) {
    setFilters((f) => ({ ...f, ...p, page: p.page ?? 1 }));
  }

  async function changeStatus(b: Booking, to: BookingStatus) {
    setActionError(null);
    try {
      await updateBookingStatus(b.id, to);
      await load(filters);
      if (history?.booking.id === b.id) {
        setHistory({ booking: { ...b, status: to }, events: await fetchBookingEvents(b.id) });
      }
    } catch (e) {
      setActionError(
        e instanceof Error && e.message.includes("AUTH_REQUIRED")
          ? "The server rejected that transition — it needs an admin role."
          : "The status change failed. Please try again."
      );
    }
  }

  const pages = Math.max(1, Math.ceil(count / filters.pageSize));

  return (
    <div>
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Pending enquiries", value: stats?.pendingAll },
          { label: "Confirmed (upcoming)", value: stats?.confirmedThisWeek },
          { label: "Upcoming guests (confirmed)", value: stats?.totalGuestsUpcoming },
          { label: "Total booking records", value: stats?.totalBookings },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-slate-line bg-night-2/70 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-cream/50">{s.label}</p>
            <p className="mt-3 font-display text-4xl text-gold">
              {loading || stats === null ? "—" : s.value ?? 0}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="mt-8 grid gap-4 sm:grid-cols-[1fr_220px_200px]">
        <Input
          label="Search"
          type="search"
          placeholder="Reference, name, phone or email…"
          value={filters.search}
          onChange={(e) => patch({ search: e.target.value })}
        />
        <Select
          label="Status"
          value={filters.status}
          onChange={(e) => patch({ status: e.target.value as BookingStatus | "all" })}
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="seated">Seated</option>
          <option value="cancelled">Cancelled</option>
          <option value="no_show">No-show</option>
        </Select>
        <Input
          label="Booking date"
          type="date"
          value={filters.date ?? ""}
          onChange={(e) => patch({ date: e.target.value || null })}
        />
      </div>

      {error === "NOT_CONFIGURED" ? null : error ? (
        <p role="alert" className="mt-6 rounded-xl border border-red-400/50 bg-red-500/10 px-5 py-4 text-sm text-red-200">
          {error}
        </p>
      ) : null}
      {actionError && (
        <p role="alert" className="mt-6 rounded-xl border border-red-400/50 bg-red-500/10 px-5 py-4 text-sm text-red-200">
          {actionError}
        </p>
      )}

      {/* Table */}
      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-line">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="bg-night-2/80 text-[0.7rem] uppercase tracking-[0.16em] text-cream/50">
            <tr>
              <th className="px-4 py-3">Reference</th>
              <th className="px-4 py-3">When</th>
              <th className="px-4 py-3">Guest</th>
              <th className="px-4 py-3">Party</th>
              <th className="px-4 py-3">Occasion / preference</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-line">
            {loading && (
              <tr>
                <td colSpan={7}>
                  <Spinner label="Fetching bookings" />
                </td>
              </tr>
            )}
            {!loading && rows?.length === 0 && (
              <tr>
                <td colSpan={7} className="p-6">
                  <EmptyState title="No bookings match these filters" />
                </td>
              </tr>
            )}
            {!loading &&
              (rows ?? []).map((b) => (
                <tr key={b.id} className="align-top hover:bg-night-2/40">
                  <td className="px-4 py-4">
                    <button
                      className="font-mono text-xs text-gold hover:underline"
                      onClick={async () => {
                        setHistory({ booking: b, events: await fetchBookingEvents(b.id) });
                      }}
                    >
                      {b.booking_reference}
                    </button>
                    <p className="mt-1 text-xs text-cream/40">
                      Created {new Date(b.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                    </p>
                  </td>
                  <td className="px-4 py-4 text-cream/75">
                    {new Date(`${b.booking_date}T00:00:00`).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                    <p className="text-xs text-cream/45">{b.booking_time.slice(0, 5)}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-cream/85">{b.customer_name}</p>
                    <p className="text-xs text-cream/50">{b.customer_phone}</p>
                    {b.customer_email && <p className="text-xs text-cream/40">{b.customer_email}</p>}
                  </td>
                  <td className="px-4 py-4 text-cream/75">{b.guest_count} guests</td>
                  <td className="px-4 py-4 text-cream/70">
                    {b.occasion.replace(/_/g, " ")}
                    <p className="text-xs text-cream/45">{b.dining_preference}</p>
                    {b.special_requests && (
                      <p className="mt-1 max-w-xs text-xs italic text-cream/40">“{b.special_requests}”</p>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-block rounded-full border px-3 py-1 text-xs ${
                        STATUS_TONE[b.status] === "green"
                          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300"
                          : STATUS_TONE[b.status] === "red"
                            ? "border-red-500/40 bg-red-500/10 text-red-300"
                            : STATUS_TONE[b.status] === "gold"
                              ? "border-gold/40 bg-gold/10 text-gold-bright"
                              : "border-cream/20 bg-cream/5 text-cream/70"
                      }`}
                    >
                      {b.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      {(NEXT_ACTIONS[b.status] ?? [])
                        .filter((a) => !a.adminOnly || profile?.role === "admin")
                        .map((a) => (
                          <Button
                            key={a.to}
                            size="sm"
                            variant={a.to === "confirmed" || a.to === "seated" ? "gold" : "outline"}
                            onClick={() => void changeStatus(b, a.to)}
                          >
                            {a.label}
                          </Button>
                        ))}
                      {(NEXT_ACTIONS[b.status] ?? []).length === 0 && (
                        <span className="text-xs text-cream/40">Final state</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between text-sm text-cream/60">
        <p>
          {count} record{count === 1 ? "" : "s"} · page {filters.page} of {pages}
        </p>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            disabled={filters.page <= 1}
            onClick={() => patch({ page: filters.page - 1 })}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={filters.page >= pages}
            onClick={() => patch({ page: filters.page + 1 })}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Event history modal */}
      <Modal
        open={history !== null}
        onClose={() => setHistory(null)}
        title={`History · ${history?.booking.booking_reference ?? ""}`}
      >
        {history && (
          <>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-wider text-cream/45">Guest</dt>
                <dd className="text-cream/85">{history.booking.customer_name}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-cream/45">Phone</dt>
                <dd className="text-cream/85">{history.booking.customer_phone}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-cream/45">When</dt>
                <dd className="text-cream/85">
                  {history.booking.booking_date} · {history.booking.booking_time.slice(0, 5)}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-cream/45">Status</dt>
                <dd className="text-cream/85">{history.booking.status}</dd>
              </div>
            </dl>
            <div className="mt-6">
              <h3 className="text-xs uppercase tracking-[0.2em] text-cream/50">Event trail</h3>
              <ol className="mt-3 space-y-3">
                {history.events.map((ev) => (
                  <li key={ev.id} className="border-l-2 border-gold/40 pl-4 text-sm">
                    <p className="text-cream/80">{ev.event_type}</p>
                    <p className="text-xs text-cream/40">
                      {new Date(ev.created_at).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {(NEXT_ACTIONS[history.booking.status] ?? []).map((a) => (
                <Button
                  key={a.to}
                  size="sm"
                  variant="outline"
                  onClick={() => void changeStatus(history.booking, a.to)}
                >
                  {a.label}
                  {a.adminOnly ? " (admin)" : ""}
                </Button>
              ))}
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
