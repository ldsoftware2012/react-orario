import Login from "./login";
import { useContext, useRef, useState } from "react";
import { OrarioDataContext } from "../App";
import "bootstrap/dist/css/bootstrap.css";
import { Menu } from "./Menu";
import { Footer } from "./Footer";

function Home() {
  const GlobalData = useContext(OrarioDataContext);
  const target = useRef(null);

  return (
    <>
      <Menu />
      {!GlobalData?.isLogged && <Login />}
      {GlobalData?.isLogged && (
        <div className="align-items-center justify-content-center text-center">
          Benvenuto {GlobalData?.tecnico}
        </div>
      )}
      <Footer />
    </>
  );
}

export default Home;
