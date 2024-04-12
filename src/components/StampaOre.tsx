import { ChangeEvent, useContext, useEffect, useState } from "react";
import { OrarioDataContext } from "../App";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import { DownloadRI, ListaClienti, Somma } from "../data/Datasource";
import { ICliente, IModelOrario } from "../interface/interface";
import { Form } from "react-bootstrap";


export default function StampaOre(props:any){
    const {mese,anno} = props


    const GlobalData = useContext(OrarioDataContext);
    const [numeroIntervento,setNumeroIntervento] = useState("")
    const [dataIntervento,setDataIntervento] = useState<Date>(new Date())
    const [cliente,setCliente] = useState("");
    const [macchina,setMacchina] = useState("");
    const [plc,setPlc] = useState("");
    const [matricola,setMatricola] = useState("");
    const [descrizione1,setDescrizione1] = useState("Vedi dettagli commessa");
    const [descrizione2,setDescrizione2] = useState("");
    const [descrizione3,setDescrizione3] = useState("");
    const [descrizione4,setDescrizione4] = useState("");
    const [descrizione5,setDescrizione5] = useState("");
    const [segnalazioni1,setSegnalazioni1] = useState("Nessuna segnalazione");
    const [segnalazioni2,setSegnalazioni2] = useState("");
    const [segnalazioni3,setSegnalazioni3] = useState("");
    const [segnalazioni4,setSegnalazioni4] = useState("");
    const [segnalazioni5,setSegnalazioni5] = useState("");
    const [materiali1,setMateriali1] = useState("Nessun materiale utilizzato");
    const [materiali2,setMateriali2] = useState("");
    const [materiali4,setMateriali4] = useState("");
    const [materiali3,setMateriali3] = useState("");
    const [materiali5,setMateriali5] = useState("");
    const [completato, setCompletato] = useState("X")
    const [noncompletato, setNonCompletato] = useState("")

    const tecnico = GlobalData?.tecnici.find((t) => t.Tecnico == GlobalData.tecnico)
    const [dettagliCliente, setDettagliCliente] = useState<ICliente>()
    const [text, setText] = useState<string>();
    

    const test = (e:any) => {
    console.log(e.target.files);
    };

    let fileReader:any;

    const onChange = (e:ChangeEvent<HTMLInputElement>) => {
        if(e != null){}
        let file = e.target.files;
        console.log(e)
        if (file != null) {   
            fileReader = new FileReader();
            fileReader.onloadend = handleFileRead;
            try {
                fileReader.readAsText(file[0]);     
            } catch (error) {
                console.log(error);
            }
        }
    };

    const deleteLines = (t:string, n = 1) => {
        console.log("remove lines");
        return t.replace(new RegExp(`(?:.*?\n){${n - 1}}(?:.*?\n)`), "");
    };

    const cleanContent = (t:string) => {
        t =t.replace(/^\s*[\r\n]/gm, "");
        let array = t.split(new RegExp(/[\r\n]/gm));
        const arr = array.join("\n")
        console.log("array=" + arr)
        return {text:arr , arr:array}
    };

    const handleFileRead = (e:any) => {
        let content = fileReader.result;
        content = cleanContent(content);
        setText(content.text);
        ReplaceText(content.arr);
    };

    function DataAdaptation(arr: string[] , original:string , replaced : string) {
        arr.map((t,i)=>{
            if (t.includes (original)) {
                arr[i] = replaced ;
            }
        })
        const a = arr.join("\n")
    }

    function ListaOrePrint(orario : IModelOrario[]){
        

        const arr = []
        arr.push("%Dettaglio commessa" + "\n")
        arr.push("\\begin{flushleft}" + "\n")
        arr.push("\\begin{table}[h!]" + "\n")
        arr.push("\\begin{tabular}{|c c c c c c c c|} " + "\n") 
        arr.push("\\rowcolor{Gray}" + "\n")
        arr.push("\\hline" + "\n")
        arr.push("\\textbf{DATA} & \\textbf{TIPO} & \\textbf{ORARIO} & \\textbf{ITALIA} & \\textbf{ESTERO} & \\textbf{PRANZO} & \\textbf{CENA} & \\textbf{KM} \\\\" + "\n")
        arr.push("\\hline" + "\n")
        arr.push("\\" + "\n")
        
        orario.map((o)=>{       
            arr.push(format(o.Data,"dd-MM-yyyy"))
            arr.push("&" + o.Tipo)
            arr.push("&" + o.Ora_IN1 + " - " + o.Ora_OUT1)
            arr.push(" \\ " + o.Ora_IN2 + " - " + o.Ora_OUT2)
            arr.push("&" + (o.Pernotto === "true" ? "*" : ""))
            arr.push("&" + (o.Estero === "true" ? "*" : ""))
            arr.push("&" + (o.Pranzo === "true" ? "*" : ""))
            arr.push("&" + (o.Cena === "true" ? "*" : ""))
            arr.push("&" + o.Km + "\\\\" + "\n")
        })
        arr.push("\\hline" + "\n")
        arr.push("\\end{tabular}")
        arr.push("\\end{table}")
        arr.push("\\end{flushleft}" + "\n")

        //Somma commessa
        const {oo,op,of,os,ov,cena,estero,KM,pernotto,pranzo,tot_hours,total0} = Somma(orario)
        arr.push("%Totale Commessa " + "\n");
        arr.push("\\begin{table}[h!]" + "\n");
        arr.push("\\center\\begin{tabular}{|c c c c c c c c c c|} " + "\n");
        arr.push("\\rowcolor{Gray}" + "\n");
        arr.push("\\hline" + "\n")
        arr.push("\\textbf{ORD} & \\textbf{STRA} & \\textbf{PRE} & \\textbf{FEST} & \\textbf{VIAGGIO} & \\textbf{ITALIA} & \\textbf{ESTERO} & \\textbf{PRANZO} & \\textbf{CENA} & \\textbf{KM} \\\\" + "\n");
        arr.push("\\hline" + "\n");
        arr.push("\\rowcolor{yellow}" + "\n");
        arr.push(oo + "&" +  os + "&" + op + "&" + of + "&" + ov + "&" + pernotto + "&" + estero + "&" + pranzo + "&" +  cena + "&" + KM + "\\\\" + "\n");
        arr.push("\\hline" + "\n");
        arr.push("\\end{tabular}" + "\n");
        arr.push("\\end{table}" + "\n");

        return arr.join("")
    }

    function TotaliPrint(orario : IModelOrario[]){
    const arr = []
 //Somma commessa
    const {oo,op,of,os,ov,cena,estero,KM,pernotto,pranzo,tot_hours,total0} = Somma(orario)
    arr.push("%Totale Commessa " + "\n");
    arr.push("\\begin{table}[h!]" + "\n");
    arr.push("\\center\\textbf{TOTALE}");
    arr.push("\\center\\begin{tabular}{|c c c c c c c c c c|} " + "\n");
    arr.push("\\rowcolor{Gray}" + "\n");
    arr.push("\\hline" + "\n")
    arr.push("\\textbf{ORD} & \\textbf{STRA} & \\textbf{PRE} & \\textbf{FEST} & \\textbf{VIAGGIO} & \\textbf{ESTERO} & \\textbf{ITALIA} & \\textbf{PRANZO} & \\textbf{CENA} & \\textbf{KM} \\\\" + "\n");
    arr.push("\\hline" + "\n");
    arr.push("\\rowcolor{green}" + "\n");
    arr.push(oo + "&" +  os + "&" + op + "&" + of + "&" + ov + "&" + estero + "&" + pernotto + "&" + pranzo + "&" + cena + "&" + KM + "\\\\" + "\n");
    arr.push("\\hline" + "\n");
    arr.push("\\end{tabular}" + "\n");
    arr.push("\\end{table}" + "\n");

    return arr.join("")
    }


    const ReplaceText=(arr: string[]) => {
        DataAdaptation(arr,"\\def \\tecnico","\\def \\tecnico {" + tecnico?.Tecnico + "}")
        DataAdaptation(arr,"\\def \\mese","\\def \\mese {" + mese + "}")
        DataAdaptation(arr,"\\def \\anno","\\def \\anno {" + anno + "}")

        const IndexSezioneDettaglio = arr.findIndex((t) => t === "\\sectionmark{ListaOre}")
        const IndexSezioneFinale = arr.findIndex((t) => t === "\\sectionmark{Parte Finale}")
        const FileParte1 = arr.slice(0,IndexSezioneDettaglio)        
        const FileParte2 = arr.slice(IndexSezioneFinale)

        console.log("Indici=",IndexSezioneDettaglio,IndexSezioneFinale)
        const SezioneOrari = [""]
        
        //Print lista ore
        GlobalData?.orario.map((o:IModelOrario)=>{
            const somma = parseFloat(o.Ore_Ord) +  parseFloat(o.Ore_Stra) +  parseFloat(o.Ore_Fest) +  parseFloat(o.Ore_Pre) +  parseFloat(o.Ore_Viaggio)
            SezioneOrari.push(format(o.Data,"dd-MM-yyyy"))
            SezioneOrari.push("&" + somma)
            const d = new Date(o.Data);
            if (somma < 8 && !d.isHoliday()) {
                SezioneOrari.push("&" + "Anomalia" + "\\\\" + "\n")                
            }else{
                SezioneOrari.push("&" + "" + "\\\\" + "\n")                
            }
            

            SezioneOrari.push("\\hline" + "\n")
        })


        const f1=FileParte1.join("\n")
        const f2=FileParte2.join("\n")

        const File = [f1, ...SezioneOrari, f2]
        const testo=File.join("\n");
        setText(testo)
        DownloadRI(File,GlobalData?.tecnico + mese+anno)
    }

    function DataIntervento() {

        return (
            <>
            <DatePicker
                id="data_inizio"
                className="m-2"
                dateFormat="dd/MM/yyyy"
                showIcon
                selected={dataIntervento}
                onChange={(date) => {
                    (date != null ? setDataIntervento(date) : new Date());
                    setNumeroIntervento("O-" + date?.RapportoIntervento() + "-01/" + tecnico?.Acronimo);
                }
            }
            />
        </>
        );
    }


    useEffect(() => {
        setDettagliCliente((GlobalData?.clienti.find((c) => c.Cliente === cliente)))
    }, [cliente])
    


    function Donwload_RI(arr:[]): void {
        
    }

    return(
    <>
        <div className="Container-fluid m-5 col-9  bg-light">
            <legend className="text-center">Lista Ore</legend>
        
            <div className="App">
            <div className="upload-btn-wrapper">
                <button className="btn">Carica file modello</button>
                <input type="file" className="myfile" onChange={(e) => onChange(e)} />
            </div>            
            {/* {text && <pre>{text}</pre>} */}
    </div>
        </div>
    </>
    )
    
}
