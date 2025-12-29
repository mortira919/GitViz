import { useCallback, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion } from 'framer-motion';
import CommitNode from './CommitNode';
import { buildCommitGraph } from '../../utils/graphBuilder';
import { useRepoStore } from '../../stores/repoStore';

const nodeTypes = {
  commit: CommitNode,
  merge: CommitNode,
};

export default function CommitGraph() {
  const { commits, setSelectedCommit } = useRepoStore();

  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    if (commits.length === 0) return { nodes: [], edges: [] };
    return buildCommitGraph(commits);
  }, [commits]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes as Node[]);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges as Edge[]);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const commit = commits.find((c) => c.sha === node.id);
      if (commit) {
        setSelectedCommit(commit);
      }
    },
    [commits, setSelectedCommit]
  );

  if (commits.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-neon-purple"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white/80 mb-2">No commits to display</h3>
          <p className="text-white/50">Search for a repository to visualize its commit history</p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full w-full"
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.1}
        maxZoom={2}
        defaultEdgeOptions={{
          type: 'smoothstep',
          style: { strokeWidth: 2 },
        }}
      >
        <Background color="#2a2a3a" gap={20} size={1} />
        <Controls
          className="!bg-dark-800 !border-dark-600 !rounded-xl overflow-hidden"
          showInteractive={false}
        />
        <MiniMap
          className="!bg-dark-800 !border-dark-600 !rounded-xl overflow-hidden"
          nodeColor={(node) => node.data?.color || '#a855f7'}
          maskColor="rgba(10, 10, 15, 0.8)"
        />
      </ReactFlow>
    </motion.div>
  );
}
