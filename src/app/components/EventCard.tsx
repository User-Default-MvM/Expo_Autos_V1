"use client";

// app/components/EventCard.tsx
import { useState, useRef } from 'react';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  carType: string;
  imageUrl: string;
  organizer: string;
  maxParticipants: number;
  currentParticipants: number;
  price: number;
  category: string;
}

interface EventCardProps {
  event: Event;
  onImageChange?: (eventId: number, imageUrl: string) => void;
  onDelete?: (eventId: number) => void;
  editable?: boolean;
  deletable?: boolean;
}

export default function EventCard({ 
  event, 
  onImageChange, 
  onDelete,
  editable = false,
  deletable = false
}: EventCardProps) {
  const [currentImageUrl, setCurrentImageUrl] = useState(event.imageUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido');
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen debe ser menor a 5MB');
      return;
    }

    setIsLoading(true);

    // Crear URL temporal para previsualizar
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setCurrentImageUrl(imageUrl);
      setIsLoading(false);
      
      // Llamar callback si existe
      if (onImageChange) {
        onImageChange(event.id, imageUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleImageClick = () => {
    if (editable && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDelete = async () => {
    const isConfirmed = window.confirm(
      `¿Estás seguro de que quieres eliminar el evento "${event.title}"?\n\nEsta acción no se puede deshacer.`
    );
    
    if (!isConfirmed) return;

    setIsDeleting(true);
    
    try {
      const response = await fetch(`/api/events/${event.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Llamar callback si existe
        if (onDelete) {
          onDelete(event.id);
        }
      } else {
        const errorData = await response.json();
        alert(`Error al eliminar el evento: ${errorData.error || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('Error al eliminar evento:', error);
      alert('Error al eliminar el evento');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img 
          src={currentImageUrl} 
          alt={event.title}
          className={`w-full h-48 object-cover ${
            editable ? 'cursor-pointer hover:opacity-90' : ''
          }`}
          onClick={handleImageClick}
        />
        
        {/* Overlay de carga */}
        {isLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
        
        {/* Icono de edición */}
        {editable && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-all">
            <svg 
              className="w-4 h-4 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" 
              />
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" 
              />
            </svg>
          </div>
        )}
        
        {/* Botón de eliminar */}
        {deletable && (
          <div className="absolute top-2 left-2 bg-red-500 bg-opacity-80 rounded-full p-2 hover:bg-opacity-100 transition-all">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center justify-center"
              title="Eliminar evento"
            >
              {isDeleting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <svg 
                  className="w-4 h-4 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                  />
                </svg>
              )}
            </button>
          </div>
        )}
        
        {/* Input de archivo oculto */}
        {editable && (
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
        )}
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
            {event.category}
          </span>
        </div>
        <h3 className="text-xl text-black font-semibold mb-2">{event.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
        <div className="space-y-2 text-sm text-gray-500">
          <p>📅 {new Date(event.date).toLocaleDateString()}</p>
          <p>📍 {event.location}</p>
          <p>🚗 {event.carType}</p>
          <p>👤 {event.organizer}</p>
          <p>👥 {event.currentParticipants}/{event.maxParticipants} participantes</p>
        </div>
        
        {/* Botón de eliminar en la parte inferior como alternativa */}
        {deletable && (
          <div className="mt-4 pt-4 border-t">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Eliminando...
                </>
              ) : (
                <>
                  <svg 
                    className="w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                    />
                  </svg>
                  Eliminar Evento
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}