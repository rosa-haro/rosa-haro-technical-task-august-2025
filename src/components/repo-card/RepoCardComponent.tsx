import type { GithubRepo } from "../../core/types/github";
import { timeAgo } from "../../core/utils/time";
import CircleIcon from "../../assets/icons/circle.svg?react";
import StarIcon from "../../assets/icons/star.svg?react";
import ForkIcon from "../../assets/icons/fork.svg?react";
import { getLanguageColor } from "../../core/utils/languageColors";

type Props = { repo: GithubRepo };

const RepoCardComponent = ({ repo }: Props) => {
  return (
    <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
      <article
        className="card-base h-full flex flex-col p-5 md:p-6 transition-all hover:bg-white/[0.06] hover:translate-y-[-2px] hover:shadow-lg/10 focus-within:shadow-lg/10 ring-1 ring-[var(--color-border)]/60"
        aria-labelledby={`repo-${repo.id}`}
      >
        <h3
          id={`repo-${repo.id}`}
          className="text-[length:var(--font-h3)] font-semibold tracking-tight mb-1 truncate-1"
        >
          {repo.name}
        </h3>

        <div className="min-h-[2rem]">
          {repo.description && (
            <p className="text-[color:var(--color-muted)]/90 leading-relaxed truncate-2 mb-3">
              {repo.description}
            </p>
          )}
        </div>
        <div className="grid gap-2 text-[length:var(--font-meta)] mt-auto">
          <div className="flex items-center gap-2 flex-wrap">
            {repo.language && (
              <div className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5">
                <CircleIcon
                  className="h-2.5 w-2.5 fill-current"
                  style={{ color: getLanguageColor(repo.language) }}
                  aria-hidden={true}
                />
                <span className="truncate-1">{repo.language}</span>
              </div>
            )}

            {repo.stargazers_count > 0 && (
              <div className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-[color:var(--color-text)]/90">
                <StarIcon className="h-4 w-4 text-[#ffc107] fill-current" />
                <span aria-label="Startgazers count">
                  {repo.stargazers_count}
                </span>
              </div>
            )}

            {repo.forks > 0 && (
              <div className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-[color:var(--color-text)]/90">
                <ForkIcon className="h-4 w-4 text-[color:var(--color-muted)] fill-current" />
                <span aria-label="Forks count">{repo.forks}</span>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-1">
            <span className="text-[color:var(--color-muted)]">
              Updated {timeAgo(repo.updated_at)}
            </span>
          </div>
        </div>
      </article>
    </a>
  );
};

export default RepoCardComponent;
