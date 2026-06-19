export default function StatCard({ title, value, icon }) {
    return (
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
            
            <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{icon}</span>
                <span className="text-slate-400 text-xs uppercase tracking-wider font-medium">
                    {title}
                </span>
            </div>

            <p className="text-2xl font-bold text-white">{value}</p>

        </div>
    )
}