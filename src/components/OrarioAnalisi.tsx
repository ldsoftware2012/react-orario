import { useContext, useEffect, useState } from "react";
import { OrarioDataContext } from "../App";
import { GetRemoteData, ListaTecnici } from "../data/Datasource";
import { url_Orario } from "../data/config";
import { format, getDate } from "date-fns";
import AnalisiMese from "./AnalisiMese";
import { Menu } from "./Menu";
import { Footer } from "./Footer";
import Select from "react-select"

export default function OrarioAnalisi() {
  const GlobalData = useContext(OrarioDataContext);
  const [Orari, setOrari] = useState<[]>([]);
  const [Anno, setAnno] = useState(GlobalData?.data_ref.Anno()||2023);
  const [Mese, setMese] = useState(GlobalData?.data_ref.Mese()||11);
  const [isLoadData, setIsLoadData] = useState(false);
  const mesiOptions = [{value:1,label:"Gennaio"},{value:2,label:"Febbraio"},{value:3,label:"Marzo"},{value:4,label:"Aprile"}
        ,{value:5,label:"Maggio"},{value:6,label:"Giugno"},{value:7,label:"Luglio"},{value:8,label:"Agosto"}
        ,{value:9,label:"Settembre"},{value:10,label:"Ottobre"},{value:11,label:"Novembre"},{value:12,label:"Dicembre"}]

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


        let giornilavorati=[0]
        orario.map((o:any)=>{
          const d = new Date(o.Data)
          giornilavorati.push(d.Giorno())
        })
        

        for (let i = 1; i <= NumGiorni; i++) {
          if(!giornilavorati.includes(i)) {
            let data = new Date(Anno, Mese - 1, i );
            let festivo = data.isHoliday() || data.getDay() === 0 || data.getDay() === 6;
            orario.push({Index : i+1 ,Festivo: festivo,Ore_Ord: "Assente",Giorno: data.getDay(),data:format(data, "dd/MM/yyyy")});
          }
        }        

        orario.filter((o:any) => o.Ore_Ord != "Assente").map((o:any)=>o.Index = getDate(o.Data) )

        setOrari(orario);
        setIsLoadData(true);

      } catch (error) {}
    })();
  }, [Anno, Mese, GlobalData?.tecnico,GlobalData?.isdataUpdated]);

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
      <div className="bg-secondary-subtle text-center d-flex flex-wrap justify-content-center">
        <div className="w-100">
          {GlobalData?.isAdmin && <ListaTecnici />}
        </div>

        <div className="Container d-flex bd-highlight bd-highlight">
            <button className="btn border btn-primary" onClick={(e) => AnnoMeno(e)}>-</button>
            <input 
              className="text-center"              
              type="number"
              value={Anno}     
              onChange={(e)=>setAnno(parseInt(e.target.value))}     
            />
            <button className="btn border btn-primary" onClick={(e) => AnnoPiu(e)}>+</button>
        </div>
        <div className="d-flex bd-highlight">
            <button className="btn border btn-primary" onClick={(e) => MeseMeno(e)}>-</button>    
            <Select
              options={mesiOptions}
              value={{value:Mese,label:mesiOptions.at(Mese-1)?.label}}
              onChange={(e)=>setMese(e?.value || 0)}
              />
            <button className="btn border btn-primary" onClick={(e) => MesePiu(e)}>+</button>     

          </div>
      </div>
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
      <div style={{marginTop:"100px"}}>
        <Filtro />
      </div>
      <div>
        <p></p>
      </div>
      {isLoadData && <AnalisiMese Anno={Anno} Mese={Mese} Orari={Orari} />}
      {!isLoadData && <DataLoading />}
      <Footer />
    </>
  );
}
