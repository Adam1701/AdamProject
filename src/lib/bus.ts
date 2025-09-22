import { EventEmitter } from 'events'

type Events = {
  'stock:update': { id: string; quantity: number }
  'stock:create': { id: string }
  'stock:delete': { id: string }
}

class TypedBus {
  private emitter = new EventEmitter()
  on<K extends keyof Events>(event: K, listener: (payload: Events[K]) => void) {
    this.emitter.on(event, listener as any)
  }
  off<K extends keyof Events>(event: K, listener: (payload: Events[K]) => void) {
    this.emitter.off(event, listener as any)
  }
  emit<K extends keyof Events>(event: K, payload: Events[K]) {
    this.emitter.emit(event, payload)
  }
}

export const bus = (global as any).__stock_bus__ || new TypedBus()
if (!(global as any).__stock_bus__) (global as any).__stock_bus__ = bus

export function emitStockUpdate(id: string, quantity: number) {
  bus.emit('stock:update', { id, quantity })
}
export function emitStockCreate(id: string) {
  bus.emit('stock:create', { id })
}
export function emitStockDelete(id: string) {
  bus.emit('stock:delete', { id })
}
