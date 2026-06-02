'use client'
import { useState } from 'react'
import Dropdown from './Dropdown'
import { COUNTRIES, COUNTRY_NAMES, getFlag } from './Countries'

export { COUNTRIES, COUNTRY_NAMES, getFlag }

type CountryDropdownProps = {
  value?: string
  onChange?: (country: string) => void
}

export default function CountryDropdown({ value, onChange }: CountryDropdownProps) {
  const [internal, setInternal] = useState('All Countries')

  const selected = value ?? internal
  const handleChange = (v: string) => {
    setInternal(v)
    onChange?.(v)
  }

  return (
    <Dropdown
      options={COUNTRY_NAMES}
      value={selected}
      onChange={handleChange}
      renderPrefix={(name) => getFlag(name)}
      label="Filter by Country"
    />
  )
}