import { NavLink } from "react-router-dom";
import logo from "../../assets/40163 - Edited.jpg";
import userPng from "../../assets/user.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faCog, faHome } from "@fortawesome/free-solid-svg-icons";
import { faClipboard, faGrinBeamSweat } from "@fortawesome/free-regular-svg-icons";

function Sidbar() {
  return (
    <div className="bg-white border-r border-r-black/10 w-full flex flex-col fixed top-0 left-0 max-w-[70px] h-full">
      <NavLink
        to="/"
        className="my-6 pb-2 text-center border-b border-b-black/10"
      >
        <img src={logo} alt="logo" className="w-full px-4" />
        <p className="text-sm text-cyan-800">INVOICE</p>
      </NavLink>
      <div className="flex flex-row sm:flex-col">
        <h1 className="text-slate-800/80 text-center mb-2">Menu</h1>
        <ul className="text-center flex sm:flex-col">
          <li className="my-4">
            <NavLink
              to="/"
              className="bg-neutral-100 rounded-md cursor-pointer  pt-3 pb-2 px-3 hover:text-white hover:bg-cyan-800"
            >
              <FontAwesomeIcon icon={faHome} className="text-lg" />
            </NavLink>
          </li>
          <li className="my-4">
            <NavLink
              to="/"
              className="bg-neutral-100 rounded-md cursor-pointer  pt-3 pb-2 px-3 hover:text-white hover:bg-cyan-800"
            >
              <FontAwesomeIcon icon={faClipboard} className="text-lg" />
            </NavLink>
          </li>
          <li className="my-4">
            <NavLink
              to="/"
              className="bg-neutral-100 rounded-md cursor-pointer  pt-3 pb-2 px-3 hover:text-white hover:bg-cyan-800"
            >
              <FontAwesomeIcon icon={faCog} className="text-lg" />
            </NavLink>
          </li>
          <li className="my-4">
            <NavLink
              to="/"
              className="bg-neutral-100 rounded-md cursor-pointer  pt-3 pb-2 px-3 hover:text-white hover:bg-cyan-800"
            >
              <FontAwesomeIcon icon={faGrinBeamSweat} className="text-lg" />
            </NavLink>
          </li>
        </ul>
      </div>
      <NavLink to="/" className="mt-auto mb-4">
        <img src={userPng} alt="user" className="w-full px-4" />
      </NavLink>
    </div>
  );
}

export default Sidbar;
