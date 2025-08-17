import UserSearchComponent from "../user-search-component/UserSearchComponent";

const HeaderComponent = () => {
  return (
    <header className="header-glass">
      <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 h-auto py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <a
          href="/"
          className="text-[length:var(--font-h2)] font-semibold hover:opacity-90 shrink-0"
        >
          <span className="text-[color:var(--color-accent)] font-bold">GitHub </span>
          Repo Searcher
        </a>

        <div className="w-full sm:max-w-md">
          <UserSearchComponent />
        </div>
      </div>
    </header>
  );
};

export default HeaderComponent;
