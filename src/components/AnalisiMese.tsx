import { Col, Row, Table } from "react-bootstrap";
import "../css/AnalisiMese.css";
import { Giorno } from "./Giorno";
import { useContext, useEffect, useState } from "react";
import { format } from "date-fns";
import "../interface/interface";
import { Footer } from "./Footer";
import { OrarioDataContext } from "../App";

export default function AnalisiMese(props: any) {
  const row = [1, 2, 3, 4, 5, 6];
  const col = [1, 2, 3, 4, 5, 6, 7];
  
  const [Mese, setMese] = useState<number>(2);
  const [Anno, setAnno] = useState<number>(2024);
  const [Orari, setOrari] = useState<[]>([]);
  const GlobalData = useContext(OrarioDataContext);
  
  let Indice = 0;

  //Adatta i dati ricevuti
  useEffect(() => {
    let i = 0;

    setMese(props.Mese);
    setAnno(props.Anno);

    const d = new Date();

    const NumGiorni = new Date(Anno || 2024, Mese || 1, 0).getDate();

    const ore = props.Orari;

    for (i = 0; i <= NumGiorni - 1; i++) {
      if (ore.find((o: any) => o.Index == i) == null) {
        const data = new Date(props.Anno, props.Mese - 1, i + 1);
        const d = format(data, "yyyy-MM-dd");
        const festivo =
          data.isHoliday() || data.getDay() == 0 || data.getDay() == 6;

        ore.push({Index: i,Festivo: festivo,Ore_Ord: "Assente",Giorno: data.getDay(),});
      }
    }

    const o = ore.filter((o: any) => !isNaN(o.Index));

    setOrari(o);
  }, [props.Mese, props.Anno]);

  const d = new Date(Anno || 2024, (Mese || 1) - 1);
  let primogiorno = d.getDay();
  if (primogiorno < 0) {
    primogiorno = 6;
  }
  if (primogiorno == 0) {
    primogiorno = 7;
  }

  let giorno = 0;

  return (
    <>
    <h1 className="text-center">{new Date(Anno,Mese,1).MeseTesto()} {Anno} </h1>
      <label className="px-2">Abilita Modifiche<span className="px-2">
        <input type="checkbox" 
        checked={GlobalData?.isEnableChange == "true"} 
        onChange={(e)=>GlobalData?.setIsEnableChange(e.currentTarget.checked ? "true" : "false")}>
        </input></span>
      </label>
      <Table className="Calendario">
        {row.map((row) => {
          return (
            <Row key={row} className="Row">
              {col.map((col) => {
                Indice = Indice + 1;
                giorno = col + (row - 1) * 7;                
                const NumGiorni = new Date(Anno, Mese, 0).getDate();
                const data = new Date(
                  Anno,
                  Mese - 1,
                  Indice - (primogiorno - 1)
                );
                let isValidDay = Indice >= primogiorno && Indice < NumGiorni + primogiorno
                const festivo = data.isHoliday() || data.getDay() == 0 || data.getDay() == 6;
                return (
                  <>
                  <Col className="Col">
                    {isValidDay ? data.GiornoTesto() : ""}                    
                    {/* Scrivo numero giorni */}
                    {                      
                      <div>
                        {
                          <h4
                            className={`${festivo ? "Festivo text-danger" : ""} rounded`}>
                            <u>{isValidDay ? Indice - primogiorno + 1 : ""}</u>                            
                          </h4>
                        }
                      </div>
                    }

                    {/* Scrivo gli orari contenuti nei dati */}
                    {Orari.filter((d: any) => d.Index + primogiorno == giorno && d.Index < NumGiorni).map((d: any) => {
                      return <Giorno Anno={Anno} Mese={Mese} giorno={Indice - primogiorno + 1} Dati={d} />;
                    })}                    
                  </Col>
                  </>
                );
              })}
            </Row>
          );
        })}
      </Table>
      <Footer />
    </>
  );
}
