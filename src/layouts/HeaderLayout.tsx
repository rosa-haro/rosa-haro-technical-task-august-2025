import { Outlet } from "react-router-dom";
import HeaderComponent from "../components/header-component/HeaderComponent";

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
