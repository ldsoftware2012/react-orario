import { Col, Row, Table } from "react-bootstrap";
import "../css/AnalisiMese.css";
import { useState } from "react";
import "../interface/interface";
import { Footer } from "./Footer";
import { DisegnaGiorno } from "./DisegnaGiorno";
import React from "react";
import { IConfigDisegnaGiorno } from "../interface/interface";
import { ComponentListaOpzioni } from "./ComponentConfigOptions";
import { ComponentOreDipendente } from "./ComponentOreDipendente";

export default function AnalisiMese(props: any) {
  const row = [1, 2, 3, 4, 5, 6];
  const col = [1, 2, 3, 4, 5, 6, 7];
  const {Anno,Mese} = props
  const [configDisegnaGiorno, setconfigDisegnaGiorno] = useState<IConfigDisegnaGiorno>({VisualizzaColoriCommessa:false}) 
  let Indice = 0;

  const d = new Date(Anno, (Mese) - 1);
  let primogiorno = d.getDay();
  if (primogiorno < 0) {primogiorno = 6;}
  if (primogiorno === 0) {primogiorno = 7;}
  const NumGiorni = new Date(Anno, Mese, 0).getDate();

const handleOptionsChanged = (e:any,tipo:string)=>{
switch (tipo) {
  case 'VisualizzaDescrizioneCommessa':
    setconfigDisegnaGiorno({...configDisegnaGiorno,VisualizzaDescrizioneCommessa:!configDisegnaGiorno.VisualizzaDescrizioneCommessa})
    break;
  case 'VisualizzaOrediLavoro':
      setconfigDisegnaGiorno({...configDisegnaGiorno,VisualizzaOrediLavoro:!configDisegnaGiorno.VisualizzaOrediLavoro})
    break;
case 'VisualizzaColoriCommessa':
      setconfigDisegnaGiorno({...configDisegnaGiorno,VisualizzaColoriCommessa:!configDisegnaGiorno.VisualizzaColoriCommessa})
    break;
case 'VisualizzaSoloGiorniNonCompleti':
      setconfigDisegnaGiorno({...configDisegnaGiorno,VisualizzaSoloGiorniNonCompleti:!configDisegnaGiorno.VisualizzaSoloGiorniNonCompleti})
    break;
  
  default:
    break;
}
}

  return (
    <>
    <u><h1 className="text-center">{new Date(Anno,Mese,0).MeseTesto()} {Anno} </h1></u>
    <ComponentListaOpzioni config = {configDisegnaGiorno} onChange= {handleOptionsChanged}/>
    <ComponentOreDipendente Anno = {Anno} Mese = {Mese} Orari = {props.Orari}/>
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
                        && <DisegnaGiorno Config={configDisegnaGiorno} Data={new Date(Anno,Mese-1,Indice-primogiorno+1)} Orari={props.Orari}/>}
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
