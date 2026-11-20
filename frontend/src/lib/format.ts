const priceFormatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "EUR",
    currencyDisplay: "narrowSymbol",
});

export function formatDateTime(value: string) {
    return new Date(value).toLocaleString(undefined, {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function formatTime(value: string) {
    return new Date(value).toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function formatPrice(value: number) {
    return priceFormatter.format(value);
}
