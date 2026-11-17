import { request } from "./client";
import type { AvailableFlight, Booking, BookingRequest, Flight } from "./types";

// 1. GET /api/flights → all flights
export function getAllFlights() {
    return request<Flight[]>("/api/flights");
}

// 2. GET /api/flights/available → only AVAILABLE flights (no status field)
export function getAvailableFlights() {
    return request<AvailableFlight[]>("/api/flights/available");
}

// 3. POST /api/flights/{flightId}/book
//    path: flightId, body: BookingRequest → returns ONE Booking
export function bookFlight(flightId: number, data: BookingRequest) {
    return request<Booking>(`/api/flights/${flightId}/book`, {
        method: "POST",
        body: JSON.stringify(data),
    });
}

// 4. GET /api/flights/bookings?email=
//    query: email → returns a LIST of Booking (empty [] if none)
export function getBookingsByEmail(email: string) {
    return request<Booking[]>(`/api/flights/bookings?email=${encodeURIComponent(email)}`);
}

// 5. DELETE /api/flights/{flightId}/cancel?email=
//    path: flightId, query: email → 204, no body
export function cancelFlight(flightId: number, email: string) {
    return request<void>(`/api/flights/${flightId}/cancel?email=${encodeURIComponent(email)}`, {
        method: "DELETE",
    });
}


