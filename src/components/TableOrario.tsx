import { useContext, useEffect, useState } from "react";
import { IModelOrario } from "../interface/interface";
import { format } from "date-fns";
import { OrarioDataContext } from "../App";
import { Accordion, Card, Col, ProgressBar } from "react-bootstrap";
import { Somma } from "../data/Datasource";
import { useNavigate } from "react-router-dom";
import "../interface/interface";
import "../css/TableOrario.css";
import { faAutomobile, faBed, faNoteSticky, faPlane, faPlateWheat, faWineBottle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function FillTableCommessaTotal(data: IModelOrario[] = []) {
  const { oo, os, ov, op, of, KM ,pranzo, cena, estero } =  Somma(data);
  return (
    <>

    <div id="TotaleCommessa">

    <ProgressBar className="TotaleProgress">
      {oo > 0 && (
        <ProgressBar
          now={40}
          label={oo}
          variant="success"          
          title={"Ore Ordinarie " + oo}
        ></ProgressBar>
      )}
      {os > 0 && (
        <ProgressBar
          now={20}
          label={os}
          variant="text-light bg-dark"
          title={"Ore Straordinarie " + os}
        ></ProgressBar>
      )}
      {ov > 0 && (
        <ProgressBar
          now={88}
          label= {<span><FontAwesomeIcon icon={faPlane}></FontAwesomeIcon> {ov}</span>}
          variant="info"
          title={"Ore Viaggio " + ov}
        ></ProgressBar>
      )}
      {op > 0 && (
        <ProgressBar
          now={60}
          label={op}
          variant="warning"
          title={"Ore Pre-Festive " + op}
        ></ProgressBar>
      )}
      {of > 0 && (
        <ProgressBar
          now={60}
          label={of}
          variant="primary"
          title={"Ore Festive " + of}
        ></ProgressBar>)}
    </ProgressBar>

      <div className="TotaleIcone">
        <p> {estero} <FontAwesomeIcon icon={faBed}></FontAwesomeIcon></p>
        <p> {pranzo} <FontAwesomeIcon icon={faPlateWheat}></FontAwesomeIcon></p>
        <p> {cena} <FontAwesomeIcon icon={faPlateWheat}></FontAwesomeIcon></p>
        <p> Km {KM} <FontAwesomeIcon icon={faAutomobile}></FontAwesomeIcon></p>
      </div>
    </div>

    </>
  );
}

function ShowBadge({ Descrizione = "", Valore = 0 }) {
  return (
    <>
      <label className="btn btn-primary position-relative m-2">
        {Descrizione}
        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
          {Valore}
          <span className="visually-hidden">unread messages</span>
        </span>
      </label>
    </>
  );
}

function FillTableTotal(data: IModelOrario[] = []) {
  const { oo, os, ov, op, of, pranzo, cena, pernotto, estero, KM } =  Somma(data);
  const [total0,SetTotal0]=useState(false)
  const GlobalData = useContext(OrarioDataContext);
  
  useEffect(() => {
    const { total0 } =  Somma(GlobalData?.orario);
    SetTotal0(total0)
  }, [GlobalData?.orario])
  

  return (
    <>
      { !total0 &&  <Accordion defaultActiveKey="0" className="w-100">
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <h3>Totali</h3>
          </Accordion.Header>
          <Accordion.Body className="bg-secondary-subtle bg-gradient">
              <Card.Body>
                <Card.Title>
                  <h1></h1>
                </Card.Title>
                <Card.Text>
                  {oo > 0 && (
                    <ShowBadge Descrizione="Ore Ordinarie" Valore={oo} />
                  )}
                  {os > 0 && (
                    <ShowBadge Descrizione="Ore Straordinarie" Valore={os} />
                  )}
                  {op > 0 && (
                    <ShowBadge Descrizione="Ore Prefestive" Valore={op} />
                  )}
                  {of > 0 && (
                    <ShowBadge Descrizione="Ore Festive" Valore={of} />
                  )}
                  {ov > 0 && (
                    <ShowBadge Descrizione="Ore Viaggio" Valore={ov} />
                  )}
                  {KM > 0 && <ShowBadge Descrizione="Km" Valore={KM} />}
                  {pranzo > 0 && (
                    <ShowBadge Descrizione="Pranzi" Valore={pranzo} />
                  )}
                  {cena > 0 && <ShowBadge Descrizione="Cene" Valore={cena} />}
                  {pernotto > 0 && (
                    <ShowBadge Descrizione="Pernotti" Valore={pernotto} />
                  )}
                  {estero > 0 && (
                    <ShowBadge Descrizione="Estero" Valore={estero} />
                  )}
                </Card.Text>
              </Card.Body>
            {/* </Card> */}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
      }
    </>
  );
}

const GiornoProgressBar = (props:any)=>{
  const {Ore_Ord,Ore_Stra,Ore_Viaggio,Ore_Pre,Ore_Fest} = props.Orario
  return (
  <>
  {Ore_Ord + Ore_Stra + Ore_Viaggio + Ore_Pre + Ore_Fest > 0 && (
    <ProgressBar className="w-75">
      {Ore_Ord > 0 && (
        <ProgressBar
          now={40}
          label={Ore_Ord}
          variant="success"
          title={"Ore Ordinarie " + Ore_Ord}
        ></ProgressBar>
      )}
      {Ore_Stra > 0 && (
        <ProgressBar
          now={20}
          label={Ore_Stra}
          variant="text-light bg-dark"
          title={"Ore Straordinarie " + Ore_Stra}
        ></ProgressBar>
      )}
      {Ore_Viaggio > 0 && (
        <ProgressBar
          now={88}
          label={Ore_Viaggio}
          variant="info"
          title={"Ore Viaggio " + Ore_Viaggio}
        ></ProgressBar>
      )}
      {Ore_Pre > 0 && (
        <ProgressBar
          now={60}
          label={Ore_Pre}
          variant="warning"
          title={"Ore Pre-Festive " + Ore_Pre}
        ></ProgressBar>
      )}
      {Ore_Fest > 0 && (
        <ProgressBar
          now={60}
          label={Ore_Fest}
          variant="primary"
          title={"Ore Festive " + Ore_Fest}
        ></ProgressBar>
      )}
    </ProgressBar>              
  )}
  </>
  )
}

const GiornoIcons = (props:any)=>{
  const {Note,Ore_Viaggio,Estero,Pranzo,Cena,Km} = props.Orario  
  return(
    <>
    <Col className="d-flex font-weight-bold">
      {(Note != "" && Note != undefined) &&
      <FontAwesomeIcon icon={faNoteSticky} title={Note} color="orange"/>
      }
    </Col>
    <Col className="d-flex flex-row-reverse">
      {(Cena == "true" || Pranzo=="true") && (
        <span className="px-1">
          <FontAwesomeIcon icon={faWineBottle} />
        </span>
      )}

      {Ore_Viaggio > 0 && (
        <span className="px-1">
          <FontAwesomeIcon icon={faPlane} />
        </span>
      )}
      {Estero == "true" && (
        <span className="px-1">
          <FontAwesomeIcon icon={faBed} />
        </span>
      )}

      {(Km != 0 && Km != undefined) &&
      <p><FontAwesomeIcon icon={faAutomobile} title={Km.toString()} /> {Km} Km </p>
      }
    </Col>
    </>
  )
}

function FillTableData(o: IModelOrario, index: number) {
  const data = format(o.Data, "dd/MM/yyyy");


  const GlobalData = useContext(OrarioDataContext);
  const navigate = useNavigate();


  function ModificaRow(id: number) {
    navigate("/updateDataDay?Method=Update&ID=" + id );
  }

  return (
    <>
      <div id="ListaOre" onClick={()=>ModificaRow(o.id || 999999)}>

        <div className="colonna-1">
          <p >{data}</p>
          <p >{o.Cliente}</p>
          <p >{o.Commessa}</p>
        </div>

        <div className="colonna-2">
          <p >{o.Ora_IN1} {o.Ora_OUT1} {o.Ora_IN2} {o.Ora_OUT2}</p>
          <p><GiornoProgressBar Orario={o}/></p>
          <GiornoIcons Orario={o}/>
          <p>{o.Note}</p>
        </div>

      </div>
    </>
  );
}

function OrarioList() {
  const GlobalData = useContext(OrarioDataContext);
  return (
    <>
      {<>{FillTableTotal(GlobalData?.orario)}</>}
        {GlobalData?.orario.map((o) => {
          return FillTableData(o, o.id || 999);
        })}
    </>
  );
}

function OrarioCommesse() {
  const GlobalData = useContext(OrarioDataContext);

  const ListaCommesse = GlobalData?.orario.reduce((commesselista, current) => {
    if (!commesselista.includes(current.Commessa))
      commesselista.push(current.Commessa);
    return commesselista;
  }, [] as string[]); //Added as string[]


  return (
    <>
      {<>{FillTableTotal(GlobalData?.orario)}</>}
        {ListaCommesse?.map((commessa) => {
          const Desc = GlobalData?.commesse.filter((c) => c.Commessa == commessa) || [];
          let Descrizione;
          if (Desc.length > 0) {
            Descrizione = Desc[0].Descrizione;
          } else {
            Descrizione = "";
          }

          return (
            <>
              <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    <h3>{commessa + "(" + Descrizione + ")"}</h3>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div>
                      {GlobalData?.orario.filter((comm) => comm.Commessa == commessa).map((o) => {
                          return FillTableData(o, o.id || 99999);
                        })}
                    </div>
                    {                      
                    <div>
                        {FillTableCommessaTotal(
                          GlobalData?.orario.filter(
                            (o) => o.Commessa == commessa
                          )
                        )}
                    </div>
                    }
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
              <br></br>
            </>
          );
        })}
    </>
  );
}

export default function TableOrario(props: any) {
  const { Tipo } = props;
  const [tipoVisualizzazione, settipoVisualizzazione] = useState(Tipo);

  useEffect(() => {
    settipoVisualizzazione(Tipo);
  }, [Tipo]);
  
  return (
    <>
      <div className="Container">
        {tipoVisualizzazione === "Commesse" && OrarioCommesse()}
        {tipoVisualizzazione === "Lista" && OrarioList()}
      </div>
    </>
  );
}
