import { BrowserRouter, Route, Routes } from "react-router-dom";
// import store from "./core/redux/store/store";
import HomePage from "./pages/HomePage";
// import { Provider } from "react-redux";
import UserPage from "./pages/UserPage";

function App() {
  return (
    // <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/user/:username" element={<UserPage />} />
        </Routes>
      </BrowserRouter>
    // </Provider>
  );
}

export default App;
