import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

function generateOrderNumber(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.floor(1000 + Math.random() * 9000);
  return `IT-${date}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      customer_name,
      customer_email,
      customer_phone,
      customer_street,
      customer_city,
      customer_zip,
      payment_method,
      total,
      items,
      notes,
    } = body;

    if (!customer_name || !customer_email || !customer_street || !customer_city || !customer_zip || !payment_method) {
      return NextResponse.json({ success: false, error: 'Chybí povinné údaje' }, { status: 400 });
    }

    const order_number = generateOrderNumber();

    const admin = supabaseAdmin();
    const { data, error } = await admin
      .from('orders')
      .insert({
        order_number,
        customer_name,
        customer_email,
        customer_phone: customer_phone || null,
        customer_street,
        customer_city,
        customer_zip,
        payment_method,
        total,
        items,
        notes: notes || null,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ success: false, error: 'Chyba při ukládání objednávky' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      orderId: data.id,
      orderNumber: order_number,
    });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ success: false, error: 'Interní chyba serveru' }, { status: 500 });
  }
}
