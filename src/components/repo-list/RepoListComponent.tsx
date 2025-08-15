import type { GithubRepo } from "../../core/types/github";
import RepoCardComponent from "../repo-card/RepoCardComponent";

type Props = { repos: GithubRepo[] };

const RepoListComponent = ({ repos }: Props) => {

  if (!repos || repos.length === 0) {
    return <p>No repositories found.</p>
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
