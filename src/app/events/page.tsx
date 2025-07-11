'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import EventCard from '../components/EventCard';

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
  createdAt: string;
  updatedAt: string;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);

  // Estados para los filtros
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedCarType, setSelectedCarType] = useState('Todos');
  const [locationFilter, setLocationFilter] = useState('');

  // Cargar eventos
  useEffect(() => {
    fetchEvents();
  }, []);

  // Aplicar filtros cuando cambien los estados de filtros o eventos
  useEffect(() => {
    applyFilters();
  }, [events, selectedCategory, selectedCarType, locationFilter]);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...events];

    // Filtrar por categoría
    if (selectedCategory !== 'Todos') {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    // Filtrar por tipo de vehículo
    if (selectedCarType !== 'Todos') {
      filtered = filtered.filter(event => event.carType === selectedCarType);
    }

    // Filtrar por ubicación (búsqueda parcial, insensible a mayúsculas)
    if (locationFilter.trim() !== '') {
      filtered = filtered.filter(event => 
        event.location.toLowerCase().includes(locationFilter.toLowerCase().trim())
      );
    }

    setFilteredEvents(filtered);
  };

  const handleDeleteClick = (event: Event) => {
    setEventToDelete(event);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!eventToDelete) return;

    setDeleteLoading(eventToDelete.id);
    try {
      const response = await fetch(`/api/events/${eventToDelete.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remover el evento de la lista local
        setEvents(events.filter(event => event.id !== eventToDelete.id));
        setShowDeleteModal(false);
        setEventToDelete(null);
      } else {
        alert('Error al eliminar el evento');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Error al eliminar el evento');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setEventToDelete(null);
  };

  const clearFilters = () => {
    setSelectedCategory('Todos');
    setSelectedCarType('Todos');
    setLocationFilter('');
  };

  const categories = ['Todos', 'Exposiciones', 'Encuentros', 'Competencias', 'Técnicos'];
  const carTypes = ['Todos', 'Tuning', 'Clásicos', 'Deportivos', 'Exóticos', 'Modificados'];

  // Contar filtros activos
  const activeFiltersCount = [
    selectedCategory !== 'Todos',
    selectedCarType !== 'Todos',
    locationFilter.trim() !== ''
  ].filter(Boolean).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-black">Cargando eventos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-black py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-black">
              Eventos Automotrices
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-black">
              Descubre, participa y conecta con la comunidad automotriz más activa de Colombia
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/events/create"
                className="bg-white text-red-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Crear Evento
              </Link>
              <Link 
                href="/comunidad"
                className="bg-transparent border-2 border-white text-black font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-red-600 transition-colors inline-flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Ir a Comunidad
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 bg-white text-black border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Categoría
              </label>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Tipo de Vehículo
              </label>
              <select 
                value={selectedCarType}
                onChange={(e) => setSelectedCarType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
              >
                {carTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Ubicación
              </label>
              <input 
                type="text" 
                placeholder="Ciudad o región"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
              />
            </div>
          </div>
          
          {/* Filtros activos y botón limpiar */}
          {activeFiltersCount > 0 && (
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {activeFiltersCount} filtro{activeFiltersCount > 1 ? 's' : ''} activo{activeFiltersCount > 1 ? 's' : ''}
                </span>
                <div className="flex gap-2">
                  {selectedCategory !== 'Todos' && (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                      {selectedCategory}
                    </span>
                  )}
                  {selectedCarType !== 'Todos' && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {selectedCarType}
                    </span>
                  )}
                  {locationFilter.trim() !== '' && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      {locationFilter}
                    </span>
                  )}
                </div>
              </div>
              <button 
                onClick={clearFilters}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Events List */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h4a1 1 0 011 1v2a1 1 0 01-1 1h-1v10a2 2 0 01-2 2H6a2 2 0 01-2-2V11H3a1 1 0 01-1-1V8a1 1 0 011-1h4z" />
                </svg>
                <h3 className="text-2xl font-bold text-black mb-4">
                  {events.length === 0 ? 'No hay eventos disponibles' : 'No se encontraron eventos'}
                </h3>
                <p className="text-black text-lg mb-8">
                  {events.length === 0 
                    ? '¡Sé el primero en crear un evento y conectar con la comunidad automotriz!'
                    : 'Prueba ajustando los filtros para encontrar eventos que coincidan con tu búsqueda.'
                  }
                </p>
                {events.length === 0 ? (
                  <Link 
                    href="/events/create"
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Crear Primer Evento
                  </Link>
                ) : (
                  <button 
                    onClick={clearFilters}
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4l16 16m0-16L4 20" />
                    </svg>
                    Limpiar Filtros
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-black">
                  {activeFiltersCount > 0 ? 'Eventos Filtrados' : 'Próximos Eventos'} ({filteredEvents.length})
                </h2>
                <div className="flex gap-2">
                  <button className="p-2 text-black hover:text-red-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                  <button className="p-2 text-black hover:text-red-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredEvents.map(event => (
                  <div key={event.id} className="relative">
                    <EventCard event={event} />
                    
                    {/* Botones de administración */}
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Link
                        href={`/events/${event.id}/edit`}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors shadow-lg"
                        title="Editar evento"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>
                      
                      <button
                        onClick={() => handleDeleteClick(event)}
                        disabled={deleteLoading === event.id}
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors shadow-lg disabled:opacity-50"
                        title="Eliminar evento"
                      >
                        {deleteLoading === event.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-red-600 mb-2">
                {filteredEvents.length}
              </div>
              <div className="text-black">Eventos {activeFiltersCount > 0 ? 'Filtrados' : 'Activos'}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-red-600 mb-2">
                {filteredEvents.reduce((acc, event) => acc + (event.currentParticipants || 0), 0)}
              </div>
              <div className="text-black">Participantes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-red-600 mb-2">
                {new Set(filteredEvents.map(e => e.location)).size}
              </div>
              <div className="text-black">Ciudades</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-red-600 mb-2">
                {new Set(filteredEvents.map(e => e.organizer)).size}
              </div>
              <div className="text-black">Organizadores</div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal de Confirmación de Eliminación */}
      {showDeleteModal && eventToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-black">
                  Confirmar Eliminación
                </h3>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-black">
                ¿Estás seguro de que quieres eliminar el evento "{eventToDelete.title}"? 
                Esta acción no se puede deshacer.
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleDeleteCancel}
                className="px-4 py-2 text-sm font-medium text-black bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteLoading !== null}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50"
              >
                {deleteLoading ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}