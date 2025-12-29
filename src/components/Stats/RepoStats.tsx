import { motion } from 'framer-motion';
import { Star, GitFork, Eye, GitBranch, GitCommit, Users } from 'lucide-react';
import { useRepoStore } from '../../stores/repoStore';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
  delay?: number;
}

function StatCard({ icon, label, value, color, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
      whileHover={{ scale: 1.05, y: -4 }}
      className="glass rounded-xl p-4 cursor-pointer transition-all"
      style={{
        boxShadow: `0 0 20px ${color}20`,
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: `${color}20` }}
        >
          <div style={{ color }}>{icon}</div>
        </div>
        <div>
          <p className="text-2xl font-bold text-white">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          <p className="text-xs text-white/50">{label}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function RepoStats() {
  const { repo, commits, branches, contributors } = useRepoStore();

  if (!repo) return null;

  const stats = [
    {
      icon: <Star className="w-5 h-5" />,
      label: 'Stars',
      value: repo.stargazers_count,
      color: '#eab308',
    },
    {
      icon: <GitFork className="w-5 h-5" />,
      label: 'Forks',
      value: repo.forks_count,
      color: '#22c55e',
    },
    {
      icon: <Eye className="w-5 h-5" />,
      label: 'Watchers',
      value: repo.watchers_count,
      color: '#3b82f6',
    },
    {
      icon: <GitCommit className="w-5 h-5" />,
      label: 'Commits',
      value: commits.length + '+',
      color: '#a855f7',
    },
    {
      icon: <GitBranch className="w-5 h-5" />,
      label: 'Branches',
      value: branches.length,
      color: '#06b6d4',
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: 'Contributors',
      value: contributors.length,
      color: '#ec4899',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat, index) => (
        <StatCard key={stat.label} {...stat} delay={index * 0.05} />
      ))}
    </div>
  );
}
