'use client';
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import SalaryDropdown, { SALARY_RANGES } from '../components/SalaryDropdown'
import { getFlag } from '../components/Countries'

import Accommodation from '@/utils/Accommodation';
import backend from '@/utils/Backend';


const PRICE_RANGES = [
  { label: 'Any Price', min: 0, max: Infinity },
  { label: '₱0 – ₱10,000', min: 0, max: 10000 },
  { label: '₱10,000 – ₱50,000', min: 10000, max: 50000 },
  { label: '₱50,000 – ₱100,000', min: 50000, max: 100000 },
  { label: '₱100,000+', min: 100000, max: Infinity },
]

// ── Accommodation card ────────────────────────────────────────────────────────
function AccommodationCard({ item, city, country }: { 
  item: Accommodation,
  city: string,
  country: string,
}) {
  return (
    <article className="
      group relative
      bg-slate-900/60 hover:bg-slate-900
      border border-slate-800 hover:border-slate-600
      rounded-2xl p-6
      transition-all duration-200
      hover:shadow-xl hover:shadow-black/30
      cursor-pointer
    " onClick={() => {
      /**
       * Opens the link of the {@link Accommodation} object provided by the
       * {@link item.url} variable in another tab.
       * 
       * Do NOT open the link in the same tab. The React state will be lost once
       * the user leaves the website. Going back to the website from the accommodation
       * link will result to an error.
       */
      window.open(item.url, "_blank", "noopener,noreferrer")
    }}>
      <div className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full bg-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-slate-100 group-hover:text-amber-300 transition-colors duration-150 truncate">
            {item.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-1.5">
            <svg className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
            <span className="text-xs text-slate-500">{getFlag(country)} {city}, {country}</span>
          </div>
        </div>
        <div className="flex-shrink-0 text-right">
          <span className="text-sm font-semibold text-amber-400">
            {item.price}
          </span>
          <p className="text-[10px] text-slate-600 mt-0.5">per month</p>
        </div>
      </div>

      <p className="mt-3 text-sm text-slate-500 leading-relaxed line-clamp-2">
        {item.description}
      </p>

      <div className="flex items-center gap-2 mt-4">
        <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-medium text-slate-400">
          {item.rating === null ? "No Rating" : `${item.rating} out of 5`}
        </span>
        <span className="ml-auto text-xs text-slate-600 group-hover:text-amber-500 transition-colors flex items-center gap-1">
          View listing
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </span>
      </div>
    </article>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function AccommodationsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Job details passed via query params from JobPage
  const jobTitle = searchParams.get('jobTitle') ?? 'Job Position'
  const jobCompany = searchParams.get('jobCompany') ?? 'Company Name'
  const jobCity = searchParams.get('jobCity') ?? 'Job City'
  const jobCountry = searchParams.get('jobCountry') ?? 'Job Country'
  const jobSalaryMin = Number(searchParams.get('jobSalaryMin') ?? 10000)
  const jobSalaryMax = Number(searchParams.get('jobSalaryMax') ?? 100000)
  const jobDescription = searchParams.get('jobDescription') ?? ''
  const jobTags = searchParams.get('jobTags')?.split(',') ?? []

  // Accommodation filters — city pre-filled from job, country locked
  const [cityQuery, setCityQuery] = useState(jobCity)
  const [accomQuery, setAccomQuery] = useState('')
  const [priceRange, setPriceRange] = useState(PRICE_RANGES[0].label)

  /**
   * The {@link accommodation} variable handles the original list of accommodations 
   * retrieved from the backend API, while the {@link filteredAccommodations} variable 
   * just filters the accommodations found in the {@link accommodations} variable.
   * 
   * You can think about this like caching. The results of the backend API are 
   * cached in the {@link accommodations} variable.
   */
  const [accommodations, setAccommodations] = useState([] as Accommodation[]);
  const [filteredAccommodations, setFilteredAccommodations] = useState([] as Accommodation[]);

  const activePrice = PRICE_RANGES.find((r) => r.label === priceRange) ?? PRICE_RANGES[0]

  /**
   * Determines if the {@link Accommodation} object satisfies the
   * filters set by the user.
   *
   * @param {Accommodation} accommodation The {@link Accommodation} object to be checked.
   * @returns {boolean} The value true if it satisfies the filters;
   *    the value false otherwise.
   */
  const is_relevant_accommodation = (accommodation: Accommodation) => {
    const matchName = accomQuery === "" || accommodation.name.toLowerCase().includes(accomQuery.toLowerCase());

    // TODO: Figure out how to properly filter price.
    // const matchPrice = activePrice.label === "Any Price";

    return matchName;
  }
  
  /**
   * Updates the list of filtered accommodations based on the given filters.
   * 
   * @param {Accommodation[]} accommodations The array of {@link Accommodation} 
   *    objects to be filtered.
   */
  const updateFilteredAccommodations = (accommodations: Accommodation[]) => {
    const filteredAccommodations = accommodations.filter(is_relevant_accommodation);
    setFilteredAccommodations(filteredAccommodations);
  }

  // This calls the backend API once for initializing the accommodations.
  useEffect(() => {
    const accommodationsPromise = backend.accommodationsFrom(cityQuery);
    
    accommodationsPromise
      .then(accommodations => {
        setAccommodations(accommodations);
        updateFilteredAccommodations(accommodations);
      })
  }, [])  // Do NOT remove the empty array. This prevents multiple calls to the backend each second.

  return (
    <main className="relative min-h-screen bg-slate-950 overflow-hidden px-6 py-12">

      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-indigo-600/5 blur-3xl" />
      </div>

      {/* Dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        aria-hidden
      />

      <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col gap-8">

        {/* ── Header ── */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1">Find housing near your job</p>
            <h1 className="text-3xl font-black tracking-tight text-white [font-family:'Sora',system-ui,sans-serif]">
              Job<span className="text-amber-400">Orbit</span>
              <span className="text-slate-500 font-light"> | Accommodations</span>
            </h1>
          </div>
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="
              inline-flex items-center gap-2 px-4 py-2
              rounded-xl border border-slate-700 bg-slate-800/60
              text-xs font-medium text-slate-400
              hover:border-slate-500 hover:text-slate-200
              transition-all duration-150
            "
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Back to Jobs
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-slate-700 via-slate-600 to-transparent" />

        {/* ── Expanded job card ── */}
        <div className="
          relative
          bg-slate-900/80 border border-amber-400/20
          rounded-2xl p-6
          shadow-lg shadow-amber-500/5
        ">
          {/* Amber top-edge accent */}
          <div className="absolute top-0 left-6 right-6 h-0.5 rounded-full bg-gradient-to-r from-amber-400/60 via-amber-300/30 to-transparent" />

          {/* Title row */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500">Selected Job</span>
              </div>
              <h2 className="text-xl font-black text-slate-100 [font-family:'Sora',system-ui,sans-serif]">
                {jobTitle}
              </h2>
              <p className="text-sm text-slate-400 font-medium mt-0.5">{jobCompany}</p>
            </div>
            <div className="flex-shrink-0 text-right">
              <span className="text-sm font-semibold text-amber-400">
                ₱{jobSalaryMin.toLocaleString()} – ₱{jobSalaryMax.toLocaleString()}
              </span>
              <p className="text-[10px] text-slate-600 mt-0.5">per month</p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 mt-3">
            <svg className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
            <span className="text-xs text-slate-500">{getFlag(jobCountry)} {jobCity}, {jobCountry}</span>
          </div>

          {/* Divider */}
          <div className="h-px bg-slate-800 my-4" />

          {/* Description */}
          {jobDescription && (
            <p className="text-sm text-slate-400 leading-relaxed mb-4">{jobDescription}</p>
          )}

          {/* Tags + meta row */}
          <div className="flex items-center gap-2 flex-wrap">
            {jobTags.map((tag) => (
              <span key={tag} className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-medium text-slate-400">
                {tag}
              </span>
            ))}
          </div>

          {/* Contact row */}
          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582" />
              </svg>
              <span className="text-xs text-slate-500 hover:text-amber-400 cursor-pointer transition-colors">
                {jobCompany.toLowerCase().replace(/\s+/g, '')}.com
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-slate-600" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
              <span className="text-xs text-slate-500 hover:text-amber-400 cursor-pointer transition-colors">
                Contact Details
              </span>
            </div>
          </div>
        </div>

        {/* ── Accommodation search ── */}
        <div className="flex flex-col gap-4">

          {/* Row 1: accommodation name + locked country + Find */}
          <div className="flex items-stretch gap-3">
            {/* Accommodation name search */}
            <div className="relative flex-1">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </div>
              <input
                type="text"
                value={accomQuery}
                placeholder="Search accommodations..."
                onChange={(e) => setAccomQuery(e.target.value)}
                className="
                  w-full h-full pl-11 pr-4 py-3
                  rounded-xl bg-slate-800/60 hover:bg-slate-800
                  border border-slate-700 focus:border-amber-400/60
                  text-sm text-slate-100 placeholder-slate-500
                  focus:outline-none focus:shadow-[0_0_0_2px_rgba(251,191,36,0.2)]
                  transition-all duration-150
                "
              />
            </div>

            {/* Locked country chip */}
            <div className="
              inline-flex items-center gap-2 px-4 py-3
              rounded-xl
              bg-slate-800/30 border border-slate-700/50
              text-sm font-medium text-slate-500
              cursor-not-allowed select-none
              flex-shrink-0
            ">
              <svg className="w-4 h-4 text-slate-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
              <span className="text-base leading-none">{getFlag(jobCountry)}</span>
              <span className="max-w-[120px] truncate">{jobCountry}</span>
            </div>

            {/* Find button */}
            <button className="
              px-6 py-3 rounded-xl
              bg-amber-400 hover:bg-amber-300
              text-slate-900 font-bold text-sm tracking-wide
              shadow-lg shadow-amber-500/20
              transition-all duration-150 active:scale-95
              flex-shrink-0
            " onClick={() => { updateFilteredAccommodations(accommodations); }}>
              Find
            </button>
          </div>

          {/* Row 2: city + price range */}
          <div className="flex items-stretch gap-3">
            {/* City search */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
              </div>
              <input
                type="text"
                value={cityQuery}
                placeholder="Search city..."
                onChange={(e) => setCityQuery(e.target.value)}
                className="
                  pl-11 pr-4 py-3
                  rounded-xl bg-slate-800/60 hover:bg-slate-800
                  border border-slate-700 focus:border-amber-400/60
                  text-sm text-slate-100 placeholder-slate-500
                  focus:outline-none focus:shadow-[0_0_0_2px_rgba(251,191,36,0.2)]
                  transition-all duration-150
                "
              />
            </div>

            {/* Price range dropdown — reusing SalaryDropdown */}
            <SalaryDropdown value={priceRange} onChange={setPriceRange} />
          </div>
        </div>

        {/* ── Results count ── */}
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
            Accommodations near {jobCity}
          </p>
          <span className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-400">
            {filteredAccommodations.length} listing{filteredAccommodations.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="h-px bg-gradient-to-r from-slate-700 via-slate-600 to-transparent -mt-4" />

        {/* ── Accommodation listings ── */}
        <div className="flex flex-col gap-4">
          {filteredAccommodations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
              <svg className="w-10 h-10 text-slate-700" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
              </svg>
              <p className="text-slate-500 text-sm">No accommodations found in {jobCountry}.</p>
              <button
                onClick={() => { setAccomQuery(''); setCityQuery(jobCity); setPriceRange(PRICE_RANGES[0].label) }}
                className="text-amber-400 text-xs hover:text-amber-300 underline underline-offset-2 transition-colors"
              >
                Clear filters
              </button>
            </div>
          ) : (
            filteredAccommodations.map((item) => <AccommodationCard key={item.id} item={item} city={jobCity} country={jobCountry} />)
          )}
        </div>

      </div>
    </main>
  )
}