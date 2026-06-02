'use client';
import CountryDropdown from '../components/CountryDropdown'
import { getFlag } from '../components/Countries'
import SalaryDropdown, { SALARY_RANGES } from '../components/SalaryDropdown'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import clsx from 'clsx'
import { Fragment, useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import backend from "../../utils/Backend.js"
import Job from "../../utils/Job.js"

// ── Job card ─────────────────────────────────────────────────────────────────
function JobCard({ job }: { job: Job }) {
  const router = useRouter()

  const handleClick = () => {
    const params = new URLSearchParams({
      jobTitle:       job.title,
      jobCompany:     'JobOrbit Company',
      jobCity:        job.city,
      jobCountry:     job.country,
      jobSalaryMin:   String(job.salaryMin),
      jobSalaryMax:   String(job.salaryMax),
      jobDescription: job.description,
      jobTags:        job.tags.join(','),
    })
    router.push(`/accommodations?${params.toString()}`)
  }

  let salary: string
  if (job.salaryMin === null && job.salaryMax === null)
    salary = `Not specified`;
  else if (job.salaryMin === null)
    salary = `Max: ₱${job.salaryMax!.toLocaleString()}`;
  else if (job.salaryMax === null)
    salary = `Min: ₱${job.salaryMin!.toLocaleString()}`;
  else
    salary = `₱${job.salaryMin.toLocaleString()} – ₱${job.salaryMax.toLocaleString()}`;

  return (
    <article
      onClick={handleClick}
      className="
        group relative
        bg-slate-900/60 hover:bg-slate-900
        border border-slate-800 hover:border-slate-600
        rounded-2xl p-6
        transition-all duration-200
        hover:shadow-xl hover:shadow-black/30
        cursor-pointer
      ">
      {/* Amber left-edge accent on hover */}
      <div className="
        absolute left-0 top-4 bottom-4 w-0.5 rounded-full
        bg-amber-400 opacity-0 group-hover:opacity-100
        transition-opacity duration-200
      " />

      <div className="flex items-start justify-between gap-4">
        {/* Left: title + location */}
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-bold text-slate-100 group-hover:text-amber-300 transition-colors duration-150 truncate">
            {job.title}
          </h2>
          <div className="flex items-center gap-1.5 mt-1.5">
            <svg className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
            <span className="text-xs text-slate-500">{getFlag(job.country)} {job.city}, {job.country}</span>
          </div>
        </div>

        {/* Right: salary */}
        <div className="flex-shrink-0 text-right">
          <span className="text-sm font-semibold text-amber-400">
            {salary}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="mt-3 text-sm text-slate-500 leading-relaxed line-clamp-2">
        {job.description}
      </p>

      {/* Tags */}
      <div className="flex items-center gap-2 mt-4 flex-wrap">
        {job.tags.map((tag) => (
          <span
            key={tag}
            className="
              px-2.5 py-1 rounded-lg
              bg-slate-800 border border-slate-700
              text-xs font-medium text-slate-400
            "
          >
            {tag}
          </span>
        ))}
        <span className="ml-auto text-xs text-slate-600 group-hover:text-amber-500 transition-colors flex items-center gap-1">
          View details
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </span>
      </div>
    </article>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function JobPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [titleQuery, setTitleQuery] = useState(searchParams.get('q') ?? '')
  const [cityQuery, setCityQuery] = useState('')
  const [salaryRange, setSalaryRange] = useState(SALARY_RANGES[0].label)

  /**
   * The {@link jobs} variable handles the original list of jobs retrieved from
   * the backend API, while the {@link filteredJobs} variable just filters the jobs
   * found in the {@link jobs} variable.
   * 
   * You can think about this like caching. The results of the backend API are 
   * cached in the {@link jobs} variable.
   */
  const [jobs, setJobs] = useState([] as Job[])
  const [filteredJobs, setFilteredJobs] = useState([] as Job[])

  /**
   * The {@link country} variable keeps track of the currently set country
   * in the filters. On the other hand, the {@link previousCountry} variable
   * keeps the country of the jobs in the {@link jobs} variable.
   *
   * This is necessary because we only call the backend API when we change
   * the "country" filter, press the "Find" button, AND the previous jobs
   * array has a different "country" than the new one.
   * 
   * Thus, this is done for caching purposes.
   */
  const initialCountry = "All Countries";
  const [country, setCountry] = useState(initialCountry);
  const [previousCountry, setPreviousCountry] = useState(initialCountry);

  const activeSalary = SALARY_RANGES.find((r) => r.label === salaryRange) ?? SALARY_RANGES[0]
  

  /**
   * Determines if the {@link Job} object satisfies the
   * filters set by the user.
   *
   * @param {Job} job The {@link Job} object to be checked.
   * @returns {boolean} The value true if it satisfies the filters;
   *    the value false otherwise.
   */
  const is_relevant_job = (job: Job) => {
    const matchTitle = titleQuery === "" || job.title.toLowerCase().includes(titleQuery.toLowerCase())
    const matchCity = cityQuery === "" || job.city.toLowerCase().includes(cityQuery.toLowerCase())
    const matchCountry = country === 'All Countries' || job.country === country
    const matchSalary = activeSalary.label === 'Any Salary' || (
      job.salaryMax !== null 
      && job.salaryMin !== null
      && job.salaryMax >= activeSalary.min 
      && job.salaryMin <= activeSalary.max
    )

    return matchTitle && matchCity && matchCountry && matchSalary
  }
  
  /**
   * Updates the list of filtered jobs based on the given filters.
   * 
   * @param {Job[]} jobs The array of {@link Job} objects to be filtered.
   */
  const updateFilteredJobs = (jobs: Job[]) => {
    const filteredJobs = jobs.filter(is_relevant_job)
    setFilteredJobs(filteredJobs)
  }

  /**
   * Updates the {@link jobs} and {@link filteredJobs} variables handled
   * by React.
   * 
   * @param {string} country The country to be searched for jobs.
   */
  const updateJobArraysBasedOnCountry = (country: string) => {
    let jobsPromise: Promise<Job[]>
    
    switch(country) {
      case "United States of America":
        jobsPromise = backend.jobsFromUSA();
        break;
      case "United Kingdom":
        jobsPromise = backend.jobsFromUK();
        break;
      case "Canada":
        jobsPromise = backend.jobsFromCanada();
        break;
      case "Germany":
        jobsPromise = backend.jobsFromGermany();
        break;
      case "France":
        jobsPromise = backend.jobsFromFrance();
        break;
      default:
        jobsPromise = backend.jobs()
    }

    // Update all the jobs arrays.
    jobsPromise
      .then(jobs => {
        setJobs(jobs);
        updateFilteredJobs(jobs);
        // alert(`Found ${jobs.length} jobs in ${country}.`);
      })
  }
  
  /**
   * Updates the search parameters in the link.
   */
  const updateSearchParams = () => {
    const current = new URLSearchParams(Array.from(searchParams.entries()))
    current.set("q", titleQuery)

    const search = current.toString()
    const query = search ? `?${search}` : ""
    router.push(`${pathname}${query}`)
  }

  // Calls the backend and processes the API.
  useEffect(() => {
    const jobsPromise = backend.jobs()
    jobsPromise
      .then(jobs => {
        if (jobs === null)
          throw new Error("Backend API returned null instead of a list of jobs.");
        setJobs(jobs);
        updateFilteredJobs(jobs);
      })
      .catch(error => {
        console.log(error);
      })
  }, []);   // Do NOT remove the empty array. This avoids infinite loop (and thus, infinite API calls.)

  return (
    <main className="relative min-h-screen bg-slate-950 overflow-hidden px-6 py-12">

      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-indigo-600/5 blur-3xl" />
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
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1">Explore</p>
            <h1 className="text-3xl font-black tracking-tight text-white [font-family:'Sora',system-ui,sans-serif]">
              Job<span className="text-amber-400">Orbit</span>
              <span className="text-slate-500 font-light"> | Jobs</span>
            </h1>
          </div>
          <span className="
            px-3 py-1.5 rounded-xl
            bg-slate-800 border border-slate-700
            text-xs font-semibold text-slate-400
          ">
            {filteredJobs.length} listing{filteredJobs.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-slate-700 via-slate-600 to-transparent" />

        {/* ── Filter row 1: title + country + find ── */}
        <div className="flex items-stretch gap-3">
          {/* Title search */}
          <div className="relative flex-1">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
            <input
              type="text"
              value={titleQuery}
              placeholder="Job position, keyword, company..."
              onChange={(e) => setTitleQuery(e.target.value)}
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

          {/* Country dropdown — using shared component */}
          <CountryDropdown value={country} onChange={setCountry} />

          {/* Find button */}
          <button className="
            px-6 py-3 rounded-xl
            bg-amber-400 hover:bg-amber-300
            text-slate-900 font-bold text-sm tracking-wide
            shadow-lg shadow-amber-500/20
            transition-all duration-150 active:scale-95
            flex-shrink-0
          " onClick={() => { 
              updateSearchParams(); 
              if (previousCountry !== country) {
                setPreviousCountry(country);
                updateJobArraysBasedOnCountry(country)
              } else {
                updateFilteredJobs(jobs);
              }
            }}>
            Find
          </button>
        </div>

        {/* ── Filter row 2: city + salary ── */}
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
          
          {/* Salary dropdown — using shared component */}
          <SalaryDropdown value={salaryRange} onChange={setSalaryRange} />
        </div>

        {/* ── Job listings ── */}
        <div className="flex flex-col gap-4">
          {filteredJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
              <svg className="w-10 h-10 text-slate-700" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
              </svg>
              <p className="text-slate-500 text-sm">No jobs match your filters.</p>
              <button
                onClick={() => { 
                  setTitleQuery('');
                  setCityQuery('');
                  setCountry('All Countries');
                  setSalaryRange(SALARY_RANGES[0].label);
                }}
                className="text-amber-400 text-xs hover:text-amber-300 underline underline-offset-2 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            filteredJobs.map((job) => <JobCard key={job.id} job={job} />)
          )}
        </div>

      </div>
    </main>
  )
}