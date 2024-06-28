import { DateCompare, IAcconto, ICliente, ICommesse, IDayMissing, IModelCostiOrariTecnico, IModelOrario, ITecnico } from "../interface/interface";
import { saveAs} from 'file-saver';
import { useContext } from "react";
import Select from "react-select"
import { OrarioDataContext } from "../App";
import { start } from "repl";


export async function GetRemoteData(url:string){
    const response = await fetch(url)
    const data = await response.json(); 
    return data
}

export async function UpdateCommessa(url:string,newdata:ICommesse) {
    const requestOptions:RequestInit = {
        method: 'POST',
        mode : 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({newdata})
    };

    try {
        // Simuliamo una richiesta asincrona, ad esempio con fetch
        const response = await fetch(url, requestOptions)
    
        // Verifica lo stato della risposta
        if (!response.ok) {
        //   throw new Error(`Errore HTTP! Stato: ${response.status}`);
        return ({status:-1, description:"Errore durante aggiornamento!"})
        }
    
        // Leggi il corpo della risposta come JSON
        const data = await response.json();
    
        // Restituisci il risultato della funzione asincrona
        // return (data)
        return ({status:1, description:"Aggiornamento eseguito correttamente"});
    } catch (error) {
        // Gestisci gli errori durante la richiesta
        console.error('Errore durante la richiesta:', error);
        return ({status:-2, description:"Errore durante aggiornamento!" + error})
        //throw error; // Puoi anche propagare l'errore se lo desideri
    }
    }
export async function UpdateCliente(url:string,newdata:ICliente) {
    const requestOptions:RequestInit = {
        method: 'POST',
        mode : 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({newdata})
    };

    try {
        // Simuliamo una richiesta asincrona, ad esempio con fetch
        const response = await fetch(url, requestOptions)
    
        // Verifica lo stato della risposta
        if (!response.ok) {
        //   throw new Error(`Errore HTTP! Stato: ${response.status}`);
        return ({status:-1, description:"Errore durante aggiornamento!"})
        }
    
        // Leggi il corpo della risposta come JSON
        const data = await response.json();
    
        // Restituisci il risultato della funzione asincrona
        // return (data)
        return ({status:1, description:"Aggiornamento eseguito correttamente"});
    } catch (error) {
        // Gestisci gli errori durante la richiesta
        console.error('Errore durante la richiesta:', error);
        return ({status:-2, description:"Errore durante aggiornamento!" + error})
        //throw error; // Puoi anche propagare l'errore se lo desideri
    }
    }
export async function UpdateAcconto(url:string,newdata:IAcconto) {
    const requestOptions:RequestInit = {
        method: 'POST',
        mode : 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({newdata})
    };

    try {
        // Simuliamo una richiesta asincrona, ad esempio con fetch
        const response = await fetch(url, requestOptions)
    
        // Verifica lo stato della risposta
        if (!response.ok) {
        //   throw new Error(`Errore HTTP! Stato: ${response.status}`);
        return ({status:-1, description:"Errore durante aggiornamento!"})
        }
    
        // Leggi il corpo della risposta come JSON
        const data = await response.json();
    
        // Restituisci il risultato della funzione asincrona
        // return (data)
        return ({status:1, description:"Aggiornamento eseguito correttamente"});
    } catch (error) {
        // Gestisci gli errori durante la richiesta
        console.error('Errore durante la richiesta:', error);
        return ({status:-2, description:"Errore durante aggiornamento!" + error})
        //throw error; // Puoi anche propagare l'errore se lo desideri
    }
    }

export async function UpdateDay(url:string,newdata:IModelOrario) {
    let status = 1
    let description =""
    const requestOptions:RequestInit = {
        method: 'POST',
        mode : 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({newdata})
    };


    try {
        // Simuliamo una richiesta asincrona, ad esempio con fetch
        const response = await fetch(url, requestOptions)
    
        // Verifica lo stato della risposta
        if (!response.ok) {
        status = -1;
        description = "Errore durante aggiornamento!";
        return ({status,description})
        }
    
        // Leggi il corpo della risposta come JSON
        const data = await response.json();
    
        status = 1;
        description = "Aggiornamento eseguito correttamente!";
        return ({status,description})
    } catch (error) {
        // Gestisci gli errori durante la richiesta
        console.error('Errore durante la richiesta:', error);
        status = -2
        description = "Errore durante aggiornamento!" + error
        return ({status,description})
        //throw error; // Puoi anche propagare l'errore se lo desideri
    }
    }
    
export async function Delete(url:string) {
    const requestOptions:RequestInit = {
        method: 'POST',
        mode : 'cors',
        headers: { 'Content-Type': 'application/json' },
        // body: JSON.stringify({newdata})
    };


    try {
        // Simuliamo una richiesta asincrona, ad esempio con fetch
        const response = await fetch(url, requestOptions)
    
        // Verifica lo stato della risposta
        if (!response.ok) {
        //   throw new Error(`Errore HTTP! Stato: ${response.status}`);
        return ({status:-1,description:"" + response.status})
        }
    
        // Leggi il corpo della risposta come JSON
        const data = await response.json();
    
        // Restituisci il risultato della funzione asincrona
        // return (data)
        return ({status:1,description:"Cancellazione eseguita correttamente"});
    } catch (error) {
        // Gestisci gli errori durante la richiesta
        console.error('Errore durante la richiesta:', error);
        return ({status:-2,description:"ERROR" + error})
        //throw error; // Puoi anche propagare l'errore se lo desideri
    }
    }

export async function AddDay(url:string,newdata:IModelOrario) {
    let status = -1
    let description = ""

    const requestOptions:RequestInit = {
        method: 'POST',
        mode : 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({newdata})
    };


    try {
        // Simuliamo una richiesta asincrona, ad esempio con fetch
        const response = await fetch(url, requestOptions)
    
        // Verifica lo stato della risposta
        if (!response.ok) {
        description="Errore durante inserimento!"
        return ({status,description})
        }
    
        // Leggi il corpo della risposta come JSON
        const data = await response.json();
    
        // Restituisci il risultato della funzione asincrona
        // return (data)
        status = 1
        description="Inserimento eseguito correttamente";
        return ({status,description});
    } catch (error) {
        // Gestisci gli errori durante la richiesta
        console.error('Errore durante la richiesta:', error);
        status=2
        description = "Errore durante inserimento!" + error 
        return ({status,description})
        //throw error; // Puoi anche propagare l'errore se lo desideri
    }
    }

export function DataLoading() {
        return (
        <div hidden className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
            <span className="sr-only"></span>
            </div>
        </div>
        );
    }


export function Somma(data: IModelOrario[] = []) {
        let oo = 0.0,
        os = 0.0,
        ov = 0.0,
        op = 0.0,
        of = 0.0,
        KM = 0.0,
        cena = 0,
        pranzo = 0,
        pernotto = 0,
        estero = 0,
        total0 = false;

        data.map((d) => {
        if(d.Km!=""){ KM = KM + parseFloat(d.Km)};
        oo = oo + parseFloat(d.Ore_Ord);
        os = os + parseFloat(d.Ore_Stra);
        ov = ov + parseFloat(d.Ore_Viaggio);
        op = op + parseFloat(d.Ore_Pre);
        of = of + parseFloat(d.Ore_Fest);
        pranzo = pranzo + (d.Pranzo == "true" ? 1 : 0);
        cena = cena + (d.Cena == "true" ? 1 : 0);
        pernotto = pernotto + (d.Pernotto == "true" ? 1 : 0);
        estero = estero + (d.Estero == "true" ? 1 : 0);
        });

        const tot = oo+os+ov+op+of+pranzo+cena+pernotto+estero+KM
        const tot_hours = oo+os+ov+op+of
    
        total0 = tot==0 ? true : false

        return { oo, os, ov, op, of, pranzo, cena, pernotto, estero, KM , total0,tot_hours};
    }

export const DownloadRI = (arr : string[],numero:string)=>{
    const file = new Blob(arr, { type: 'text/plain;charset=utf-8' });
    saveAs(file, numero + '.tex');
}

export const DownloadOreDipendente = (arr : string[],tecnico:string)=>{
    const file = new Blob(arr, { type: 'text/plain;charset=utf-8' });
    saveAs(file, tecnico + '.tex');
}

export const GetListaClienti = (Ore:IModelOrario[])=>{
    const ListaClienti = [{Cliente : "",Listino : ""}]
    const GlobalData = useContext(OrarioDataContext);

    Ore.map((o)=>{        
        const Listino = GlobalData?.clienti.find((c)=>c.Cliente === o.Cliente)
        if (!ListaClienti.some((c) => c.Cliente === o.Cliente))
            {ListaClienti.push({Cliente : o.Cliente , Listino : Listino?.Pricelist || ""})}
    })
    return ListaClienti
}

export const DownloadDanea = (Ore:IModelOrario[],Tecnico:ITecnico,Cliente:ICliente,Data:string,Listino:string,Iva:string) => {  
    const fields = {
        CustomerVatCode : Cliente.Piva ,//"00671870699" ,
        Data : Data,//"2024-01-01",
        Number_ : Data.replace("-","").replace("-",""),//"20240131",
        Numbering : Tecnico.Acronimo,
        PriceList : Listino,//"Selmec_2020",
        Tecnico : Tecnico.Acronimo,
        Iva : Iva
    }

    const ListaCommesse = Ore.reduce((commesselista, current) => {
        if (!commesselista.includes(current.Commessa) && commesselista != undefined && commesselista!=null)
            commesselista.push(current.Commessa);
        return commesselista;
      }, [] as string[]); //Added as string[]




    const WriteRow=(Description="",Value="",Iva="")=>{        
        if(Value=="0" || isNaN(parseInt(Value))){return ""}
        const text = []
        text.push("<Row>\n")
        text.push("<Code>" + Description + "</Code>\n")
        text.push("<Qty>" + Value + "</Qty>\n")
        text.push("<VatCode>" + Iva + "</VatCode>\n")    
        text.push("</Row>\n")      
    return text.join("")    
    }

    const Dati = [""]
    Dati.push("<?xml version = '1.0' encoding = 'UTF-8' ?>\n")
    Dati.push("<EasyfattDocuments>")
        Dati.push("<Documents>\n")
            Dati.push("<Document>\n")
                Dati.push("<CustomerVatCode>")
                    Dati.push(fields.CustomerVatCode || "")
                Dati.push("</CustomerVatCode>\n")
                Dati.push("<DocumentType>")
                    Dati.push("G")
                Dati.push("</DocumentType>\n")
                Dati.push("<Date>")
                    Dati.push(fields.Data)
                Dati.push("</Date>\n")
                Dati.push("<Number>")
                    Dati.push(fields.Number_)
                Dati.push("</Number>\n")
                Dati.push("<Numbering>")
                    Dati.push(fields.Numbering)
                Dati.push("</Numbering>\n")
                Dati.push("<PriceList>")
                    Dati.push(fields.PriceList)
                Dati.push("</PriceList>\n")
                Dati.push("<Rows>\n")
                
                    ListaCommesse.map((commessa)=>{
                        const somma = Somma(Ore.filter((ore)=>ore.Commessa === commessa))
                        if(commessa != undefined){
                            Dati.push("<Row>\n<Description>" + (commessa) + "</Description>\n</Row>\n")    
                            Dati.push(WriteRow("OLO_" + fields.Tecnico,somma.oo.toString(),fields.Iva))
                            Dati.push(WriteRow("OLS_" + fields.Tecnico,somma.os.toString(),fields.Iva))
                            Dati.push(WriteRow("OVO_" + fields.Tecnico,somma.ov.toString(),fields.Iva))
                            Dati.push(WriteRow("OLP_" + fields.Tecnico,somma.op.toString(),fields.Iva))
                            Dati.push(WriteRow("OLF_" + fields.Tecnico,somma.of.toString(),fields.Iva))
                            Dati.push(WriteRow("Trasferta Estera",somma.estero.toString(),fields.Iva))
                            Dati.push(WriteRow("Trasferta Italia",somma.pernotto.toString(),fields.Iva))
                            Dati.push(WriteRow("Pranzo",somma.pranzo.toString(),fields.Iva))
                            Dati.push(WriteRow("Cena",somma.cena.toString(),fields.Iva))
                            Dati.push(WriteRow("Km",somma.KM.toString(),fields.Iva))
                        }
                    })
                Dati.push("</Rows>\n")
            Dati.push("</Document>\n")
        Dati.push("</Documents>\n")
    Dati.push("</EasyfattDocuments>")
    


    const file = new Blob(Dati, { type: 'text/plain;charset=utf-8' });
    const nomefile = "Danea_" + Data + "/" + Tecnico.Acronimo + ".xml"
    saveAs(file, nomefile);
    };

export function ListaTecniciLocal(props:any) {
    const {defaultvalue,value,onChange,placeholder} = props
    const GlobalData = useContext(OrarioDataContext);
    const options = MapToOptions(GlobalData?.tecnici,"Tecnico",defaultvalue)    
    return (
    <>
        <Select 
                options={options}
                value={{value:value,label:value}}
                onChange={(e)=>onChange(e?.value)}
                placeholder={placeholder}
            />
    </>
    );
}

export function ListaTecnici(props:any) {
    const {defaultvalue} = props
    const GlobalData = useContext(OrarioDataContext);
    const options = MapToOptions(GlobalData?.tecnici,"Tecnico",defaultvalue)    
    return (
    <>
        <Select 
                options={options}
                value={{value: GlobalData?.tecnico,label:GlobalData?.tecnico}}
                onChange={(e)=>GlobalData?.setTecnico && GlobalData.setTecnico(e?.value || "")}
            />
    </>
    );
}

export function ListaClienti(props:any) {
    const {defaultvalue,value,onChange,placeholder} = props
    const GlobalData = useContext(OrarioDataContext);
    const options = MapToOptions(GlobalData?.clienti,"Cliente",defaultvalue)
    return (
    <>
        <Select 
                options={options}
                value={{value: value,label:value}}
                onChange={(e)=>onChange(e?.value)}
                placeholder={placeholder}
                className="w-100"
            />
    </>
    );
}

export function MapToOptions(object:any,property:string ,defaultvalue?:string):{value: string; label: string;}[]{

    function mapFn(value:any){return value;}

    function objectMap(object:any, fn:any) {
    return Object.fromEntries(
        Object.entries(object).map(([key, value]) => [key, fn(value)])
    );
    }
    const x = objectMap(object,mapFn)
    const len = Object.keys(object).length

    let ret = [{value: defaultvalue || "",label: defaultvalue ||"" }]
    for (let index = 0; index < len; index++) {
        if(x[index][property] != ""){        
            ret.push({value:x[index][property] , label: x[index][property]})
        }
    }
    const f = ret.filter((r)=>r.value!="")
    ret = [...f]
    return ret
}

export const GetWorkingDays=(startdate:Date):any=>{

    let giorni = [{}]
    let oggi = new Date()
    oggi.setDate(oggi.getDate() - 1)
    
    const GiorniMeseCorrente = new Date(startdate.getFullYear(),startdate.Mese(),0).getDate() 
    const GiorniMeseScorso = new Date(startdate.getFullYear(),startdate.Mese() - 1,0).getDate()
    const ng =GiorniMeseCorrente + GiorniMeseScorso

    const data = new Date()
    data.setDate(startdate.getDate() - GiorniMeseScorso + 1)
    data.setHours(0,0,0,0)

    for (let index = 0; index < ng; index++) {
        data.setDate(data.getDate() + 1)
        data.setHours(0,0,0,0)

        if (!data.isHoliday() && data.getDay() !=6 && data.getDay() != 0 && data <= oggi){
            giorni = [...giorni,{data:new Date(data)}]
        }
    }

    return giorni
}

export const GetMissingData=
(startdate:Date,enddate:Date,tecnico:string,orario:IModelOrario[]):IDayMissing[] =>{
    const workingDays:[] = GetWorkingDays(startdate)
    let dayList:IDayMissing[] = []

    workingDays.map(({data})=>{

        if (data != undefined) {        
            
            const dat = new Date(data)
            const day = orario.filter((o)=>{
                const d = new Date(o.Data)
                return  DateCompare(d,dat) &&  o.Tecnico==tecnico
            })
            
            const {tot_hours} = Somma(day)
            
            if(day.length==0){
                dayList.push({id:-1,data : data, missinghours : 8} )
        
            }else if(tot_hours < 8 && day.at(0)?.Tipo === "Lavoro"){
                dayList.push({id:day.at(0)?.id || -2, data : data, missinghours : 8 - tot_hours} )
            }
        }
    })

    const dl = dayList.filter((d) => d.data != undefined)
    dayList = [...dl]
    return dayList
}

export function differenzaOrari(orario1: string, orario2: string) {
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

export const Tecnici: IModelCostiOrariTecnico[] = 
    [
    {Cognome : "Lacanale",
    Nome : "Daniele",
    Nickname : "lacanale",
    Listino : "Selmec_2020",
    Ore_Ord : 42,
    Ore_Stra : 42,
    Ore_Pref : 45,
    Ore_Fest : 50,
    Ore_Viaggio : 35,
    Estero : 50,
    Km : 0.6,
    },    
    
    {Cognome : "Mariotti",
    Nome : "Alessandro",
    Nickname : "mariotti",
    Listino : "Selmec_2020",
    Ore_Ord : 35,
    Ore_Stra : 35,
    Ore_Pref : 38,
    Ore_Fest : 45,
    Ore_Viaggio : 35,
    Estero : 50,
    Km : 0.6,
    },
    
    {Cognome : "Di Credico",
        Nome : "Nikolas",
        Nickname : "dicredico",
        Listino : "Selmec_2020",
        Ore_Ord : 32,
        Ore_Stra : 32,
        Ore_Pref : 35,
        Ore_Fest : 36,
        Ore_Viaggio : 30,
        Estero : 50,
        Km : 0.6,
        },

    {Cognome : "Scurti",
        Nome : "Antonio",
        Nickname : "scurti",
        Listino : "Selmec_2020",
        Ore_Ord : 38,
        Ore_Stra : 38,
        Ore_Pref : 42,
        Ore_Fest : 45,
        Ore_Viaggio : 35,
        Estero : 50,
        Km : 0.6,
        }, 
    {Cognome : "Lacanale",
        Nome : "Daniele",
        Nickname : "lacanale",
        Listino : "Standard",
        Ore_Ord : 42,
        Ore_Stra : 42,
        Ore_Pref : 45,
        Ore_Fest : 50,
        Ore_Viaggio : 35,
        Estero : 50,
        Km : 0.6,
        },    
        
    {Cognome : "Mariotti",
    Nome : "Alessandro",
    Nickname : "mariotti",
    Listino : "Standard",
    Ore_Ord : 35,
    Ore_Stra : 35,
    Ore_Pref : 38,
    Ore_Fest : 45,
    Ore_Viaggio : 35,
    Estero : 50,
    Km : 0.6,
    },
    
    {Cognome : "Di Credico",
        Nome : "Nikolas",
        Nickname : "dicredico",
        Listino : "Standard",
        Ore_Ord : 32,
        Ore_Stra : 32,
        Ore_Pref : 35,
        Ore_Fest : 36,
        Ore_Viaggio : 30,
        Estero : 50,
        Km : 0.6,
        },

    {Cognome : "Scurti",
        Nome : "Antonio",
        Nickname : "scurti",
        Listino : "Standard",
        Ore_Ord : 38,
        Ore_Stra : 38,
        Ore_Pref : 42,
        Ore_Fest : 45,
        Ore_Viaggio : 35,
        Estero : 50,
        Km : 0.6,
        }, 
        






]
