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

// Static price history data
const staticPriceHistory: PriceHistory[] = [
  { month: "2007-01-01", average_square_meter: 6291.93219279724 },
  { month: "2007-02-01", average_square_meter: 6694.57855269555 },
  { month: "2007-03-01", average_square_meter: 5887.77179923661 },
  { month: "2007-04-01", average_square_meter: 6523.02436457529 },
  { month: "2007-05-01", average_square_meter: 6217.33279962096 },
  { month: "2007-06-01", average_square_meter: 6746.85657776988 },
  { month: "2007-07-01", average_square_meter: 5496.73134679453 },
  { month: "2007-08-01", average_square_meter: 6094.542663705 },
  { month: "2007-09-01", average_square_meter: 6008.26817150385 },
  { month: "2007-10-01", average_square_meter: 6934.10543598561 },
  { month: "2007-11-01", average_square_meter: 7610.5265313709 },
  { month: "2007-12-01", average_square_meter: 7439.34223858019 },
  { month: "2008-01-01", average_square_meter: 9857.0114769636 },
  { month: "2008-02-01", average_square_meter: 9099.10351574179 },
  { month: "2008-03-01", average_square_meter: 8624.77104269254 },
  { month: "2008-04-01", average_square_meter: 8160.98472192938 },
  { month: "2008-05-01", average_square_meter: 9191.25544157847 },
  { month: "2008-06-01", average_square_meter: 10493.9933189987 },
  { month: "2008-07-01", average_square_meter: 9850.32927487503 },
  { month: "2008-08-01", average_square_meter: 10629.4283196638 },
  { month: "2008-09-01", average_square_meter: 9494.07235478166 },
  { month: "2008-10-01", average_square_meter: 9425.94079272622 },
  { month: "2008-11-01", average_square_meter: 8378.17732815873 },
  { month: "2008-12-01", average_square_meter: 8592.02922670775 },
  { month: "2009-01-01", average_square_meter: 7972.56093652475 },
  { month: "2009-02-01", average_square_meter: 7792.08658763508 },
  { month: "2009-03-01", average_square_meter: 7911.37016376854 },
  { month: "2009-04-01", average_square_meter: 8471.71679475755 },
  { month: "2009-05-01", average_square_meter: 8351.27977720553 },
  { month: "2009-06-01", average_square_meter: 9129.06345383005 },
  { month: "2009-07-01", average_square_meter: 9213.55171570028 },
  { month: "2009-08-01", average_square_meter: 8818.43364795307 },
  { month: "2009-09-01", average_square_meter: 9302.98488412948 },
  { month: "2009-10-01", average_square_meter: 9567.98054319552 },
  { month: "2009-11-01", average_square_meter: 8978.70846060592 },
  { month: "2009-12-01", average_square_meter: 8885.68357851495 },
  { month: "2010-01-01", average_square_meter: 9776.17545735442 },
  { month: "2010-02-01", average_square_meter: 9601.0414971801 },
  { month: "2010-03-01", average_square_meter: 9943.3878961089 },
  { month: "2010-04-01", average_square_meter: 9927.43081034826 },
  { month: "2010-05-01", average_square_meter: 10066.3435753652 },
  { month: "2010-06-01", average_square_meter: 9861.04421907349 },
  { month: "2010-07-01", average_square_meter: 10326.6292648438 },
  { month: "2010-08-01", average_square_meter: 10983.6811865367 },
  { month: "2010-09-01", average_square_meter: 10465.2736449132 },
  { month: "2010-10-01", average_square_meter: 10242.5092908251 },
  { month: "2010-11-01", average_square_meter: 11483.176141185 },
  { month: "2010-12-01", average_square_meter: 10838.5702217033 },
  { month: "2011-01-01", average_square_meter: 11177.0591960526 },
  { month: "2011-02-01", average_square_meter: 11370.7922564399 },
  { month: "2011-03-01", average_square_meter: 10284.5937965527 },
  { month: "2011-04-01", average_square_meter: 11413.3966613351 },
  { month: "2011-05-01", average_square_meter: 10667.6087583006 },
  { month: "2011-06-01", average_square_meter: 10422.0596865596 },
  { month: "2011-07-01", average_square_meter: 10938.1196945019 },
  { month: "2011-08-01", average_square_meter: 10483.2094210849 },
  { month: "2011-09-01", average_square_meter: 9587.43665738244 },
  { month: "2011-10-01", average_square_meter: 10802.5926107951 },
  { month: "2011-11-01", average_square_meter: 10116.1165715894 },
  { month: "2011-12-01", average_square_meter: 11402.8045113161 },
  { month: "2012-01-01", average_square_meter: 10959.0828365265 },
  { month: "2012-02-01", average_square_meter: 10470.3738685507 },
  { month: "2012-03-01", average_square_meter: 10049.7525167023 },
  { month: "2012-04-01", average_square_meter: 11070.2035865074 },
  { month: "2012-05-01", average_square_meter: 11130.7691089152 },
  { month: "2012-06-01", average_square_meter: 10724.2088257841 },
  { month: "2012-07-01", average_square_meter: 10561.291024395 },
  { month: "2012-08-01", average_square_meter: 10760.3027921965 },
  { month: "2012-09-01", average_square_meter: 10742.9355610688 },
  { month: "2012-10-01", average_square_meter: 11214.5506608235 },
  { month: "2012-11-01", average_square_meter: 11210.5507258592 },
  { month: "2012-12-01", average_square_meter: 11948.2923268576 },
  { month: "2013-01-01", average_square_meter: 11205.7586610546 },
  { month: "2013-02-01", average_square_meter: 12466.4967675762 },
  { month: "2013-03-01", average_square_meter: 13560.3330012077 },
  { month: "2013-04-01", average_square_meter: 11857.3496291159 },
  { month: "2013-05-01", average_square_meter: 11832.388291457 },
  { month: "2013-06-01", average_square_meter: 12430.1220488201 },
  { month: "2013-07-01", average_square_meter: 12894.6793911894 },
  { month: "2013-08-01", average_square_meter: 12502.7530852508 },
  { month: "2013-09-01", average_square_meter: 11526.0217215802 },
  { month: "2013-10-01", average_square_meter: 13193.9549790018 },
  { month: "2013-11-01", average_square_meter: 13673.7402028886 },
  { month: "2013-12-01", average_square_meter: 13718.7832696063 },
  { month: "2014-01-01", average_square_meter: 14842.6484154156 },
  { month: "2014-02-01", average_square_meter: 15376.7178174869 },
  { month: "2014-03-01", average_square_meter: 14122.8961099336 },
  { month: "2014-04-01", average_square_meter: 15313.7932395256 },
  { month: "2014-05-01", average_square_meter: 15204.1295996308 },
  { month: "2014-06-01", average_square_meter: 15029.3985729584 },
  { month: "2014-07-01", average_square_meter: 14234.8925998613 },
  { month: "2014-08-01", average_square_meter: 14324.0474239996 },
  { month: "2014-09-01", average_square_meter: 14720.2385763426 },
  { month: "2014-10-01", average_square_meter: 14163.7191804992 },
  { month: "2014-11-01", average_square_meter: 14465.8705266664 },
  { month: "2014-12-01", average_square_meter: 13856.9289167869 },
  { month: "2015-01-01", average_square_meter: 13470.7129259002 },
  { month: "2015-02-01", average_square_meter: 14078.9971435435 },
  { month: "2015-03-01", average_square_meter: 14131.7446976334 },
  { month: "2015-04-01", average_square_meter: 14368.6376270837 },
  { month: "2015-05-01", average_square_meter: 13289.1547127328 },
  { month: "2015-06-01", average_square_meter: 12550.3508399737 },
  { month: "2015-07-01", average_square_meter: 14073.0335542489 },
  { month: "2015-08-01", average_square_meter: 12894.4256969074 },
  { month: "2015-09-01", average_square_meter: 13118.1556679723 },
  { month: "2015-10-01", average_square_meter: 13208.5461445452 },
  { month: "2015-11-01", average_square_meter: 13933.9971529223 },
  { month: "2015-12-01", average_square_meter: 12927.7630827781 },
  { month: "2016-01-01", average_square_meter: 12835.4431992762 },
  { month: "2016-02-01", average_square_meter: 13072.3057918572 },
  { month: "2016-03-01", average_square_meter: 12780.8725051603 },
  { month: "2016-04-01", average_square_meter: 12309.760587921 },
  { month: "2016-05-01", average_square_meter: 12857.2616888055 },
  { month: "2016-06-01", average_square_meter: 13029.7223916573 },
  { month: "2016-07-01", average_square_meter: 12521.5361159608 },
  { month: "2016-08-01", average_square_meter: 13012.2843797497 },
  { month: "2016-09-01", average_square_meter: 12685.1562704354 },
  { month: "2016-10-01", average_square_meter: 12347.5042608965 },
  { month: "2016-11-01", average_square_meter: 13019.3936630096 },
  { month: "2016-12-01", average_square_meter: 12994.1532201085 },
  { month: "2017-01-01", average_square_meter: 12785.5871618888 },
  { month: "2017-02-01", average_square_meter: 13671.0803005385 },
  { month: "2017-03-01", average_square_meter: 13408.4059282414 },
  { month: "2017-04-01", average_square_meter: 13548.2698627813 },
  { month: "2017-05-01", average_square_meter: 13212.9426522565 },
  { month: "2017-06-01", average_square_meter: 12864.6199591788 },
  { month: "2017-07-01", average_square_meter: 12559.389140437 },
  { month: "2017-08-01", average_square_meter: 12047.4670206011 },
  { month: "2017-09-01", average_square_meter: 13285.5370616998 },
  { month: "2017-10-01", average_square_meter: 13073.6719884672 },
  { month: "2017-11-01", average_square_meter: 13333.2506009298 },
  { month: "2017-12-01", average_square_meter: 12805.5051269912 },
  { month: "2018-01-01", average_square_meter: 11891.1517002033 },
  { month: "2018-02-01", average_square_meter: 12198.136583969 },
  { month: "2018-03-01", average_square_meter: 12119.2232297788 },
  { month: "2018-04-01", average_square_meter: 12198.277285852 },
  { month: "2018-05-01", average_square_meter: 12899.0888907497 },
  { month: "2018-06-01", average_square_meter: 12310.5851825462 },
  { month: "2018-07-01", average_square_meter: 10905.2387338848 },
  { month: "2018-08-01", average_square_meter: 11176.8428144438 },
  { month: "2018-09-01", average_square_meter: 10591.4378778568 },
  { month: "2018-10-01", average_square_meter: 11151.0008126604 },
  { month: "2018-11-01", average_square_meter: 11209.1440484398 },
  { month: "2018-12-01", average_square_meter: 13782.4589234074 },
  { month: "2019-01-01", average_square_meter: 9939.80888689397 },
  { month: "2019-02-01", average_square_meter: 10401.8276016461 },
  { month: "2019-03-01", average_square_meter: 10551.8302795794 },
  { month: "2019-04-01", average_square_meter: 10392.3079971813 },
  { month: "2019-05-01", average_square_meter: 10361.4798223964 },
  { month: "2019-06-01", average_square_meter: 10575.3791637571 },
  { month: "2019-07-01", average_square_meter: 10496.6269350037 },
  { month: "2019-08-01", average_square_meter: 9843.79909888078 },
  { month: "2019-09-01", average_square_meter: 9264.39384067393 },
  { month: "2019-10-01", average_square_meter: 9995.16421054621 },
  { month: "2019-11-01", average_square_meter: 9777.06300810549 },
  { month: "2019-12-01", average_square_meter: 9322.06724175423 },
  { month: "2020-01-01", average_square_meter: 9119.21395566644 },
  { month: "2020-02-01", average_square_meter: 10034.6058087279 },
  { month: "2020-03-01", average_square_meter: 10137.4279308372 },
  { month: "2020-04-01", average_square_meter: 8995.88737925164 },
  { month: "2020-05-01", average_square_meter: 9136.74939663993 },
  { month: "2020-06-01", average_square_meter: 10005.7251947283 },
  { month: "2020-07-01", average_square_meter: 9132.14833076118 },
  { month: "2020-08-01", average_square_meter: 9462.52735274594 },
  { month: "2020-09-01", average_square_meter: 8845.58035778083 },
  { month: "2020-10-01", average_square_meter: 8918.951287581 },
  { month: "2020-11-01", average_square_meter: 9325.39766616501 },
  { month: "2020-12-01", average_square_meter: 9742.29589265384 },
  { month: "2021-01-01", average_square_meter: 10888.0662721365 },
  { month: "2021-02-01", average_square_meter: 9960.90977977411 },
  { month: "2021-03-01", average_square_meter: 10838.5345523454 },
  { month: "2021-04-01", average_square_meter: 10932.0897912981 },
  { month: "2021-05-01", average_square_meter: 12136.9073581256 },
  { month: "2021-06-01", average_square_meter: 12026.3452724474 },
  { month: "2021-07-01", average_square_meter: 12282.421287415 },
  { month: "2021-08-01", average_square_meter: 11399.3945963415 },
  { month: "2021-09-01", average_square_meter: 11692.7915725253 },
  { month: "2021-10-01", average_square_meter: 11813.3852843957 },
  { month: "2021-11-01", average_square_meter: 12235.286493535 },
  { month: "2021-12-01", average_square_meter: 13051.1294765224 },
  { month: "2022-01-01", average_square_meter: 13947.557595669 },
  { month: "2022-02-01", average_square_meter: 12629.1804850626 },
  { month: "2022-03-01", average_square_meter: 13673.9413760396 },
  { month: "2022-04-01", average_square_meter: 15436.8688023387 },
  { month: "2022-05-01", average_square_meter: 14919.504108993 },
  { month: "2022-06-01", average_square_meter: 11376.3525925107 },
  { month: "2022-07-01", average_square_meter: 13938.1253462632 },
  { month: "2022-08-01", average_square_meter: 11581.0950175545 },
  { month: "2022-09-01", average_square_meter: 14108.7484304349 },
  { month: "2022-10-01", average_square_meter: 13732.7236465646 },
  { month: "2022-11-01", average_square_meter: 13629.6543717607 },
  { month: "2022-12-01", average_square_meter: 13727.549363903 }
].map(item => ({
  ...item,
  month: format(new Date(item.month), 'MMM yyyy')
}))

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
              <LineChart data={staticPriceHistory}>
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
