import type { CartItem } from '@/lib/types';

const BRAND_COLOR = '#008abf';
const SECONDARY_COLOR = '#432273';

function itemsTable(items: CartItem[]): string {
  const rows = items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:14px;color:#374151;">
          ${item.product.name}
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:14px;color:#374151;text-align:center;">
          ${item.quantity}×
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;font-size:14px;color:#374151;text-align:right;">
          ${(item.product.price * item.quantity).toLocaleString('cs-CZ')} Kč
        </td>
      </tr>`
    )
    .join('');
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      <thead>
        <tr>
          <th style="padding:8px 0;font-size:12px;text-transform:uppercase;color:#9ca3af;text-align:left;">Produkt</th>
          <th style="padding:8px 0;font-size:12px;text-transform:uppercase;color:#9ca3af;text-align:center;">Ks</th>
          <th style="padding:8px 0;font-size:12px;text-transform:uppercase;color:#9ca3af;text-align:right;">Cena</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
}

function paymentLabel(method: string): string {
  if (method === 'cash') return 'Hotově při převzetí';
  if (method === 'bank_transfer') return 'Bankovním převodem';
  return method;
}

export function customerEmailHtml(order: {
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string | null;
  customer_street: string;
  customer_city: string;
  customer_zip: string;
  payment_method: string;
  total: number;
  items: CartItem[];
  notes?: string | null;
}): string {
  return `<!DOCTYPE html>
<html lang="cs">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,${BRAND_COLOR},${SECONDARY_COLOR});padding:36px 40px;text-align:center;">
            <h1 style="margin:0;font-size:28px;font-weight:700;color:#ffffff;letter-spacing:0.05em;">It's Time</h1>
            <p style="margin:6px 0 0;font-size:13px;color:rgba(255,255,255,0.75);letter-spacing:0.1em;text-transform:uppercase;">Prémiová autokosmetika</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:40px;">
            <h2 style="margin:0 0 8px;font-size:22px;color:#111827;">Děkujeme za vaši objednávku!</h2>
            <p style="margin:0 0 24px;font-size:14px;color:#6b7280;">Dobrý den, ${order.customer_name},<br>vaše objednávka byla úspěšně přijata a brzy ji zpracujeme.</p>

            <!-- Order number badge -->
            <div style="background:#f0f9ff;border:1px solid ${BRAND_COLOR};border-radius:8px;padding:16px 20px;margin-bottom:28px;">
              <p style="margin:0;font-size:12px;color:#6b7280;text-transform:uppercase;letter-spacing:0.08em;">Číslo objednávky</p>
              <p style="margin:4px 0 0;font-size:22px;font-weight:700;color:${BRAND_COLOR};">${order.order_number}</p>
            </div>

            <!-- Items -->
            <h3 style="margin:0 0 12px;font-size:15px;color:#374151;">Přehled objednávky</h3>
            ${itemsTable(order.items)}

            <!-- Total -->
            <div style="margin-top:16px;padding:14px 0;border-top:2px solid #111827;display:flex;justify-content:space-between;">
              <span style="font-size:15px;font-weight:700;color:#111827;">Celkem k úhradě</span>
              <span style="font-size:18px;font-weight:700;color:${BRAND_COLOR};">${order.total.toLocaleString('cs-CZ')} Kč</span>
            </div>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:4px;">
              <tr>
                <td style="font-size:14px;font-weight:600;color:#111827;">Celkem k úhradě</td>
                <td style="font-size:16px;font-weight:700;color:${BRAND_COLOR};text-align:right;">${order.total.toLocaleString('cs-CZ')} Kč</td>
              </tr>
            </table>

            <!-- Payment & Delivery -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
              <tr style="background:#f9fafb;">
                <td style="padding:14px 18px;font-size:12px;text-transform:uppercase;color:#9ca3af;font-weight:600;border-bottom:1px solid #e5e7eb;">Způsob platby</td>
                <td style="padding:14px 18px;font-size:14px;color:#374151;border-bottom:1px solid #e5e7eb;text-align:right;">${paymentLabel(order.payment_method)}</td>
              </tr>
              <tr>
                <td style="padding:14px 18px;font-size:12px;text-transform:uppercase;color:#9ca3af;font-weight:600;">Doručovací adresa</td>
                <td style="padding:14px 18px;font-size:14px;color:#374151;text-align:right;">${order.customer_street}, ${order.customer_zip} ${order.customer_city}</td>
              </tr>
            </table>

            ${order.notes ? `<div style="margin-top:20px;padding:14px 18px;background:#fffbeb;border:1px solid #fbbf24;border-radius:8px;font-size:14px;color:#92400e;"><strong>Poznámka:</strong> ${order.notes}</div>` : ''}

            ${order.payment_method === 'bank_transfer' ? `
            <div style="margin-top:24px;padding:18px;background:#f0f9ff;border-radius:8px;border-left:4px solid ${BRAND_COLOR};">
              <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:#111827;">Platební údaje pro převod:</p>
              <p style="margin:0;font-size:13px;color:#374151;line-height:1.7;">
                Částka: <strong>${order.total.toLocaleString('cs-CZ')} Kč</strong><br>
                Variabilní symbol: <strong>${order.order_number}</strong><br>
                Bankovní spojení vám zašleme e-mailem po potvrzení objednávky.
              </p>
            </div>` : ''}

            <p style="margin:28px 0 0;font-size:13px;color:#9ca3af;text-align:center;">V případě dotazů nás kontaktujte na <a href="mailto:xhypextream@gmail.com" style="color:${BRAND_COLOR};">xhypextream@gmail.com</a></p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f9fafb;padding:20px 40px;text-align:center;border-top:1px solid #e5e7eb;">
            <p style="margin:0;font-size:12px;color:#9ca3af;">© ${new Date().getFullYear()} It's Time · Prémiová autokosmetika</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function adminEmailHtml(order: {
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string | null;
  customer_street: string;
  customer_city: string;
  customer_zip: string;
  payment_method: string;
  total: number;
  items: CartItem[];
  notes?: string | null;
}): string {
  return `<!DOCTYPE html>
<html lang="cs">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <tr>
          <td style="background:#111827;padding:24px 40px;">
            <h1 style="margin:0;font-size:20px;font-weight:700;color:#ffffff;">🛍️ Nová objednávka</h1>
            <p style="margin:4px 0 0;font-size:14px;color:${BRAND_COLOR};">${order.order_number}</p>
          </td>
        </tr>

        <tr>
          <td style="padding:32px 40px;">
            <!-- Customer info -->
            <h3 style="margin:0 0 12px;font-size:14px;text-transform:uppercase;color:#9ca3af;letter-spacing:0.08em;">Zákazník</h3>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;margin-bottom:24px;">
              ${[
                ['Jméno', order.customer_name],
                ['Email', order.customer_email],
                ['Telefon', order.customer_phone || '—'],
                ['Adresa', `${order.customer_street}, ${order.customer_zip} ${order.customer_city}`],
                ['Platba', paymentLabel(order.payment_method)],
              ].map(([label, value], i) => `
              <tr style="background:${i % 2 === 0 ? '#f9fafb' : '#ffffff'}">
                <td style="padding:10px 16px;font-size:12px;color:#9ca3af;font-weight:600;width:120px;">${label}</td>
                <td style="padding:10px 16px;font-size:14px;color:#374151;">${value}</td>
              </tr>`).join('')}
            </table>

            <!-- Items -->
            <h3 style="margin:0 0 12px;font-size:14px;text-transform:uppercase;color:#9ca3af;letter-spacing:0.08em;">Položky</h3>
            ${itemsTable(order.items)}

            <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;">
              <tr>
                <td style="font-size:15px;font-weight:700;color:#111827;">Celkem</td>
                <td style="font-size:18px;font-weight:700;color:${BRAND_COLOR};text-align:right;">${order.total.toLocaleString('cs-CZ')} Kč</td>
              </tr>
            </table>

            ${order.notes ? `<div style="margin-top:20px;padding:14px;background:#fffbeb;border:1px solid #fbbf24;border-radius:8px;font-size:14px;color:#92400e;"><strong>Poznámka zákazníka:</strong> ${order.notes}</div>` : ''}

            <div style="margin-top:24px;text-align:center;">
              <a href="https://its-time-shop.vercel.app/admin/objednavky" style="display:inline-block;background:linear-gradient(135deg,${BRAND_COLOR},${SECONDARY_COLOR});color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:6px;font-size:14px;font-weight:600;">Zobrazit v admin panelu →</a>
            </div>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
