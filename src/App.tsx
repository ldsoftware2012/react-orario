import { createContext, useContext, useEffect, useState } from "react";
import { ICliente, ICommesse, IDataContext, IModelOrario, ISearchParameter, ITecnico } from "./interface/interface";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import OrarioList from "./components/OrarioList";
import OrarioAnalisi from "./components/OrarioAnalisi";
import Home from "./components/Home";
import { UpdateDataDay } from "./components/UpdateDataDay";
import { GetRemoteClientiData, GetRemoteCommesseData, GetRemoteTecniciData } from "./data/Datasource";
import { url_Clienti, url_Commesse, url_Tecnici } from "./data/config";
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
const [data_ref,setData_ref] = useState<Date>(new Date)
const [isEnableChange,setIsEnableChange] = useState<string>("false")

useEffect(() => {
  (async () => {
    const cl = await GetRemoteClientiData(url_Clienti)
    setclienti(cl)

    const comm = await GetRemoteCommesseData(url_Commesse)
    setCommesse(comm)

    const tec = await GetRemoteTecniciData(url_Tecnici)
    setTecnici(tec)

  })()
}, [])

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
      setIsEnableChange
    }}>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/updateDataday" element={<UpdateDataDay />}/>
        <Route path="/orario" element={<OrarioList />}/>
        <Route path="/orariocommessa" element={<OrarioList />}/>
        <Route path="/orarioanalisi" element={<OrarioAnalisi />}/>
      </Routes>
    </BrowserRouter>
      </OrarioDataContext.Provider>

    );
  }