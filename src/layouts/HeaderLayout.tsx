import { Outlet } from "react-router-dom";
import HeaderComponent from "../components/header/HeaderComponent";

/**
 * HeaderLayout — shared layout with a glass header and an outlet for pages.
 *
 * Responsibilities:
 * - Renders `HeaderComponent` (brand + search) on top.
 * - Renders the current route's element via `<Outlet />`.
 *
 * Notes:
 * - Kept minimal so pages own their spacing and grid/layout.
 *
 * @example
 * <Route element={<HeaderLayout />}>
 *   <Route path="/user/:username" element={<UserPage />} />
 * </Route>
 */

const HeaderLayout = () => {
  return (
    <>
      <HeaderComponent />
      <div>
        <Outlet />
      </div>
    </>
  );
};

export default HeaderLayout;
