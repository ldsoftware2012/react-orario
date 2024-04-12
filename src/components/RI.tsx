import { ChangeEvent, useContext, useEffect, useState } from "react";
import { OrarioDataContext } from "../App";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import { DownloadRI, ListaClienti, Somma } from "../data/Datasource";
import { ICliente, IModelOrario } from "../interface/interface";
import { Button, Form } from "react-bootstrap";
import React from "react";


export default function RI(props:any){
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
    const [testo,setTesto] = useState<string>("") 


    const tecnico = GlobalData?.tecnici.find((t) => t.Tecnico == GlobalData.tecnico)
    const [dettagliCliente, setDettagliCliente] = useState<ICliente>()
    const [text, setText] = useState<string>()


    let fileReader:any;

useEffect(() => {
    let links = [process.env.PUBLIC_URL + "/model.tex"];
    const action = testo
    console.log("azione = ",action)
    async function main() {
        const files = await Promise.all(
            links.map((link) => fetch(link)
            .then((res) => res.text()),
            )
        );
        setTesto(files[0]);
        if(action != "Aggiorna" && action != "" && numeroIntervento != ""){
            const f = ReadFileModel();
        }
    }
    main();

    }, [testo]);

    const ReadFileModel=()=>{
        let content = cleanContent(testo);
        setText(content.text);
        ReplaceText(content.arr);
    }

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
        console.log("chiamato handle")
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
        const Desc = GlobalData?.commesse.filter((c) => c.Commessa == orario[0].Commessa) || [];
        const arr = []
        arr.push("%Dettaglio commessa" + "\n")
        arr.push("\\begin{flushleft}" + "\n")
        arr.push("\\begin{table}[h!]" + "\n")
        arr.push("\\center\\textbf{" + orario[0].Commessa + " (" +  Desc[0].Descrizione + ")} \\\\" + "\n")
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
        DataAdaptation(arr,"\\def \\numeroIntervento","\\def \\numeroIntervento {" + numeroIntervento + "}")
        DataAdaptation(arr,"\\def \\dataIntervento","\\def \\dataIntervento  {" + format(dataIntervento,"dd-MM-yyyy") + "}")
        DataAdaptation(arr,"\\def \\tecnicoIntervento","\\def \\tecnicoIntervento {" + tecnico?.Tecnico + "}")
        DataAdaptation(arr,"\\def \\clienteIntervento","\\def \\clienteIntervento {" + cliente + "}")
        DataAdaptation(arr,"\\def \\indirizzoCliente","\\def \\indirizzoCliente {" + dettagliCliente?.Indirizzo + "}")
        DataAdaptation(arr,"\\def \\localitaCliente","\\def \\localitaCliente {" + dettagliCliente?.Localita + "}")
        DataAdaptation(arr,"\\def \\macchina","\\def \\macchina {" + macchina + "}")
        DataAdaptation(arr,"\\def \\matricola","\\def \\matricola {" + matricola + "}")
        DataAdaptation(arr,"\\def \\plc","\\def \\plc {" + plc + "}")
        DataAdaptation(arr,"\\def \\descrizioneA","\\def \\descrizioneA {" + descrizione1 + "}")
        DataAdaptation(arr,"\\def \\descrizioneB","\\def \\descrizioneB {" + descrizione2 + "}")
        DataAdaptation(arr,"\\def \\descrizioneC","\\def \\descrizioneC {" + descrizione3 + "}")
        DataAdaptation(arr,"\\def \\descrizioneD","\\def \\descrizioneD {" + descrizione4 + "}")
        DataAdaptation(arr,"\\def \\descrizioneE","\\def \\descrizioneE {" + descrizione5 + "}")
        DataAdaptation(arr,"\\def \\segnalazioniA","\\def \\segnalazioniA  {" + segnalazioni1 + "}")
        DataAdaptation(arr,"\\def \\segnalazioniB","\\def \\segnalazioniB  {" + segnalazioni2 + "}")
        DataAdaptation(arr,"\\def \\segnalazioniC","\\def \\segnalazioniC  {" + segnalazioni3 + "}")
        DataAdaptation(arr,"\\def \\segnalazioniD","\\def \\segnalazioniD  {" + segnalazioni4 + "}")
        DataAdaptation(arr,"\\def \\segnalazioniE","\\def \\segnalazioniE  {" + segnalazioni5 + "}")
        DataAdaptation(arr,"\\def \\materialiA","\\def \\materialiA  {" + materiali1 + "}")
        DataAdaptation(arr,"\\def \\materialiB","\\def \\materialiB  {" + materiali2 + "}")
        DataAdaptation(arr,"\\def \\materialiC","\\def \\materialiC  {" + materiali3 + "}")
        DataAdaptation(arr,"\\def \\materialiD","\\def \\materialiD  {" + materiali4 + "}")
        DataAdaptation(arr,"\\def \\materialiE","\\def \\materialiE  {" + materiali5 + "}")
        DataAdaptation(arr,"\\def \\completato","\\def \\completato  {" + completato + "}")
        DataAdaptation(arr,"\\def \\noncompletato","\\def \\noncompletato  {" + noncompletato + "}")
        
        
        const IndexSezioneDettaglio = arr.findIndex((t) => t === "\\sectionmark{Dettaglio Commessa}")
        const IndexSezioneFinale = arr.findIndex((t) => t === "\\sectionmark{Parte Finale}")
        const FileParte1 = arr.slice(0,IndexSezioneDettaglio)        
        const FileParte2 = arr.slice(IndexSezioneFinale)


        const SezioneOrari = [""]


        //Found all Commesse
        const ListaCommesse = GlobalData?.orario.reduce((commesselista, current) => {
            if (!commesselista.includes(current.Commessa))
                commesselista.push(current.Commessa);
            return commesselista;
        }, [] as string[]);        

        //Print commessa detail + commessa partial sum
        {ListaCommesse?.map((commessa) => {
            const orario = GlobalData?.orario.filter((o)=> o.Commessa === commessa) || []
            SezioneOrari.push(ListaOrePrint(orario))
        }) ;
        }

        //Print total sum
        if(GlobalData?.orario != null){    
            SezioneOrari.push(TotaliPrint(GlobalData.orario))
        }

        const f1=FileParte1.join("\n")
        const f2=FileParte2.join("\n")

        const File = [f1, ...SezioneOrari, f2]
        const testo=File.join("\n");
        setText(testo)
        console.log("numero intervento=",numeroIntervento)
        console.log("Download")
        DownloadRI(File,(numeroIntervento))
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
            <legend className="text-center">Rapporto di intervento</legend>
            <DataIntervento/>
            <input
                type="text"
                value={numeroIntervento}
                onChange={(e)=>setNumeroIntervento(e.target.value)}
            />

            <div className="input-group input-group ">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="inputGroup-sizing-sm">Cliente</span>
                    </div>
                    
                    <div className="w-50"><ListaClienti                
                    value={cliente}
                    onChange={setCliente}
                    placeholder="Seleziona cliente"
                    /></div>
            </div>    

            <div className="mt-3">
                <div className="input-group input-group-sm mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="inputGroup-sizing-sm">Macchina</span>
                    </div>
                    <input
                        className="form-control w-25"
                        type="text"
                        placeholder="Macchina"
                        value={macchina}
                        onChange={(e)=>setMacchina(e.target.value)}
                        />
                </div>
                <div className="input-group input-group-sm mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="inputGroup-sizing-sm">Matricola</span>
                    </div>
                <input
                    className="form-control w-25"
                    type="text"
                    placeholder="Matricola"
                    value={matricola}
                    onChange={(e)=>setMatricola(e.target.value)}
                    />
                </div>  
                <div className="input-group input-group-sm mb-3">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="inputGroup-sizing-sm">PLC/CNC</span>
                    </div>  
                    <input
                    className="form-control w-25"
                    type="text"
                    placeholder="PLC/CNC"
                    value={plc}
                    onChange={(e)=>setPlc(e.target.value)}
                    />
                </div>    
                </div>
            <div className="mt-3">    
                <div className="input-group-prepend">
                        <span className="input-group-text" id="inputGroup-sizing-sm">Descrizione</span>
                    </div>
                <input
                    className="w-100"
                    type="text"
                    placeholder="DESCRIZIONE 1"
                    value={descrizione1}
                    onChange={(e)=>setDescrizione1(e.target.value)}
                />
                <input
                    className="w-100"
                    type="text"
                    placeholder="DESCRIZIONE 2"
                    value={descrizione2}
                    onChange={(e)=>setDescrizione2(e.target.value)}
                />
                <input
                    className="w-100"
                    type="text"
                    placeholder="DESCRIZIONE 3"
                    value={descrizione3}
                    onChange={(e)=>setDescrizione3(e.target.value)}
                />
                <input
                    className="w-100"
                    type="text"
                    placeholder="DESCRIZIONE 4"
                    value={descrizione4}
                    onChange={(e)=>setDescrizione4(e.target.value)}
                />
                <input
                    className="w-100"
                    type="text"
                    placeholder="DESCRIZIONE 5"
                    value={descrizione5}
                    onChange={(e)=>setDescrizione5(e.target.value)}
                />
            </div>
                <div className="input-group-prepend">
                        <span className="input-group-text" id="inputGroup-sizing-sm">Segnalazioni</span>
                    </div>
            <div className="mt-3">
                <input
                    className="w-100"
                    type="text"
                    placeholder="SEGNALAZIONE 1"
                    value={segnalazioni1}
                    onChange={(e)=>setSegnalazioni1(e.target.value)}
                />
                <input
                    className="w-100"
                    type="text"
                    placeholder="SEGNALAZIONE 2"
                    value={segnalazioni2}
                    onChange={(e)=>setSegnalazioni2(e.target.value)}
                />
                <input
                    className="w-100"
                    type="text"
                    placeholder="SEGNALAZIONE 3"
                    value={segnalazioni3}
                    onChange={(e)=>setSegnalazioni3(e.target.value)}
                />            
                <input
                    className="w-100"
                    type="text"
                    placeholder="SEGNALAZIONE 4"
                    value={segnalazioni4}
                    onChange={(e)=>setSegnalazioni4(e.target.value)}
                />
                <input
                    className="w-100"
                    type="text"
                    placeholder="SEGNALAZIONE 5"
                    value={segnalazioni5}
                    onChange={(e)=>setSegnalazioni5(e.target.value)}
                />
            </div>
                <div className="input-group-prepend">
                        <span className="input-group-text" id="inputGroup-sizing-sm">Materiali</span>
                    </div>
                <div className="mt-3">
                <input
                    className="w-100"
                    type="text"
                    placeholder="MATERIALE 1"
                    value={materiali1}
                    onChange={(e)=>setMateriali1(e.target.value)}
                />
                <input
                    className="w-100"
                    type="text"
                    placeholder="MATERIALE 2"
                    value={materiali2}
                    onChange={(e)=>setMateriali2(e.target.value)}
                />
                <input
                    className="w-100"
                    type="text"
                    placeholder="MATERIALE 3"
                    value={materiali3}
                    onChange={(e)=>setMateriali3(e.target.value)}
                />
                <input
                    className="w-100"
                    type="text"
                    placeholder="MATERIALE 4"
                    value={materiali4}
                    onChange={(e)=>setMateriali4(e.target.value)}
                />
                <input
                    className="w-100"
                    type="text"
                    placeholder="MATERIALE 5"
                    value={materiali5}
                    onChange={(e)=>setMateriali5(e.target.value)}
            />
            </div>

        <Form>
        <Form.Check
            type="switch"
            id="custom-switch"
            name="ratingCheckbox"
            checked={completato == "X" ? true : false}
            onChange={(e) =>
            {setCompletato(e.target.checked == true ? "X" : "")
            setNonCompletato(e.target.checked == false ? "X" : "");
            }

            }
            label="Completato"
        ></Form.Check>
        </Form>

            <div className="App">
            {/* <div className="upload-btn-wrapper">
                <button className="btn">Carica file modello</button>
                <input type="file" className="myfile" onChange={(e) => onChange(e)} />
            </div>        */}
            <Button onClick={()=>setTesto("Aggiorna")}>Download</Button>     
            {/* {text && <pre>{text}</pre>} */}
    </div>
        </div>
    </>
    )
    
}
