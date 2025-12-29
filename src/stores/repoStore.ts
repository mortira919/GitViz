import { create } from 'zustand';
import type { GitCommit, GitBranch, GitContributor, GitRepo, CommitActivity } from '../types/git';

interface RepoState {
  repo: GitRepo | null;
  commits: GitCommit[];
  branches: GitBranch[];
  contributors: GitContributor[];
  activity: CommitActivity[];
  selectedCommit: GitCommit | null;
  loading: boolean;
  error: string | null;

  setRepo: (repo: GitRepo | null) => void;
  setCommits: (commits: GitCommit[]) => void;
  setBranches: (branches: GitBranch[]) => void;
  setContributors: (contributors: GitContributor[]) => void;
  setActivity: (activity: CommitActivity[]) => void;
  setSelectedCommit: (commit: GitCommit | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  repo: null,
  commits: [],
  branches: [],
  contributors: [],
  activity: [],
  selectedCommit: null,
  loading: false,
  error: null,
};

export const useRepoStore = create<RepoState>((set) => ({
  ...initialState,

  setRepo: (repo) => set({ repo }),
  setCommits: (commits) => set({ commits }),
  setBranches: (branches) => set({ branches }),
  setContributors: (contributors) => set({ contributors }),
  setActivity: (activity) => set({ activity }),
  setSelectedCommit: (selectedCommit) => set({ selectedCommit }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
}));
