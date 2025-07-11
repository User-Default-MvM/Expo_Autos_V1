// src/app/events/[id]/page.tsx
import { notFound } from 'next/navigation'
import { prisma } from '@/app/lib/prisma'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params
  const eventId = Number(id)

  if (!eventId || isNaN(eventId)) {
    notFound()
  }

  const event = await prisma.event.findUnique({
    where: { id: eventId },
  })

  if (!event) {
    notFound()
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
      <div className="space-y-2">
        <p><strong>Fecha:</strong> {new Date(event.date).toLocaleDateString()}</p>
        <p><strong>Ubicación:</strong> {event.location}</p>
        <p><strong>Tipo de Auto:</strong> {event.carType}</p>
        {event.imageUrl && (
          <div className="mt-4">
            <img 
              src={event.imageUrl} 
              alt={event.title}
              className="max-w-full h-auto rounded"
            />
          </div>
        )}
      </div>
    </div>
  )
}