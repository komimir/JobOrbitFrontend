'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import Search from "./components/Search";
import CountryDropdown from "./components/CountryDropdown";

export default function Home() {
    const router = useRouter();
    const [searchValue, setSearchValue] = useState('');

    const handleSearch = (value: string) => {
        setSearchValue(value);
        router.push(`/jobs?q=${encodeURIComponent(value.trim())}`);
    };

    return (
        <main className="
            relative flex min-h-screen flex-col items-center justify-center
            bg-slate-950
            overflow-hidden
            px-6
        ">
            {/* Background glow blobs */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
                <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-3xl" />
                <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] rounded-full bg-indigo-600/5 blur-3xl" />
            </div>

            {/* Dot grid texture */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                }}
                aria-hidden
            />

            {/* Content card */}
            <div className="relative z-10 w-full max-w-xl flex flex-col gap-6">

                {/* Brand header */}
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 mb-1">
                        {/* Logo mark */}
                        <span className="
                            flex items-center justify-center
                            w-9 h-9 rounded-xl
                            bg-amber-400
                            shadow-lg shadow-amber-500/30
                        ">
                            <svg className="w-5 h-5 text-slate-900" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
                            </svg>
                        </span>
                        <h1 className="
                            text-3xl font-black tracking-tight
                            text-white
                            [font-family:'Sora','DM_Sans',system-ui,sans-serif]
                        ">
                            Job<span className="text-amber-400">Orbit</span>
                        </h1>
                    </div>
                    <p className="text-slate-500 text-sm tracking-wide ml-0.5">
                        Discover opportunities across the globe.
                    </p>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-slate-700 via-slate-600 to-transparent" />

                {/* Search bar */}
                <Search onSearch={handleSearch} />

                {/* Toolbar row */}
                <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs text-slate-600 uppercase tracking-widest font-semibold">Filter by</span>
                    <CountryDropdown />
                </div>

                {/* Active search result echo */}
                {searchValue && (
                    <div className="
                        flex items-center gap-2 px-4 py-3
                        rounded-xl bg-slate-800/50 border border-slate-700/50
                    ">
                        <svg className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                        <p className="text-sm text-slate-400">
                            Results for <span className="text-slate-200 font-medium">"{searchValue}"</span>
                        </p>
                        <button
                            onClick={() => setSearchValue('')}
                            className="ml-auto text-slate-600 hover:text-slate-300 transition-colors"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}