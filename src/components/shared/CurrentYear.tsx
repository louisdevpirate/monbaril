'use client'

import { useEffect, useState } from "react"

export function CurrentYear() {
  const [year, setYear] = useState("")

  useEffect(() => {
    setYear(new Date().getFullYear().toString())
  }, [])

  return <span>{year}</span>
}
