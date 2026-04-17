import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  const { orderNumber } = await params;

  if (!orderNumber || orderNumber.length < 5) {
    return NextResponse.json({ success: false, error: 'Neplatné číslo objednávky' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('orders')
    .select('order_number, status, payment_method, total, items, created_at')
    .eq('order_number', orderNumber.trim())
    .single();

  if (error || !data) {
    return NextResponse.json({ success: false, error: 'Objednávka nenalezena' }, { status: 404 });
  }

  return NextResponse.json({ success: true, order: data });
}
