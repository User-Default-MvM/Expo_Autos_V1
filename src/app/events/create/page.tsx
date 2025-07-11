'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateEventPage() {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [location, setLocation] = useState('')
  const [carType, setCarType] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido')
      return
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen debe ser menor a 5MB')
      return
    }

    setImageLoading(true)
    setImageFile(file)

    // Crear URL temporal para previsualizar
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setImageUrl(result)
      setImageLoading(false)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImageUrl('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      let finalImageUrl = imageUrl

      // Si hay un archivo seleccionado, podrías subirlo a un servicio de almacenamiento
      // Por ahora, usaremos la URL base64 generada
      if (imageFile && imageUrl) {
        // Aquí puedes implementar la subida a un servicio como Cloudinary, AWS S3, etc.
        // finalImageUrl = await uploadImageToService(imageFile)
        finalImageUrl = imageUrl // Por ahora usamos la URL base64
      }

      const response = await fetch('/api/events', {
        method: 'POST',
        body: JSON.stringify({ 
          title, 
          date: new Date(date).toISOString(), 
          location, 
          carType, 
          imageUrl: finalImageUrl || null 
        }),
        headers: { 'Content-Type': 'application/json' },
      })

      if (response.ok) {
        const event = await response.json()
        // Redirigir al evento creado
        router.push(`/events/${event.id}`)
      } else {
        const errorData = await response.json()
        console.error('Error al crear el evento:', errorData)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl mb-4 font-bold text-black">Crear Evento</h1>
      
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título"
        className="block mb-4 border p-2 w-full rounded text-black placeholder-gray-500"
        required
      />
      
      <input
        type="datetime-local"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="block mb-4 border p-2 w-full rounded text-black"
        required
      />
      
      <input
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Ubicación"
        className="block mb-4 border p-2 w-full rounded text-black placeholder-gray-500"
        required
      />
      
      <input
        value={carType}
        onChange={(e) => setCarType(e.target.value)}
        placeholder="Tipo de auto"
        className="block mb-4 border p-2 w-full rounded text-black placeholder-gray-500"
        required
      />
      
      {/* Selector de imagen */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-black mb-2">
          Imagen del evento
        </label>
        
        {/* Previsualización de imagen */}
        {imageUrl && (
          <div className="relative mb-4">
            <img
              src={imageUrl}
              alt="Vista previa"
              className="w-full h-48 object-cover rounded-lg border"
            />
            {imageLoading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        
        {/* Botón/área de selección */}
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="image-upload"
            className={`flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors ${
              imageUrl ? 'border-blue-400 bg-blue-50' : ''
            }`}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="mb-2 text-sm text-black">
                <span className="font-semibold">Haz clic para subir</span> o arrastra una imagen
              </p>
              <p className="text-xs text-black">PNG, JPG, GIF (MAX. 5MB)</p>
            </div>
            <input
              id="image-upload"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </label>
        </div>
        
        {/* Información del archivo */}
        {imageFile && (
          <div className="mt-2 text-sm text-black">
            <p>Archivo: {imageFile.name}</p>
            <p>Tamaño: {(imageFile.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        )}
      </div>
      
      <button 
        type="submit" 
        disabled={loading || imageLoading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 w-full hover:bg-blue-700 transition-colors"
      >
        {loading ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  )
}