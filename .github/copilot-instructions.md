# ThreadHive Frontend Copilot Instructions

## Project overview

ThreadHive is a Vite-powered React 19 frontend. The application currently uses local dummy data rather than a running backend API.

## Build, test, and lint

Run these commands from the repository root:

```bash
npm install
npm run dev       # Start the Vite development server
npm run build     # Create the production build in dist/
npm run preview   # Serve the production build locally
npm run lint      # Run ESLint over the project
npm run lint:changed # Run ESLint only on changed JavaScript files
npm run prettier   # Format changed source/config files
npm test          # Run Vitest once
```

To run one test file or one test name:

```bash
npm test -- tests/ThreadCard.test.jsx
npm test -- -t "renders the thread title"
```

Vitest is configured for a `jsdom` environment and expects `tests/setup.js` as its setup file. There are currently no test files in the repository, so `npm test` exits with “No test files found.” Keep new React Testing Library tests in a top-level `tests/` directory and add the setup file when introducing the first tests. Vitest does not use Jest’s `--runInBand` option.

The production build currently succeeds. `npm run lint` is the authoritative full-project lint command; `npm run lint:changed` is useful for focused local iteration. Existing unused-variable errors in `App.jsx`, `CommentForm.jsx`, and `ThreadList.jsx` must be addressed when touching those areas rather than bypassing ESLint.

## Architecture and data flow

- [`src/main.jsx`](../src/main.jsx) is the browser entry point. It imports the global stylesheet, Bootstrap CSS, and renders [`App`](../src/App.jsx) inside `StrictMode`.
- [`src/App.jsx`](../src/App.jsx) owns the application shell: header, main content area, footer, and the dark-mode preference. Dark mode is initialized from `localStorage`, applied through the document-level `data-theme="dark"` attribute, and persisted whenever it changes.
- [`src/App.jsx`](../src/App.jsx) also owns the intended page-selection state and passes navigation callbacks to [`Header`](../src/components/Header/Header.jsx). At present, the active render path displays [`Home`](../src/pages/User/Home.jsx); the imported login/register pages are not currently selected by `App`. There is no router dependency, so page transitions are callback/state based.
- [`Home`](../src/pages/User/Home.jsx) loads recent threads through [`threadService`](../src/services/threadService.js). It renders [`ThreadList`](../src/components/ThreadList/ThreadList.jsx), and switches to [`ThreadPage`](../src/pages/User/ThreadPage.jsx) when a thread is selected. `ThreadPage` loads comments through [`commentService`](../src/services/commentService.js), then composes `ThreadCard`, `CommentForm`, and `CommentList`.
- The service modules are the data-access boundary. They currently return/filter/sort exports from [`data/dummyData.js`](../data/dummyData.js) and use async-shaped functions where appropriate so a future API implementation can replace the dummy logic without moving data fetching into presentational components. `mongoose` is installed but there is no backend or database connection in this frontend.
- Dummy relationships are string IDs: users use `_id`, threads refer to `author` and `subreddit`, and comments refer to `thread` and `user`. Preserve those shapes when changing fixtures or service behavior. Thread vote totals are derived in `ThreadCard` from `upvotedBy.length - downvotedBy.length`; comment cards use the fixture’s `voteCount`.
- [`src/index.css`](../src/index.css) and [`src/App.css`](../src/App.css) define the global reset, Bootstrap overrides, layout, and light/dark CSS variables. Component and page styles are colocated beside their JSX files and imported by the component/page. Bootstrap Icons are loaded from the CDN link in [`index.html`](../index.html).

## Repository-specific conventions

- Prefer React-Bootstrap components (`Container`, `Card`, `Button`, `Form`, `Row`, `Col`, etc.) over raw HTML equivalents. Prefer Bootstrap utility classes for spacing, layout, typography, borders, and shadows.
- Avoid adding inline styles or new custom CSS classes when an existing Bootstrap utility or project class is sufficient. When custom styling is necessary, keep it in the colocated CSS file and use the existing CSS variables (`--bg-white`, `--text-dark`, `--primary-blue`, `--border-light`, and related theme variables) so dark mode remains consistent.
- Preserve the existing responsive approach: Bootstrap layout utilities plus mobile media queries around the `767px`/`768px` breakpoints. Avoid fixed widths that can cause horizontal overflow; the global layout intentionally constrains overflow to the viewport.
- Keep reusable voting UI in [`VoteButtons`](../src/components/Shared/VoteButtons.jsx) and pass handlers/counts from the owning card. Keep data fetching and fixture/API translation in `src/services`, not in reusable presentational components.
- Use callback props for navigation (`onSelect`, `goBack`, and the header’s `onNavigate`) because the project does not use a routing library. If page routing is implemented later, update the app-level flow consistently rather than adding isolated navigation state inside individual cards.
- Keep form controls controlled with local React state, use React-Bootstrap form components, preserve native validation where already present, and use explicit submit/button types and accessible labels for icon-only controls.
- Follow the existing ESLint flat configuration in [`eslint.config.js`](../eslint.config.js): source files are JavaScript/JSX, browser globals are enabled, React Hooks rules are active, and unused variables are errors.
- Keep test setup and component tests in the top-level `tests/` directory as described by [`resources/prompts.md`](../resources/prompts.md); use Vitest with React Testing Library and `jsdom`.
