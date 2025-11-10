"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { searchLocation } from "@/app/actions/geocoding"

interface GeocoderProps {
  onLocationSelect: (location: { longitude: number; latitude: number; name: string }) => void
  placeholder?: string
  buttonText?: string
  onError?: (message: string) => void
}

export function Geocoder({
  onLocationSelect,
  placeholder = "Buscar endereço...",
  buttonText = "Buscar",
  onError,
}: GeocoderProps) {
  const [query, setQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const { toast } = useToast()

  const handleSearch = async () => {
    if (!query.trim()) return

    setIsLoading(true)

    try {
      const searchResults = await searchLocation(query)

      if (searchResults && searchResults.length > 0) {
        setResults(searchResults)
      } else {
        setResults([])
        toast({
          title: "Nenhum resultado encontrado",
          description: "Tente um endereço diferente ou mais específico.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro na busca de localização:", error)
      setResults([])
      onError && onError("Não foi possível buscar endereços. Por favor, tente inserir manualmente.")
      toast({
        title: "Erro na busca",
        description: "Não foi possível buscar o endereço. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelect = (result: any) => {
    onLocationSelect({
      longitude: result.center[0],
      latitude: result.center[1],
      name: result.place_name,
    })
    setResults([])
    setQuery("")
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button onClick={handleSearch} disabled={isLoading}>
          {isLoading ? "Buscando..." : buttonText}
        </Button>
      </div>

      {results.length > 0 && (
        <Card className="absolute z-10 w-full max-w-md mt-1">
          <CardContent className="p-2">
            <ul className="space-y-1">
              {results.map((result) => (
                <li
                  key={result.id}
                  className="p-2 hover:bg-muted rounded cursor-pointer flex items-start gap-2"
                  onClick={() => handleSelect(result)}
                >
                  <Search className="h-4 w-4 mt-1 flex-shrink-0" />
                  <span className="text-sm">{result.place_name}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
