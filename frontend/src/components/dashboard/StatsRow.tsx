import StatCard from './StatCard'
import { KPI_STATS } from '../../data/mockData'

// The KPI row: Occupancy Rate, Active Rooms and Daily Revenue (highlighted).
export default function StatsRow() {
  return (
    <section
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
      data-testid="stats-row"
    >
      {KPI_STATS.map((stat, index) => (
        <StatCard key={stat.id} stat={stat} index={index} />
      ))}
    </section>
  )
}
