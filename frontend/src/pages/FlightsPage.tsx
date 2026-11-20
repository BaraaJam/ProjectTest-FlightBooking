import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
    CheckCircle2,
    ChevronUp,
    Clock,
    Lock,
    MapPin,
    Plane,
    PlaneTakeoff,
    Tag,
    Ticket,
} from "lucide-react";
import { getAllFlights, getAvailableFlights } from "../api/flights";
import BookingForm from "../components/BookingForm";
import Toast from "../components/Toast";
import { formatDateTime, formatPrice, formatTime } from "../lib/format";
import { readCache, writeCache } from "../lib/cache";
import type { AvailableFlight, Flight } from "../api/types";

export default function FlightsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const filterAvailable = searchParams.get("available") === "true";
    const cacheKey = filterAvailable ? "flights:available" : "flights:all";
    const cached = readCache<Flight[] | AvailableFlight[]>(cacheKey);

    const [flights, setFlights] = useState<(Flight | AvailableFlight)[]>(cached ?? []);
    const [isInitialLoading, setIsInitialLoading] = useState(cached === undefined);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [apiError, setApiError] = useState<string>("");
    const [selectedFlight, setSelectedFlight] = useState<Flight | AvailableFlight | null>(null);
    const [reloadKey, setReloadKey] = useState(0);
    const [successMessage, setSuccessMessage] = useState("");
    const hasLoaded = useRef(cached !== undefined);

    useEffect(() => {
        const load = async () => {
            // Only dim the list if the request is actually slow.
            // A fast refetch must not blink the content.
            let slowTimer: number | undefined;

            if (hasLoaded.current) {
                slowTimer = window.setTimeout(() => setIsRefreshing(true), 150);
            } else {
                setIsInitialLoading(true);
            }

            try {
                if (filterAvailable) {
                    const data = await getAvailableFlights();
                    setFlights(data);
                    writeCache(cacheKey, data);
                } else {
                    const data = await getAllFlights();
                    setFlights(data);
                    writeCache(cacheKey, data);
                }
                setApiError("");
            } catch (err) {
                setApiError(err instanceof Error ? err.message : "Something went wrong");
                console.error(err);
            } finally {
                if (slowTimer) window.clearTimeout(slowTimer);
                hasLoaded.current = true;
                setIsInitialLoading(false);
                setIsRefreshing(false);
            }
        };
        void load();
    }, [cacheKey, filterAvailable, reloadKey]);

    // keep the URL in sync so the filter survives a refresh and a shared link
    const handleFilterChange = (checked: boolean) => {
        setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            if (checked) {
                next.set("available", "true");
            } else {
                next.delete("available");
            }
            return next;
        }, { replace: true });
    };

    if (isInitialLoading) {
        return (
            <div className="space-y-6">
                <div>
                    <div className="h-5 w-40 animate-pulse rounded-md bg-white/70" />
                    <div className="mt-3 h-8 w-32 animate-pulse rounded-md bg-white/70" />
                    <div className="mt-2 h-4 w-24 animate-pulse rounded-md bg-white/60" />
                </div>

                <div className="overflow-hidden rounded-md border border-white/60 bg-white/60 backdrop-blur">
                    {[0, 1, 2, 3, 4].map((row) => (
                        <div
                            key={row}
                            className="flex items-center gap-4 border-b border-white/40 px-5 py-4 last:border-0"
                        >
                            <div className="h-4 w-16 animate-pulse rounded-md bg-slate-200/70" />
                            <div className="h-4 flex-1 animate-pulse rounded-md bg-slate-200/60" />
                            <div className="h-8 w-28 animate-pulse rounded-md bg-slate-200/70" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (apiError && flights.length === 0) {
        return (
            <p className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {apiError}
            </p>
        );
    }

    return (
        <div className="space-y-6">
            <header className="flex flex-wrap items-end justify-between gap-5">
                <div>
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-white/60 bg-white/55 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600 backdrop-blur">
                        <PlaneTakeoff size={12} aria-hidden />
                        Flight reservation
                    </span>
                    <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                        Flights
                    </h1>
                    <p className="mt-1.5 flex items-center gap-1.5 text-sm text-slate-600">
                        <Plane size={13} className="text-slate-400" aria-hidden />
                        <span>
                            <span className="tabular-nums">{flights.length}</span>{" "}
                            {flights.length === 1 ? "flight" : "flights"}
                        </span>
                        {isRefreshing && (
                            <span className="text-xs text-slate-400">Updating...</span>
                        )}
                    </p>
                </div>

                <label className="inline-flex cursor-pointer select-none items-center gap-2 rounded-md border border-white/60 bg-white/70 px-4 py-2 text-[13px] font-medium text-slate-700 backdrop-blur">
                    <input
                        type="checkbox"
                        checked={filterAvailable}
                        onChange={(e) => handleFilterChange(e.target.checked)}
                        className="h-4 w-4 cursor-pointer accent-slate-900"
                    />
                    Available only
                </label>
            </header>

            {apiError && (
                <p className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {apiError}
                </p>
            )}

            {successMessage && (
                <Toast
                    key={successMessage}
                    message={successMessage}
                    onClose={() => setSuccessMessage("")}
                />
            )}

            {flights.length === 0 ? (
                <p className="rounded-md border border-white/60 bg-white/80 px-4 py-6 text-center text-sm text-slate-600 backdrop-blur">
                    No flights available.
                </p>
            ) : (
                <div
                    className={`overflow-hidden rounded-md border border-white/60 bg-linear-to-b from-white/70 to-white/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_10px_30px_-15px_rgba(15,23,42,0.3)] backdrop-blur-2xl backdrop-saturate-150 transition-opacity duration-200 ${
                        isRefreshing ? "opacity-60" : "opacity-100"
                    }`}
                >
                    <div className="hidden gap-4 border-b border-white/50 bg-white/30 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.14em] text-slate-500 md:grid md:grid-cols-[240px_1fr_120px_130px]">
                        <span className="text-center">Flight</span>
                        <span className="text-center">Destination</span>
                        <span className="text-center">Price</span>
                        <span className="text-center">Action</span>
                    </div>

                    <ul
                        key={filterAvailable ? "available" : "all"}
                        className="animate-fade-in divide-y divide-slate-200/60"
                    >
                        {flights.map((flight) => {
                            const status = "status" in flight ? flight.status : "AVAILABLE";
                            const canBook = status === "AVAILABLE";
                            const isOpen = selectedFlight?.id === flight.id;

                            return (
                                <li
                                    key={flight.id}
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
                                                {flight.flightNumber}
                                            </span>
                                            <span
                                                className={`inline-flex w-28 items-center justify-center gap-1 rounded-md py-1 text-[10px] font-semibold uppercase tracking-wide ${
                                                    canBook
                                                        ? "bg-emerald-50 text-emerald-700"
                                                        : "bg-slate-100 text-slate-500"
                                                }`}
                                            >
                                                {canBook ? (
                                                    <CheckCircle2 size={11} aria-hidden />
                                                ) : (
                                                    <Lock size={10} aria-hidden />
                                                )}
                                                {canBook ? "Available" : "Booked"}
                                            </span>
                                        </div>

                                        <div className="flex flex-col items-start text-left md:items-center md:text-center">
                                            <p className="flex items-center gap-1.5 text-base font-semibold tracking-tight text-slate-900">
                                                <MapPin
                                                    size={14}
                                                    className="text-slate-400"
                                                    aria-hidden
                                                />
                                                {flight.destination}
                                            </p>
                                            <p className="mt-1 flex items-center gap-1.5 text-sm tabular-nums text-slate-600">
                                                <Clock
                                                    size={13}
                                                    className="text-slate-400"
                                                    aria-hidden
                                                />
                                                {formatDateTime(flight.departureTime)}
                                                <span className="text-slate-400">→</span>
                                                {formatTime(flight.arrivalTime)}
                                            </p>
                                        </div>

                                        <p className="flex items-center gap-1.5 text-sm font-semibold tabular-nums text-slate-900 md:justify-center">
                                            <Tag size={13} className="text-slate-400" aria-hidden />
                                            {formatPrice(flight.price)}
                                        </p>

                                        <div className="md:text-center">
                                            <button
                                                disabled={!canBook}
                                                onClick={() => {
                                                    setSuccessMessage("");
                                                    setSelectedFlight((current) =>
                                                        current?.id === flight.id ? null : flight
                                                    );
                                                }}
                                                className="inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-slate-900 px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 md:w-28"
                                            >
                                                {isOpen ? (
                                                    <>
                                                        <ChevronUp size={14} aria-hidden />
                                                        Close
                                                    </>
                                                ) : canBook ? (
                                                    <>
                                                        <Ticket size={14} aria-hidden />
                                                        Book
                                                    </>
                                                ) : (
                                                    <>
                                                        <Lock size={12} aria-hidden />
                                                        Booked
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/*
                                        The form stays mounted so the collapse can animate.
                                        `inert` keeps the hidden fields out of the tab order.
                                    */}
                                    <div
                                        className={`grid transition-all duration-300 ease-out ${
                                            isOpen
                                                ? "grid-rows-[1fr] opacity-100"
                                                : "grid-rows-[0fr] opacity-0"
                                        }`}
                                    >
                                        <div className="overflow-hidden">
                                            <div className="px-5 pb-5" inert={!isOpen} aria-hidden={!isOpen}>
                                                <BookingForm
                                                    flight={flight}
                                                    onSuccess={(booking) => {
                                                        setSelectedFlight(null);
                                                        setSuccessMessage(
                                                            `Booked ${booking.flightNumber} to ${booking.destination}`
                                                        );
                                                        setReloadKey((key) => key + 1);
                                                    }}
                                                    onCancel={() => setSelectedFlight(null)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
}
