import Sidbar from "./Sidbar";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <div className=" grid grid-rows-[60px_1fr] sm:grid-rows-none sm:grid-cols-[70px_1fr]  font-nunito m-0">
      <Sidbar />
      <div></div>
      <main className="">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;
