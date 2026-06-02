export type Country = {
  name: string
  flag: string
}

export const COUNTRIES: Country[] = [
  { name: 'All Countries',            flag: '🌐' },
  { name: 'United States of America', flag: '🇺🇸' },
  { name: 'United Kingdom',           flag: '🇬🇧' },
  { name: 'Canada',                   flag: '🇨🇦' },
  { name: 'Germany',                  flag: '🇩🇪' },
  { name: 'France',                   flag: '🇫🇷' },
]

// Lookup helpers
export function getFlag(name: string): string {
  return COUNTRIES.find((c) => c.name === name)?.flag ?? '🌐'
}

export const COUNTRY_NAMES = COUNTRIES.map((c) => c.name)