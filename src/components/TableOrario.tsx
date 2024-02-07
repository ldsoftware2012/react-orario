import { useContext, useEffect, useState } from "react";
import { IModelOrario } from "../interface/interface";
import { format } from "date-fns";
import { OrarioDataContext } from "../App";
import { Accordion, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClone, faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { DeleteDay } from "../data/Datasource";
import { url_DeleteDay } from "../data/config";
import PopupConfirm from "./PopupConfirm";
import { useNavigate } from "react-router-dom";
import "../interface/interface";
import "../css/TableOrario.css";

const thClass = "text-center px-md-2 border ";
const totalClass = "text-center px-md-2 border border-primary  ";

function Somma(data: IModelOrario[] = []) {
  let oo = 0.0,
    os = 0.0,
    ov = 0.0,
    op = 0.0,
    of = 0.0,
    km = 0.0,
    cena = 0,
    pranzo = 0,
    pernotto = 0,
    estero = 0;

  data.map((d) => {
    oo = oo + parseFloat(d.Ore_Ord);
    os = os + parseFloat(d.Ore_Stra);
    ov = ov + parseFloat(d.Ore_Viaggio);
    op = op + parseFloat(d.Ore_Pre);
    of = of + parseFloat(d.Ore_Fest);
    pranzo = pranzo + (d.Pranzo == "true" ? 1 : 0);
    cena = cena + (d.Cena == "true" ? 1 : 0);
    pernotto = pernotto + (d.Pernotto == "true" ? 1 : 0);
    estero = estero + (d.Estero == "true" ? 1 : 0);
    km = km + parseFloat(d.Km);
  });

  return { oo, os, ov, op, of, pranzo, cena, pernotto, estero, km };
}

function FillTableCommessaTotal(data: IModelOrario[] = []) {
  const { oo, os, ov, op, of, pranzo, cena, pernotto, estero, km } =
    Somma(data);
  return (
    <>
      <tr>
        <td className="hidden"></td>
        <td className="hidden"></td>
        <td className="hidden"></td>
        <td className="hidden"></td>
        <td className="hidden"></td>
        <td className="hidden"></td>
        <td className="hidden"></td>
        <td className="hidden"></td>
        <td className={totalClass}>{km != 0 && !isNaN(km) ? km : ""}</td>
        <td className={totalClass}>{pranzo != 0 ? pranzo : ""}</td>
        <td className={totalClass}>{cena != 0 ? cena : ""}</td>
        <td className={totalClass}>{pernotto != 0 ? pernotto : ""}</td>
        <td className={totalClass}>{estero != 0 ? estero : ""}</td>
        <td className={totalClass}>{oo != 0 ? oo : ""}</td>
        <td className={totalClass}>{os != 0 ? os : ""}</td>
        <td className={totalClass}>{op != 0 ? op : ""}</td>
        <td className={totalClass}>{of != 0 ? of : ""}</td>
        <td className={totalClass}>{ov != 0 ? ov : ""}</td>
        <td className="hidden"></td>
      </tr>
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
  const { oo, os, ov, op, of, pranzo, cena, pernotto, estero, km } =
    Somma(data);
  return (
    <>
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <h3>Totali</h3>
          </Accordion.Header>
          <Accordion.Body className="bg-light bg-gradient">
            <Card className="bg-info" style={{ width: "30rem" }}>
              {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
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
                  {km > 0 && <ShowBadge Descrizione="Km" Valore={km} />}
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
            </Card>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  );
}

function FillTableHeader() {
  return (
    <>
      <tr>
        <th className={thClass}>Data</th>
        <th className={thClass}>Cliente</th>
        <th className={thClass}>Commessa</th>
        <th className={thClass}>Tipo</th>
        <th className={thClass}>Ora in 1</th>
        <th className={thClass}>Ora out 1</th>
        <th className={thClass}>Ora in 2</th>
        <th className={thClass}>Ora out 2</th>
        <th className={thClass}>Km</th>
        <th className={thClass}>Pranzo</th>
        <th className={thClass}>Cena</th>
        <th className={thClass}>Italia</th>
        <th className={thClass}>Estero</th>
        <th className={thClass}>Ord</th>
        <th className={thClass}>Stra</th>
        <th className={thClass}>PreFest</th>
        <th className={thClass}>Fest</th>
        <th className={thClass}>Viaggio</th>
        <th className={thClass}>Note</th>
      </tr>
    </>
  );
}

function FillTableData(o: IModelOrario, index: number) {
  const data = format(o.Data, "dd/MM/yyyy");

  var json = JSON.stringify(o.Data);

  const [showPanelDelete, setshowPanelDelete] = useState(false);
  const [showPanelEdit, setshowPanelEdit] = useState(false);
  const GlobalData = useContext(OrarioDataContext);
  const navigate = useNavigate();

  async function EliminaRow(index: number) {
    try {
      const url = url_DeleteDay + "?id=" + index;
      const del = await DeleteDay(url);
      console.log(" delete result = " + del);
      setshowPanelDelete(false);
      GlobalData?.setIsDataUpdated(true);
    } catch (error) {
      console.log(error);
    }
  }

  function getClassDayOfWeek() {
    const Sabato = "";
    const d = new Date(o.Data);
    const giorno = d.getDay();
    if (o.Tipo == "Viaggio") {
      return "text-center Viaggio";
    }

    try {
      if (giorno == 0 || d.isHoliday()) {
        return "text-center Domenica";
      } else if (giorno == 6) {
        return "text-center Sabato";
      } else {
        return "text-center";
      }
    } catch (error) {
      console.log("errore", error);
    }
  }
  function ModificaRow(id: number) {
    navigate("/updateDataDay?Method=Update&ID=" + id );
  }

  return (
    <tbody key={index}>
      <tr key={index} className={getClassDayOfWeek()}>
        <td>{data}</td>
        <td>{o.Cliente}</td>
        <td>{o.Commessa}</td>
        <td>{o.Tipo}</td>
        <td>{o.Ora_IN1}</td>
        <td>{o.Ora_OUT1}</td>
        <td>{o.Ora_IN2}</td>
        <td>{o.Ora_OUT2}</td>
        <td>{o.Km != "0" ? o.Km : ""}</td>
        {/* k()}><input type="checkbox" checked={o.Pranzo == "true"}></input></td> */}
        <td>
          <input
            type="checkbox"
            className="form-check-input"
            checked={o.Pranzo == "true"}
          ></input>
        </td>
        <td>
          <input
            type="checkbox"
            className="form-check-input"
            checked={o.Cena == "true"}
          ></input>
        </td>
        <td>
          <input
            type="checkbox"
            className="form-check-input"
            checked={o.Pernotto == "true"}
          ></input>
        </td>
        <td>
          <input
            type="checkbox"
            className="form-check-input"
            checked={o.Estero == "true"}
          ></input>
        </td>
        <td>{o.Ore_Ord != "0" ? o.Ore_Ord : ""}</td>
        <td>{o.Ore_Stra != "0" ? o.Ore_Stra : ""}</td>
        <td>{o.Ore_Pre != "0" ? o.Ore_Pre : ""}</td>
        <td>{o.Ore_Fest != "0" ? o.Ore_Fest : ""}</td>
        <td>{o.Ore_Viaggio != "0" ? o.Ore_Viaggio : ""}</td>
        <td>{o.Note}</td>
        <td>
          <button onClick={(e) => setshowPanelEdit(true)} title="Modifica">
            {" "}
            <FontAwesomeIcon icon={faPen} />
          </button>
        </td>
        <td>
          <button onClick={(e) => setshowPanelDelete(true)} title="Elimina">
            {" "}
            <FontAwesomeIcon icon={faTrashCan} />
          </button>
        </td>
        <td>
          <button onClick={(e) => setshowPanelDelete(true)} title="Duplica">
            {" "}
            <FontAwesomeIcon icon={faClone} />
          </button>
        </td>
        {showPanelDelete && (
          <PopupConfirm
            Titolo="Elimina"
            Descrizione="Vuoi eliminare questo giorno?"
            onConfirmation={() => EliminaRow(o.id || -1)}
            setClose={() => setshowPanelDelete(false)}
          ></PopupConfirm>
        )}
        {showPanelEdit && (
          <PopupConfirm
            Titolo="Modifica"
            Descrizione="Vuoi modificare questo giorno?"
            onConfirmation={() => ModificaRow(o.id || -1)}
            setClose={() => setshowPanelEdit(false)}
          ></PopupConfirm>
        )}
      </tr>
    </tbody>
  );
}

function OrarioList() {
  const GlobalData = useContext(OrarioDataContext);
  return (
    <>
      {<>{FillTableTotal(GlobalData?.orario)}</>}

      <table>
        {FillTableHeader()}
        {GlobalData?.orario.map((o, index) => {
          return FillTableData(o, o.id || 999);
        })}
        {FillTableCommessaTotal(GlobalData?.orario)}
      </table>
    </>
  );
}

function OrarioCommesse() {
  const GlobalData = useContext(OrarioDataContext);
  const data: IModelOrario[] = [];

  const ListaCommesse = GlobalData?.orario.reduce((commesselista, current) => {
    if (!commesselista.includes(current.Commessa))
      commesselista.push(current.Commessa);
    return commesselista;
  }, [] as string[]); //Added as string[]

  return (
    <>
      {<>{FillTableTotal(GlobalData?.orario)}</>}

      <table>
        {ListaCommesse?.map((commessa) => {
          const Desc =
            GlobalData?.commesse.filter((c) => c.Commessa == commessa) || [];
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
                    {/* <legend className="font-weight-bold">{commessa + "(" + Desc[0].Descrizione + ")"}</legend> */}

                    {FillTableHeader()}

                    {GlobalData?.orario
                      .filter((comm) => comm.Commessa == commessa)
                      .map((o, index) => {
                        return FillTableData(o, o.id || 999);
                      })}
                    {
                      <>
                        {FillTableCommessaTotal(
                          GlobalData?.orario.filter(
                            (o) => o.Commessa == commessa
                          )
                        )}
                      </>
                    }
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
              <br></br>
            </>
          );
        })}
      </table>
    </>
  );
}

export default function TableOrario(props: any) {
  const { Tipo } = props;
  const [tipoVisualizzazione, settipoVisualizzazione] = useState(Tipo);
  const GlobalData = useContext(OrarioDataContext);

  useEffect(() => {
    settipoVisualizzazione(Tipo);
  }, [Tipo]);

  return (
    <>
      {tipoVisualizzazione == "Commesse" && OrarioCommesse()}
      {tipoVisualizzazione == "Lista" && OrarioList()}
    </>
  );
}
