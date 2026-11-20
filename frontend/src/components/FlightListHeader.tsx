export default function FlightListHeader() {
    return (
        <div className="hidden gap-4 border-b border-white/50 bg-white/30 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.14em] text-slate-500 md:grid md:grid-cols-[240px_1fr_120px_130px]">
            <span className="text-center">Flight</span>
            <span className="text-center">Destination</span>
            <span className="text-center">Price</span>
            <span className="text-center">Action</span>
        </div>
    );
}
