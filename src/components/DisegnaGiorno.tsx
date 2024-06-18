import {
  faAutomobile,
  faBed, faNoteSticky,
  faPlane, faWineBottle
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { Col, ProgressBar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { OrarioDataContext } from "../App";
import { Somma } from "../data/Datasource";
import { DateCompare, IAcconto, IModelOrario } from "../interface/interface";
import { format } from "date-fns";
import React from "react";
import { ComponentContextMenu } from "./ComponentContextMenu";

export function DisegnaGiorno(props: any) {
  const {
    Data,
    Orari,
  } = props;

  type OreMancanti = {
    giorno : Date,
    ore : number
  }

  const navigate = useNavigate();
  const GlobalData = useContext(OrarioDataContext);
  const [orario, setOrario] = useState<IModelOrario[]>([])

  const [data,SetData] = useState<Date>()
  const [Ore_Ord,SetOre_Ord] = useState<number>(0)
  const [Ore_Stra,SetOre_Stra] = useState<number>(0)
  const [Ore_Viaggio,SetOre_Viaggio] = useState<number>(0)
  const [Ore_Pre,SetOre_Pre] = useState<number>(0)
  const [Ore_Fest,SetOre_Fest] = useState<number>(0)
  const [Pranzo,SetPranzo] = useState<number>(0)
  const [Cena,SetCena] = useState<number>(0)
  const [Estero,SetEstero] = useState<number>(0)
  const [Km,SetKm] = useState<number>(0)
  const [Note,SetNote] = useState<string>("")
  const [Pernotto,SetPernotto] = useState<number>(0)
  const [id,SetID] = useState<number>(-1)
  const [Festivo,SetFestivo] = useState<boolean>(false)
  const [TotaleOre,SetTotaleOre] = useState<number>(0)
  const [GiornoMancante,SetGiornoMancante] = useState<boolean>(false)
  const [acconti,SetAcconti] = useState<IAcconto[]>([])
  const [dataLoaded,SetDataLoaded] = useState<boolean>(false)
  const [ore_Mancanti,setOreMancanti] = useState<OreMancanti>()
  const [giornoCopiato, setgiornoCopiato] = useState<number>()
  const Sabato =6
  const Domenica = 0


useEffect(() => {
if (!dataLoaded) {
try {

    const Filtro = Orari.filter((o:IModelOrario) => {      
      try {
        const d = new Date(o.Data)
        return (DateCompare(d,Data) && o.Tecnico === GlobalData?.tecnico)
      } catch (error) {}
    })
    
    const acc = GlobalData?.acconti.filter((a)=>{
      var dd = new Date(a.Data)
      return DateCompare(dd,Data) && a.Tecnico==GlobalData.tecnico })       
      || [{Cliente:"",Data:new Date(),Entrata:0,ID:0,Tecnico:"",Uscita:0,Fattura:"",Note:""}]
      
      SetAcconti(acc)
      SetData(Data)
      SetFestivo(Data.isHoliday() || Data.getDay()===Sabato || Data.getDay()===Domenica)
      SetDataLoaded(true) 
      if(Filtro.length > 0){setOrario(Filtro)
        const {oo,op,of,os,ov,cena,estero,pernotto,pranzo,tot_hours} = Somma(Filtro)
      setOreMancanti({giorno : Data , ore : 8-tot_hours})
      SetOre_Ord(oo)
      SetOre_Stra(os)
      SetOre_Viaggio(ov)
      SetOre_Pre(op)
      SetOre_Fest(of)
      SetCena(cena)
      SetPranzo(pranzo)
      SetEstero(estero)
      SetPernotto(pernotto)
      SetTotaleOre(tot_hours)
      SetNote(Filtro[0].Note)
    }else{
      SetGiornoMancante(true)
      setOreMancanti({giorno : Data , ore : 8})
    }
  } catch (error) {
  console.log("error",error)
}

}  
}, [])


function GetIcon():any  {
    let ok=false,nok=false,viaggio=false

    //Colore blu
    if (Ore_Viaggio > 0) {
      viaggio = true;
    }
    
    //Colore rosso
    if (
      TotaleOre < 8 ||
      (GiornoMancante && !Festivo)
    ) {
      nok=true
    }

    if (
      TotaleOre >= 8 ||
      Ore_Pre > 0 ||
      Ore_Fest > 0
    ) {
      ok=true
    }

    return { ok, nok, viaggio}
}
function EditDate(ID: number) {
    if(ID != undefined){
      navigate("/updateDataDay?Method=Update&ID="+ ID);
    }
}
const DescrizioneCommessa = (Commessa : string)=>{
    const desc = GlobalData?.commesse.find((c) => c.Commessa == Commessa)
    return desc?.Descrizione
}
const HandleModificaAcconto = (ID:number) : any =>{
    alert(ID)
}
const VerificaAcconti = ():any =>{
    return(
      acconti?.map((a:IAcconto)=>{
        const uscita = a.Uscita > 0 ? "€" + a.Uscita  : ""
        const entrata = a.Entrata > 0 ? "€" + a.Entrata : ""
      return (
        <>
        <div onClick={()=>HandleModificaAcconto(a.ID || -1)}>
          {uscita != "" && <b><p className={a.Fattura != "" ? "testo_barrato text-danger" : "text-danger"}>{uscita}</p></b>}
          {entrata != "" && <b><p className={a.Fattura != "" ? "testo_barrato text-success" : "text-success"}>{entrata}</p></b>}
        </div>
        </>        
      )
      })
    )
}
const GiornoIcons = ()=>{
    return(
      <>
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
        {Estero > 0 && (
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
        {(Km != 0 && Km != undefined) &&
        <FontAwesomeIcon icon={faAutomobile} title={Km.toString()} color="blue" className="px-2"/>
        }
      </Col>
      </>
    )
}
const GiornoProgressBar = (props: any)=>{

    let ore : IModelOrario = props.ore
    const  oo = parseFloat(ore.Ore_Ord)
    const  os = parseFloat(ore.Ore_Stra)
    const  ov = parseFloat(ore.Ore_Viaggio)
    const  of = parseFloat(ore.Ore_Fest)
    const  op = parseFloat(ore.Ore_Pre)
    const Cliente = ore.Cliente
    const color = Cliente == "LD Software" ? "danger" :"success"

    return (
    <>
    {oo + os + Ore_Viaggio + Ore_Pre + Ore_Fest > 0 && (
      <ProgressBar>
        {oo > 0 && (
          <ProgressBar
            now={40}
            label={oo}
            variant= {color}
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
            label={ov}
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
          ></ProgressBar>
        )}
      </ProgressBar>              
    )}
    </>
    )
}
const GetStatusColor = ():string=>{
    let className = ""
    if (GetIcon().ok && !GetIcon().viaggio) {
      className = "border border-3 rounded-circle border-success "
    }
    else if (GetIcon().viaggio) {
      className = "border border-3 rounded-circle border-info"
    }
    else if (GetIcon().nok && !Festivo) {
      className = "border border-3 rounded-circle border-danger"
    }
    return className
    
}
const NumeroGiorno = ()=>{
    let classOggi = DateCompare(new Date(),Data) ? "border border-5 border-primary rounded-5 shadow-lg" : ""
    Festivo ? classOggi = classOggi + "Festivo text-danger " : classOggi = classOggi
    
    return(<>
        <h4 style={{margin:2,padding:0}} className={classOggi}>{Data.GiornoTesto()}</h4>
        <h4 style={{width:40,height:40,margin:"auto",padding:0}} className={`${GetStatusColor()}`}>{Data.Giorno() + 1}</h4>
    </>)
}
const ClienteCommessa = (props:any) =>{
  const {Commessa,Cliente}=props.dati
  const className = Cliente == "LD Software" ? "bg-danger":""
    

  return(
    <>
      <div title={Note}>
        <p style={{margin:0}} ><u>{Cliente}</u></p>
        <span title={DescrizioneCommessa(Commessa)} className={className}>{Commessa}</span>
      </div>
    </>
  )
}

function HandleAggiungiPermessoNew(data:string,ore:number){
  navigate("/updateDataDay?Method=Permesso&OreMancanti=" + ore + "&Data=" + data)
}
function handleContextMenu(e:Event,value:string,id:number){
  const data = format(Data,"yyyy-MM-dd")
  const tecnico = GlobalData?.tecnico || ""
  // setgiornoCopiato(id)
  switch (value) {
    case "Aggiungi":
        navigate("/updateDataDay?Method=Add&Data=" + format(Data, "yyyy/MM/dd"))
    break;
    case "Acconti":
      navigate("/updateAcconto?Data=" + data + "&Tecnico=" + tecnico)
      break;
    case "Permesso":
      HandleAggiungiPermessoNew(data,ore_Mancanti?.ore || 0)
      break;
    case "Copia":
      GlobalData?.setgiornoCopiato({orario:orario,id:id})
      break;  
    case "Incolla":
      GlobalData?.onPaste(Data)
      break;
    default:
      break;
  }
    
}

  return (
    <React.Fragment>
    {dataLoaded && <div>        
        <NumeroGiorno/>        
        <div className="d-flex">
          <GiornoIcons/>
        </div>
        {orario.map((o:IModelOrario)=>{
          return(
            <>            
            <div  onClick={() => EditDate(o.id || -1)}>
              <ClienteCommessa dati={o} />
              <GiornoProgressBar ore={o} />
            </div>
            {/* <GiornoEsistenteAdd id={o.id || -1}/> */}
            <ComponentContextMenu data={data} ore={ore_Mancanti?.ore} id={o.id || -1} onClick={handleContextMenu}></ComponentContextMenu>
            </>
          )
        })}
        {GiornoMancante && <ComponentContextMenu data={data} ore={ore_Mancanti?.ore} id={-1} onClick={handleContextMenu}></ComponentContextMenu>}
        <VerificaAcconti/>
        </div>
        }
    </React.Fragment>
  );
}
