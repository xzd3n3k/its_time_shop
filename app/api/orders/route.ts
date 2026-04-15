import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { supabaseAdmin } from '@/lib/supabase';
import { customerEmailHtml, adminEmailHtml } from '@/lib/emails/templates';

const FROM = "It's Time <onboarding@resend.dev>";
const ADMIN_EMAIL = process.env.ORDER_EMAIL ?? 'xhypextream@gmail.com';

function generateOrderNumber(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
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

    // Uložit objednávku
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

    const orderData = {
      order_number,
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
    };

    // Odeslat emaily paralelně
    const resend = new Resend(process.env.RESEND_API_KEY);
    await Promise.allSettled([
      // Potvrzení zákazníkovi
      resend.emails.send({
        from: FROM,
        to: [customer_email],
        subject: `Potvrzení objednávky ${order_number} – It's Time`,
        html: customerEmailHtml(orderData),
      }),
      // Notifikace adminovi
      resend.emails.send({
        from: FROM,
        to: [ADMIN_EMAIL],
        subject: `Nová objednávka ${order_number} – ${customer_name} (${total.toLocaleString('cs-CZ')} Kč)`,
        html: adminEmailHtml(orderData),
      }),
    ]);

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
