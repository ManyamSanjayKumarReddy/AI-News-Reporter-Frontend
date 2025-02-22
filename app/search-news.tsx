"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"

export function SearchNews() {
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm) {
        router.push(`/?search=${encodeURIComponent(searchTerm)}`)
      } else {
        router.push("/")
      }
    }, 300)

    return () => clearTimeout(handler)
  }, [searchTerm, router])

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search news..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-9"
      />
    </div>
  )
}

