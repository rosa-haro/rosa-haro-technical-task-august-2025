import UserSearchComponent from "../components/user-search-component/UserSearchComponent";

const HomePage = () => {
  return (
    <>
      <h1>GitHub Repo Searcher</h1>
      <UserSearchComponent />
      <div className="bg-blue-500 text-white p-4 rounded">
  Tailwind is working! 🎉
</div>

    </>
  );
};

export default HomePage;
