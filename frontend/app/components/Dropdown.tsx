'use client'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import clsx from 'clsx'
import { Fragment } from 'react'

export type DropdownProps<T extends string> = {
  options: T[]
  value: T
  onChange: (v: T) => void
  icon?: React.ReactNode
  label?: string
  // Optional: render a custom prefix (e.g. flag) for each option by name
  renderPrefix?: (option: T) => React.ReactNode
}

export default function Dropdown<T extends string>({
  options,
  value,
  onChange,
  icon,
  label = 'Select',
  renderPrefix,
}: DropdownProps<T>) {
  return (
    <Menu as="div" className="relative inline-block text-left">

      <MenuButton className="
        inline-flex items-center gap-2 px-4 py-3
        rounded-xl bg-slate-800/60 hover:bg-slate-800
        border border-slate-700 hover:border-slate-500
        text-sm font-medium text-slate-300 hover:text-slate-100
        transition-all duration-150
        focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400
        whitespace-nowrap
      ">
        {/* Show flag of selected value in button, or fallback icon */}
        {renderPrefix ? (
          <span className="text-base leading-none">{renderPrefix(value)}</span>
        ) : (
          icon
        )}
        <span className="max-w-[140px] truncate">{value}</span>
        <svg
          className="w-3 h-3 text-slate-500 flex-shrink-0"
          fill="none" viewBox="0 0 24 24"
          strokeWidth={2.5} stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </MenuButton>

      <MenuItems
        anchor="bottom start"
        className="
          z-50 mt-2 min-w-[200px]
          rounded-2xl bg-slate-900
          border border-slate-700/80
          shadow-2xl shadow-black/40
          p-1.5 focus:outline-none
          transition
          data-[closed]:scale-95 data-[closed]:opacity-0
          data-[enter]:duration-100 data-[leave]:duration-75
        "
      >
        {/* Panel header */}
        <div className="px-3 py-1.5 mb-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            {label}
          </p>
        </div>
        <div className="h-px bg-slate-700/60 mx-1 mb-1" />

        {options.map((opt) => (
          <MenuItem key={opt} as={Fragment}>
            {({ focus }) => (
              <button
                onClick={() => onChange(opt)}
                className={clsx(
                  'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left',
                  'text-sm font-medium transition-colors duration-100',
                  focus
                    ? 'bg-amber-400/10 text-amber-300'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800',
                  value === opt && 'text-amber-400'
                )}
              >
                {renderPrefix ? (
                  <span className="text-base leading-none flex-shrink-0 w-5 text-center">
                    {renderPrefix(opt)}
                  </span>
                ) : (
                  <span className={clsx(
                    'w-1.5 h-1.5 rounded-full flex-shrink-0',
                    value === opt ? 'bg-amber-400' : 'bg-slate-700'
                  )} />
                )}
                <span className="truncate">{opt}</span>
                {value === opt && !renderPrefix && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                )}
                {value === opt && renderPrefix && (
                  <svg className="ml-auto w-3 h-3 text-amber-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                )}
              </button>
            )}
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  )
}