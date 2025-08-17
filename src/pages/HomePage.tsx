import UserSearchComponent from "../components/user-search-component/UserSearchComponent";

const HomePage = () => {
  return (
    <main className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8 pt-12 md:pt-20">
      <h1 className="text-[length:var(--font-display)] font-bold text-center">GitHub Repo Searcher</h1>
      <p className="text-[length:var(--font-body)] text-[color:var(--color-muted)] text-center mt-2">Search any GitHub user and explore their repositories</p>
      <div className="mt-10">
        <UserSearchComponent />
        
        </div>
        
    </main>
  );
};

export default HomePage;
