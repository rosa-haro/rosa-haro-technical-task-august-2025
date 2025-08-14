import type { GithubUser } from "../../core/types/github";
import { normalizeUrl } from "../../core/utils/url";

type Props = { user: GithubUser };

const UserInfoComponent = ({ user }: Props) => {
  const blogUrl = normalizeUrl(user.blog);

  return (
    <section aria-label="User profile">
      <div>
        <img src={user.avatar_url} alt={`${user.login}'s avatar`} />
      </div>
      <header>
        <h2>{user.name ?? user.login}</h2>
        <a href={user.html_url} target="_blank" rel="noopener noreferrer">
          @{user.login}
        </a>
      </header>

      {user.bio && <p>{user.bio}</p>}
      <ul>
        <li>
          <span>Followers</span>
          <span>{user.followers}</span>
        </li>
        <li>
          <span>Following</span>
          <span>{user.following}</span>
        </li>
      </ul>

      {(user.location || user.email || blogUrl) && (
        <div>
          {user.location && (
            <div>
              <p>{user.location}</p>
            </div>
          )}
          {user.email && (
            <div>
              <a href={`mailto:${user.email}`}>{user.email}</a>
            </div>
          )}
          {blogUrl && (
            <div>
              <a href={blogUrl} target="_blank" rel="noopener noreferrer">
                {user.blog}
              </a>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default UserInfoComponent;
