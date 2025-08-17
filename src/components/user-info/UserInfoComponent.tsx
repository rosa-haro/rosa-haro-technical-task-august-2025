import type { GithubUser } from "../../core/types/github";
import { normalizeUrl } from "../../core/utils/url";
import LocationIcon from "../../assets/icons/location.svg?react";

type Props = { user: GithubUser };

const UserInfoComponent = ({ user }: Props) => {
  const blogUrl = normalizeUrl(user.blog);

  return (
    <section className="card-base px-6 pt-6 pb-8" aria-label="User profile">

        <div className="flex flex-col gap-3 lg:gap-4 lg:text-center">
        <div className="flex items-center gap-3 lg:flex-col lg:gap-4">
          <img
            src={user.avatar_url}
            alt={`${user.login}'s avatar`}
            className="h-14 w-14 lg:h-28 lg:w-28 rounded-full border border-[var(--color-border)]"
          />

          <div className="min-w-0">
            <h2 className="text-[length:var(--font-h2)] font-semibold truncate-1">
              {user.name ?? user.login}
            </h2>
            <a
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[color:var(--color-muted)] block truncate"
            >
              @{user.login}
            </a>
          </div>
   </div>

        {user.bio && (
          <p className="text-[length:var(--font-body)] text-center whitespace-pre-wrap break-words">
            {user.bio}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2 justify-start lg:justify-center">
          <span className="badge-accent">Followers {user.followers}</span>
          <span className="badge-accent">Following {user.following}</span>
        </div>

        {(user.location || user.email || blogUrl) && (
          <ul className="space-y-1">
            {user.location && (
              <li className="text-[length:var(--font-body)] truncate-1 flex items-start lg:justify-center gap-1">
                <span><LocationIcon className="h-5 w-5" /></span>
                <span>{user.location}</span>
              </li>
            )}

            {user.email && (
              <li className="text-[length:var(--font-body)]">
                <a
                  href={`mailto:${user.email}`}
                  className="underline decoration-white/40 underline-offset-2 hover:decoration-white truncate-1"
                >
                  {user.email}
                </a>
              </li>
            )}

            {blogUrl && (
              <li className="text-[length:var(--font-body)]">
                <a
                  href={blogUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-white/40 underline-offset-2 hover:decoration-white truncate-1"
                  title={blogUrl}
                >
                  {blogUrl}
                </a>
              </li>
            )}
          </ul>
        )}
      </div>
    </section>
  );
};
export default UserInfoComponent;
