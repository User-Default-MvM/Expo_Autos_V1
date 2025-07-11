import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, date, location, carType, imageUrl, category } = body

    // Validar campos requeridos
    if (!title || !date || !location || !carType || !category) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos: title, date, location, carType, category' },
        { status: 400 }
      )
    }

    const event = await prisma.event.create({
      data: {
        title,
        date: new Date(date),
        location,
        carType,
        imageUrl: imageUrl || '',
        category,
      },
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: 'asc' },
    })
    return NextResponse.json(events)
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
