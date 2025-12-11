import { useEffect, useState } from 'react'
import { getStocks, getCrypto } from '../services/api'

const Assets = () => {
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all') // 'all' | 'stock' | 'crypto'

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const [stocksRes, cryptoRes] = await Promise.all([
          getStocks(),
          getCrypto(),
        ])

        console.log('stocksRes from API:', stocksRes)
        console.log('cryptoRes from API:', cryptoRes)

        // ------- safely extract arrays from responses -------
        const stocksPayload = stocksRes.data
        const cryptoPayload = cryptoRes.data

        let stocksData = []
        let cryptoData = []

        // if shape is { success, data: [...] }
        if (Array.isArray(stocksPayload?.data)) {
          stocksData = stocksPayload.data
        } else if (Array.isArray(stocksPayload)) {
          // if shape is just [...]
          stocksData = stocksPayload
        }

        if (Array.isArray(cryptoPayload?.data)) {
          cryptoData = cryptoPayload.data
        } else if (Array.isArray(cryptoPayload)) {
          cryptoData = cryptoPayload
        }
        // ----------------------------------------------------

        const stocks = stocksData.map((item) => ({ ...item, type: 'stock' }))
        const crypto = cryptoData.map((item) => ({ ...item, type: 'crypto' }))

        setAssets([...stocks, ...crypto])
      } catch (err) {
        console.error('Error loading assets:', err)
        setError('Failed to load assets.')
      } finally {
        setLoading(false)
      }
    }

    fetchAssets()
  }, [])

  const filteredAssets = assets.filter((asset) => {
    if (filter === 'all') return true
    return asset.type === filter
  })

  if (loading) return <div className="p-6">Loading assets...</div>
  if (error) return <div className="p-6 text-red-500">{error}</div>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Assets</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        {/* Filter buttons */}
        <div className="mb-4 flex gap-2">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-sm border transition ${filter === 'all'
                ? 'bg-indigo-500 text-white border-indigo-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
          >
            All
          </button>

          <button
            type="button"
            onClick={() => setFilter('stock')}
            className={`px-3 py-1 rounded-full text-sm border transition ${filter === 'stock'
                ? 'bg-indigo-500 text-white border-indigo-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
          >
            Stocks
          </button>

          <button
            type="button"
            onClick={() => setFilter('crypto')}
            className={`px-3 py-1 rounded-full text-sm border transition ${filter === 'crypto'
                ? 'bg-indigo-500 text-white border-indigo-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
          >
            Crypto
          </button>
        </div>

        {/* Assets table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Symbol</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Current Price</th>
                <th className="px-4 py-3">Change %</th>
                <th className="px-4 py-3">Volume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAssets.map((asset) => {
                const changePercent = asset.changePercent ?? 0
                const isPositive = changePercent >= 0

                return (
                  <tr
                    key={`${asset.type}-${asset.symbol}`}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-4 py-2 capitalize text-gray-500">
                      {asset.type}
                    </td>
                    <td className="px-4 py-2 font-semibold text-gray-900">
                      {asset.symbol}
                    </td>
                    <td className="px-4 py-2 text-gray-700">{asset.name}</td>
                    <td className="px-4 py-2 text-gray-800">
                      ${asset.currentPrice?.toLocaleString()}
                    </td>
                    <td
                      className={`px-4 py-2 font-medium ${isPositive ? 'text-green-500' : 'text-red-500'
                        }`}
                    >
                      {isPositive ? '+' : ''}
                      {changePercent}%
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      {asset.volume?.toLocaleString()}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>      </div>
    </div>
  )
}

export default Assets
