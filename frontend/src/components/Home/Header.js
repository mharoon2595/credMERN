import React, { useContext } from "react";
import CardContext from "../../context/context";
import credLogo from "../../assets/credLogo.png";
import { Link } from "react-router-dom";

const Header = () => {
  const auth = useContext(CardContext);

  return (
    <>
      <div className="flex w-full justify-between bg-yellow-400 px-3 py-1 h-[10%]">
        {auth.token ? (
          <>
            <img
              src={credLogo}
              alt="companyLogo"
              className="w-15 h-10 my-auto"
            />
            <div className="flex gap-2">
              <button className="border border-black rounded-md px-2 hover:bg-black hover:text-yellow-400 my-[10px]">
                <Link to="/add">Add Card</Link>
              </button>
              <button className="border border-black rounded-md px-2 hover:bg-black hover:text-yellow-400 my-[10px]">
                <Link to="/cards">View Cards</Link>
              </button>
            </div>
          </>
        ) : (
          <>
            <img
              src={credLogo}
              alt="companyLogo"
              className="w-15 h-10 my-auto"
            />
            <button className="border border-black rounded-md px-2 hover:bg-black hover:text-yellow-400 my-[10px]">
              <Link to="/login">Login</Link>
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default Header;
