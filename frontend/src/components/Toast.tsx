import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

export type ToastVariant = "success" | "error";

type ToastProps = {
    message: string;
    variant?: ToastVariant;
    onClose: () => void;
};

export default function Toast({ message, variant = "success", onClose }: ToastProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const isLeaving = useRef(false);
    const onCloseRef = useRef(onClose);

    useEffect(() => {
        onCloseRef.current = onClose;
    });

    // flip after the first paint so the slide-up transition runs
    useEffect(() => {
        const frame = requestAnimationFrame(() => setIsVisible(true));
        return () => cancelAnimationFrame(frame);
    }, []);

    useEffect(() => {
        if (!isVisible || isPaused) return;

        const duration = variant === "error" ? 6000 : 3500;
        const timer = window.setTimeout(() => {
            if (isLeaving.current) return;
            isLeaving.current = true;
            setIsVisible(false);
            window.setTimeout(() => onCloseRef.current(), 200);
        }, duration);

        return () => window.clearTimeout(timer);
    }, [isPaused, isVisible, variant]);

    return createPortal(
        <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
            <div
                role="status"
                aria-live="polite"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                className={`pointer-events-auto flex items-center gap-3 rounded-md border px-4 py-3 text-sm shadow-lg backdrop-blur-md transition-all duration-200 ease-out ${
                    isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                } ${
                    variant === "success"
                        ? "border-emerald-200 bg-emerald-50/95 text-emerald-800"
                        : "border-rose-200 bg-rose-50/95 text-rose-800"
                }`}
            >
                {variant === "success" ? (
                    <CheckCircle2 size={16} aria-hidden />
                ) : (
                    <AlertCircle size={16} aria-hidden />
                )}

                <span className="font-medium">{message}</span>

                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Dismiss"
                    className="ml-1 opacity-60 transition-opacity hover:opacity-100"
                >
                    <X size={14} aria-hidden />
                </button>
            </div>
        </div>,
        document.body
    );
}
