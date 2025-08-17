import type { GithubRepo } from "../../core/types/github";
import EmptyStateComponent from "../empty-state/EmptyStateComponent";
import RepoCardComponent from "../repo-card/RepoCardComponent";

type Props = { repos: GithubRepo[] };

const RepoListComponent = ({ repos }: Props) => {
  if (!repos || repos.length === 0) {
    return (
      <EmptyStateComponent
        title="No repositories match your filters"
        description="Adjust the search or language filter."
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
