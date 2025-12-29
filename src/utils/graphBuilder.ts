import type { GitCommit, GraphNode, GraphEdge } from '../types/git';

const BRANCH_COLORS = [
  '#a855f7', // purple
  '#06b6d4', // cyan
  '#22c55e', // green
  '#f97316', // orange
  '#ec4899', // pink
  '#3b82f6', // blue
  '#eab308', // yellow
  '#ef4444', // red
];


export function buildCommitGraph(commits: GitCommit[]): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const shaToIndex = new Map<string, number>();

  // Create index mapping
  commits.forEach((commit, index) => {
    shaToIndex.set(commit.sha, index);
  });

  // Assign branches (simplified - real git graph is more complex)
  let currentBranch = 0;
  const commitBranches = new Map<string, number>();

  // Process commits in order (newest first from API)
  commits.forEach((commit, index) => {
    // If this commit has multiple parents, it's a merge
    const isMerge = commit.parents.length > 1;
    
    // Determine branch for this commit
    let branchIndex = commitBranches.get(commit.sha);
    
    if (branchIndex === undefined) {
      // Check if any parent is already assigned
      const parentBranch = commit.parents
        .map((p) => commitBranches.get(p))
        .find((b) => b !== undefined);
      
      if (parentBranch !== undefined) {
        branchIndex = parentBranch;
      } else {
        branchIndex = currentBranch;
      }
    }

    // Assign branch to first parent (main line)
    if (commit.parents[0]) {
      commitBranches.set(commit.parents[0], branchIndex);
    }

    // For merges, the second parent might be from another branch
    if (isMerge && commit.parents[1]) {
      const existingBranch = commitBranches.get(commit.parents[1]);
      if (existingBranch === undefined) {
        currentBranch++;
        commitBranches.set(commit.parents[1], currentBranch);
      }
    }

    const color = BRANCH_COLORS[branchIndex % BRANCH_COLORS.length];
    const xOffset = branchIndex * 40;

    // Create node
    nodes.push({
      id: commit.sha,
      type: isMerge ? 'merge' : 'commit',
      position: {
        x: 100 + xOffset,
        y: index * 80,
      },
      data: {
        commit,
        branch: `branch-${branchIndex}`,
        color,
      },
    });

    // Create edges to parents
    commit.parents.forEach((parentSha, parentIndex) => {
      const parentCommitIndex = shaToIndex.get(parentSha);
      if (parentCommitIndex !== undefined) {
        const parentBranchIndex = commitBranches.get(parentSha) ?? branchIndex;
        const edgeColor = parentIndex === 0 ? color : BRANCH_COLORS[parentBranchIndex % BRANCH_COLORS.length];
        
        edges.push({
          id: `${commit.sha}-${parentSha}`,
          source: commit.sha,
          target: parentSha,
          type: parentIndex > 0 ? 'merge' : 'default',
          style: {
            stroke: edgeColor,
          },
          animated: parentIndex > 0,
        });
      }
    });
  });

  return { nodes, edges };
}

export function formatCommitDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function shortenSha(sha: string): string {
  return sha.substring(0, 7);
}

export function truncateMessage(message: string, maxLength = 50): string {
  const firstLine = message.split('\n')[0];
  if (firstLine.length <= maxLength) return firstLine;
  return firstLine.substring(0, maxLength) + '...';
}
