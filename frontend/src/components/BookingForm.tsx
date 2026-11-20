import { useId, useState } from "react";
import { Mail, User } from "lucide-react";
import { bookFlight } from "../api/flights";
import type { AvailableFlight, Booking, Flight } from "../api/types";

type BookingFormProps = {
    flight: Flight | AvailableFlight;
    onSuccess: (booking: Booking) => void;
    onCancel: () => void;
};

export default function BookingForm({ flight, onSuccess, onCancel }: BookingFormProps) {
    const [form, setForm] = useState({ name: "", email: "" });
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const nameId = useId();
    const emailId = useId();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // stops the browser from reloading the page
        setIsSubmitting(true);
        setError("");
        try {
            const booking = await bookFlight(flight.id, {
                passengerName: form.name,
                passengerEmail: form.email,
            });
            onSuccess(booking);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="rounded-md border border-slate-200 bg-white p-5"
        >
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                Booking
            </p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight text-slate-900">
                {flight.flightNumber} to {flight.destination}
            </h2>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                    <label
                        htmlFor={nameId}
                        className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.14em] text-slate-500"
                    >
                        <User size={12} aria-hidden />
                        Full name
                    </label>
                    <input
                        id={nameId}
                        type="text"
                        required
                        minLength={2}
                        maxLength={100}
                        value={form.name}
                        onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10"
                    />
                </div>
                <div>
                    <label
                        htmlFor={emailId}
                        className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.14em] text-slate-500"
                    >
                        <Mail size={12} aria-hidden />
                        Email
                    </label>
                    <input
                        id={emailId}
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-900/10"
                    />
                </div>
            </div>

            {error && (
                <p className="mt-4 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
                    {error}
                </p>
            )}

            <div className="mt-5 flex flex-wrap gap-2">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex w-40 items-center justify-center rounded-md bg-slate-900 px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                    {isSubmitting ? "Booking..." : "Confirm booking"}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="inline-flex w-40 items-center justify-center rounded-md border border-slate-200 bg-white px-4 py-2 text-[13px] font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
