'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Calendar, MapPin, Car, Edit, Save, X } from 'lucide-react'
import { toast } from 'sonner'

interface Event {
  id: string
  titulo: string
  fecha: string
  ubicacion: string
  tipoCarro: string
  descripcion?: string
}

const tiposCarros = [
  'Sedán',
  'SUV',
  'Hatchback',
  'Deportivo',
  'Clásico',
  'Eléctrico',
  'Híbrido',
  'Pick-up',
  'Convertible',
  'Todos los tipos'
]

export default function EditarEventoPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(false)
  const [evento, setEvento] = useState<Event>({
    id: '',
    titulo: '',
    fecha: '',
    ubicacion: '',
    tipoCarro: '',
    descripcion: ''
  })

  // Simular carga de datos del evento
  useEffect(() => {
    const cargarEvento = async () => {
      try {
        setLoading(true)
        
        // Aquí harías la llamada a tu API para obtener el evento
        // const response = await fetch(`/api/eventos/${params.id}`)
        // const eventoData = await response.json()
        
        // Simulando datos del evento existente
        const eventoMock: Event = {
          id: params.id as string,
          titulo: 'Expo Carros Clásicos 2025',
          fecha: '2025-08-15',
          ubicacion: 'Centro de Convenciones Bogotá',
          tipoCarro: 'Clásico',
          descripcion: 'Una exposición dedicada a los automóviles clásicos más espectaculares.'
        }
        
        setEvento(eventoMock)
      } catch (error) {
        console.error('Error al cargar evento:', error)
        toast.error('Error al cargar el evento')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      cargarEvento()
    }
  }, [params.id])

  const handleInputChange = (field: keyof Event, value: string) => {
    setEvento(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validaciones básicas
      if (!evento.titulo || !evento.fecha || !evento.ubicacion || !evento.tipoCarro) {
        toast.error('Por favor completa todos los campos obligatorios')
        return
      }

      // Aquí harías la llamada a tu API para actualizar el evento
      // const response = await fetch(`/api/eventos/${evento.id}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(evento),
      // })

      // if (!response.ok) {
      //   throw new Error('Error al actualizar evento')
      // }

      // Simulando éxito
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Evento actualizado exitosamente')
      router.push('/eventos')
    } catch (error) {
      console.error('Error al actualizar evento:', error)
      toast.error('Error al actualizar el evento')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/eventos')
  }

  if (loading && !evento.titulo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando evento...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Edit className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Editar Evento</h1>
              <p className="text-gray-600">Modifica los detalles del evento de ExpoAuto</p>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Información del Evento
            </CardTitle>
            <CardDescription>
              Actualiza los detalles del evento automotriz
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Título */}
              <div className="space-y-2">
                <Label htmlFor="titulo">Título del Evento *</Label>
                <Input
                  id="titulo"
                  type="text"
                  value={evento.titulo}
                  onChange={(e) => handleInputChange('titulo', e.target.value)}
                  placeholder="Ej: Expo Carros Deportivos 2025"
                  required
                />
              </div>

              {/* Fecha y Ubicación */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fecha" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Fecha del Evento *
                  </Label>
                  <Input
                    id="fecha"
                    type="date"
                    value={evento.fecha}
                    onChange={(e) => handleInputChange('fecha', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ubicacion" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Ubicación *
                  </Label>
                  <Input
                    id="ubicacion"
                    type="text"
                    value={evento.ubicacion}
                    onChange={(e) => handleInputChange('ubicacion', e.target.value)}
                    placeholder="Ej: Centro de Convenciones"
                    required
                  />
                </div>
              </div>

              {/* Tipo de Carro */}
              <div className="space-y-2">
                <Label htmlFor="tipoCarro" className="flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  Tipo de Carro *
                </Label>
                <Select
                  value={evento.tipoCarro}
                  onValueChange={(value) => handleInputChange('tipoCarro', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo de carro" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposCarros.map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Descripción */}
              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={evento.descripcion}
                  onChange={(e) => handleInputChange('descripcion', e.target.value)}
                  placeholder="Describe el evento (opcional)"
                  rows={4}
                />
              </div>

              {/* Botones */}
              <div className="flex gap-4 pt-4">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Guardando...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Actualizar Evento
                    </div>
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Información adicional */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Información sobre ExpoAuto</h3>
          <p className="text-blue-700 text-sm">
            Los eventos de ExpoAuto son experiencias únicas para los amantes de los automóviles. 
            Asegúrate de proporcionar información precisa para que los asistentes tengan la mejor experiencia posible.
          </p>
        </div>
      </div>
    </div>
  )
}