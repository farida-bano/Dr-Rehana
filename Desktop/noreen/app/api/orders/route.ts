import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { addressId, phone, notes, paymentMethod, totalAmount, items } = body;

    // Validate required fields
    if (!addressId || !phone || !totalAmount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create order in database
    const order = await prisma.order.create({
      data: {
        userId,
        addressId,
        totalAmount,
        status: 'pending',
        paymentMethod: paymentMethod || 'cod',
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
        notes,
        items: {
          create: items.map((item: any) => ({
            quantity: item.quantity,
            price: item.price,
            menuItem: {
              connectOrCreate: {
                where: { slug: item.name.toLowerCase().replace(/\s+/g, '-') },
                create: {
                  name: item.name,
                  slug: item.name.toLowerCase().replace(/\s+/g, '-'),
                  price: item.price,
                  category: {
                    connectOrCreate: {
                      where: { slug: 'other' },
                      create: {
                        name: 'Other',
                        slug: 'other',
                      },
                    },
                  },
                },
              },
            },
          })),
        },
      },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    return NextResponse.json({
      id: order.id,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      status: order.status,
      createdAt: order.createdAt,
    });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
        address: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
