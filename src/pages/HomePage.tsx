import UserSearchComponent from "../components/user-search/UserSearchComponent";

const HomePage = () => {
  return (
    <main className="max-w-3xl mx-auto px-4 pt-40 md:px-6 md:pt-50">
      <h1 className="text-4xl md:text-[length:var(--font-display)] font-semibold text-center">
        <span className="text-[color:var(--color-accent)] font-bold">
          GitHub{" "}
        </span>
        Repo Searcher
      </h1>
      <p className="text-[length:var(--font-h3)] text-[color:var(--color-muted)] text-center mt-2">
        Search any GitHub user and explore their repositories
      </p>
      <div className="mt-10">
        <UserSearchComponent />
      </div>
    </main>
  );
};

export default HomePage;
