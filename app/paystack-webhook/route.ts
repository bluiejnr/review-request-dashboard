import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY || '')
      .update(body)
      .digest('hex');

    const paystackSignature = req.headers.get('x-paystack-signature');

    // Verify the request actually came from Paystack
    if (hash !== paystackSignature) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(body);

    // Handle successful payment event
    if (event.event === 'charge.success') {
      const customerEmail = event.data.customer.email;
      const amountPaid = event.data.amount / 100;
      const reference = event.data.reference;

      console.log(`Payment confirmed via Webhook for ${customerEmail}! Amount: ${amountPaid}, Ref: ${reference}`);

      // TODO: Update database record (e.g., set user.subscription = 'Pro')
    }

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ message: 'Webhook handler failed' }, { status: 500 });
  }
}