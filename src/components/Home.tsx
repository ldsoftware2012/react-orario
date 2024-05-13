import Login from "./login";
import { useContext, useEffect, useState } from "react";
import { OrarioDataContext } from "../App";
import "bootstrap/dist/css/bootstrap.css";
import { Menu } from "./Menu";
import { Footer } from "./Footer";
import { GetMissingData, GetRemoteData } from "../data/Datasource";
import { format } from "date-fns";
import { url_Orario } from "../data/config";
import { IDayMissing } from "../interface/interface";
import { Link } from "react-router-dom";
import React from "react";


const MissingDay = ()=>{
  const [mese,SetMeseCorrente] = useState(new Date().Mese())
  const [anno,SetAnno] = useState(new Date().getFullYear())
  const [isloadData, SetIsloadData] = useState(false)
  const [missingdata, Setmissingdata] = useState<IDayMissing[]>([])
  const GlobalData = useContext(OrarioDataContext);


useEffect(() => {
  (async () => {
    try {

if (!isloadData) {

        const NumGiorni = new Date(anno, mese , 0).getDate();
        const startDate = new Date(anno, mese - 2 , 1);
        const endDate = new Date(anno, mese - 1 , NumGiorni);
        
        const data_inizio = format(startDate, "yyyy/MM/dd");
        const data_fine = format(endDate, "yyyy/MM/dd");
  
        const orario = await GetRemoteData(
          url_Orario +
            "?tecnico=" +
            GlobalData?.tecnico +
            "&cliente=" +
            "Tutti *" +
            "&commessa=" +
            "Tutte *" +
            "&datainizio=" +
            data_inizio +
            "&datafine=" +
            data_fine
        );
        const md = GetMissingData(startDate,endDate,GlobalData?.tecnico||"",orario)
        Setmissingdata(md)
        SetIsloadData(true);
}

    } catch (error) {}
  })();
}, [])

  return(
  <>
    {missingdata.map((d:IDayMissing,index) => {
      return(
        <React.Fragment key={index}>
          {d.id != -1 && <p><Link className="text-bg-warning" to={"/updateDataDay?Method=Update&ID="+ d.id}>{d.data && d.data.DataText()} contiene anomalie, mancano {d.missinghours} ore</Link></p>}
          {d.id == -1 && <p><Link className="text-bg-danger" to={"/updateDataDay?Method=Add&Data="+ format(d.data, "yyyy/MM/dd")}>{d.data && d.data.DataText()} contiene anomalie, mancano {d.missinghours} ore</Link></p>} 
        </React.Fragment>
      )})}        
    <div className="text-success"><b>{missingdata.length==0 ? "Tutti gli orari sono corretti" : ""}</b></div>  
    <div className="text-danger"><b>{missingdata.length!=0 ? "Ci sono " + missingdata.length + " anomalie negli orari" : ""}</b></div>  
  </>
  )
}

function Home() {
  const GlobalData = useContext(OrarioDataContext);

  return (
    <>
      <Menu />
      {!GlobalData?.isLogged && <Login />}
      {GlobalData?.isLogged && (
        <>
        <br></br>
        <div className="align-items-center justify-content-center text-center mt-5">
          Benvenuto {GlobalData?.tecnico}
        </div>        
        <div className="m-5"><MissingDay/></div>
        </>
      )}     
      <Footer />
    </>
  );
}

export default Home;
