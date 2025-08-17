import UserSearchComponent from "../user-search-component/UserSearchComponent";

const HeaderComponent = () => {
  return (
    <header className="header-glass">
      <div className="relative max-w-7xl mx-auto px-4 md:px-6 lg:px-8 h-14 flex items-center justify-between">
        <a
          href="/"
          className="text-[length:var(--font-h2)] font-semibold hover:opacity-90"
        >
          <span className="text-[color:var(--color-accent)] font-bold">GitHub </span>
          Repo Searcher
        </a>

        <div className="w-full max-w-md">
          <UserSearchComponent />
        </div>
      </div>
    </header>
  );
};

export default HeaderComponent;
