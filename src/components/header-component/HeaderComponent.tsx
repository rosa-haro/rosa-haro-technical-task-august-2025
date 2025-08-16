import UserSearchComponent from "../user-search-component/UserSearchComponent";

const HeaderComponent = () => {
  return (
    <header className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-black/30">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 h-14 flex items-center justify-between">
        <a
          href="/"
          className="text-[length:var(--font-h3)] font-semibold hover:opacity-90"
        >
          GitHub Repo Searcher
        </a>

        <div className="w-full max-w-md">
          <UserSearchComponent />
        </div>
      </div>
    </header>
  );
};

export default HeaderComponent;
