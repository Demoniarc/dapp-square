"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { supabase } from "@/lib/supabase"
import { format } from "date-fns"

interface FormField {
  feature: string
  is_numerical: boolean
  values?: string[]
}

interface PriceHistory {
  month: string
  average_square_meter: number
}

const staticDates = [
  "2007-01-01", "2007-02-01", "2007-03-01", "2007-04-01", "2007-05-01", "2007-06-01",
  "2007-07-01", "2007-08-01", "2007-09-01", "2007-10-01", "2007-11-01", "2007-12-01",
  "2008-01-01", "2008-02-01", "2008-03-01", "2008-04-01", "2008-05-01", "2008-06-01",
  "2008-07-01", "2008-08-01", "2008-09-01", "2008-10-01", "2008-11-01", "2008-12-01",
  "2009-01-01", "2009-02-01", "2009-03-01", "2009-04-01", "2009-05-01", "2009-06-01",
  "2009-07-01", "2009-08-01", "2009-09-01", "2009-10-01", "2009-11-01", "2009-12-01",
  "2010-01-01", "2010-02-01", "2010-03-01", "2010-04-01", "2010-05-01", "2010-06-01",
  "2010-07-01", "2010-08-01", "2010-09-01", "2010-10-01", "2010-11-01", "2010-12-01",
  "2011-01-01", "2011-02-01", "2011-03-01", "2011-04-01", "2011-05-01", "2011-06-01",
  "2011-07-01", "2011-08-01", "2011-09-01", "2011-10-01", "2011-11-01", "2011-12-01",
  "2012-01-01", "2012-02-01", "2012-03-01", "2012-04-01", "2012-05-01", "2012-06-01",
  "2012-07-01", "2012-08-01", "2012-09-01", "2012-10-01", "2012-11-01", "2012-12-01",
  "2013-01-01", "2013-02-01", "2013-03-01", "2013-04-01", "2013-05-01", "2013-06-01",
  "2013-07-01", "2013-08-01", "2013-09-01", "2013-10-01", "2013-11-01", "2013-12-01",
  "2014-01-01", "2014-02-01", "2014-03-01", "2014-04-01", "2014-05-01", "2014-06-01",
  "2014-07-01", "2014-08-01", "2014-09-01", "2014-10-01", "2014-11-01", "2014-12-01",
  "2015-01-01", "2015-02-01", "2015-03-01", "2015-04-01", "2015-05-01", "2015-06-01",
  "2015-07-01", "2015-08-01", "2015-09-01", "2015-10-01", "2015-11-01", "2015-12-01",
  "2016-01-01", "2016-02-01", "2016-03-01", "2016-04-01", "2016-05-01", "2016-06-01",
  "2016-07-01", "2016-08-01", "2016-09-01", "2016-10-01", "2016-11-01", "2016-12-01",
  "2017-01-01", "2017-02-01", "2017-03-01", "2017-04-01", "2017-05-01", "2017-06-01",
  "2017-07-01", "2017-08-01", "2017-09-01", "2017-10-01", "2017-11-01", "2017-12-01",
  "2018-01-01", "2018-02-01", "2018-03-01", "2018-04-01", "2018-05-01", "2018-06-01",
  "2018-07-01", "2018-08-01", "2018-09-01", "2018-10-01", "2018-11-01", "2018-12-01",
  "2019-01-01", "2019-02-01", "2019-03-01", "2019-04-01", "2019-05-01", "2019-06-01",
  "2019-07-01", "2019-08-01", "2019-09-01", "2019-10-01", "2019-11-01", "2019-12-01",
  "2020-01-01", "2020-02-01", "2020-03-01", "2020-04-01", "2020-05-01", "2020-06-01",
  "2020-07-01", "2020-08-01", "2020-09-01", "2020-10-01", "2020-11-01", "2020-12-01",
  "2021-01-01", "2021-02-01", "2021-03-01", "2021-04-01", "2021-05-01", "2021-06-01",
  "2021-07-01", "2021-08-01", "2021-09-01", "2021-10-01", "2021-11-01", "2021-12-01",
  "2022-01-01", "2022-02-01", "2022-03-01", "2022-04-01", "2022-05-01", "2022-06-01",
  "2022-07-01", "2022-08-01", "2022-09-01", "2022-10-01", "2022-11-01", "2022-12-01",
  "2023-01-01", "2023-02-01", "2023-03-01", "2023-04-01", "2023-05-01", "2023-06-01",
  "2023-07-01", "2023-08-01", "2023-09-01", "2023-10-01", "2023-11-01", "2023-12-01"
]

export default function FormPage() {
  const { projectId } = useParams()
  const [fields, setFields] = useState<FormField[]>([])
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [estimatedValue, setEstimatedValue] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [priceHistory, setPriceHistory] = useState<PriceHistory[]>([])

  useEffect(() => {
    // Generate mock data for the chart
    const mockData = staticDates.map((date, index) => {
      // Create a sine wave pattern for the price variation
      const basePrice = 10000
      const amplitude = 2000
      const frequency = 0.1
      const price = basePrice + amplitude * Math.sin(index * frequency) + (index * 50)
      
      return {
        month: format(new Date(date), 'MMM yyyy'),
        average_square_meter: Number(price.toFixed(2))
      }
    })

    setPriceHistory(mockData)
  }, [])

  useEffect(() => {
    const fetchFormFields = async () => {
      try {
        const { data: featuresData, error: featuresError } = await supabase
          .from('form')
          .select('feature, is_numerical')
          .eq('id', projectId);

        if (featuresError) throw featuresError

        const uniqueData = [...new Map(featuresData.map(item => [item.feature, item])).values()];

        const fieldsWithValues = await Promise.all(
          uniqueData.map(async (field) => {
            if (!field.is_numerical) {
              const { data: valuesData, error: valuesError } = await supabase
                .from('form')
                .select('value')
                .eq('id', projectId)
                .eq('feature', field.feature)

              if (valuesError) throw valuesError

              return {
                ...field,
                values: valuesData.map(v => v.value)
              }
            }
            return field
          })
        )

        setFields(fieldsWithValues)
      } catch (error) {
        console.error('Error fetching form fields:', error)
      } finally {
        setLoading(false)
      }
    }

    if (projectId) {
      fetchFormFields()
    }
  }, [projectId])

  const handleInputChange = (feature: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [feature]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const baseUrl = `https://dubai-flat-price-estimation-api.onrender.com/${projectId}`
      const queryParams = new URLSearchParams()
      
      Object.entries(formData).forEach(([key, value]) => {
        queryParams.append(key, value)
      })

      const response = await fetch(`${baseUrl}?${queryParams.toString()}`)
      
      if (!response.ok) {
        throw new Error('API request failed')
      }

      const result = await response.json()
      setEstimatedValue(result)
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return <div>Loading form...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Price History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${value.toLocaleString()} AED`}
                />
                <Tooltip
                  formatter={(value: number) => [`${value.toLocaleString()} AED`, 'Average Price/m²']}
                />
                <Line
                  type="monotone"
                  dataKey="average_square_meter"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dubai - Property Price Estimation Model</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {fields.map((field) => (
              <div key={field.feature} className="space-y-2">
                <Label htmlFor={field.feature}>
                  {field.feature.charAt(0).toUpperCase() + field.feature.slice(1)}
                </Label>
                {field.is_numerical ? (
                  <Input
                    id={field.feature}
                    type="number"
                    step="any"
                    value={formData[field.feature] || ''}
                    onChange={(e) => handleInputChange(field.feature, e.target.value)}
                    className="w-full"
                  />
                ) : (
                  <Select
                    value={formData[field.feature] || ''}
                    onValueChange={(value) => handleInputChange(field.feature, value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      {field.values?.map((value) => (
                        <SelectItem key={value} value={value}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            ))}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Loading...' : 'Estimate'}
            </Button>
            {estimatedValue !== null && (
              <div className="mt-4 text-center">
                <p className="text-lg font-semibold">
                  Property Estimated Value: {estimatedValue.toLocaleString()}
                </p>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
