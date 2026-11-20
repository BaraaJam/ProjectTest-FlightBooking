import { useState } from "react";
import { Loader2, Mail, Ticket, XCircle } from "lucide-react";
import { cancelFlight, getBookingsByEmail } from "../api/flights";
import FlightListHeader from "../components/FlightListHeader";
import FlightRow from "../components/FlightRow";
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
                className="flex flex-wrap gap-2 rounded-md border border-white/60 bg-linear-to-b from-white/40 to-white/45 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_10px_30px_-15px_rgba(15,23,42,0.3)] backdrop-blur-2xl backdrop-saturate-150"
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
                <div className="overflow-hidden rounded-md border border-white/60 bg-linear-to-b from-white/40 to-white/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_10px_30px_-15px_rgba(15,23,42,0.3)] backdrop-blur-2xl backdrop-saturate-150">
                    <FlightListHeader />

                    <ul className="divide-y divide-slate-200/60">
                        {bookings.map((booking) => (
                            <FlightRow
                                key={booking.id}
                                flightNumber={booking.flightNumber}
                                destination={booking.destination}
                                departureTime={booking.departureTime}
                                arrivalTime={booking.arrivalTime}
                                price={booking.price}
                                status={booking.status}
                                passengerName={booking.passengerName}
                                action={
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
                                }
                            />
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
