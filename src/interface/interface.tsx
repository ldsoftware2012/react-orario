import { format } from "date-fns";
import { Dispatch } from "react";

export interface IDayMissing{
  id:number,
  data:Date,
  missinghours:number
}

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
  setTecnico? : Dispatch<string>
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
  setIsEnableChange : Dispatch<string>,
  acconti : IAcconto[],
  setAcconti : Dispatch<IAcconto[]>
} 

export interface IAcconto{
  ID : number | undefined,
  Data : Date,
  Tecnico : string,
  Uscita : number,
  Entrata : number,
  Note? : string,
  Fattura? : string,
  Cliente : string
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
    DataString? : string,
    Tipo? : string
    Ora_IN1 : string,
    Ora_OUT1 : string,
    Ora_IN2 : string,
    Ora_OUT2 : string,
    Km : string,
    Pranzo : string,
    Cena : string,
    Pernotto : string,
    Evaso?:string,
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
  Indirizzo : string,
  Localita : string,
  Provincia? : string,
  Tel? : string,
  Cell? : string,
  Fax? :string,
  Email?:string,
  Piva? : string,
  CAP? : string,
  Pricelist? : string
}
export interface ICommesse{
  Descrizione : string,
  Commessa : string,
  DataInizio : Date
}

export interface ITecnico{
  Tecnico : string,
  Indirizzo : string,
  Acronimo : string
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
    Giorno():number;
    isHoliday():boolean;
    GiornoTesto():string;
    MeseTesto():string;
    FormatoYY_MM_DD():string;
    FormatoYYMMDD():string;
    NumOfDaysInMonth():number;
    DataText():string;
    RapportoIntervento() : string;
    RedOnCalendar():boolean;
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

  if (holiday.length > 0) {
      return true
  }else{
      return false
  }

  }
  Date.prototype.FormatoYY_MM_DD = function ():string{
    if (this===null) {return ""}
    const giorno = this.getDate() > 10 ? this.getDate() : "0" + this.getDate()  
    const mese = this.Mese() > 10 ? this.Mese() : "0" + this.Mese()

    return (this.Anno() + "-" + mese + "-" + giorno)
  }
  Date.prototype.FormatoYYMMDD = function ():string{
    if (this===null) {return ""}
    const giorno = this.getDate() > 10 ? this.getDate() : "0" + this.getDate()  
    const mese = this.Mese() > 10 ? this.Mese() : "0" + this.Mese()

    return (this.Anno() + mese.toString() + giorno)
  }
  Date.prototype.Mese = function ():number {
    return this.getMonth() + 1;
  }
  Date.prototype.Anno = function ():number {
    return this.getFullYear();
  }
  Date.prototype.Giorno = function ():number {
    return this.getDate()-1;
  }
  Date.prototype.GiornoTesto = function ():string {
    const Giorni = ["Dom","Lun","Mar","Mer","Gio","Ven","Sab"]
    return Giorni[this.getDay()];
  }  
  Date.prototype.NumOfDaysInMonth = function ():number {
    const y = this.getFullYear()
    const m = this.Mese()
    return new Date(y,m,0).getDate()
  }  
  Date.prototype.DataText = function ():string {
    return "Il giorno " + this.GiornoTesto() + " " + this.getDate() + " " + this.MeseTesto();
  }  
  Date.prototype.RapportoIntervento = function ():string {
    if (this===null) {return ""}
    const giorno = this.getDate() > 10 ? this.getDate() : "0" + this.getDate()  
    const mese = this.Mese() > 10 ? this.Mese() : "0" + this.Mese()

    return this.getFullYear().toString() + mese + giorno;
  } 
  Date.prototype.RedOnCalendar = function ():boolean {
    return this.isHoliday() || this.Giorno()==0;
  }  

  Date.prototype.MeseTesto = function ():string {
    const Mesi = ["Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno","Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre"]
    let index = this.getMonth()
    if(index == -1){index = 11}
    return Mesi[index];
  }

export function DateCompare(data1:Date,data2:Date):boolean{
  const d1 = format(data1,"dd-MM-yyyy");    
    const d2 = format(data2,"dd-MM-yyyy");
    return (d1===d2)
}

