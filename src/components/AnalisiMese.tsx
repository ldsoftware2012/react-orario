import { Col, Row, Table } from "react-bootstrap";
import "../css/AnalisiMese.css";
import { useContext } from "react";
import "../interface/interface";
import { Footer } from "./Footer";
import { OrarioDataContext } from "../App";
import { DisegnaGiorno } from "./DisegnaGiorno";
import React from "react";

export default function AnalisiMese(props: any) {
  const row = [1, 2, 3, 4, 5, 6];
  const col = [1, 2, 3, 4, 5, 6, 7];
  const {Anno,Mese} = props
  const GlobalData = useContext(OrarioDataContext);
  let Indice = 0;
  let giorno = 0;

  const d = new Date(Anno, (Mese) - 1);
  let primogiorno = d.getDay();
  if (primogiorno < 0) {primogiorno = 6;}
  if (primogiorno == 0) {primogiorno = 7;}
  const NumGiorni = new Date(Anno, Mese, 0).getDate();

  const AbilitaModifiche = ()=>{
    return(
    <>
      <label className="px-2">Abilita Modifiche<span className="px-2">
        <input type="checkbox" 
        checked={GlobalData?.isEnableChange == "true"} 
        onChange={(e)=>GlobalData?.setIsEnableChange(e.currentTarget.checked ? "true" : "false")}>
        </input></span>
      </label>
    </>)
  }

  return (
    <>
    <u><h1 className="text-center">{new Date(Anno,Mese,0).MeseTesto()} {Anno} </h1></u>
      
    <AbilitaModifiche/>

    <Table className="Calendario">
        {row.map((row,index) => {
          return (     
            <>
            <React.Fragment key={index}>
              <Row key={row} className="Row">
                {col.map((col,indexCol) => {                  
                  Indice = Indice + 1;
                  return (    
                    <React.Fragment key={indexCol}>
                      <Col className="Col" id={Indice.toString()}>                    
                        {Indice >= primogiorno && (Indice <= NumGiorni + primogiorno - 1) 
                        && <DisegnaGiorno Data={new Date(Anno,Mese-1,Indice-primogiorno+1)} Orari={props.Orari}/>}
                      </Col>
                    </React.Fragment>             
                  );          
                })}
              </Row>
            </React.Fragment>
            </>       
          );
        }
        )}
    </Table>

    <Footer />
      
    </>
  );
}
