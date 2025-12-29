import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { useGitHub } from './hooks/useGitHub';
import { useRepoStore } from './stores/repoStore';
import { CommitGraph } from './components/Graph';
import { ActivityHeatmap } from './components/Timeline';
import { ContributorBubbles, RepoStats } from './components/Stats';
import { SearchInput } from './components/Search';
import { Header, RepoCard, CommitDetails } from './components/UI';
import './index.css';

function App() {
  const { fetchRepo, fetchCommits, fetchBranches, fetchContributors, fetchCommitActivity } =
    useGitHub();
  const {
    repo,
    loading,
    setRepo,
    setCommits,
    setBranches,
    setContributors,
    setActivity,
    setLoading,
    setError,
    reset,
  } = useRepoStore();

  const handleSearch = useCallback(
    async (owner: string, repoName: string) => {
      reset();
      setLoading(true);
      setError(null);

      try {
        const [repoData, commitsData, branchesData, contributorsData, activityData] =
          await Promise.all([
            fetchRepo(owner, repoName),
            fetchCommits(owner, repoName, 100),
            fetchBranches(owner, repoName),
            fetchContributors(owner, repoName),
            fetchCommitActivity(owner, repoName),
          ]);

        if (repoData) setRepo(repoData);
        setCommits(commitsData);
        setBranches(branchesData);
        setContributors(contributorsData);
        setActivity(activityData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch repository data');
      } finally {
        setLoading(false);
      }
    },
    [
      fetchRepo,
      fetchCommits,
      fetchBranches,
      fetchContributors,
      fetchCommitActivity,
      reset,
      setRepo,
      setCommits,
      setBranches,
      setContributors,
      setActivity,
      setLoading,
      setError,
    ]
  );

  return (
    <div className="min-h-screen bg-dark-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4">
          <Header />
          <div className="py-8">
            <SearchInput onSearch={handleSearch} loading={loading} />
          </div>
        </div>

        {repo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container mx-auto px-4 pb-12"
          >
            <RepoCard />
            <div className="mb-6">
              <RepoStats />
            </div>
            <div className="grid lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2 glass rounded-2xl overflow-hidden" style={{ height: '600px' }}>
                <CommitGraph />
              </div>
              <div className="space-y-6">
                <ActivityHeatmap />
                <ContributorBubbles />
              </div>
            </div>
          </motion.div>
        )}

        {!repo && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="container mx-auto px-4 py-20"
          >
            <div className="text-center">
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-8">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className="aspect-square rounded-2xl bg-gradient-to-br from-dark-700 to-dark-800 flex items-center justify-center"
                  >
                    <div
                      className="w-8 h-8 rounded-full"
                      style={{
                        backgroundColor: i === 0 ? '#a855f7' : i === 1 ? '#06b6d4' : '#22c55e',
                        boxShadow: '0 0 20px ' + (i === 0 ? '#a855f7' : i === 1 ? '#06b6d4' : '#22c55e') + '60',
                      }}
                    />
                  </motion.div>
                ))}
              </div>
              <p className="text-white/40 text-lg">
                Search for a repository to see beautiful visualizations
              </p>
            </div>
          </motion.div>
        )}

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="container mx-auto px-4 py-20"
          >
            <div className="flex flex-col items-center">
              <div className="relative w-24 h-24 mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-dark-700" />
                <div className="absolute inset-0 rounded-full border-4 border-neon-purple border-t-transparent animate-spin" />
              </div>
              <p className="text-white/60 text-lg">Loading repository data...</p>
            </div>
          </motion.div>
        )}
      </div>

      <CommitDetails />
    </div>
  );
}

export default App;
