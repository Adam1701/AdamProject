import { NextRequest } from 'next/server'
import { bus } from '@/lib/bus'

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder()
  
  const stream = new ReadableStream({
    start(controller) {
      // Envoyer un message de test toutes les 30 secondes
      const interval = setInterval(() => {
        const data = JSON.stringify({
          type: 'ping',
          timestamp: new Date().toISOString()
        })
        
        controller.enqueue(
          encoder.encode(`data: ${data}\n\n`)
        )
      }, 30000)

      const onUpdate = (payload: { id: string; quantity: number }) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'stock_update', stockId: payload.id, quantity: payload.quantity })}\n\n`)
        )
      }
      const onCreate = (payload: { id: string }) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'stock_create', stockId: payload.id })}\n\n`)
        )
      }
      const onDelete = (payload: { id: string }) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'stock_delete', stockId: payload.id })}\n\n`)
        )
      }

      bus.on('stock:update', onUpdate as any)
      bus.on('stock:create', onCreate as any)
      bus.on('stock:delete', onDelete as any)

      // Nettoyer l'intervalle quand la connexion se ferme
      request.signal.addEventListener('abort', () => {
        clearInterval(interval)
        bus.off('stock:update', onUpdate as any)
        bus.off('stock:create', onCreate as any)
        bus.off('stock:delete', onDelete as any)
        controller.close()
      })
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}