import { Link, useParams } from "react-router-dom";
import RepoListComponent from "../components/repo-list/RepoListComponent";
import UserInfoComponent from "../components/user-info/UserInfoComponent";
import { fetchAllUserRepos, fetchUserData } from "../core/api/github";
import { useEffect, useMemo, useState } from "react";
import type { GithubRepo, GithubUser } from "../core/types/github";
import LoaderComponent from "../components/loader/LoaderComponent";
import ErrorStateComponent from "../components/error-state/ErrorStateComponent";
import RepoFiltersComponent from "../components/repo-filters/RepoFiltersComponent";
import EmptyStateComponent from "../components/empty-state/EmptyStateComponent";

/**
 * UserPage — fetches a user's GitHub profile and repositories, then provides
 * client-side filtering (text + language) and simple incremental reveal.
 * 
 * Data loading:
 * - Loads user profile and all repositories in parallel (see `fetchUserData` and `fetchAllUserRepos`).
 * - On `username` change: resets filters and local paging, aborts in-flight requests.
 * 
 * UX:
 * - Shows loader while fetching.
 * - On error: shows a generic error state with a link back to search.
 * - If user not found: shows a compact empty state.
 * - Filters are **combinable** and operate in-memory over the full dataset.
 * - Local paging reveals more items in steps (no server pagination).
 * 
 * Accessibility:
 * - Delegates accessibility to child components (UserInfo, RepoFilters, RepoList).
 */

/**
 * Number of repositories revealed per "Show more" click.
 * Keeps the initial render lightweight while allowing the full list in small steps.
 */

const VISIBLE_REPOS_STEP = 12;


/**UserPage
 * 
 * Responsibilities:
 * - Derives `username` from the route.
 * - Fetches `GithubUser` + all `GithubRepo[]` (walking the API with `perPage=100`).
 * - Derives language options from the dataset (unique + alphabetical).
 * - Applies in-memory filters:
 *    - Text: case-insensitive substring match on `repo.name`.
 *    - Language: exact match on `repo.language` (empty = all).
 * - Resets the visible slice when filters change; reveals more with "Show more".
 *
 * Error handling:
 * - AbortError during navigation/typing is benign (ignored).
 * - Other errors are surfaced via `ErrorStateComponent` with a "Back to search" action.
 *
 * @example
 * // Route: /user/:username
 * <Route path="/user/:username" element={<UserPage />} />
 */
 
const UserPage = () => {
  const { username } = useParams<{ username: string }>();

  const [user, setUser] = useState<GithubUser | null>(null);
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [repoQuery, setRepoQuery] = useState("");
  const [language, setLanguage] = useState<string>("");

  const [visibleCount, setVisibleCount] = useState(VISIBLE_REPOS_STEP);

  /**
   * Loads user profile and repos in parallel.
   * Resets filters and paging when the username changes.
   */
  useEffect(() => {
    if (!username) return;
    const controller = new AbortController();

    const load = async () => {
      setLoading(true);
      setError(null);
      setRepos([]);
      setRepoQuery("");
      setLanguage("");
      setVisibleCount(VISIBLE_REPOS_STEP);

      try {
        const [userData, repos] = await Promise.all([
          fetchUserData(username),
          fetchAllUserRepos(username, { signal: controller.signal }),
        ]);

        setUser(userData);
        setRepos(repos);
      } catch (error: unknown) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setError((error as Error).message || "Unexpected error");
        }
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, [username]);

  /**
   * Derives the language options from dataset.
   *
   * - Sorts alphabetically for a predictable UI.
   */
  const languageOptions = useMemo(() => {
    const set = new Set<string>();
    for (const r of repos) if (r.language) set.add(r.language);
    return [...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [repos]);

  /** Combinable filtering in memory.
   * - Text match: case-insensitivity on repo.name.
   * - Language match: exact equality
   */
  const reposFiltered = useMemo(() => {
    const query = repoQuery.trim().toLowerCase();
    const lang = language;

    return repos.filter((r) => {
      const nameMatch = query ? r.name.toLowerCase().includes(query) : true;
      const langMatch =
        !lang ? true : (r.language ?? "") === lang;
      return nameMatch && langMatch;
    });
  }, [repos, repoQuery, language]);

  /** Local paging on top of the filtered dataset.
   * Resets when filters change so the user sees the first slice again.
   */
  useEffect(() => {
    setVisibleCount(VISIBLE_REPOS_STEP);
  }, [repoQuery, language]);

  const reposVisible = useMemo(
    () => reposFiltered.slice(0, visibleCount),
    [reposFiltered, visibleCount]
  );

  if (loading)
    return <LoaderComponent label="Loading user and repositories..." />;
  if (error) {
    return (
      <ErrorStateComponent
        message="Failed to load user data and repositories."
        action={<Link to="/" className="button-secondary px-5 py-2">Back to search</Link>}
      />
    );
  }
  if (!user) {
    return (
      <div className="min-h-[80vh] grid place-items-center">
        <EmptyStateComponent title="User not found" className="card-base mx-auto max-w-md px-10 py-8 text-center text-lg"/>

      </div>
    )
}

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-8 items-start">
      <section className="card-base p-4">
        <UserInfoComponent user={user} />
      </section>
      <section className="flex flex-col gap-8">
        <RepoFiltersComponent
          repoQuery={repoQuery}
          onQuerySubmit={setRepoQuery}
          language={language}
          languageOptions={languageOptions}
          onLanguageChange={setLanguage}
        />

        <RepoListComponent repos={reposVisible} />
        {reposFiltered.length > visibleCount && (
          <div>
            <button
              onClick={() => setVisibleCount((c) => c + VISIBLE_REPOS_STEP)}
              className="button-ghost w-full mt-2"
            >
              Show more
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

export default UserPage;
