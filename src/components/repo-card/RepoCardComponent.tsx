import type { GithubRepo } from "../../core/types/github";
import { timeAgo } from "../../core/utils/time";

type Props = { repo: GithubRepo };

const RepoCardComponent = ({ repo }: Props) => {
  return (
    <article
      className="card-base p-5 md:p-6 transition-all hover:bg-white/[0.06] hover:translate-y-[-1px] hover:shadow-lg/10 focus-within:shadow-lg/10 ring-1 ring-[var(--color-border)]/60"
      aria-labelledby={`repo-${repo.id}`}
    >
      <h3
        id={`repo-${repo.id}`}
        className="text-[length:var(--font-h3)] font-semibold tracking-tight mb-1 truncate-1"
      >
        <a
          href={repo.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline underline-offset-2 decoration-white/40"
        >
          {repo.name}
        </a>
      </h3>

      {repo.description && (
        <p className="text-[color:var(--color-muted)]/90 leading-relaxed truncate-2 mb-4">
          {repo.description}
        </p>
      )}
      <div className="grid gap-3 text-[length:var(--font-meta)]">
        <div className="flex items-center gap-2 flex-wrap">
          {repo.language && (
            <div className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5">
              <span className="inline-block h-2 w-2 rounded-full bg-[var(--color-primary)]"></span>
              <span className="truncate-1">{repo.language}</span>
            </div>
          )}

          {repo.stargazers_count > 0 && (
            <div className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-[color:var(--color-text)]/90">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4 shrink-0"
              >
                <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
              <span>{repo.stargazers_count}</span>
            </div>
          )}

          {repo.forks > 0 && (
            <div className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-[color:var(--color-text)]/90">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4 shrink-0"
              >
                <path d="M7 4a3 3 0 1 0 2 5.236V11a3 3 0 0 0 3 3h1a3 3 0 0 0 3-3V9.236A3 3 0 1 0 15 6a3 3 0 0 0 .999 2.27V11a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V8.27A3 3 0 1 0 7 4z" />
              </svg>
              <span>{repo.forks}</span>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <span className="text-[color:var(--color-muted)]">
            Updated {timeAgo(repo.updated_at)}
          </span>
        </div>
      </div>
    </article>
  );
};

export default RepoCardComponent;
