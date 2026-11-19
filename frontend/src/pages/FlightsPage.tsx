import {useEffect, useState} from "react";
import {getAllFlights, getAvailableFlights} from "../api/flights";
import type {AvailableFlight, Flight} from "../api/types";

export default function FlightsPage() {
    // three states → flights (Flight[], starts []), loading (starts true), error (string, starts "")
    const [flights, setFlights] = useState<(Flight | AvailableFlight)[]>([])
    const [isLoading, setIsLoading] = useState(true);
    const [apiError, setApiError] = useState<string>("");
    const [filterAvailable, setFilterAvailable] = useState(false);

    useEffect(() => {
        const load = async () => {
            setIsLoading(true);
            // call getAllFlights() or getAvailableFlights() and save the result in state
            try {
                if(filterAvailable){
                    const data = await getAvailableFlights();
                    setFlights(data);
                } else {
                    const data = await getAllFlights();
                    setFlights(data);
                }
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
    }, [filterAvailable]);

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
        <div>
            <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                    type="checkbox"
                    checked={filterAvailable}
                    onChange={(e) => setFilterAvailable(e.target.checked)}
                    className="h-4.5 w-4.5 rounded-md border border-slate-200 dark:border-slate-700 accent-blue-600 cursor-pointer"
                />
                <span className="flex-1 text-sm text-slate-700 dark:text-slate-300">Available Only</span>
            </label>
            <ul className="list-disc">
                {flights.map((flight) => (
                    <li className="flex gap-4"
                        key={flight.id}>
                        <span>Flight Number: {flight.flightNumber}</span>
                        <span>Destination: {flight.destination}</span>
                        <span>{"status" in flight && <span>Status: {flight.status}</span>}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
