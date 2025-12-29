import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2, Github } from 'lucide-react';

interface SearchInputProps {
  onSearch: (owner: string, repo: string) => void;
  loading: boolean;
}

export default function SearchInput({ onSearch, loading }: SearchInputProps) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Parse input: can be "owner/repo" or full GitHub URL
    let owner = '';
    let repo = '';

    if (input.includes('github.com')) {
      const match = input.match(/github\.com\/([^/]+)\/([^/]+)/);
      if (match) {
        owner = match[1];
        repo = match[2].replace(/\.git$/, '');
      }
    } else if (input.includes('/')) {
      const parts = input.split('/');
      if (parts.length >= 2) {
        owner = parts[0].trim();
        repo = parts[1].trim();
      }
    }

    if (!owner || !repo) {
      setError('Please enter a valid repository (owner/repo or GitHub URL)');
      return;
    }

    onSearch(owner, repo);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="relative group">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-neon-purple via-neon-cyan to-neon-purple rounded-2xl opacity-30 group-hover:opacity-50 blur-lg transition-opacity" />

        {/* Input container */}
        <div className="relative flex items-center bg-dark-800 rounded-xl border border-dark-600 overflow-hidden">
          <div className="pl-4 text-white/40">
            <Github className="w-5 h-5" />
          </div>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter repository (facebook/react or GitHub URL)"
            className="flex-1 px-4 py-4 bg-transparent text-white placeholder-white/40 outline-none text-lg"
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-6 py-4 bg-gradient-to-r from-neon-purple to-neon-cyan text-white font-semibold transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Loading</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Visualize</span>
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 text-center text-neon-red text-sm"
        >
          {error}
        </motion.p>
      )}

      {/* Popular repos */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-4 flex flex-wrap justify-center gap-2"
      >
        <span className="text-white/40 text-sm">Try:</span>
        {['facebook/react', 'vercel/next.js', 'microsoft/vscode', 'tailwindlabs/tailwindcss'].map(
          (repo) => (
            <button
              key={repo}
              type="button"
              onClick={() => {
                setInput(repo);
                const [owner, repoName] = repo.split('/');
                onSearch(owner, repoName);
              }}
              disabled={loading}
              className="px-3 py-1 text-sm text-white/60 hover:text-white bg-dark-700 hover:bg-dark-600 rounded-full transition-colors disabled:opacity-50"
            >
              {repo}
            </button>
          )
        )}
      </motion.div>
    </motion.form>
  );
}
