import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Copy, Check, GitCommit, User, Calendar, Hash } from 'lucide-react';
import { useState } from 'react';
import { useRepoStore } from '../../stores/repoStore';
import { formatCommitDate } from '../../utils/graphBuilder';

export default function CommitDetails() {
  const { selectedCommit, setSelectedCommit } = useRepoStore();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {selectedCommit && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCommit(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-50"
          >
            <div className="glass rounded-2xl p-6 mx-4 border border-neon-purple/30 shadow-2xl"
              style={{ boxShadow: '0 0 40px rgba(168, 85, 247, 0.2)' }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-neon-purple/20">
                    <GitCommit className="w-6 h-6 text-neon-purple" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Commit Details</h3>
                    <p className="text-sm text-white/50">View full commit information</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedCommit(null)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>

              {/* Content */}
              <div className="space-y-4">
                {/* SHA */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-dark-700/50">
                  <Hash className="w-5 h-5 text-neon-cyan" />
                  <code className="flex-1 text-sm font-mono text-white/80">
                    {selectedCommit.sha}
                  </code>
                  <button
                    onClick={() => copyToClipboard(selectedCommit.sha)}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-neon-green" />
                    ) : (
                      <Copy className="w-4 h-4 text-white/40" />
                    )}
                  </button>
                </div>

                {/* Message */}
                <div className="p-4 rounded-xl bg-dark-700/50">
                  <p className="text-white whitespace-pre-wrap">{selectedCommit.message}</p>
                </div>

                {/* Author */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-dark-700/50">
                  {selectedCommit.author.avatar_url ? (
                    <img
                      src={selectedCommit.author.avatar_url}
                      alt={selectedCommit.author.name}
                      className="w-10 h-10 rounded-full ring-2 ring-neon-purple/30"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-neon-purple/20 flex items-center justify-center">
                      <User className="w-5 h-5 text-neon-purple" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-white">{selectedCommit.author.name}</p>
                    <p className="text-sm text-white/50">{selectedCommit.author.email}</p>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-dark-700/50">
                  <Calendar className="w-5 h-5 text-neon-yellow" />
                  <span className="text-white/80">
                    {formatCommitDate(selectedCommit.author.date)}
                  </span>
                </div>

                {/* Parents */}
                {selectedCommit.parents.length > 0 && (
                  <div className="p-3 rounded-xl bg-dark-700/50">
                    <p className="text-sm text-white/50 mb-2">
                      {selectedCommit.parents.length} parent{selectedCommit.parents.length > 1 ? 's' : ''}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedCommit.parents.map((sha) => (
                        <code
                          key={sha}
                          className="px-2 py-1 rounded bg-dark-600 text-xs font-mono text-neon-cyan"
                        >
                          {sha.substring(0, 7)}
                        </code>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="mt-6 flex justify-end">
                <a
                  href={selectedCommit.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-neon-purple to-neon-cyan text-white font-medium hover:opacity-90 transition-opacity"
                >
                  <span>View on GitHub</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
