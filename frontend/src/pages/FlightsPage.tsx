import {useEffect, useState} from "react";
import {getAllFlights} from "../api/flights";
import type {Flight} from "../api/types";

export default function FlightsPage() {
    // three states → flights (Flight[], starts []), loading (starts true), error (string, starts "")
    const [flights, setFlights] = useState<Flight[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [apiError, setApiError] = useState<string>("");

    useEffect(() => {
        const load = async () => {
            try {
                // call getAllFlights() and save the result in state
                const data = await getAllFlights();
                setFlights(data);
                setApiError("")
            } catch (err) {
                // save the error message (hint: err instanceof Error ? err.message : "...")
                setApiError(err instanceof Error ? err.message : "Something went wrong");
                console.error(err);
            } finally {
                // loading is done (runs on success AND on error)
                setIsLoading(false);
            }
        };
        void load();
    }, []);

    // if loading → return <p>Loading...</p>
    if (isLoading) {
        return <p className="mb-6 rounded-lg bg-gray-50 p-4 text-blue-700">
            Loading...
        </p>
    }

    // if error   → return <p>{error}</p>
    if (apiError) {
        return <p className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
            {apiError}
        </p>
    }

    return (
        <ul className="list-disc">
            {flights.map((flight) => (
                <li className="flex gap-4"
                    key={flight.id}>
                    <span>Flight Number: {flight.flightNumber}</span>
                    <span>Destination: {flight.destination}</span>
                    <span>Status: {flight.status}</span>
                </li>
            ))}
        </ul>
    );
}
