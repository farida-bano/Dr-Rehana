import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { orderId, amount, phone } = body;

    if (!orderId || !amount || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // TODO: Integrate with JazzCash API
    // For now, return a mock response
    const transactionId = `JZ-${Date.now()}`;

    return NextResponse.json({
      success: true,
      transactionId,
      orderId,
      amount,
      status: 'pending',
      message: 'JazzCash integration coming soon. Please use Cash on Delivery for now.',
    });
  } catch (error) {
    console.error('JazzCash payment error:', error);
    return NextResponse.json(
      { error: 'Failed to process JazzCash payment' },
      { status: 500 }
    );
  }
}
