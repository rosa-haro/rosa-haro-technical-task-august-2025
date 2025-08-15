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
      />
    );
  }

  return (
    <div>
      {repos.map((r) => (
        <RepoCardComponent key={r.id} repo={r} />
      ))}
    </div>
  );
};

export default RepoListComponent;
