// src/app/api/events/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { unlink } from 'fs/promises'
import path from 'path'
import { prisma } from '@/app/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = parseInt(params.id)
    
    if (isNaN(eventId)) {
      return NextResponse.json({ error: 'ID de evento inválido' }, { status: 400 })
    }

    // Obtener la información del evento antes de eliminarlo
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    })

    if (!event) {
      return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 })
    }

    // Si el evento tiene una imagen subida, eliminarla del servidor
    if (event.imageUrl && event.imageUrl.startsWith('/uploads/')) {
      try {
        const fileName = event.imageUrl.replace('/uploads/', '')
        const filePath = path.join(process.cwd(), 'public', 'uploads', fileName)
        await unlink(filePath)
      } catch (fileError) {
        console.warn('No se pudo eliminar la imagen:', fileError)
      }
    }

    // Eliminar el evento de la base de datos
    await prisma.event.delete({
      where: { id: eventId }
    })

    console.log(`Evento ${eventId} eliminado exitosamente`)
    return NextResponse.json({ 
      message: 'Evento eliminado exitosamente',
      id: eventId 
    })
  } catch (error) {
    console.error('Error al eliminar evento:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = parseInt(params.id)
    
    if (isNaN(eventId)) {
      return NextResponse.json({ error: 'ID de evento inválido' }, { status: 400 })
    }

    // Obtener evento específico de la base de datos
    const event = await prisma.event.findUnique({
      where: { id: eventId }
    })

    if (!event) {
      return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 })
    }

    return NextResponse.json(event)
  } catch (error) {
    console.error('Error al obtener evento:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const eventId = parseInt(params.id)
    
    if (isNaN(eventId)) {
      return NextResponse.json({ error: 'ID de evento inválido' }, { status: 400 })
    }

    const body = await request.json()
    const { title, date, location, carType, imageUrl } = body

    // Verificar que el evento existe
    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId }
    })

    if (!existingEvent) {
      return NextResponse.json({ error: 'Evento no encontrado' }, { status: 404 })
    }

    // Actualizar el evento
    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        title: title || existingEvent.title,
        date: date || existingEvent.date,
        location: location || existingEvent.location,
        carType: carType || existingEvent.carType,
        imageUrl: imageUrl !== undefined ? imageUrl : existingEvent.imageUrl,
      }
    })

    return NextResponse.json(updatedEvent)
  } catch (error) {
    console.error('Error al actualizar evento:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}