import { Dispatch, useContext, useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { ICliente, IModelOrario } from "../interface/interface";
import {
  AddDay, DeleteDay, GetRemoteOrarioDataByID, UpdateDay,
} from "../data/Datasource";
import { url_AddDay, url_DeleteDay, url_OrarioByID, url_UpdateDay } from "../data/config";
import {
  Badge,
  Button,
  Col,
  Container,
  Form,
  Overlay,
  Row,
  Tooltip,
} from "react-bootstrap";
import { OrarioDataContext } from "../App";
import PopupInfo from "./PopupInfo";
import { Menu } from "./Menu";
import { Footer } from "./Footer";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-regular-svg-icons";
import { faArrowCircleLeft, faTrash } from "@fortawesome/free-solid-svg-icons";
import PopupConfirm from "./PopupConfirm";

export function UpdateDataDay() {
  const hasLoadedBefore = useRef(true);
  const [data, setData] = useState<Date>(new Date());
  const [commessa, setCommessa] = useState("");
  const [tipo, setTipo] = useState<string>("Lavoro");
  const [cliente, setCliente] = useState("");
  const [orain1, setOraIn1] = useState("08:00");
  const [oraout1, setOraOut1] = useState("12:30");
  const [orain2, setOraIn2] = useState("13:30");
  const [oraout2, setOraOut2] = useState("17:00");
  const [pranzo, setPranzo] = useState("false");
  const [cena, setCena] = useState("false");
  const [pernotto, setPernotto] = useState("false");
  const [estero, setEstero] = useState("false");
  const [km, setKm] = useState("");
  const [oreOrd, setOreOrd] = useState(0.0);
  const [oreStra, setOreStra] = useState(0.0);
  const [oreViaggio, setOreViaggio] = useState(0.0);
  const [orePrefestive, setOrePrefestive] = useState(0.0);
  const [oreFestive, setOreFestive] = useState(0.0);
  const [note, setNote] = useState("");
  const [fatturato, setFatturato] = useState("false");

  const [isEnableCommand, setIsEnableCommand] = useState(false);
  const [resultInsert, setResultInsert] = useState("");
  const [showPopupInsert, setShowPopupInsert] = useState(false);
  const [error,setError] = useState("")
  const [orario, setOrario] = useState<IModelOrario[]>([]);
  const [showPanelDelete, setshowPanelDelete] = useState(false);

  const navigate = useNavigate();
  const ore = [
    "",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
    "21:30",
    "22:00",
    "22:30",
    "23:00",
    "23:30",
    "00:00",
    "00:30",
    "01:00",
    "01:30",
    "02:00",
    "02:30",
    "03:00",
    "03:30",
    "04:00",
    "04:30",
    "05:00",
    "05:30",
    "06:00",
    "06:30",
    "07:00",
    "07:30",
  ];

  const GlobalData = useContext(OrarioDataContext);
  const [Parameters] = useSearchParams();
  const Method = Parameters.get("Method");
  const ID = Parameters.get("ID");
  let NuovaData = Parameters.get("Data");
  if(NuovaData==null) {NuovaData = new Date().toString()} 

 
  function differenzaOrari(orario1: string, orario2: string) {
    const data1 = new Date(`1970-01-01T${orario1}`);
    const data2 = new Date(`1970-01-01T${orario2}`);

    // Calcola la differenza in millisecondi
    const differenzaInMillisecondi = data2.getTime() - data1.getTime();

    // Calcola le ore, i minuti e i secondi dalla differenza in millisecondi
    const ore = Math.floor(differenzaInMillisecondi / 3600000);
    const minuti = Math.floor((differenzaInMillisecondi % 3600000) / 60000);
    const secondi = Math.floor((differenzaInMillisecondi % 60000) / 1000);

    const oreNumber = ore + minuti / 60;

    // Restituisci un oggetto con le informazioni sulla differenza
    return { ore, minuti, secondi, oreNumber };
  }
  
  function AggiornaOrari() {
    let oo = 0, os = 0,op = 0,of = 0,ov = 0;
    setError("");

    const giorno = new Date(data).getDay();
    var reg = new RegExp("^([0-9])+$");

    if (differenzaOrari(orain1, oraout1).oreNumber > 0) {
      oo = differenzaOrari(orain1, oraout1).oreNumber;
    } else {
      setError("Anomalia orario mattina")
      oo=0
    }

    if (differenzaOrari(orain2, oraout2).oreNumber > 0) {
      oo = oo + differenzaOrari(orain2, oraout2).oreNumber;
      console.log(orain2,oraout2,oo)
    } else if((orain2 == "" && oraout2 == "") || (orain2 == undefined && oraout2 == undefined)){
    }
    else {
      console.log(orain2,oraout2)
      if(orain2 != "" || oraout2 != ""){
        setError("Anomalia orario pomeriggio")
        oo=0
      }
    }

    if (oo > 8) {
      os = oo - 8;
      oo = 8;
    }

    if (giorno == 6 && tipo == "Lavoro") {
      //saturday
      op = oo + os;
      oo = 0;
      os = 0;
    }

    if ((giorno == 0 || data.isHoliday()) && tipo == "Lavoro") {
      //sunday or holiday
      of = oo + os;
      oo = 0;
      os = 0;
    }

    if (tipo == "Viaggio") {
      //traveling
      ov = oo + os;
      oo = 0;
      os = 0;
    }

    if(!cliente){setError("Selezionare un cliente")}
    if(!commessa){setError("Selezionare una commessa")}
    if(!reg.test(km) && km !=""){setError("Valore km immesso non corretto")}

    setOreOrd(oo);
    setOreStra(os);
    setOreViaggio(ov);
    setOrePrefestive(op);
    setOreFestive(of);
  }


useEffect(() => {
  error == "" ? setIsEnableCommand(true):setIsEnableCommand(false)  
}, [error])

  //change day parameter
useEffect(() => {    
    // if(ID != null && ID != undefined){
      AggiornaOrari();
    // }
    return () => {};
  }, [orain1, orain2, , oraout1, oraout2, tipo, data, cliente, commessa, km]);

useEffect(() => {
  if (hasLoadedBefore.current) {
    hasLoadedBefore.current = false;
    (async()=>{
      console.log(Method,ID)
      if(Method =="Update" && ID != null && ID != undefined){
        const ore = await GetRemoteOrarioDataByID(
          url_OrarioByID + "?id=" + ID
        );
        setOrario(ore);
        if(ore.length > 0){
          const data = new Date(ore.at(0)?.Data);
          setData(data || new Date());
          setTipo(ore.at(0)?.Tipo || "");
          setCliente(ore.at(0)?.Cliente || "");
          setCommessa(ore.at(0)?.Commessa || "");
          setOraIn1(ore.at(0).Ora_IN1 || "");
          setOraOut1(ore.at(0).Ora_OUT1 || "");
          setOraIn2(ore.at(0).Ora_IN2 || "");
          setOraOut2(ore.at(0).Ora_OUT2 || "");
          setPranzo(ore.at(0)?.Pranzo || "");
          setCena(ore.at(0)?.Cena || "");
          setPernotto(ore.at(0)?.Pernotto || "");
          setEstero(ore.at(0)?.Estero || "");
          setOreOrd(ore.at(0)?.Ore_Ord || "");
          setOreStra(ore.at(0)?.Ore_Stra || "");
          setOrePrefestive(ore.at(0)?.Ore_Pre || "");
          setOreFestive(ore.at(0)?.Ore_Fest || "");
          setOreViaggio(ore.at(0)?.Ore_Viaggio || "");
          setNote(ore.at(0)?.Note || "");
          setFatturato(ore.at(0)?.Fatturato || "");
          setKm(ore.at(0)?.Km || "");
          }
      }

      if(Method == "Add" && NuovaData != ""){
        const d = new Date(NuovaData || "")
        setData(d);
        setOraIn1("08:00");
        setOraOut1("12:30");
        setOraIn2("13:30");
        setOraOut2("17:00");
      }
    })()
  }
  }, [])


  function Data() {
    return (
      <>
        <DatePicker
          id="data"
          className="m-2"
          dateFormat="dd/MM/yyyy"
          showIcon
          selected={data}
          onChange={(data) => (data != null ? setData(data) : new Date())}
        />
      </>
    );
  }
  function Tipo() {
    return (
      <>
        <select
          id="tipo1"
          className="m-2"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        >
          <option key="lavoro" defaultValue={tipo}>
            Lavoro
          </option>
          <option key="viaggio">Viaggio</option>
        </select>
      </>
    );
  }
  function Cliente() {
    return (
      <>
        <select
          className= {cliente ?  "m-2" : "m-2 border-danger border-3"}
          value={cliente}
          onChange={(cliente) =>
            cliente.target.value != null ? setCliente(cliente.target.value) : ""
          }
        >
          <option value="" disabled selected hidden>
            Seleziona cliente
          </option>
          {GlobalData?.clienti.map((c, index) => {
            return <option key={index}>{c.Cliente}</option>;
          })}
        </select>
      </>
    );
  }
  function ListaCommesse() {
    return (
      <>
        <select
          className= {commessa ?  "m-2" : "m-2 border-danger border-3"}
          value={commessa}
          onChange={(commessa) =>
            commessa.target.value != null
              ? setCommessa(commessa.target.value)
              : ""
          }
        >
          <option value="" disabled selected hidden>
            Seleziona commessa
          </option>
          {GlobalData?.commesse.map((c, index) => {
            return <option key={index}>{c.Commessa}</option>;
          })}
        </select>
      </>
    );
  }
  function Pranzo() {
    return (
      <Form>
        <Form.Check
          type="switch"
          id="custom-switch"
          name="ratingCheckbox"
          checked={pranzo == "true" ? true : false}
          onChange={(e) =>
            setPranzo(e.target.checked == true ? "true" : "false")
          }
          label="Pranzo"
        ></Form.Check>
      </Form>
    );
  }
  function Cena() {
    return (
      <Form>
        <Form.Check
          type="switch"
          id="custom-switch"
          name="ratingCheckbox"
          checked={cena == "true" ? true : false}
          onChange={(e) => setCena(e.target.checked == true ? "true" : "false")}
          label="Cena"
        ></Form.Check>
      </Form>
    );
  }
  function Pernotto() {
    return (
      <Form>
        <Form.Check
          type="switch"
          id="custom-switch"
          name="ratingCheckbox"
          checked={pernotto == "true" ? true : false}
          onChange={(e) =>
            setPernotto(e.target.checked == true ? "true" : "false")
          }
          label="Pernotto"
        ></Form.Check>
      </Form>
    );
  }
  function Estero() {
    return (
      <Form>
        <Form.Check
          type="switch"
          id="custom-switch"
          name="ratingCheckbox"
          checked={estero == "true" ? true : false}
          onChange={(e) =>
            setEstero(e.target.checked == true ? "true" : "false")
          }
          label="Estero"
        ></Form.Check>
      </Form>
    );
  }
  function OreOrd() {
    return (
      <>
        <label htmlFor="tipo" className="m-2">
          Ore Ordinarie
        </label>
        <label>{oreOrd}</label>
      </>
    );
  }
  function OreStra() {
    return (
      <>
        <label htmlFor="tipo" className="m-2">
          Ore Straordinarie
        </label>
        <label>{oreStra}</label>
      </>
    );
  }
  function OreViaggio() {
    return (
      <>
        <label htmlFor="tipo" className="m-2">
          Ore Viaggio
        </label>
        <label>{oreViaggio}</label>
      </>
    );
  }
  function OrePrefestive() {
    return (
      <>
        <label htmlFor="tipo" className="m-2">
          Ore Prefestive
        </label>
        <label>{orePrefestive}</label>
      </>
    );
  }
  function OreFestive() {
    return (
      <>
        <label htmlFor="tipo" className="m-2">
          Ore Festive
        </label>
        <label>{oreFestive}</label>
      </>
    );
  }
  function OrarioTemplate(props : any){
    return (
      <button
        onClick={(e) => {
          e.preventDefault();
          setOraIn1(props.OraIN1);
          setOraOut1(props.OraOUT1);
          setOraIn2(props.OraIN2);
          setOraOut2(props.OraOUT2);
        }}
      >
        {props.Label}
      </button>
    );
  }
  function ButtonShowOrario({
    titolo = "",
    setOra = (o: string) => {},
    posizione = "destra",
  }) {
    const [show, setShow] = useState(false);
    const target = useRef(null);

    return (
      <>
        <span className="m-1">
          {titolo != "" && (
            <Button ref={target} onClick={() => setShow(!show)}>
              {titolo}
            </Button>
          )}
          <Overlay
            target={target.current}
            show={show}
            placement={posizione != "destra" ? "left" : "right"}
          >
            {(props) => (
              <Tooltip id="overlay-example" {...props}>
                {ore.map((o) => {
                  return <Button onClick={() => setOra(o)}>{o}</Button>;
                })}
              </Tooltip>
            )}
          </Overlay>
        </span>
      </>
    );
  }
  function ButtonShowPresetOrario() {
    const [show, setShow] = useState(false);
    const target = useRef(null);
    return (
      <>
        <Button ref={target} onClick={() => setShow(!show)}>
          ...
        </Button>
        <Overlay target={target.current} show={show} placement="right">
          {(props) => (
            <Tooltip id="overlay-example" {...props}>
              <OrarioTemplate Label="Mezza" OraIN1="08:00" OraOUT1="12:30"/>     
              <OrarioTemplate Label="Standard" OraIN1="08:00" OraOUT1="12:30" OraIN2="13:30" OraOUT2="17:00"/>
              <OrarioTemplate Label="+0.5" OraIN1="08:00" OraOUT1="12:30" OraIN2="13:30" OraOUT2="17:30"/>
              <OrarioTemplate Label="+1" OraIN1="08:00" OraOUT1="12:30" OraIN2="13:30" OraOUT2="18:00"/>
              <OrarioTemplate Label="+1.5" OraIN1="08:00" OraOUT1="12:30" OraIN2="13:30" OraOUT2="18:30"/>
              <OrarioTemplate Label="+2" OraIN1="08:00" OraOUT1="12:30" OraIN2="13:30" OraOUT2="19:00"/>
              <OrarioTemplate Label="+2.5" OraIN1="08:00" OraOUT1="12:30" OraIN2="13:30" OraOUT2="19:30"/>
              <OrarioTemplate Label="+3" OraIN1="08:00" OraOUT1="12:30" OraIN2="13:30" OraOUT2="20:00"/>
            </Tooltip>
          )}
        </Overlay>
      </>
    );
  }
  
  async function EliminaRow(index: number) {
    try {
      const url = url_DeleteDay + "?id=" + index;
      const del = await DeleteDay(url);
      console.log(" delete result = " + del);
      setshowPanelDelete(false);
      GlobalData?.setIsDataUpdated(true);
      navigate(-1)
    } catch (error) {
      console.log(error);
    }
  }

  async function SaveData() {
    const new_orario: IModelOrario = {
      id: parseInt(ID || ""),
      Data: data,
      Cliente: cliente,
      Tecnico: GlobalData?.tecnico || "",
      Commessa: commessa,
      Tipo: tipo,
      Ora_IN1: orain1,
      Ora_OUT1: oraout1,
      Ora_IN2: orain2 != undefined ? orain2 : "",
      Ora_OUT2: oraout2 != undefined ? oraout2 : "",
      Km: km,
      Pranzo: pranzo,
      Cena: cena,
      Pernotto: pernotto,
      Estero: estero,
      Ore_Ord: oreOrd.toString(),
      Ore_Stra: oreStra.toString(),
      Ore_Pre: orePrefestive.toString(),
      Ore_Fest: oreFestive.toString(),
      Ore_Viaggio: oreViaggio.toString(),
      Note: note,
      Fatturato: fatturato,
    };

    const result = ""
    if(Method == "Add"){
      const result = await AddDay(url_AddDay, new_orario);
      setShowPopupInsert(true);
      setResultInsert(result);
    }

    if(Method == "Update"){
    const result = await UpdateDay(url_UpdateDay, new_orario);
      setShowPopupInsert(true);
      setResultInsert(result);
    }

    console.log(" result = " + result);
  }

  return (
    <>
      <Menu />

      <Container fluid>
      <div className="container fluid bg-light mt-5">
      <Row className="align-items-center">
        <Col>
          <Data />
        </Col>
        <Col>
          <Tipo />
        </Col>
      </Row>
      <Row>
        <Col>
          <Cliente />
        </Col>
        <Col>
          <ListaCommesse />
        </Col>
      </Row>

      <ButtonShowPresetOrario />

      <ButtonShowOrario titolo={orain1} setOra={setOraIn1} posizione="destra" />
      <ButtonShowOrario
        titolo={oraout1}
        setOra={setOraOut1}
        posizione="destra"
      />
      <ButtonShowOrario
        titolo={orain2}
        setOra={setOraIn2}
        posizione="sinistra"
      />
      <ButtonShowOrario
        titolo={oraout2}
        setOra={setOraOut2}
        posizione="sinistra"
      />

      <Row className="m-2">
        <Col>
          <Pranzo />
        </Col>
        <Col>
          <Cena />
        </Col>
        <Col>
          <Pernotto />
        </Col>
        <Col>
          <Estero />
        </Col>
      </Row>

      <Row className="mt-3 text-center">
        <Col>
          <input
            type="text"
            value={km}
            placeholder="Km"
            onChange={(e) => setKm(e.target.value)}
            className="text-center"
          ></input>
        </Col>
      </Row>

      <Row className="mt-3">
        <Col>
        <div>
        <input
          type="text"
          value={note}
          placeholder="Note"
          className="w-100"
          onChange={(e) => setNote(e.target.value)}
          key="note"
        ></input>
      </div>
        </Col>
      </Row>

      <div className="mt-3">
        {oreOrd > 0 && (
          <Badge className="m-2" bg="success">
            <OreOrd />
          </Badge>
        )}

        {oreStra > 0 && (
          <Badge className="m-2" bg="secondary">
            <OreStra />
          </Badge>
        )}

        {oreViaggio > 0 && (
          <Badge className="m-2" bg="info">
            <OreViaggio />
          </Badge>
        )}

        {orePrefestive > 0 && (
          <Badge className="m-2" bg="warning">
            <OrePrefestive />
          </Badge>
        )}

        {oreFestive > 0 && (
          <Badge className="m-2" bg="danger">
            <OreFestive />
          </Badge>
        )}
      </div>

      <div className="bg-danger">{error}</div>

      {showPopupInsert && (
        <PopupInfo
          Titolo="Salvataggio"
          setClose={() => setShowPopupInsert(false)}
          Descrizione={resultInsert}
        />
      )}
        {showPanelDelete && (
          <PopupConfirm
            Titolo="Elimina"
            Descrizione="Vuoi eliminare questo giorno?"
            onConfirmation={() => EliminaRow(parseInt(ID || "-1"))}
            setClose={() => setshowPanelDelete(false)}
          ></PopupConfirm>
        )}


      <div className="align-items-center text-center ">
      <button onClick={()=>navigate(-1)} className="btn btn-outline-dark"><FontAwesomeIcon icon={faArrowCircleLeft}/></button>
        <button
          disabled={!isEnableCommand}
          type="button"
          className="btn btn-primary "
          onClick={() => SaveData()}>
          <FontAwesomeIcon icon={faSave}/> Salva
        </button>
        {ID !=null && <button
          disabled={!isEnableCommand}
          type="button"
          className="btn bg-danger"
          onClick={(e) => setshowPanelDelete(true)} title="Elimina">
          <FontAwesomeIcon icon={faTrash}/> Elimina
        </button>}
      </div>
      </div>
      </Container>
      <Footer />
    </>
  );
}
