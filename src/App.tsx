import { createContext, useEffect, useState } from "react";
import { CalcolaOre, IAcconto, ICliente, ICommesse, IDataContext, IModelOrario, ISearchParameter, ITecnico } from "./interface/interface";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import OrarioList from "./components/OrarioList";
import OrarioAnalisi from "./components/OrarioAnalisi";
import Home from "./components/Home";
import { UpdateDataDay } from "./components/UpdateDataDay";
import { AddDay, GetRemoteData, differenzaOrari } from "./data/Datasource";
import { url_Acconti, url_AddDay, url_Clienti, url_Commesse, url_Orario, url_Tecnici } from "./data/config";
import ListaCommesse from "./components/ListaCommesse";
import GestioneAcconti from "./components/GestioneAcconti";
import SituazioneAcconti from "./components/SituazioneAcconti";
import Clienti from "./components/ListaClienti";
import Info from "./components/Info";
import { format } from "date-fns";
export const OrarioDataContext = createContext<IDataContext | null>(null);

export default function App() {

const [orario, setOrario] = useState<IModelOrario[]>([])
const [tecnico, setTecnico] = useState<string>("Lacanale")
const [isDataLoad, setIsDataLoad] = useState(true)
const [isLogged, setIsLogged] = useState(false)
const [commesse, setCommesse] = useState<ICommesse[]>([])
const [isAdmin, setIsAdmin] = useState(false)
const [isdataUpdated,setIsDataUpdated] = useState<boolean>(false)
const [searchParameter, setSearchParameter] = useState<ISearchParameter>({})
const [clienti, setclienti] = useState<ICliente[]>([])
const [tecnici,setTecnici] = useState<ITecnico[]>([])
const [data_ref,setData_ref] = useState<Date>(new Date())
const [isEnableChange,setIsEnableChange] = useState<string>("false")
const [acconti, setAcconti] = useState<IAcconto[]>([])
const [IDgiornoCopiato,setIDgiornoCopiato] = useState<IModelOrario[]>([])
const [resultRemoteOperation, setResultRemoteOperation] = useState<{status : Number, description:string}>();

useEffect(() => {

  (async () => {
    const cl = await GetRemoteData(url_Clienti)
    setclienti(cl)

    const comm = await GetRemoteData(url_Commesse)
    setCommesse(comm)

    const tec = await GetRemoteData(url_Tecnici)
    setTecnici(tec)

    const acc = await GetRemoteData(url_Acconti)
    setAcconti(acc)
  })()
}, [])




const onPaste =async (data:Date)=>{
    const {oo,os,ov,op,of} = CalcolaOre(IDgiornoCopiato[0],data)
  const new_orario: IModelOrario = {
    Data: data,
    DataString : format(data,"yyyy-MM-dd"),
    Cliente: IDgiornoCopiato[0].Cliente,
    Tecnico: IDgiornoCopiato[0].Tecnico || "",
    Commessa: IDgiornoCopiato[0].Commessa,
    Tipo: IDgiornoCopiato[0].Tipo,
    Ora_IN1: IDgiornoCopiato[0].Ora_IN1,
    Ora_OUT1: IDgiornoCopiato[0].Ora_OUT1,
    Ora_IN2: IDgiornoCopiato[0].Ora_IN2 != undefined ? IDgiornoCopiato[0].Ora_IN2 : "",
    Ora_OUT2: IDgiornoCopiato[0].Ora_OUT2 != undefined ? IDgiornoCopiato[0].Ora_OUT2 : "",
    Km: IDgiornoCopiato[0].Km,
    Pranzo: IDgiornoCopiato[0].Pranzo,
    Cena: IDgiornoCopiato[0].Cena,
    Pernotto: IDgiornoCopiato[0].Pernotto,
    Estero: IDgiornoCopiato[0].Estero,
    Fatturato: IDgiornoCopiato[0].Fatturato,
    Ore_Ord: oo.toString(),
    Ore_Stra: os.toString(),
    Ore_Pre: op.toString(),
    Ore_Fest: of.toString(),
    Ore_Viaggio: ov.toString(),
    Note: IDgiornoCopiato[0].Note,
  };

  const result = await AddDay(url_AddDay, new_orario);
  setResultRemoteOperation({status:result.status,description:result.description});
  setIsDataUpdated(true)
}

useEffect(() => {
setIsDataUpdated(false)
}, [isdataUpdated])

    return (
      <OrarioDataContext.Provider value= {{
      orario , 
      setOrario, 
      tecnico, 
      setTecnico,
      isDataLoad,
      setIsDataLoad,
      isLogged,
      setIsLogged,
      commesse,
      setCommesse,
      isAdmin,
      setIsAdmin,
      isdataUpdated,
      setIsDataUpdated,
      searchParameter,
      setSearchParameter,
      clienti,
      tecnici,
      data_ref,
      setData_ref,
      isEnableChange,
      setIsEnableChange,
      acconti,
      setAcconti,
      IDgiornoCopiato,
      setIDgiornoCopiato,
      onPaste
    }}>
      <BrowserRouter basename={'/react-orario'}>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/updateDataday" element={<UpdateDataDay />}/>
        <Route path="/info" element={<Info />}/>
        <Route path="/updateAcconto" element={<GestioneAcconti />}/>
        <Route path="/orario" element={<OrarioList />}/>
        <Route path="/orariocommessa" element={<OrarioList />}/>
        <Route path="/orarioanalisi" element={<OrarioAnalisi />}/>
        <Route path="/listacommesse" element={<ListaCommesse />}/>
        <Route path="/listaclienti" element={<Clienti />}/>
        <Route path="/situazioneacconti" element={<SituazioneAcconti />}/>
      </Routes>
    </BrowserRouter>
      </OrarioDataContext.Provider>

    );
  }