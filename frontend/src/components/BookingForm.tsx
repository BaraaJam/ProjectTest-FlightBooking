import { useState } from "react";
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // stops the browser from reloading the page
        setIsSubmitting(true);
        setError("");
        try {
            const booking = await bookFlight(flight.id, {passengerName: form.name, passengerEmail: form.email});
            onSuccess(booking);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong")
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Book {flight.flightNumber}</h2>
            <div>
                <label>Full Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}/>
            </div>
            <div>
                <label>Email Address</label>
                <input type="email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}/>
            </div>
            {error && <p>{error}</p>}
            <button type="submit" disabled={isSubmitting}>Book</button>
            <button type="button" onClick={onCancel}>Cancel</button>
        </form>
    );
}
