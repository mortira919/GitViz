import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useRepoStore } from '../../stores/repoStore';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getColorIntensity(count: number, max: number): string {
  if (count === 0) return 'bg-dark-700';
  const intensity = count / max;
  if (intensity < 0.25) return 'bg-neon-purple/30';
  if (intensity < 0.5) return 'bg-neon-purple/50';
  if (intensity < 0.75) return 'bg-neon-purple/70';
  return 'bg-neon-purple';
}

function getGlowIntensity(count: number, max: number): string {
  if (count === 0) return '';
  const intensity = count / max;
  if (intensity < 0.5) return '';
  if (intensity < 0.75) return 'shadow-[0_0_8px_rgba(168,85,247,0.4)]';
  return 'shadow-[0_0_12px_rgba(168,85,247,0.6)]';
}

export default function ActivityHeatmap() {
  const { activity } = useRepoStore();

  const { heatmapData, maxCount, totalCommits, months } = useMemo(() => {
    if (activity.length === 0) {
      return { heatmapData: [], maxCount: 0, totalCommits: 0, months: [] };
    }

    // Get last 52 weeks of data
    const weeks = activity.slice(-52);
    const allDays: { count: number; date: Date }[][] = [];
    let max = 0;
    let total = 0;
    const monthLabels: { month: string; weekIndex: number }[] = [];
    let lastMonth = -1;

    weeks.forEach((week, weekIndex) => {
      const weekData: { count: number; date: Date }[] = [];
      const weekDate = new Date(week.week * 1000);

      week.days.forEach((count, dayIndex) => {
        const date = new Date(weekDate);
        date.setDate(date.getDate() + dayIndex);
        weekData.push({ count, date });
        if (count > max) max = count;
        total += count;

        // Track month changes for labels
        if (dayIndex === 0 && date.getMonth() !== lastMonth) {
          lastMonth = date.getMonth();
          monthLabels.push({ month: MONTHS[lastMonth], weekIndex });
        }
      });

      allDays.push(weekData);
    });

    return { heatmapData: allDays, maxCount: max, totalCommits: total, months: monthLabels };
  }, [activity]);

  if (activity.length === 0) {
    return (
      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Activity</h3>
        <div className="h-32 flex items-center justify-center text-white/50">
          No activity data available
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Commit Activity</h3>
        <div className="flex items-center gap-2 text-sm text-white/60">
          <span className="text-neon-purple font-semibold">{totalCommits.toLocaleString()}</span>
          <span>commits in the last year</span>
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        {/* Month labels */}
        <div className="flex mb-2 ml-10">
          {months.map((m, i) => (
            <div
              key={i}
              className="text-xs text-white/40"
              style={{ marginLeft: i === 0 ? 0 : `${(m.weekIndex - (months[i - 1]?.weekIndex || 0)) * 14 - 24}px` }}
            >
              {m.month}
            </div>
          ))}
        </div>

        <div className="flex gap-1">
          {/* Day labels */}
          <div className="flex flex-col gap-1 mr-2">
            {DAYS.map((day, i) => (
              <div
                key={day}
                className="h-3 text-xs text-white/40 flex items-center"
                style={{ visibility: i % 2 === 1 ? 'visible' : 'hidden' }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          {heatmapData.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => (
                <motion.div
                  key={`${weekIndex}-${dayIndex}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: weekIndex * 0.01 + dayIndex * 0.005 }}
                  className={`w-3 h-3 rounded-sm ${getColorIntensity(day.count, maxCount)} ${getGlowIntensity(day.count, maxCount)} cursor-pointer transition-transform hover:scale-125`}
                  title={`${day.date.toDateString()}: ${day.count} commits`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mt-4 text-xs text-white/40">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-dark-700" />
          <div className="w-3 h-3 rounded-sm bg-neon-purple/30" />
          <div className="w-3 h-3 rounded-sm bg-neon-purple/50" />
          <div className="w-3 h-3 rounded-sm bg-neon-purple/70" />
          <div className="w-3 h-3 rounded-sm bg-neon-purple" />
        </div>
        <span>More</span>
      </div>
    </motion.div>
  );
}
