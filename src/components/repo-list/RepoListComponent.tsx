import type { GithubRepo } from "../../core/types/github";
import EmptyStateComponent from "../empty-state/EmptyStateComponent";
import RepoCardComponent from "../repo-card/RepoCardComponent";

/**
 * List of repositories with empty-state handling.
 * 
 * Responsibilities:
 * - Renders a responsive grid of `RepoCardComponent`.
 * - If no repos are provided, shows a generic `EmptyStateComponent`.
 * 
 * Accessibility:
 * - Wraps the list in a `<section aria-label="Repositories">`.
 */

/**
 * Props for RepoListComponent.
 * 
 * @property {GithubRepo[]} repos - Repositories to render. If empty, an empty state is shown.
 */

type Props = { repos: GithubRepo[] };

/**
 * RepoListComponent
 * 
 * Displays the provided repositories as a two-column grid on medium screens and up,
 * falling back to a single column on small screens.
 * 
 * @example
 * <RepoListComponent repos={repos} />
 */

const RepoListComponent = ({ repos }: Props) => {
  if (!repos || repos.length === 0) {
    return (
      <EmptyStateComponent
        title="No repositories match your filters."
        className="col-span-full card-base p-8 text-center"
      />
    );
  }

  return (
    <section aria-label="Repositories">
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
      {repos.map((r) => (
        <li key={r.id}>

          <RepoCardComponent repo={r} />
        </li>
      ))}

      </ul>
    </section>
  );
};

export default RepoListComponent;
