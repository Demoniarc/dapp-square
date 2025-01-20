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
import { supabase } from "@/lib/supabase"

interface FormField {
  feature: string
  is_numerical: boolean
  values?: string[]
}

export default function FormPage() {
  const { projectId } = useParams()
  const [fields, setFields] = useState<FormField[]>([])
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [estimatedValue, setEstimatedValue] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

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
      // Construct the URL with query parameters
      const baseUrl = `https://dubai-flat-price-estimation-api.onrender.com/${projectId}`
      const queryParams = new URLSearchParams()
      
      // Add all form data to query parameters
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
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Project Form</CardTitle>
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
              {isSubmitting ? 'Sending...' : 'Send'}
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
