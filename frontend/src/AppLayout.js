import React from "react";
import Header from "./components/Home/Header";
import { Outlet } from "react-router-dom";
import { useContext } from "react";
import CardContext from "./context/context";

const AppLayout = () => {
  const auth = useContext(CardContext);

  return (
    <>
      <Header />
      <Outlet context={auth} />
    </>
  );
};

export default AppLayout;
