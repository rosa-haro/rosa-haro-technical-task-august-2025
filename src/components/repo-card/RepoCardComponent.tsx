import type { GithubRepo } from "../../core/types/github";
import { timeAgo } from "../../core/utils/time";

type Props = { repo: GithubRepo };

const RepoCardComponent = ({ repo }: Props) => {
  return (
    <article>
      <h3>
        <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
          {repo.name}
        </a>
      </h3>

      {repo.description && <p>{repo.description}</p>}
      <div>
        {repo.language && (
          <div>
            <span>{repo.language}</span>
          </div>
        )}
        {repo.stargazers_count > 0 && (
          <div>
            <span>{repo.stargazers_count}</span>
          </div>
        )}
        {repo.forks > 0 && (
          <div>
            <span>{repo.forks}</span>
          </div>
        )}
        <div>
          <span>Updated {timeAgo(repo.updated_at)}</span>
        </div>
      </div>
    </article>
  );
};

export default RepoCardComponent;
