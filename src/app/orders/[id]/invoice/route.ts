import { prisma } from '@/lib/prisma'

export async function GET(req: Request, ctx: any) {
  const id = ctx.params.id
  const { searchParams } = new URL(req.url)
  const shouldAutoPrint = searchParams.get('print') === '1'
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      items: { include: { variant: { include: { product: true } }, size: true } },
    },
  })
  if (!order) return new Response('Not Found', { status: 404 })

  const lines = order.items.map((it) => ({
    name: `${it.variant.product.brand} ${it.variant.product.name} · ${it.variant.colorName} · ${it.size.label}`,
    qty: it.quantity,
    price: it.unitPrice,
    total: it.unitPrice * it.quantity,
  }))

  const now = new Date().toLocaleString()

  const html = `<!doctype html>
  <html lang="fr"><head><meta charset="utf-8"/>
  <title>Facture ${id}</title>
  <style>
    body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;}
    .container{max-width:720px;margin:40px auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px}
    h1{font-size:20px;margin:0 0 8px}
    table{width:100%;border-collapse:collapse;margin-top:16px}
    th,td{border-bottom:1px solid #e5e7eb;padding:8px;text-align:left;font-size:14px}
    tfoot td{font-weight:600}
    .muted{color:#64748b;font-size:12px}
    @media print { .no-print { display:none } .container{border:none;margin:0} }
  </style></head><body>
  <div class="container">
    <h1>Facture #${id.slice(-8)}</h1>
    <div class="muted">Date: ${now}</div>
    <div class="muted">Client: ${order.user.email}</div>
    <button class="no-print" onclick="window.print()" style="margin-top:8px;padding:8px 12px;border:1px solid #e5e7eb;border-radius:8px;background:#111827;color:white">Imprimer</button>
    <table>
      <thead><tr><th>Article</th><th>Qté</th><th>Prix</th><th>Total</th></tr></thead>
      <tbody>
        ${lines.map(l => `<tr><td>${l.name}</td><td>${l.qty}</td><td>${l.price.toFixed(2)} EUR</td><td>${l.total.toFixed(2)} EUR</td></tr>`).join('')}
      </tbody>
      <tfoot>
        <tr><td colspan="3">Total</td><td>${order.total.toFixed(2)} EUR</td></tr>
      </tfoot>
    </table>
    <p class="muted">Boutique: Adam'sneakers — Paiement simulé — Non transmissible</p>
  </div>
  ${shouldAutoPrint ? '<script>window.addEventListener("load",()=>setTimeout(()=>window.print(),150))</script>' : ''}
  </body></html>`

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  })
}


