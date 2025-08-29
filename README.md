# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/7fc7ef8e-72e6-4e52-ba99-1b23b9218649

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/7fc7ef8e-72e6-4e52-ba99-1b23b9218649) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Features

- Road-Runner AsphaltOS desktop UI (windows, taskbar, start menu)
- Theme Manager with persistent wallpapers and effects
- Built-in apps: File Explorer, Settings, Terminal
- Widgets: System Monitor, Weather, AI Assistant, Fleet Tracker, Security Panel, Map, Calculator, Media Player
- Repo icons open a built-in browser; probes common deploy URLs and falls back to GitHub
- Persistent layout: windows, widgets, theme, and browser last-visited URL per repo

## Development

```sh
npm ci
npm run dev
npm run typecheck
npm run lint
npm run build
```

## Configuration

- Repo display names and custom URLs: edit `src/lib/repoMap.ts`
- Themes: edit `src/lib/themes.ts`

### External Integrations

- GitHub: Optionally set a token in localStorage key `asphaltos.github.token` (for private repos visibility). The desktop will render clickable icons for `github.com/NXConner` repositories and open them in the built-in browser that probes common deploy URLs and falls back to GitHub.
- Lovable: The app heuristically links to `lovable.dev/@nxconner` and `*.lovable.app` if discoverable. No token is required for public projects; private listings are not fetched.

## CI

GitHub Actions workflow runs typecheck, lint, and build on PRs and main.

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/7fc7ef8e-72e6-4e52-ba99-1b23b9218649) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
