import { useState } from "react";
import {
    CheckCircle2,
    Clock,
    Loader2,
    Mail,
    MapPin,
    Plane,
    Tag,
    Ticket,
    User,
    XCircle,
} from "lucide-react";
import { cancelFlight, getBookingsByEmail } from "../api/flights";
import { formatDateTime, formatPrice, formatTime } from "../lib/format";
import Toast, { type ToastVariant } from "../components/Toast";
import type { Booking } from "../api/types";

export default function BookingsPage() {
    const [email, setEmail] = useState("");
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [toast, setToast] = useState<{ text: string; variant: ToastVariant } | null>(null);
    const [cancellingId, setCancellingId] = useState<number | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setToast(null);
        setHasSearched(false);
        try {
            const data = await getBookingsByEmail(email.trim());
            setBookings(data);
            setHasSearched(true);
        } catch (err) {
            setBookings([]);
            setToast({
                text: err instanceof Error ? err.message : "Something went wrong",
                variant: "error",
            });
            console.error(err);
        }
    };

    const handleCancel = async (booking: Booking) => {
        setToast(null);
        setCancellingId(booking.id);
        try {
            // the backend matches the email stored on the booking row
            await cancelFlight(booking.id, booking.passengerEmail);
            setBookings((prev) => prev.filter((item) => item.id !== booking.id));
            setToast({ text: `Cancelled ${booking.flightNumber}`, variant: "success" });
        } catch (err) {
            setToast({
                text: err instanceof Error ? err.message : "Something went wrong",
                variant: "error",
            });
            console.error(err);
        } finally {
            setCancellingId(null);
        }
    };

    return (
        <div className="space-y-6">
            <header>
                <span className="inline-flex items-center gap-1.5 rounded-md border border-white/60 bg-white/55 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600 backdrop-blur">
                    <Ticket size={12} aria-hidden />
                    Flight reservation
                </span>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                    My bookings
                </h1>
                <p className="mt-1.5 flex items-center gap-1.5 text-sm text-slate-600">
                    <Mail size={13} className="text-slate-400" aria-hidden />
                    Enter the email you used when booking.
                </p>
            </header>

            <form
                onSubmit={handleSearch}
                className="flex flex-wrap gap-2 rounded-md border border-white/60 bg-linear-to-b from-white/70 to-white/45 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_10px_30px_-15px_rgba(15,23,42,0.3)] backdrop-blur-2xl backdrop-saturate-150"
            >
                <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="min-w-56 flex-1 rounded-md border border-white/70 bg-white/70 px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-900/10"
                />
                <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-1.5 rounded-md bg-slate-900 px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-slate-800"
                >
                    Search
                </button>
            </form>

            {toast && (
                <Toast
                    key={`${toast.variant}-${toast.text}`}
                    message={toast.text}
                    variant={toast.variant}
                    onClose={() => setToast(null)}
                />
            )}

            {hasSearched && bookings.length === 0 && (
                <p className="rounded-md border border-white/60 bg-white/55 px-4 py-6 text-center text-sm text-slate-600 backdrop-blur-2xl">
                    No bookings found for {email}.
                </p>
            )}

            {bookings.length > 0 && (
                <div className="overflow-hidden rounded-md border border-white/60 bg-linear-to-b from-white/70 to-white/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_10px_30px_-15px_rgba(15,23,42,0.3)] backdrop-blur-2xl backdrop-saturate-150">
                    <div className="hidden gap-4 border-b border-white/50 bg-white/30 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.14em] text-slate-500 md:grid md:grid-cols-[240px_1fr_120px_130px]">
                        <span className="text-center">Flight</span>
                        <span className="text-center">Destination</span>
                        <span className="text-center">Price</span>
                        <span className="text-center">Action</span>
                    </div>

                    <ul className="divide-y divide-slate-200/60">
                        {bookings.map((booking) => (
                            <li
                                key={booking.id}
                                className="transition-colors hover:bg-white/40"
                            >
                                <div className="grid gap-3 px-5 py-4 md:grid-cols-[240px_1fr_120px_130px] md:items-center md:gap-4">
                                    <div className="flex items-center gap-2 md:justify-center">
                                        <Plane
                                            size={14}
                                            className="shrink-0 text-slate-400"
                                            aria-hidden
                                        />
                                        <span className="text-sm font-semibold tracking-tight text-slate-900">
                                            {booking.flightNumber}
                                        </span>
                                        <span className="inline-flex w-28 items-center justify-center gap-1 rounded-md bg-emerald-50 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                                            <CheckCircle2 size={11} aria-hidden />
                                            Booked
                                        </span>
                                    </div>

                                    <div className="flex flex-col items-start text-left md:items-center md:text-center">
                                        <p className="flex items-center gap-1.5 text-base font-semibold tracking-tight text-slate-900">
                                            <MapPin
                                                size={14}
                                                className="text-slate-400"
                                                aria-hidden
                                            />
                                            {booking.destination}
                                        </p>
                                        <p className="mt-1 flex items-center gap-1.5 text-sm tabular-nums text-slate-600">
                                            <Clock
                                                size={13}
                                                className="text-slate-400"
                                                aria-hidden
                                            />
                                            {formatDateTime(booking.departureTime)}
                                            <span className="text-slate-400">→</span>
                                            {formatTime(booking.arrivalTime)}
                                        </p>
                                        <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                                            <User
                                                size={12}
                                                className="text-slate-400"
                                                aria-hidden
                                            />
                                            {booking.passengerName}
                                        </p>
                                    </div>

                                    <p className="flex items-center gap-1.5 text-sm font-semibold tabular-nums text-slate-900 md:justify-center">
                                        <Tag size={13} className="text-slate-400" aria-hidden />
                                        {formatPrice(booking.price)}
                                    </p>

                                    <div className="md:text-center">
                                        <button
                                            onClick={() => handleCancel(booking)}
                                            disabled={cancellingId === booking.id}
                                            className="inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-rose-200 bg-white/70 px-4 py-2 text-[13px] font-semibold text-rose-700 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60 md:w-28"
                                        >
                                            {cancellingId === booking.id ? (
                                                <>
                                                    <Loader2
                                                        size={14}
                                                        className="animate-spin"
                                                        aria-hidden
                                                    />
                                                    Cancel
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle size={14} aria-hidden />
                                                    Cancel
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
