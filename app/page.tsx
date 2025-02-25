"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"

interface Square {
  id: string
  name: string
  logo: string
}

export default function Home() {
  const [squares, setSquares] = useState<Square[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: squaresData, error: squaresError } = await supabase
          .from('project')
          .select('*')

        if (squaresError) throw squaresError
        if (squaresData) {
          console.log('Squares data:', squaresData)
          setSquares(squaresData)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {squares.map((square) => (
        <Link key={square.id} href={`/form/${square.id}`}>
          <Card className="hover:bg-accent transition-colors">
            <CardHeader className="flex flex-row items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-2xl">
                {square.logo}
              </div>
              <CardTitle>{square.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-4"></div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
