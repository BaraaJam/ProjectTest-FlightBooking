import type { ReactNode } from "react";
import { CheckCircle2, Clock, Lock, MapPin, Plane, Tag, User } from "lucide-react";
import { formatDateTime, formatPrice, formatTime } from "../lib/format";
import type { FlightStatus } from "../api/types";

type FlightRowProps = {
    flightNumber: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    price: number;
    status: FlightStatus;
    passengerName?: string;
    action: ReactNode;
    footer?: ReactNode;
};

export default function FlightRow({
    flightNumber,
    destination,
    departureTime,
    arrivalTime,
    price,
    status,
    passengerName,
    action,
    footer,
}: FlightRowProps) {
    const isAvailable = status === "AVAILABLE";

    return (
        <li className="transition-colors hover:bg-white/55">
            <div className="grid gap-3 px-5 py-4 md:grid-cols-[240px_1fr_120px_130px] md:items-center md:gap-4">
                <div className="flex items-center gap-2 md:justify-center">
                    <Plane size={14} className="shrink-0 text-slate-400" aria-hidden />
                    <span className="text-sm font-semibold tracking-tight text-slate-900">
                        {flightNumber}
                    </span>
                    <span
                        className={`inline-flex w-28 items-center justify-center gap-1 rounded-md py-1 text-[10px] font-semibold uppercase tracking-wide ${
                            isAvailable
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-slate-200 text-slate-500"
                        }`}
                    >
                        {isAvailable ? (
                            <CheckCircle2 size={11} aria-hidden />
                        ) : (
                            <Lock size={10} aria-hidden />
                        )}
                        {isAvailable ? "Available" : "Booked"}
                    </span>
                </div>

                <div className="flex flex-col items-start text-left md:items-center md:text-center">
                    <p className="flex items-center gap-1.5 text-base font-semibold tracking-tight text-slate-900">
                        <MapPin size={14} className="text-slate-400" aria-hidden />
                        {destination}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm tabular-nums text-slate-600">
                        <Clock size={13} className="text-slate-400" aria-hidden />
                        {formatDateTime(departureTime)}
                        <span className="text-slate-400">→</span>
                        {formatTime(arrivalTime)}
                    </p>
                    {passengerName && (
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                            <User size={12} className="text-slate-400" aria-hidden />
                            {passengerName}
                        </p>
                    )}
                </div>

                <p className="flex items-center gap-1.5 text-sm font-semibold tabular-nums text-slate-900 md:justify-center">
                    <Tag size={13} className="text-slate-400" aria-hidden />
                    {formatPrice(price)}
                </p>

                <div className="md:text-center">{action}</div>
            </div>

            {footer}
        </li>
    );
}
