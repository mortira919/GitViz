import { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { motion } from 'framer-motion';
import { GitCommit, GitMerge } from 'lucide-react';
import { shortenSha, truncateMessage, formatCommitDate } from '../../utils/graphBuilder';
import type { GitCommit as GitCommitType } from '../../types/git';

interface CommitNodeData {
  commit: GitCommitType;
  branch?: string;
  color: string;
}

function CommitNode({ data, selected }: NodeProps<CommitNodeData>) {
  const { commit, color } = data;
  const isMerge = commit.parents.length > 1;

  return (
    <>
      <Handle type="target" position={Position.Top} className="opacity-0" />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        className={`relative px-4 py-3 rounded-xl cursor-pointer bg-dark-800/80 backdrop-blur-sm border transition-all duration-300 ${selected ? 'border-opacity-100' : 'border-opacity-40'}`}
        style={{
          borderColor: color,
          boxShadow: selected ? `0 0 20px ${color}40, 0 0 40px ${color}20` : `0 0 10px ${color}20`,
          minWidth: '280px',
        }}
      >
        {/* Glowing indicator */}
        <div
          className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full"
          style={{
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}, 0 0 20px ${color}60`,
          }}
        >
          <div className="absolute inset-0 rounded-full animate-ping opacity-30" style={{ backgroundColor: color }} />
        </div>

        {/* Icon */}
        <div className="absolute -left-1 top-1/2 -translate-y-1/2 flex items-center justify-center">
          {isMerge ? (
            <GitMerge className="w-2.5 h-2.5 text-dark-950" />
          ) : (
            <GitCommit className="w-2.5 h-2.5 text-dark-950" />
          )}
        </div>

        {/* Content */}
        <div className="ml-2">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="font-mono text-xs px-2 py-0.5 rounded-md"
              style={{ backgroundColor: `${color}20`, color }}
            >
              {shortenSha(commit.sha)}
            </span>
            {isMerge && (
              <span className="text-xs px-2 py-0.5 rounded-md bg-neon-pink/20 text-neon-pink">
                merge
              </span>
            )}
          </div>

          <p className="text-sm text-white/90 font-medium mb-2">
            {truncateMessage(commit.message, 40)}
          </p>

          <div className="flex items-center gap-3 text-xs text-white/50">
            <div className="flex items-center gap-1.5">
              {commit.author.avatar_url && (
                <img
                  src={commit.author.avatar_url}
                  alt={commit.author.name}
                  className="w-4 h-4 rounded-full ring-1 ring-white/20"
                />
              )}
              <span>{commit.author.name}</span>
            </div>
            <span>{formatCommitDate(commit.author.date)}</span>
          </div>
        </div>
      </motion.div>
      <Handle type="source" position={Position.Bottom} className="opacity-0" />
    </>
  );
}

export default memo(CommitNode);
