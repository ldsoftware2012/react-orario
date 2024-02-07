import { useContext } from "react";
import TableOrario from "./TableOrario";
import {useSearchParams } from "react-router-dom";
import SearchMenu from "./SearchMenu";
import { OrarioDataContext } from "../App";
import { Menu } from "./Menu";
import { Footer } from "./Footer";

export default function OrarioList() {
  const GlobalData = useContext(OrarioDataContext);
  const [Parameters] = useSearchParams();
  const Tipo = Parameters.get("Tipo");

  function DataLoading() {
    return (
      <div hidden className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="sr-only"></span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Menu />
      <SearchMenu />
      {GlobalData?.isDataLoad && <TableOrario Tipo={Tipo} />}
      {!GlobalData?.isDataLoad && <DataLoading />}
      <Footer />
    </>
  );
}
