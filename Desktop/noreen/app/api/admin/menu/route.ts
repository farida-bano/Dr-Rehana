import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const menuItems = await prisma.menuItem.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(menuItems);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu items' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { name, price, description, image, isAvailable } = body;

    if (!name || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get or create default category
    let category = await prisma.category.findFirst({
      where: { slug: 'other' },
    });

    if (!category) {
      category = await prisma.category.create({
        data: {
          name: 'Other',
          slug: 'other',
        },
      });
    }

    const menuItem = await prisma.menuItem.create({
      data: {
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        price,
        description,
        image,
        isAvailable: isAvailable ?? true,
        categoryId: category.id,
      },
      include: { category: true },
    });

    return NextResponse.json(menuItem);
  } catch (error) {
    console.error('Error creating menu item:', error);
    return NextResponse.json(
      { error: 'Failed to create menu item' },
      { status: 500 }
    );
  }
}
