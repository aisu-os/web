import { useAppMarketStore } from '../hooks/use-app-market-store'
import { TOP_CHART_LIMIT } from '../app-market.constants'
import AppCard from './AppCard'

const TopCharts = () => {
  const getTopApps = useAppMarketStore((s) => s.getTopApps)
  const topApps = getTopApps(TOP_CHART_LIMIT)

  return (
    <div className="px-4 mt-6">
      <h3 className="text-[13px] font-semibold text-white/60 uppercase tracking-wider mb-3">
        Top Apps
      </h3>
      <div className="grid grid-cols-1 gap-0.5">
        {topApps.map((app, index) => (
          <AppCard key={app.id} app={app} compact rank={index + 1} />
        ))}
      </div>
    </div>
  )
}

export default TopCharts
