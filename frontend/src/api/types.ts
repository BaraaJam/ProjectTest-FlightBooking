export type FlightStatus = "AVAILABLE" | "BOOKED";

export type Flight = {
    id: number;
    flightNumber: string;
    departureTime: string;
    arrivalTime: string;
    status: FlightStatus;
    destination: string;
    price: number;
}

export type AvailableFlight = Omit<Flight, "status">;


export type Booking = {
    id: number;
    flightNumber: string;
    passengerName: string;
    passengerEmail: string;
    departureTime: string;
    arrivalTime: string;
    status: FlightStatus;
    destination: string;
    price: number;
}

export type BookingRequest = {
    passengerName: string;
    passengerEmail: string;
}

export type ProblemDetail = {
    type?: string;
    title?: string;
    status?: number;
    detail?: string;
    instance?: string;
    timestamp?: string;
};
