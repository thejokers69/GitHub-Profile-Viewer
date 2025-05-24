# 🚀 GitHub Profile Viewer

A beautiful, modern web app to view any GitHub user's profile in a visually appealing and responsive way. Built with vanilla JavaScript, HTML, and CSS, this project demonstrates clean architecture and the SOLID principles in frontend engineering.

---

## 🌟 Features

- **Search any GitHub user** by username
- **Quick load** your own profile with one click
- **Responsive, modern UI** with smooth animations
- **Displays**: avatar, name, username, bio, location, company, repositories, followers, following, join date, and links (GitHub, website, Twitter, email)
- **Loading and error states** for great UX
- **No frameworks**: pure JS, HTML, and CSS
- **SOLID principles** applied in code structure

---

## 📂 Project Structure

```
├── index.html         # Main HTML file
├── styles.css         # Modern, responsive CSS
├── script.js          # All frontend logic (SOLID, OOP)
├── server.js          # Express server for static hosting
├── package.json       # Project metadata and scripts
├── eslint.config.mjs  # Linting configuration
├── .gitignore         # Git and editor ignores
├── pnpm-lock.yaml     # pnpm lockfile
├── pnpm-workspace.yaml# pnpm workspace config
```

---

## 🏗️ Architecture & SOLID Principles

This project is a showcase of the SOLID principles in frontend JavaScript:

- **Single Responsibility**: Each class (model, API, renderer, UI, etc.) has one job
- **Open/Closed**: Renderers and services are extensible without modification
- **Liskov Substitution**: All renderers can be swapped (loading, error, HTML)
- **Interface Segregation**: Only relevant methods are exposed to each class
- **Dependency Inversion**: High-level logic depends on abstractions, not details

See `script.js` for a fully documented, OOP, SOLID-compliant implementation.

---

## 🚦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [pnpm](https://pnpm.io/) (or npm/yarn)

### Install dependencies

```sh
pnpm install
```

### Run the app locally

```sh
pnpm start
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

### Development mode (auto-reload)

```sh
pnpm dev
```

### Lint the code

```sh
pnpm lint
```

---

## 🧑‍💻 Development Notes

- **No React, SolidJS, or .tsx**: This is a pure JS/HTML/CSS project
- **Linting**: ESLint is configured for JS and CSS (see `eslint.config.mjs`)
- **Server**: Express serves static files and a health endpoint
- **No build step**: All code is ready-to-run
- **Tested on modern browsers**

---

## 📜 License

ISC License. See [LICENSE](LICENSE) if present.

---

## 🙏 Acknowledgements

- [GitHub REST API](https://docs.github.com/en/rest)
- [Express.js](https://expressjs.com/)
- [pnpm](https://pnpm.io/)
- [ESLint](https://eslint.org/)

---

> Made with ❤️ by Mohamed
