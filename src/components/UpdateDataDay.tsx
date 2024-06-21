import { useContext, useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import { CalcolaOre, IModelOrario } from "../interface/interface";
import {
  AddDay, DataLoading, Delete, GetRemoteData, ListaClienti, MapToOptions, UpdateDay,
  differenzaOrari,
} from "../data/Datasource";
import { url_AddDay, url_DeleteDay, url_OrarioByID, url_UpdateDay } from "../data/config";
import {
  Badge,
  Button,
  Col,
  Container,
  Form, Overlay,
  Row,
  Tooltip
} from "react-bootstrap";
import { OrarioDataContext } from "../App";
import { Menu } from "./Menu";
import { Footer } from "./Footer";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-regular-svg-icons";
import { faClose, faTrash } from "@fortawesome/free-solid-svg-icons";
import Popup from "./Popup";
import { format } from "date-fns";
import Select from "react-select";
import "../css/TableOrario.css";
import { ComponentHoursPreset } from "./ComponentHoursList";
import { ComponentSelectHour } from "./ComponentSelectHour";
import { Alert, InputAdornment, TextField } from "@mui/material";
import { ComponentChangeWorkType } from "./ComponentChangeWrokType";
import CheckIcon from '@mui/icons-material/Check';
import { Cancel } from "@mui/icons-material";



export function UpdateDataDay() {
  const hasLoadedBefore = useRef(true);
  const [data, setData] = useState<Date>(new Date());
  const [commessa, setCommessa] = useState("");
  const [descrizioneCommessa, setdescrizioneCommessa] = useState("")
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
  const [resultRemoteOperation, setResultRemoteOperation] = useState<{status : Number, description:string}>();
  const [error,setError] = useState("")
  const [orario, setOrario] = useState<IModelOrario[]>([]);
  const [isLoading,setIsLoading] = useState(true)
  const [isDataLoaded,setIsDataLoaded] = useState(false)
  //const [showButtonHours, setshowButtonHours] = useState(true)
  const [hideHourButtons, sethideHourButtons] = useState(false)

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
  const OreMancanti = Parameters.get("OreMancanti");
  let NuovaData = Parameters.get("Data");
  if(NuovaData==null) {NuovaData = new Date().toString()} 

  function AggiornaOrari() {
if (isDataLoaded) {  

    const ore : IModelOrario ={
      Data: data,
      DataString : format(data,"yyyy-MM-dd"),
      Cliente: "",
      Tecnico: "",
      Commessa:"" ,
      Tipo: tipo,
      Ora_IN1: orain1,
      Ora_OUT1: oraout1,
      Ora_IN2: orain2 != undefined ? orain2 : "",
      Ora_OUT2: oraout2 != undefined ? oraout2 : "",
      Km: "0",
      Pranzo: "false",
      Cena: "false",
      Pernotto: "false",
      Estero: "false",
      Fatturato: "false",
      Ore_Ord:oreOrd.toString(),
      Ore_Stra: oreStra.toString(),
      Ore_Pre: orePrefestive.toString(),
      Ore_Fest: oreFestive.toString(),
      Ore_Viaggio: oreViaggio.toString(),
      Note: ""
    }
      const {oo,os,ov,op,of} = CalcolaOre(ore,data)
      setError("");
    
      const giorno = new Date(data).getDay();
      var reg = new RegExp("^([0-9])+$");

      if(tipo==="Malattia"){
        setCommessa("Malattia")
      }
  
      if(tipo==="Ferie"){
        setCommessa("Ferie")
      }

      if(tipo==="Permesso"){
        setCommessa("Permesso")
      }

      if(tipo==="Donazione"){
        setCommessa("Donazione Sangue")
      }

      if(tipo==="Riposo trasferta"){
        setCommessa("Riposo trasferta")
      }

      if(!cliente){setError("Selezionare un cliente")}
      if(!commessa){setError("Selezionare una commessa")}
      if(!reg.test(km) && km !=""){setError("Valore km immesso non corretto")}
  
      if(commessa){
        const comm = GlobalData?.commesse.find((c) => c.Commessa==commessa) 
        if(comm){
        setdescrizioneCommessa(comm?.Descrizione)               
        }
      }

      setOreOrd(oo);
      setOreStra(os);
      setOreViaggio(ov);
      setOrePrefestive(op);
      setOreFestive(of);
      setIsLoading(false)
}
  }
useEffect(() => {
  error == "" ? setIsEnableCommand(true):setIsEnableCommand(false)  
}, [error])

  //change day parameter
useEffect(() => {    
      AggiornaOrari();
  }, [orain1, orain2, , oraout1, oraout2, tipo, data, cliente, commessa,km]);

//Load page
useEffect(() => {
  if (hasLoadedBefore.current) {
    hasLoadedBefore.current = false;
    (async()=>{
      if(Method =="Update" && ID != null && ID != undefined){
        const ore = await GetRemoteData(url_OrarioByID + "?id=" + ID);
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
          setIsDataLoaded(true)
          if(ore.at(0)?.Tipo === "Permesso" || ore.at(0)?.Tipo === "Ferie" 
          || ore.at(0)?.Tipo === "Riposo trasferta" || ore.at(0)?.Tipo === "Donazione"){
            sethideHourButtons(true)
          }
          }
      }

      try {
        if(Method == "Add" && NuovaData != ""){
          const d = new Date(NuovaData || new Date())
          setCliente("")
          setCommessa("")
          setData(d);
          setOraIn1("08:00");
          setOraOut1("12:30");
          setOraIn2("13:30");
          setOraOut2("17:00");
          setIsDataLoaded(true)
        }
      else if(Method=="Permesso" && NuovaData !=""){
        const d = new Date(NuovaData || new Date())
        setCliente("LD Software")
        setCommessa("permesso")
        setTipo("Permesso")        
        setData(d);
        setOraIn1("08:00");        
        setOraIn2("");
        setOraOut2("");
        sethideHourButtons(true)
        switch (OreMancanti?.toString()) {
          case "0.5":
            setOraOut1("08:30");
            break;
            case "1":
              setOraOut1("09:00");
              break;     
            case "1.5":
              setOraOut1("09:30");
              break;      
            case "2":
              setOraOut1("10:00");
              break;     
            case "2.5":
              setOraOut1("10:30");
              break;            
            case "3":
              setOraOut1("11:00");
              break;     
            case "3.5":
                setOraOut1("11:30");
                break;     
            case "4":
              setOraOut1("12:00");
              break;     
            case "4.5":
              setOraOut1("12:30");
              break; 
            case "5":
              setOraOut1("12:30");
              setOraIn2("13:30");
              setOraOut2("14:00");
              break;     
            case "5.5":
              setOraOut1("12:30");
              setOraIn2("13:30");
              setOraOut2("14:30");
              break;      
            case "6":
              setOraOut1("12:30");
              setOraIn2("13:30");
              setOraOut2("15:00");
              break;     
            case "6.5":
              setOraOut1("12:30");
              setOraIn2("13:30");
              setOraOut2("15:30");
              break;            
            case "7":
              setOraOut1("12:30");
              setOraIn2("13:30");
              setOraOut2("16:00");
              break;     
            case "7.5":
              setOraOut1("12:30");
              setOraIn2("13:30");
              setOraOut2("16:30");
                break;     
            case "8":
              setOraOut1("12:30");
              setOraIn2("13:30");
              setOraOut2("17:00");
              break;     
        default:
            break;
        }

        setIsDataLoaded(true)
      }
      } catch (error) {
        console.log("error",error)
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
  function Cliente() {
    return (
      <>
        <ListaClienti 
          placeholder = ""          
          value={cliente}
          onChange={setCliente}          
        />
      </>
    );
  }
  function ListaCommesse() {
    const options = MapToOptions(GlobalData?.commesse,"Commessa","Tutte *")
    return (
      <>
        <Select 
          options={options} 
          value={{value: commessa,label:commessa}}
          onChange={(e)=>setCommessa(e?.value || "")}
          className="w-100"
        />
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
  function FatturatoCheck() {
    return (
      <Form>
        <Form.Check
          type="switch"
          id="custom-switch"
          name="ratingCheckbox"
          checked={fatturato == "true" ? true : false}
          onChange={(e) =>
            setFatturato(e.target.checked == true ? "true" : "false")
          }
          label="Evaso"
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
  async function EliminaRow(index: number) {
    try {
      const url = url_DeleteDay + "?id=" + index;
      const del = await Delete(url);
      console.log(" delete result = " + del);
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
      DataString : format(data,"yyyy-MM-dd"),
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
      Fatturato: fatturato,
      Ore_Ord: oreOrd.toString(),
      Ore_Stra: oreStra.toString(),
      Ore_Pre: orePrefestive.toString(),
      Ore_Fest: oreFestive.toString(),
      Ore_Viaggio: oreViaggio.toString(),
      Note: note,
    };

    const result = ""
    if(Method == "Add" || Method=="Permesso"){
      const result = await AddDay(url_AddDay, new_orario);
      setResultRemoteOperation({status:result.status,description:result.description});
    }

    if(Method == "Update"){
    const result = await UpdateDay(url_UpdateDay, new_orario);
      setResultRemoteOperation({status:result.status,description:result.description});
    }
  }
  function handleHourListSelected(e:Event,newValue:string){
    e.preventDefault();
    switch (newValue) {
      case "Mattina":
        setOraIn1("08:00");
        setOraOut1("12:30");
        setOraIn2("");
        setOraOut2("");
        break;
        case "Pomeriggio":
          setOraIn1("13:30");
          setOraOut1("17:00");
          setOraIn2("");
          setOraOut2("");
          break;        
      case "Standard":
        setOraIn1("08:00");
        setOraOut1("12:30");
        setOraIn2("13:30");
        setOraOut2("17:00");
        break;
      case "0.5":
        setOraIn1("08:00");
        setOraOut1("12:30");
        setOraIn2("13:30");
        setOraOut2("17:30");
        break;
      case "1":
        setOraIn1("08:00");
        setOraOut1("12:30");
        setOraIn2("13:30");
        setOraOut2("18:00");
        break;    
      case "1.5":
        setOraIn1("08:00");
        setOraOut1("12:30");
        setOraIn2("13:30");
        setOraOut2("18:30");
        break;    
      case "2":
        setOraIn1("08:00");
        setOraOut1("12:30");
        setOraIn2("13:30");
        setOraOut2("19:00");
        break;    
      case "2.5":
        setOraIn1("08:00");
        setOraOut1("12:30");
        setOraIn2("13:30");
        setOraOut2("19:30");
        break;    
      case "3":
        setOraIn1("08:00");
        setOraOut1("12:30");
        setOraIn2("13:30");
        setOraOut2("20:00");
        break;    
        case "3.5":
          setOraIn1("08:00");
          setOraOut1("12:30");
          setOraIn2("13:30");
          setOraOut2("20:30");
          break;                             
          case "4":
            setOraIn1("08:00");
            setOraOut1("12:30");
            setOraIn2("13:30");
            setOraOut2("21:00");
            break;          

      default:
        break;
    }
  }

  function handleChangeWorkType(e:Event,newValue:string){  
    sethideHourButtons(false)
    if(newValue==="Ferie" || newValue==="Permesso" || newValue ==="Malattia" || newValue === "Donazione" || newValue==="Riposo trasferta"){
      sethideHourButtons(true)
    }

    if(newValue==="Ferie" || newValue==="Permesso" || newValue ==="Malattia" || newValue === "Donazione"){
      setCliente("LD Software")
    }
    setTipo(newValue)
  }
useEffect(() => {
  if (resultRemoteOperation?.status != 0) {
    const timeoutId = setTimeout(() => {
        setResultRemoteOperation({status:0,description:""})
    }, 3000);
  }
}, [resultRemoteOperation])

  return (
    <>
      <Menu />
      {(isLoading || !isDataLoaded) && <DataLoading/>}

      {!isLoading && isDataLoaded && <Container fluid>   
        <legend className="text-center mt-5">Gestione Giorno</legend>

        <Col className="text-end"><Button  onClick={()=>navigate(-1)} className="btn btn-outline-dark bg-light m-2 rounded"><FontAwesomeIcon icon={faClose}/></Button></Col>

        <div className="form_ins_orario">
          <label>Data</label>
          <Data />
        </div >
        <div>
          <ComponentChangeWorkType value={tipo} onChange={handleChangeWorkType}></ComponentChangeWorkType>
        </div>  
        <div className="form_ins_orario">
          <label className="m-2">Cliente</label>
          <Cliente />
        </div>  
        <div className="form_ins_orario">
          <label className="m-2">Commessa</label>          
          <ListaCommesse />  
        </div > 
        <label className="p-2">Descrizione</label>      
        <label className="m-3 text-success">{descrizioneCommessa}</label> 
        <div className="form_ins_orario_space_beetween">
          <Pranzo />
          <Cena />
          <Pernotto />
          <Estero />
        </div>
        
        <div className="p-1"> 
          
        {!hideHourButtons &&<ComponentSelectHour value={orain1} onClick={(e,value)=>setOraIn1(value)}></ComponentSelectHour>}
        {!hideHourButtons &&<ComponentSelectHour value={oraout1} onClick={(e,value)=>setOraOut1(value)}></ComponentSelectHour>}
        {!hideHourButtons &&<ComponentSelectHour value={orain2} onClick={(e,value)=>setOraIn2(value)}></ComponentSelectHour>}
        {!hideHourButtons &&<ComponentSelectHour value={oraout2} onClick={(e,value)=>setOraOut2(value)}></ComponentSelectHour>}
        {!hideHourButtons &&<ComponentHoursPreset onClick={handleHourListSelected}></ComponentHoursPreset>}
        </div>

        <TextField
          label="Percorso"
          id="outlined-start-adornment"
          sx={{ m: 1, width: '25ch' }}
          InputProps={{
            startAdornment: <InputAdornment position="start">Km</InputAdornment>,
          }}
          value={km}
          onChange={(e)=>setKm(e.target.value)}
        />

        <TextField
          label="Note"
          id="outlined-start-adornment"
          sx={{ m: 1, width: '100%' }}
          
          value={note}
          onChange={(e)=>setNote(e.target.value)}
        />

      <Row>
        <Col>{GlobalData?.isAdmin && <FatturatoCheck/>}</Col>
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
      
      {/* {resultRemoteOperation?.status != null && <div className={resultRemoteOperation?.status === 1 ? "bg-success text-white" : "bg-danger text-white"}>{resultRemoteOperation?.description}</div>} */}
      

      <div className="align-items-center text-center ">        
        <Popup Disabled={!isEnableCommand} Icon={faSave} IconColor="green" Label="Salva" MessageTitle="Salvataggio dati" MessageDescription="Vuoi salvare questo orario?" onConfirm={()=>SaveData()}></Popup>
        <Popup Disabled={!isEnableCommand} Icon={faTrash} IconColor="red" Label="Elimina" MessageTitle="Elimina" MessageDescription="Vuoi eliminare questo orario?" onConfirm={()=>EliminaRow(parseInt(ID || "-1"))}></Popup>
      </div>

      {resultRemoteOperation?.status === 1 &&
        <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
        {resultRemoteOperation?.description}
      </Alert>
      }

      {resultRemoteOperation?.status === -1 || resultRemoteOperation?.status === -2 &&
        <Alert icon={<Cancel fontSize="inherit" />} severity="error">
        {resultRemoteOperation?.description}
      </Alert>
      }  
      </Container>
      }
      <Footer />
    </>
  );
}
