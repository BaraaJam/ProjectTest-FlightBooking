import { useState } from "react";
import { cancelFlight, getBookingsByEmail } from "../api/flights";
import type { Booking } from "../api/types";

export default function BookingsPage() {
    const [email, setEmail] = useState("");
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");
        try {
            const data = await getBookingsByEmail(email.trim());
            setBookings(data);
            setHasSearched(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
            console.error(err);
        }
    };

    const handleCancel = async (booking: Booking) => {
        setError("");
        setMessage("");
        try {
            // the backend matches the email stored on the booking row
            await cancelFlight(booking.id, booking.passengerEmail);
            setBookings((prev) => prev.filter((item) => item.id !== booking.id));
            setMessage(`Cancelled ${booking.flightNumber}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
            console.error(err);
        }
    };

    return (
        <div>
            <h1>My bookings</h1>

            <form onSubmit={handleSearch} className="mb-6 flex gap-3">
                <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 rounded-lg border border-slate-300 px-4 py-2"
                />
                <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700"
                >
                    Search
                </button>
            </form>

            {error && (
                <p className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">{error}</p>
            )}
            {message && (
                <p className="mb-4 rounded-lg bg-green-50 p-4 text-green-700">{message}</p>
            )}

            {hasSearched && bookings.length === 0 && (
                <p className="rounded-lg bg-gray-50 p-4 text-slate-600">
                    No bookings found for {email}.
                </p>
            )}

            <ul className="space-y-3">
                {bookings.map((booking) => (
                    <li
                        key={booking.id}
                        className="flex items-center gap-4 rounded-lg border border-slate-200 p-4"
                    >
                        <div className="flex-1">
                            <p className="font-bold">
                                {booking.flightNumber} to {booking.destination}
                            </p>
                            <p className="text-sm text-slate-600">
                                {new Date(booking.departureTime).toLocaleString()} ·{" "}
                                {booking.passengerName}
                            </p>
                        </div>
                        <button
                            onClick={() => handleCancel(booking)}
                            className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600"
                        >
                            Cancel
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
