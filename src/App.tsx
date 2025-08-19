import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import UserPage from "./pages/UserPage";
import HeaderLayout from "./layouts/HeaderLayout";

/**
 * Application router.
 *
 * Responsibilities:
 * - Mounts React Router with the public routes.
 * - `/` renders `HomePage`.
 * - `/user/:username` renders `UserPage` within `HeaderLayout`.
 *
 * Notes:
 * - `HeaderLayout` provides the shared top header and delegates page layout.
 *
 */

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route element={<HeaderLayout />}>
          <Route path="/user/:username" element={<UserPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
