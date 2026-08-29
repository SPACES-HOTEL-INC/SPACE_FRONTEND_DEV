import StatCard from './StatCard'
import { KPI_STATS } from '../../data/mockData'

export default function StatsRow() {
  // Filter out the Occupancy Rate card
  const filteredStats = KPI_STATS.filter((stat) => stat.id !== 'occupancy')

  return (
    <section
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6"
      data-testid="stats-row"
    >
      {filteredStats.map((stat, index) => (
        <StatCard key={stat.id} stat={stat} index={index} />
      ))}
    </section>
  )
}