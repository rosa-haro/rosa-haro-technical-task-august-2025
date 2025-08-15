import { useParams } from "react-router-dom";
import RepoListComponent from "../components/repo-list/RepoListComponent";
import UserInfoComponent from "../components/user-info/UserInfoComponent";
import { fetchUserData, fetchUserRepos } from "../core/api/github";
import { useEffect, useMemo, useState } from "react";
import type { GithubRepo, GithubUser } from "../core/types/github";
import LoaderComponent from "../components/loader/LoaderComponent";
import ErrorStateComponent from "../components/error-state/ErrorStateComponent";
import RepoFiltersComponent from "../components/repo-filters/RepoFiltersComponent";
import EmptyStateComponent from "../components/empty-state/EmptyStateComponent";

/** Number of repos per page when requesting the /users/:username/repos */
const PER_PAGE = 10;
/** How many filtered repositories are currently visible (local paging). */
const VISIBLE_REPOS_STEP = 10;

/** 
* UserPage
* - Fetches user profile and repositories (paginated).
* - Applies local, combinable filters: name + language.
* - Pagination strategy:
*   • Network pagination when not filtering.
*   • Local pagination when filtering (slice in memory).
*/

const UserPage = () => {
  const { username } = useParams<{ username: string }>();

  const [user, setUser] = useState<GithubUser | null>(null);
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [visibleCount, setVisibleCount] = useState(VISIBLE_REPOS_STEP)
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [repoQuery, setRepoQuery] = useState("");
  const [language, setLanguage] = useState<string>("All");

  const isFiltering = repoQuery.trim() !== "" || (language && language !== "All");

  /**
   * Loads user profile and the first page of repos in parallel.
   * Resets filters and paging when the `usename` changes.
   * Notes:
   * - Uses `fetchUserRepos(page=1, perPage=PER_PAGE)`.
   * - Sets `hasNextPage` from the Link header (parsed in the API layer).
   */
  useEffect(() => {
    if (!username) return;
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      setRepos([]);
      setPage(1);
      setHasNextPage(false);
      setRepoQuery("");
      setLanguage("All");
      setVisibleCount(VISIBLE_REPOS_STEP)

      try {
        const [userData, reposPage] = await Promise.all([
          fetchUserData(username),
          fetchUserRepos(username, { page: 1, perPage: PER_PAGE }),
        ]);

        if (cancelled) return;
        setUser(userData);
        setRepos(reposPage.data);
        setHasNextPage(reposPage.hasNextPage);
      } catch (error) {
        if (cancelled) return;
        setError((error as Error).message || "Unexpected error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [username]);

  /**
   * Loads the next page of repos and appends them to `repos`.
   * Safe-guards:
   * - No-op if already loading or no `hasNextPage`.
   * - Re-applies filters automatically via derived memo `reposFiltered`
   */
  const handleLoadMore = async () => {
    if (!username || !hasNextPage || loadingMore) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const { data, hasNextPage: next } = await fetchUserRepos(username, {
        page: nextPage,
        perPage: PER_PAGE,
      });
      setRepos((prev) => [...prev, ...data]);
      setPage(nextPage);
      setHasNextPage(next);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMore(false);
    }
  };

  /**
   * Derives the language options from loaded repos.
   * - Includes "All" as the first option.
   * - Sorts alphabetically for a predictable UI.
   */
  const languageOptions = useMemo(() => {
    const set = new Set<string>();
    for (const r of repos) if (r.language) set.add(r.language);
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))]
  }, [repos])

  /** Local, combinable filtering in memory.
   * - Text match: case-insensitivity on repo.name.
   * - Language match: exact equality, "All" disables the language filter.
   */
  const reposFiltered = useMemo(() => {
    const query = repoQuery.trim().toLowerCase();
    const lang = language;

    return repos.filter(r => {
      const nameMatch = query ? r.name.toLowerCase().includes(query) : true;
      const langMatch =
      !lang || lang === "All" ? true : (r.language ?? "") === lang;
      return nameMatch && langMatch
    })
  }, [repos, repoQuery, language]);

  /**
  * Repositories to display on screen:
  * - When filtering: show a slice of the filtered list (local paging).
  * - When not filtering: show the full (already loaded) list.
  */
  const reposVisible = useMemo(() => {
    return isFiltering ? reposFiltered.slice(0, visibleCount): reposFiltered;
  }, [reposFiltered, visibleCount, isFiltering])

  useEffect(() => {
    setVisibleCount(VISIBLE_REPOS_STEP)
  }, [repoQuery, language])

  if (loading) return <LoaderComponent />;
  if (error) return <ErrorStateComponent />; //msg={error}
  if (!user) return <EmptyStateComponent />;

  return (
    <>
      <UserInfoComponent user={user} />
      <RepoFiltersComponent repoQuery={repoQuery} onQuerySubmit={setRepoQuery} 
      language={language}
      languageOptions={languageOptions}
      onLanguageChange={setLanguage} />
      <RepoListComponent repos={reposVisible} />
      {(isFiltering ? reposFiltered.length > visibleCount : hasNextPage) && (
        <div>
          <button onClick={isFiltering
            ? () => setVisibleCount(c => c + VISIBLE_REPOS_STEP)
            : handleLoadMore} disabled={loadingMore} aria-busy={loadingMore}>
            {!isFiltering && loadingMore ? <LoaderComponent/> : "Show more"}
          </button>
        </div>
      )}
    </>
  );
};

export default UserPage;
