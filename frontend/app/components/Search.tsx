'use client'
import React, { ChangeEvent, useState } from 'react';

export type SearchProps = {
    onSearch: (value: string) => void
}

const Search = (props: SearchProps) => {
    const { onSearch } = props;
    const [value, setValue] = useState('');
    const [focused, setFocused] = useState(false);

    const searchHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            onSearch(value);
        }
    };

    return (
        <div
            className={`
                relative w-full group
                rounded-2xl
                transition-all duration-300
                ${focused
                    ? 'shadow-[0_0_0_2px_#f59e0b] bg-slate-800'
                    : 'shadow-[0_0_0_1px_#334155] bg-slate-800/60 hover:bg-slate-800 hover:shadow-[0_0_0_1px_#475569]'
                }
            `}
        >
            {/* Search icon — left side */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                    className={`w-4 h-4 transition-colors duration-200 ${focused ? 'text-amber-400' : 'text-slate-500'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
            </div>

            <input
                type="search"
                name="search"
                value={value}
                placeholder="Search roles, companies, skills..."
                className="
                    w-full h-13 pl-11 pr-28 py-4
                    bg-transparent
                    text-slate-100 placeholder-slate-500
                    text-sm tracking-wide
                    focus:outline-none
                    rounded-2xl
                "
                onChange={searchHandler}
                onKeyDown={handleKeyDown}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
            />

            {/* Enter to search pill */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <button
                    type="button"
                    onClick={() => onSearch(value)}
                    className="
                        flex items-center gap-1.5
                        px-3 py-1.5
                        rounded-lg
                        bg-amber-400 hover:bg-amber-300
                        text-slate-900 font-semibold text-xs tracking-wide
                        transition-all duration-150
                        active:scale-95
                        shadow-sm
                    "
                >
                    Search
                    <kbd className="text-slate-700 font-mono text-[10px] hidden sm:inline">↵</kbd>
                </button>
            </div>
        </div>
    );
};

export default Search;