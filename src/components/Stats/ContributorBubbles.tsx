import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useRepoStore } from '../../stores/repoStore';

const COLORS = [
  '#a855f7',
  '#06b6d4',
  '#22c55e',
  '#f97316',
  '#ec4899',
  '#3b82f6',
];

export default function ContributorBubbles() {
  const { contributors } = useRepoStore();

  const bubbles = useMemo(() => {
    if (contributors.length === 0) return [];

    const maxContributions = Math.max(...contributors.map((c) => c.contributions));
    const minSize = 50;
    const maxSize = 120;

    return contributors.slice(0, 10).map((contributor, index) => {
      const ratio = contributor.contributions / maxContributions;
      const size = minSize + ratio * (maxSize - minSize);
      const color = COLORS[index % COLORS.length];

      return {
        ...contributor,
        size,
        color,
      };
    });
  }, [contributors]);

  if (contributors.length === 0) {
    return (
      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Top Contributors</h3>
        <div className="h-48 flex items-center justify-center text-white/50">
          No contributor data available
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass rounded-2xl p-6"
    >
      <h3 className="text-lg font-semibold text-white mb-6">Top Contributors</h3>

      <div className="flex flex-wrap gap-4 justify-center items-center min-h-[200px]">
        {bubbles.map((contributor, index) => (
          <motion.a
            key={contributor.login}
            href={contributor.html_url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1, type: 'spring', stiffness: 200 }}
            whileHover={{ scale: 1.1, zIndex: 10 }}
            className="relative flex flex-col items-center group"
          >
            {/* Glow ring */}
            <div
              className="absolute rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                width: contributor.size + 16,
                height: contributor.size + 16,
                background: `radial-gradient(circle, ${contributor.color}40 0%, transparent 70%)`,
                top: -8,
                left: -8,
              }}
            />

            {/* Avatar container */}
            <div
              className="relative rounded-full overflow-hidden border-2 transition-all duration-300"
              style={{
                width: contributor.size,
                height: contributor.size,
                borderColor: contributor.color,
                boxShadow: `0 0 20px ${contributor.color}40`,
              }}
            >
              <img
                src={contributor.avatar_url}
                alt={contributor.login}
                className="w-full h-full object-cover"
              />

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {contributor.contributions}
                </span>
              </div>
            </div>

            {/* Name */}
            <span className="mt-2 text-xs text-white/70 group-hover:text-white transition-colors max-w-[80px] truncate">
              {contributor.login}
            </span>

            {/* Contribution count badge */}
            <div
              className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-xs font-bold"
              style={{
                backgroundColor: contributor.color,
                color: '#0a0a0f',
              }}
            >
              {contributor.contributions >= 1000
                ? `${(contributor.contributions / 1000).toFixed(1)}k`
                : contributor.contributions}
            </div>
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
}
