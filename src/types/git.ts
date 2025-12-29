export interface GitCommit {
  sha: string;
  message: string;
  author: {
    name: string;
    email: string;
    date: string;
    avatar_url?: string;
  };
  parents: string[];
  url: string;
}

export interface GitBranch {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
  protected: boolean;
}

export interface GitContributor {
  login: string;
  avatar_url: string;
  contributions: number;
  html_url: string;
}

export interface GitRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  language: string | null;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  default_branch: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

export interface CommitActivity {
  week: number;
  total: number;
  days: number[];
}

export interface GraphNode {
  id: string;
  type: 'commit' | 'branch' | 'merge';
  position: { x: number; y: number };
  data: {
    commit: GitCommit;
    branch?: string;
    color: string;
  };
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: 'default' | 'merge';
  style?: {
    stroke: string;
  };
  animated?: boolean;
}
