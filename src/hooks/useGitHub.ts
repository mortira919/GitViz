import { useState, useCallback } from 'react';
import { Octokit } from '@octokit/rest';
import type { GitCommit, GitBranch, GitContributor, GitRepo, CommitActivity } from '../types/git';

const octokit = new Octokit();

interface UseGitHubReturn {
  loading: boolean;
  error: string | null;
  fetchRepo: (owner: string, repo: string) => Promise<GitRepo | null>;
  fetchCommits: (owner: string, repo: string, perPage?: number) => Promise<GitCommit[]>;
  fetchBranches: (owner: string, repo: string) => Promise<GitBranch[]>;
  fetchContributors: (owner: string, repo: string) => Promise<GitContributor[]>;
  fetchCommitActivity: (owner: string, repo: string) => Promise<CommitActivity[]>;
}

export function useGitHub(): UseGitHubReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRepo = useCallback(async (owner: string, repo: string): Promise<GitRepo | null> => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await octokit.repos.get({ owner, repo });
      return {
        id: data.id,
        name: data.name,
        full_name: data.full_name,
        description: data.description,
        html_url: data.html_url,
        stargazers_count: data.stargazers_count,
        forks_count: data.forks_count,
        watchers_count: data.watchers_count,
        language: data.language,
        created_at: data.created_at,
        updated_at: data.updated_at,
        pushed_at: data.pushed_at,
        default_branch: data.default_branch,
        owner: {
          login: data.owner.login,
          avatar_url: data.owner.avatar_url,
        },
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch repository');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCommits = useCallback(async (owner: string, repo: string, perPage = 100): Promise<GitCommit[]> => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await octokit.repos.listCommits({
        owner,
        repo,
        per_page: perPage,
      });
      return data.map((commit) => ({
        sha: commit.sha,
        message: commit.commit.message,
        author: {
          name: commit.commit.author?.name || 'Unknown',
          email: commit.commit.author?.email || '',
          date: commit.commit.author?.date || '',
          avatar_url: commit.author?.avatar_url,
        },
        parents: commit.parents.map((p) => p.sha),
        url: commit.html_url,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch commits');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBranches = useCallback(async (owner: string, repo: string): Promise<GitBranch[]> => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await octokit.repos.listBranches({ owner, repo, per_page: 100 });
      return data.map((branch) => ({
        name: branch.name,
        commit: {
          sha: branch.commit.sha,
          url: branch.commit.url,
        },
        protected: branch.protected,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch branches');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchContributors = useCallback(async (owner: string, repo: string): Promise<GitContributor[]> => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await octokit.repos.listContributors({ owner, repo, per_page: 20 });
      return data
        .filter((c): c is typeof c & { login: string } => c.login !== undefined)
        .map((contributor) => ({
          login: contributor.login,
          avatar_url: contributor.avatar_url || '',
          contributions: contributor.contributions,
          html_url: contributor.html_url || '',
        }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch contributors');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCommitActivity = useCallback(async (owner: string, repo: string): Promise<CommitActivity[]> => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await octokit.repos.getCommitActivityStats({ owner, repo });
      if (!data || !Array.isArray(data)) return [];
      return data.map((week) => ({
        week: week.week,
        total: week.total,
        days: week.days,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch activity');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchRepo,
    fetchCommits,
    fetchBranches,
    fetchContributors,
    fetchCommitActivity,
  };
}
