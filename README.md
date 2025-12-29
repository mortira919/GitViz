<div align="center">

# GitViz

### Beautiful visualization of your GitHub repository history

<img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
<img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
<img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind" />
<img src="https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />

</div>

---

## Features

- **Interactive Commit Graph** — Visualize branches, merges, and commit relationships with smooth animations
- **Activity Heatmap** — GitHub-style contribution calendar with beautiful gradients
- **Contributor Bubbles** — See top contributors with dynamic bubble sizing
- **Repository Stats** — Stars, forks, watchers, commits, branches at a glance
- **Commit Details** — Click any commit to see full information
- **Dark Neon Theme** — Stunning dark UI with glowing neon accents

## Tech Stack

- **React 18** + **TypeScript** — Modern frontend with type safety
- **Tailwind CSS 4** — Utility-first styling with custom neon theme
- **React Flow** — Powerful graph visualization
- **Framer Motion** — Smooth animations and transitions
- **Zustand** — Lightweight state management
- **Octokit** — Official GitHub API client

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/mortira919/GitViz.git

# Navigate to project directory
cd GitViz

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

## Usage

1. Enter a repository in the format `owner/repo` (e.g., `facebook/react`)
2. Or paste a full GitHub URL
3. Click "Visualize" or press Enter
4. Explore the interactive commit graph, heatmap, and statistics

## Screenshots

<details>
<summary>Click to expand</summary>

### Landing Page
Beautiful animated landing with quick access to popular repositories

### Commit Graph
Interactive graph with zoom, pan, and click-to-view details

### Activity Heatmap  
Year-long contribution visualization with hover tooltips

### Contributor Stats
Dynamic bubble chart showing top contributors

</details>

## API Rate Limits

GitViz uses the GitHub REST API without authentication. Unauthenticated requests are limited to 60 requests per hour. For higher limits, you can add a GitHub token.

## Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - feel free to use this project for personal or commercial purposes.

---

<div align="center">

Made with love

</div>
