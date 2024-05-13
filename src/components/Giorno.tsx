import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faAutomobile,
  faBed,
  faNoteSticky,
  faPlane,
  faTrash,
  faWineBottle,
} from "@fortawesome/free-solid-svg-icons";
import { Col, ProgressBar, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { OrarioDataContext } from "../App";
import { url_DeleteDay } from "../data/config";
import { Delete } from "../data/Datasource";
import PopupConfirm from "./PopupConfirm";


export function Giorno(props: any) {
  const {
    id,
    Index,
    Cliente,
    Anno,
    Mese,
    giorno,
    Ore_Ord,
    Ore_Stra,
    Ore_Viaggio,
    Ore_Pre,
    Ore_Fest,
    Pranzo,
    Cena,
    Estero,
    Commessa,
    Festivo,
    Note,
    Km
  } = props.Dati;

  const navigate = useNavigate();
  const GlobalData = useContext(OrarioDataContext);
  const [showPanelDelete, setshowPanelDelete] = useState(false);

  function GetClassOre(): string | undefined {
    const ArrayClass = [""];

    //Colore blu
    if (parseInt(Ore_Viaggio) > 0) {
      ArrayClass.push("Travel");
    }

    //Colore rosso
    if (
      Ore_Ord + Ore_Stra + Ore_Viaggio < 8 ||
      (Ore_Ord == "Assente" && !Festivo)
    ) {
      ArrayClass.push("Error");
    }

    if (
      Ore_Ord + Ore_Stra + Ore_Viaggio + Ore_Pre + Ore_Fest >= 8 ||
      Ore_Pre > 0 ||
      Ore_Fest > 0
    ) {
      ArrayClass.push("GiornoOK");
    }

    if (Festivo) {
      ArrayClass.push("Festivo");
    }

    return ArrayClass.join(" ");
  }

  async function EliminaRow(index: number) {
    try {
      const url = url_DeleteDay + "?id=" + index;
      const del = await Delete(url);
      console.log(" delete result = " + del);
      setshowPanelDelete(false);
      GlobalData?.setIsDataUpdated(true);
    } catch (error) {
      console.log(error);
    }
  }

  const titolo =
    "Ore Ordinarie : " +
    Ore_Ord +
    "\nOre Straordinare :  " +
    Ore_Stra +
    "\nOre Viaggio :  " +
    Ore_Viaggio;

  function EditDate(ID: number) {
    if(ID != undefined){
      navigate("/updateDataDay?Method=Update&ID="+ ID);
    }
  }

  const DescrizioneCommessa = (Commessa : string)=>{
    const desc = GlobalData?.commesse.find((c) => c.Commessa == Commessa)
    return desc?.Descrizione
  }

  return (
    <>
      <div className={GetClassOre()} onClick={() => EditDate(id)}>
        <>
          <Row>
            <Col className="d-flex font-weight-bold">
              {(Note != "" && Note != undefined) &&
              <FontAwesomeIcon icon={faNoteSticky} title={Note} color="orange"/>
              }
            </Col>
            <Col className="d-flex flex-row-reverse">
              {Ore_Viaggio > 0 && (
                <span className="px-1">
                  {" "}
                  <FontAwesomeIcon icon={faPlane} />
                </span>
              )}
              {Estero == "true" && (
                <span className="px-1">
                  {" "}
                  <FontAwesomeIcon icon={faBed} />
                </span>
              )}
              {(Pranzo > 0 || Cena > 0) && (
                <span className="px-1">
                  {" "}
                  <FontAwesomeIcon icon={faWineBottle} />
                </span>
              )}
              {(Km != "" && Km != undefined) &&
              <FontAwesomeIcon icon={faAutomobile} title={Km} color="blue" className="px-2"/>
              }
            </Col>
          </Row>

          <div>
            <div title={Note}>
              <p><u>{Cliente}</u></p>
              <span title={DescrizioneCommessa(Commessa)}>{Commessa}</span>
            </div>
            <div>
              <hr />
            </div>
            {Ore_Ord + Ore_Stra + Ore_Viaggio + Ore_Pre + Ore_Fest > 0 && (
              <ProgressBar>
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
          </div>
        </>
      </div>

      {/* {Aggiungi su esistente} */}
      {GlobalData?.isEnableChange == "true" && id != undefined &&
        <p className="justify-content-end">
        <button 
        className="btn border-primary"        
        onClick={()=>{
          navigate("/updateDataDay?Method=Add&Data=" + new Date(props.Anno,props.Mese-1,props.giorno))
        }          
        }
        >
          <FontAwesomeIcon icon={faAdd}/>
        </button>
        <button 
        className="btn border-danger"
        onClick={(e) => setshowPanelDelete(true)} title="Elimina"
        >
          <FontAwesomeIcon icon={faTrash}/>
        </button>
      </p>}

      {/* {Aggiungi nuovo} */}
      {GlobalData?.isEnableChange == "true" && id == undefined &&
        <p className="justify-content-end">
        <button 
        className="btn border-primary"        
        onClick={()=>{
          navigate("/updateDataDay?Method=Add&Data=" + new Date(props.Anno,props.Mese-1,props.giorno))
        }          
        }
        >
          <FontAwesomeIcon icon={faAdd}/>
        </button>
      </p>}

      {showPanelDelete && (
          <PopupConfirm
            Titolo="Elimina"
            Descrizione="Vuoi eliminare questo giorno?"
            onConfirmation={() => EliminaRow(id || -1)}
            setClose={() => setshowPanelDelete(false)}
          ></PopupConfirm>
        )}
    </>
  );
}
