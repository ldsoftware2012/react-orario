import { Dispatch, SetStateAction } from "react";


export interface ISearchParameter{
  Tecnico? : string,
  Cliente? : string,
  Commessa? : string
  Data1? : Date,
  Data2? : Date,
  Fatturato? : string
}

export interface IDataContext{
  orario : IModelOrario[],
  setOrario? : Dispatch<IModelOrario[]>,
  tecnico : string,
  setTecnico? : Dispatch<string>,
  isDataLoad : boolean,
  setIsDataLoad : Dispatch<boolean>,
  isLogged : boolean,
  setIsLogged : Dispatch<boolean>,
  commesse : ICommesse[],
  setCommesse : Dispatch<ICommesse[]>,
  isAdmin : boolean,
  setIsAdmin :  Dispatch<boolean>,
  isdataUpdated : boolean,
  setIsDataUpdated : Dispatch<boolean>,
  searchParameter : ISearchParameter,
  setSearchParameter : Dispatch<ISearchParameter>,
  clienti : ICliente[],
  tecnici : ITecnico[],
  data_ref : Date,
  setData_ref : Dispatch<Date>,
  isEnableChange : string,
  setIsEnableChange : Dispatch<string>
} 

export interface IGlobalData{
    activeIndex : number,
    functionactiveIndex : number,
    cycle : CicloType[],
    updateRowParameter : (type:string,value:string) => void,
    setActiveIndex:(row:number) => void,
    setFunctionActiveIndex:(row:number) => void
  }

  
  export interface Props {
    id: string;
    label: string;
    backgroudcolor?:string;
    onClick? : () => void;
  }
  
  export interface CicloType{
    index:number,
    Number:number,
    Description:string,
    Cancel:number,
    Retry:number,
    Parameter:number
  }

  export interface ListFunctionType{
    Description:string,
    Index:number
  }

  export type AdaptParameter ={
    activeIndex : number,
    event : string,
    rowselected_nok : number,
    rowselected_retry : number
  }

  export interface IModelOrario{
    id? : number,
    Commessa : string,
    Cliente : string,
    Tecnico : string,
    Data : Date,
    Tipo? : string
    Ora_IN1 : string,
    Ora_OUT1 : string,
    Ora_IN2 : string,
    Ora_OUT2 : string,
    Km : string,
    Pranzo : string,
    Cena : string,
    Pernotto : string,
    Estero : string
    Ore_Ord : string,
    Ore_Stra : string,
    Ore_Pre : string,
    Ore_Fest : string,
    Ore_Viaggio : string,
    Note? : string,
    Fatturato : string    
  }

export interface ICliente{
  Cliente : string,
  Indirizzo : string
}
export interface ICommesse{
  ID : number,
  Descrizione : string,
  Commessa : string,
  DataInizio : string
}

export interface ITecnico{
  Tecnico : string,
  Indirizzo : string
}


export interface IUtente{
  Utente : string,
  Password : string,
  Gruppo : string,
  Tema:string,
  Sfondo:string
}

  export const nuovo : IModelOrario = { "id" : 5,
    "Cliente" : "S.el.me.c",
    "Data" : new Date("01/12/2023"),
    "Tecnico" : "Lacanale",
    "Commessa" : "AB111",
    "Tipo" : "Lavoro",
    "Ora_IN1" : "08:00",
    "Ora_OUT1" : "12:30",
    "Ora_IN2" : "13:30",
    "Ora_OUT2" : "17:00",
    "Km" : "100",
    "Pranzo" : "false",
    "Cena" : "true",
    "Pernotto" : "false",
    "Estero" : "true",
    "Ore_Ord" : "1",
    "Ore_Stra" : "2",
    "Ore_Pre" : "3",
    "Ore_Fest" : "4",
    "Ore_Viaggio" : "5",
    "Note" :"nota2",
    "Fatturato" : "false"
}


declare global{
  interface Date{
    Mese():number;
    Anno():number;
    isHoliday():boolean;
    GiornoTesto():string;
    MeseTesto():string;
    }
  }
  
  Date.prototype.isHoliday = function():boolean{
    const feste = [
      {giorno : 1 ,mese : 1},
      {giorno : 6 ,mese : 1},
      {giorno : 25 ,mese : 4},
      {giorno : 1 ,mese : 5},
      {giorno : 2 ,mese : 6},
      {giorno : 15 ,mese : 8},
      {giorno : 1 ,mese : 11},
      {giorno : 8 ,mese : 12},
      {giorno : 25 ,mese : 12},
      {giorno : 26 ,mese : 12}
  ]
  const day = this.getDate()
  const month = this.Mese()

  const holiday = feste.filter((f) => f.giorno == day && f.mese==(month))

  if (holiday.length > 0 ) {
      return true
  }else{
      return false
  }

  }
  
  Date.prototype.Mese = function ():number {
    return this.getMonth() + 1;
  }
  Date.prototype.Anno = function ():number {
    return this.getFullYear();
  }
  Date.prototype.GiornoTesto = function ():string {
    const Giorni = ["D","L","M","M","G","V","S"]
    return Giorni[this.getDay()];
  }  
  Date.prototype.MeseTesto = function ():string {
    const Mesi = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"]
    let index = this.getMonth() - 1
    if(index == -1){index = 11}
    return Mesi[index];
  }