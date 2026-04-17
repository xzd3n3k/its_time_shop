import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import QRCode from 'qrcode';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { customerEmailHtml, adminEmailHtml } from '@/lib/emails/templates';

function czechAccountToIBAN(account: string): string | null {
  const match = account.trim().replace(/\s/g, '').match(/^(?:(\d+)-)?(\d+)\/(\d{4})$/);
  if (!match) return null;
  const prefix = (match[1] ?? '0').padStart(6, '0');
  const number = match[2].padStart(10, '0');
  const bankCode = match[3];
  const bban = `${bankCode}${prefix}${number}`;
  const mod = BigInt(`${bban}123500`) % BigInt(97);
  const checkDigits = String(BigInt(98) - mod).padStart(2, '0');
  return `CZ${checkDigits}${bban}`;
}

function formatIBAN(iban: string): string {
  return iban.replace(/(.{4})/g, '$1 ').trim();
}

function orderToVS(orderNumber: string): string {
  return orderNumber.replace(/\D/g, '').slice(-10);
}

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

    let bank_account: string | null = null;
    let iban: string | null = null;
    let vs: string | null = null;
    let payment_qr: string | null = null;

    if (payment_method === 'bank_transfer') {
      const { data: settings } = await supabase.from('settings').select('bank_account').eq('id', 1).single();
      bank_account = settings?.bank_account ?? null;
      if (bank_account) {
        const raw = bank_account.trim();
        iban = raw.toUpperCase().startsWith('CZ')
          ? raw.replace(/\s/g, '')
          : czechAccountToIBAN(raw);
      }
      vs = orderToVS(order_number);
      if (iban && total > 0) {
        try {
          const spd = [
            'SPD*1.0',
            `ACC:${iban}`,
            `AM:${total.toFixed(2)}`,
            'CC:CZK',
            `X-VS:${vs}`,
            `MSG:Objednavka ${order_number}`.slice(0, 67),
          ].join('*');
          payment_qr = await QRCode.toDataURL(spd, {
            errorCorrectionLevel: 'M',
            margin: 1,
            width: 200,
            color: { dark: '#1a1a1a', light: '#ffffff' },
          });
        } catch {
          payment_qr = null;
        }
      }
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
      bank_account,
      iban: iban ? formatIBAN(iban) : null,
      vs,
      payment_qr,
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
