import { useContext, useEffect, useState } from "react";
import TableOrario from "./TableOrario";
import {useSearchParams } from "react-router-dom";
import SearchMenu from "./SearchMenu";
import { OrarioDataContext } from "../App";
import { Menu } from "./Menu";
import { Footer } from "./Footer";
import { DataLoading, Somma } from "../data/Datasource";
import Danea from "./Danea";
import RI from "./RI";
import StampaOre from "./StampaOre";

export default function OrarioList() {
  const GlobalData = useContext(OrarioDataContext);
  const [Parameters] = useSearchParams();
  const Tipo = Parameters.get("Tipo");
  const [total0,SetTotal0]=useState(false)

  useEffect(() => {
    const { total0 } =  Somma(GlobalData?.orario);
    SetTotal0(total0)
  }, [GlobalData?.orario])
  
  return (
    <>
      <Menu />
      <SearchMenu />
      {GlobalData?.isDataLoad && <TableOrario Tipo={Tipo} />}
      {!GlobalData?.isDataLoad && <DataLoading />}
      {!total0 && <RI Orari={GlobalData?.orario}/>}
      {!total0 && <Danea Orari={GlobalData?.orario}/>}
      {!total0 && <StampaOre Orari={GlobalData?.orario}/>}
      <Footer />
    </>
  );
}
