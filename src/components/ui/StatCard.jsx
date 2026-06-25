export default function StatCard({ title, value, icon }) {
    return (
        <div className="bg-zinc-800 p-5 border border-zinc-700">
            
            <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{icon}</span>
                <span className="text-zinc-400 text-xs uppercase tracking-wider font-medium">
                    {title}
                </span>
            </div>

            <p className="text-2xl font-bold text-zinc-300">{value}</p>

        </div>
    )
}