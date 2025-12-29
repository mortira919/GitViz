import { motion } from 'framer-motion';
import { ExternalLink, Star, GitFork, Calendar } from 'lucide-react';
import { useRepoStore } from '../../stores/repoStore';

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function RepoCard() {
  const { repo } = useRepoStore();

  if (!repo) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-6 mb-6"
    >
      <div className="flex items-start justify-between gap-4">
        {/* Repo info */}
        <div className="flex items-start gap-4">
          <img
            src={repo.owner.avatar_url}
            alt={repo.owner.login}
            className="w-16 h-16 rounded-xl ring-2 ring-neon-purple/30"
          />

          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-2xl font-bold text-white">{repo.name}</h2>
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-neon-cyan transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>

            <p className="text-white/60 mb-3">
              by <span className="text-neon-purple">{repo.owner.login}</span>
            </p>

            {repo.description && (
              <p className="text-white/70 max-w-xl mb-3">{repo.description}</p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm">
              {repo.language && (
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-neon-cyan" />
                  <span className="text-white/70">{repo.language}</span>
                </span>
              )}

              <span className="flex items-center gap-1.5 text-white/60">
                <Star className="w-4 h-4 text-neon-yellow" />
                {repo.stargazers_count.toLocaleString()}
              </span>

              <span className="flex items-center gap-1.5 text-white/60">
                <GitFork className="w-4 h-4 text-neon-green" />
                {repo.forks_count.toLocaleString()}
              </span>

              <span className="flex items-center gap-1.5 text-white/60">
                <Calendar className="w-4 h-4" />
                Updated {formatDate(repo.pushed_at)}
              </span>
            </div>
          </div>
        </div>

        {/* Default branch badge */}
        <div className="px-3 py-1.5 rounded-full bg-dark-700 text-sm text-white/70">
          {repo.default_branch}
        </div>
      </div>
    </motion.div>
  );
}
