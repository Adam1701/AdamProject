'use client'
import { useState, useEffect } from 'react'

interface Stock {
  id: string
  quantity: number
  variant: {
    id: string
    colorName: string
    product: {
      id: string
      name: string
      brand: string
    }
  }
  size: {
    id: string
    label: string
    category: string
  }
}

export default function StocksClient() {
  const [stocks, setStocks] = useState<Stock[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newStock, setNewStock] = useState({ variantId: '', sizeId: '', quantity: 0 })
  const [variantQuery, setVariantQuery] = useState('')
  const [sizeQuery, setSizeQuery] = useState('')
  const [variantOptions, setVariantOptions] = useState<Array<{ id: string; label: string }>>([])
  const [sizeOptions, setSizeOptions] = useState<Array<{ id: string; label: string }>>([])
  const [filters, setFilters] = useState({ q: '', category: '' as '' | 'men' | 'women' | 'kids', minQty: '', maxQty: '' })

  useEffect(() => {
    fetchStocks()
    
    // SSE pour les mises à jour en temps réel
    const eventSource = new EventSource('/api/stocks/sse')
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'stock_update') {
        setStocks(prev => prev.map(stock => 
          stock.id === data.stockId 
            ? { ...stock, quantity: data.quantity }
            : stock
        ))
      }
    }

    return () => eventSource.close()
  }, [])

  const fetchStocks = async () => {
    try {
      const qs = new URLSearchParams()
      if (filters.q) qs.set('q', filters.q)
      if (filters.category) qs.set('category', filters.category)
      if (filters.minQty) qs.set('minQty', filters.minQty)
      if (filters.maxQty) qs.set('maxQty', filters.maxQty)
      const res = await fetch(`/api/stocks?${qs.toString()}`)
      const data = await res.json()
      setStocks(data)
    } catch (error) {
      console.error('Erreur lors du chargement des stocks:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStock = async (stockId: string, quantity: number) => {
    try {
      const res = await fetch('/api/stock', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stockId, quantity })
      })
      
      if (res.ok) {
        setStocks(prev => prev.map(stock => 
          stock.id === stockId 
            ? { ...stock, quantity }
            : stock
        ))
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
    }
  }

  const createStock = async () => {
    try {
      setCreating(true)
      const res = await fetch('/api/stock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStock)
      })
      if (res.ok) {
        await fetchStocks()
        setNewStock({ variantId: '', sizeId: '', quantity: 0 })
      } else {
        const err = await res.json().catch(() => ({}))
        alert(err.error || 'Erreur lors de la création du stock')
      }
    } finally {
      setCreating(false)
    }
  }

  const deleteStock = async (id: string) => {
    if (!confirm('Supprimer ce stock ?')) return
    try {
      const res = await fetch(`/api/stock?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setStocks(prev => prev.filter(s => s.id !== id))
      }
    } catch (e) {
      console.error(e)
    }
  }

  const safeFetchJson = async (input: string) => {
    try {
      const res = await fetch(input)
      const text = await res.text()
      return text ? JSON.parse(text) : []
    } catch {
      return []
    }
  }

  const downloadCsv = (rows: Stock[]) => {
    const header = ['product','brand','color','size','category','quantity']
    const body = rows.map(r => [
      `${r.variant.product.name}`,
      `${r.variant.product.brand}`,
      `${r.variant.colorName}`,
      `${r.size.label}`,
      `${r.size.category}`,
      `${r.quantity}`,
    ])
    const csv = [header, ...body].map(line => line.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'stocks.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return <div className="text-center py-8">Chargement des stocks...</div>
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b flex flex-col gap-2">
        <div className="flex flex-wrap items-end gap-2">
          <div className="flex flex-col">
            <label className="text-xs text-slate-500">Recherche</label>
            <input
              placeholder="Marque, modèle, couleur, taille"
              value={filters.q}
              onChange={(e) => setFilters(f => ({ ...f, q: e.target.value }))}
              className="border px-2 py-1 rounded text-sm w-72"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-slate-500">Catégorie</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters(f => ({ ...f, category: e.target.value as any }))}
              className="border px-2 py-1 rounded text-sm"
            >
              <option value="">Toutes</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="kids">Kids</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-slate-500">Min</label>
            <input
              type="number"
              min={0}
              value={filters.minQty}
              onChange={(e) => setFilters(f => ({ ...f, minQty: e.target.value }))}
              className="border px-2 py-1 rounded text-sm w-24"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs text-slate-500">Max</label>
            <input
              type="number"
              min={0}
              value={filters.maxQty}
              onChange={(e) => setFilters(f => ({ ...f, maxQty: e.target.value }))}
              className="border px-2 py-1 rounded text-sm w-24"
            />
          </div>
          <button onClick={fetchStocks} className="px-3 py-1 rounded bg-slate-900 text-white text-sm">Filtrer</button>
          <button onClick={() => downloadCsv(stocks)} className="px-3 py-1 rounded border text-sm">Exporter CSV</button>
        </div>
        <div className="font-medium">Créer un stock</div>
        <div className="flex flex-wrap gap-2">
          <div>
            <input
              list="variants-list"
              placeholder="Rechercher variante (marque/modèle/couleur)"
              value={variantQuery}
              onChange={async (e) => {
                const q = e.target.value
                setVariantQuery(q)
                const opts = await safeFetchJson(`/api/variants?q=${encodeURIComponent(q)}&take=20`)
                setVariantOptions(opts)
              }}
              onBlur={() => {
                // si l'utilisateur a collé un id
                if (/^cmf/.test(variantQuery)) setNewStock(v => ({ ...v, variantId: variantQuery }))
              }}
              className="border px-2 py-1 rounded text-sm w-80"
            />
            <datalist id="variants-list">
              {variantOptions.map(o => (
                <option key={o.id} value={o.id}>{o.label}</option>
              ))}
            </datalist>
          </div>
          <div>
            <input
              list="sizes-list"
              placeholder="Rechercher taille (ex: 42)"
              value={sizeQuery}
              onChange={async (e) => {
                const q = e.target.value
                setSizeQuery(q)
                const opts = await safeFetchJson(`/api/sizes?q=${encodeURIComponent(q)}&take=50`)
                setSizeOptions(opts)
              }}
              onBlur={() => {
                if (/^cmf/.test(sizeQuery)) setNewStock(v => ({ ...v, sizeId: sizeQuery }))
              }}
              className="border px-2 py-1 rounded text-sm w-56"
            />
            <datalist id="sizes-list">
              {sizeOptions.map(o => (
                <option key={o.id} value={o.id}>{o.label}</option>
              ))}
            </datalist>
          </div>
          <input
            type="number"
            min={0}
            placeholder="Quantité"
            value={newStock.quantity}
            onChange={(e) => setNewStock(v => ({ ...v, quantity: parseInt(e.target.value) || 0 }))}
            className="border px-2 py-1 rounded text-sm w-28"
          />
          <button onClick={createStock} disabled={creating} className="px-3 py-1 rounded bg-slate-900 text-white text-sm disabled:opacity-50">{creating ? 'Création...' : 'Ajouter'}</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Couleur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Taille
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stocks.map((stock) => (
              <tr key={stock.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {stock.variant.product.brand}
                    </div>
                    <div className="text-sm text-gray-500">
                      {stock.variant.product.name}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {stock.variant.colorName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {stock.size.label} ({stock.size.category})
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    stock.quantity > 10 
                      ? 'bg-green-100 text-green-800' 
                      : stock.quantity > 0 
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                  }`}>
                    {stock.quantity}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="0"
                      value={stock.quantity}
                      onChange={(e) => updateStock(stock.id, parseInt(e.target.value) || 0)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <button onClick={() => deleteStock(stock.id)} className="px-2 py-1 text-sm text-red-600">Supprimer</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
