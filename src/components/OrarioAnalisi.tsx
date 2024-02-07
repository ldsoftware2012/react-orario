import { useContext, useEffect, useState } from "react";
import { OrarioDataContext } from "../App";
import { GetRemoteOrarioData, GetRemoteTecniciData } from "../data/Datasource";
import { url_Orario, url_Tecnici } from "../data/config";
import { format, getDate } from "date-fns";
import { ITecnico } from "../interface/interface";
import AnalisiMese from "./AnalisiMese";
import { Menu } from "./Menu";
import { Footer } from "./Footer";

export default function OrarioAnalisi() {
  const GlobalData = useContext(OrarioDataContext);
  const [Orari, setOrari] = useState<[]>([]);
  const [Anno, setAnno] = useState(GlobalData?.data_ref.Anno()||2023);
  const [Mese, setMese] = useState(GlobalData?.data_ref.Mese()||11);
  const [isLoadData, setIsLoadData] = useState(false);
  const [tecnici, setTecnici] = useState<ITecnico[]>([]);

  const mesi = [
    { Mese: "Gennaio", Index: 1 },
    { Mese: "Febbraio", Index: 2 },
    { Mese: "Marzo", Index: 3 },
    { Mese: "Aprile", Index: 4 },
    { Mese: "Maggio", Index: 5 },
    { Mese: "Giugno", Index: 6 },
    { Mese: "Luglio", Index: 7 },
    { Mese: "Agosto", Index: 8 },
    { Mese: "Settembre", Index: 9 },
    { Mese: "Ottobre", Index: 10 },
    { Mese: "Novembre", Index: 11 },
    { Mese: "Dicembre", Index: 12 },
  ];
  let anni = [2000];

  for (let index = 2001; index < 2050; index++) {
    anni.push(index);
  }

  useEffect(() => {
    (async () => {
      try {
        setIsLoadData(false);

        const NumGiorni = new Date(Anno, Mese, 0).getDate();
        const startDate = new Date(Anno, Mese - 1, 1);
        const endDate = new Date(Anno, Mese - 1, NumGiorni);

        const data_inizio = format(startDate, "yyyy/MM/dd");
        const data_fine = format(endDate, "yyyy/MM/dd");

        const orario = await GetRemoteOrarioData(
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

        setOrari(orario);
        setIsLoadData(true);

        const tec = await GetRemoteTecniciData(url_Tecnici);
        setTecnici(tec);
      } catch (error) {}
    })();
  }, [Anno, Mese, GlobalData?.tecnico,GlobalData?.isdataUpdated]);

  useEffect(() => {
    try {
      Orari.map((o: any) => {
        {
          o.Index = getDate(o.Data) - 1; //Aggiungo campo Giorno
        }
      });
    } catch (error) {}

    console.log("Orari dal server : ", Orari);
  }, [Orari]);

  function ListaTecnici() {
    return (
      <>
        <div hidden={!GlobalData?.isAdmin}>
          <label className="m-2">Tecnico</label>
          <select
            className="m-2"
            onChange={(tecnico) =>
              tecnico.target.value != null
                ? GlobalData?.setTecnico &&
                  GlobalData?.setTecnico(tecnico.target.value)
                : ""
            }
            value={GlobalData?.tecnico}
          >
            {tecnici.map((c, index) => {
              return <option key={index}>{c.Tecnico}</option>;
            })}
          </select>
        </div>
      </>
    );
  }

  function Filtro() {
    function MesePiu(e: any) {
      let m = Mese;
      let a = Anno
      m = m + 1;

      if (m > 12) {
        m = 1;
        a = a + 1
      }

      setMese(m);
      setAnno(a);
      GlobalData?.setData_ref(new Date(a,m-1,1))
    }

    function MeseMeno(e: any) {
      let m = Mese;
      let a = Anno
      m = m - 1;

      if (m < 1) {
        m = 12;
        a = a -1
      }

      setMese(m);
      setAnno(a);
      GlobalData?.setData_ref(new Date(a,m-1,1))
    }

    function AnnoMeno(e: any): void {
      setAnno(Anno - 1);    
      GlobalData?.setData_ref(new Date(Anno-1,Mese,1))  
    }

    function AnnoPiu(e: any): void {
      setAnno(Anno + 1);
      GlobalData?.setData_ref(new Date(Anno+1,Mese,1))  
    }

    return (
      <>
        {<ListaTecnici />}
        {<button onClick={(e) => MeseMeno(e)}>-</button>}
        {
          <select
            value={Mese}
            onChange={(e) =>
              e.target.value != null ? setMese(parseInt(e.target.value)) : ""
            }
          >
            {mesi.map((m, index) => {
              return (
                <option key={index} value={index + 1}>
                  {m.Mese}
                </option>
              );
            })}
          </select>
        }

        {<button onClick={(e) => MesePiu(e)}>+</button>}

        {<button onClick={(e) => AnnoMeno(e)}>-</button>}
        {
          <select
            value={Anno}
            onChange={(e) =>
              e.target.value != null ? setAnno(parseInt(e.target.value)) : ""
            }
          >
            {anni.map((a, index) => {
              return <option key={index}>{a}</option>;
            })}
          </select>
        }

        {<button onClick={(e) => AnnoPiu(e)}>+</button>}
      </>
    );
  }

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
      <Filtro />
      <div>
        <p></p>
      </div>
      {isLoadData && <AnalisiMese Anno={Anno} Mese={Mese} Orari={Orari} />}
      {!isLoadData && <DataLoading />}
      <Footer />

      
    </>
  );
}
