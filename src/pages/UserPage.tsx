import { useParams } from "react-router-dom";
import LanguageFilterComponent from "../components/language-filter/LanguageFilterComponent";
import RepoListComponent from "../components/repo-list/RepoListComponent";
import UserInfoComponent from "../components/user-info/UserInfoComponent";
import { fetchUserData, fetchUserRepos } from "../core/api/github";
import { useEffect, useState } from "react";
import type { GithubRepo, GithubUser } from "../core/types/github";
import LoaderComponent from "../components/loader/LoaderComponent";
import ErrorStateComponent from "../components/error-state/ErrorStateComponent";

const UserPage = () => {
  const { username } = useParams<{ username: string }>();

  const [user, setUser] = useState<GithubUser | null>(null);
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!username) return;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [userData, userRepos] = await Promise.all([
          fetchUserData(username),
          fetchUserRepos(username),
        ]);
        setUser(userData);
        setRepos(userRepos);
      } catch (error) {
        setError((error as Error).message || "Unexpected error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [username]);

  if (loading) return <LoaderComponent />
  if (error) return <ErrorStateComponent /> //msg={error}
  if (!user) return <p>User not found</p>

  return (
    <>
      <UserInfoComponent user={user}/>
      <LanguageFilterComponent />
      <RepoListComponent repos={repos} />
    </>
  );
};

export default UserPage;
