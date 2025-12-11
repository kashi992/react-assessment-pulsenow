// Dashboard Page - TO BE IMPLEMENTED BY CANDIDATE
// This is a basic placeholder structure
import { useState, useEffect } from 'react'
import { getDashboard, getPortfolio } from '../services/api'


const Dashboard = () => {

  const [portfolio, setPortfolio] = useState(null)
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 🔹 Call both APIs at the same time
        const [portfolioRes, dashboardRes] = await Promise.all([
          getPortfolio(),
          getDashboard(),
        ])

        // 🔴 IMPORTANT: your real data is in `.data.data`
        const portfolioData = portfolioRes.data?.data
        const dashboardData = dashboardRes.data?.data

        console.log('portfolio from API', portfolioRes.data)
        console.log('dashboard from API', dashboardRes.data)

        setPortfolio(portfolioData)
        setDashboard(dashboardData)
      } catch (err) {
        console.error('Error loading dashboard:', err)
        setError('Failed to load dashboard data.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // 🔹 Loading & error states
  if (loading) {
    return <div className="p-6">Loading dashboard...</div>
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>
  }

  // 🔹 Safely read values (adjust field names if needed after console.log)
  const totalValue = portfolio?.totalValue ?? 0
  const totalChange = portfolio?.totalChangeAmount ?? 0
  const totalChangePercent = portfolio?.totalChangePercent ?? 0
  const price = portfolio.currentPrice ?? 0
  const changeIsPositive = totalChange >= 0
  const changeColor = changeIsPositive ? 'text-green-500' : 'text-red-500'

  const topGainers = dashboard?.topGainers?.slice(0, 3) ?? []
  const topLosers = dashboard?.topLosers?.slice(0, 3) ?? []
  const recentNews = dashboard?.recentNews?.slice(0, 5) ?? []
  const activeAlerts = dashboard?.activeAlerts?.slice(0, 5) ?? []

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="bg-white p-6 rounded-lg shadow mb-4">
        {/* <p className="text-gray-600">
          Dashboard implementation goes here. Check the assessment instructions for requirements.
        </p> */}

        {/* 4 main boxes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Box 1 – Portfolio Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-sm font-semibold text-pulse-primary mb-2">
              Portfolio Value
            </h2>
            <p className="text-2xl font-bold">
              ${totalValue.toLocaleString()}
            </p>
            <p className={`mt-2 text-sm font-medium ${changeColor}`}>
              {changeIsPositive ? '+' : ''}
              {totalChange.toLocaleString()} ({totalChangePercent}%)
            </p>
          </div>

          {/* Box 2 – Top Gainers */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-sm font-semibold text-pulse-primary mb-2">
              Top Gainers
            </h2>
            <ul className="space-y-1 text-sm">
              {topGainers.map((item) => (
                <li
                  key={item.symbol}
                  className="grid items-center gap-3"
                  style={{gridTemplateColumns: "1fr auto auto"}}
                >
                  <div>
                    <span className="font-medium mr-2">{item.symbol}</span>
                    <span className="text-gray-500">{item.name}</span>
                  </div>
                  <span className="text-gray-700 text-sm block">
                    ${item.currentPrice?.toLocaleString()}
                  </span>

                  {/* Right: Change % */}
                  <span className="text-green-500 font-medium text-sm block text-end">
                    {item.changePercent}%
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Box 3 – Top Losers */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-sm font-semibold text-pulse-primary mb-2">
              Top Losers
            </h2>
            <ul className="space-y-2 text-sm">
              {topLosers.map((item) => (
                <li
                  key={item.symbol}
                  className="flex items-center justify-between"
                >
                  <div>
                    <span className="font-medium mr-2">{item.symbol}</span>
                    <span className="text-gray-500">{item.name}</span>
                  </div>
                  <span className="text-red-500">
                    {item.changePercent}%
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Box 4 – Active Alerts */}
          {/* Box 4 – Active Alerts */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-sm font-semibold text-pulse-primary mb-2">
              Active Alerts
            </h2>
            <ul className="space-y-2 text-sm">
              {activeAlerts.map((alert) => (
                <li
                  key={alert.id}
                  className="flex items-start justify-between"
                >
                  <div className="flex flex-col max-w-[95%]">
                    <span className="font-medium">{alert.message}</span>

                    {/* 🔹 TIMESTAMP HERE */}
                    <span className="text-xs text-gray-400">
                      {alert.timestamp
                        ? new Date(alert.timestamp).toLocaleString()
                        : ''}
                    </span>
                  </div>

                  {/* severity badge */}
                  <span
                    className={`h-fit px-2 py-1 rounded text-xs font-semibold ${alert.severity === 'critical'
                      ? 'bg-red-100 text-red-700'
                      : alert.severity === 'warning'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-blue-100 text-blue-700'
                      }`}
                  >
                    {alert.severity}
                  </span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* Recent News */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Recent News</h2>
        <ul className="divide-y divide-gray-100">
          {recentNews.map((news) => (
            <li key={news.id} className="py-3 flex items-start justify-between">
              <div>
                <p className="font-medium text-sm">{news.title}</p>
                <p className="text-xs text-gray-500">
                  {news.source} ·{' '}
                  {news.timestamp
                    ? new Date(news.timestamp).toLocaleString()
                    : ''}
                </p>
              </div>
              <span className="ml-4 inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-700">
                {news.category}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Dashboard