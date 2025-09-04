'use client'

import { useState, useEffect } from 'react'

interface ClientOnlyDateProps {
  date: string | Date;
  format: 'toLocaleDateString' | 'toLocaleString';
}

export default function ClientOnlyDate({ date, format }: ClientOnlyDateProps) {
  const [formattedDate, setFormattedDate] = useState('')

  useEffect(() => {
    const d = new Date(date)
    if (format === 'toLocaleDateString') {
      setFormattedDate(d.toLocaleDateString())
    } else {
      setFormattedDate(d.toLocaleString())
    }
  }, [date, format])

  return <>{formattedDate}</>
}
