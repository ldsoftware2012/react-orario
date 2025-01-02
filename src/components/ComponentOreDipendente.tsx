import { useContext, useEffect, useState } from "react";
import { DateCompareUTC, IModelOrario, DataAdaptation } from "../interface/interface"
import { DownloadOreDipendente, Somma } from "../data/Datasource";
import { OrarioDataContext } from "../App";
import { Button } from "@mui/material";
import { format } from "date-fns";

export const ComponentOreDipendente = (props:any)=>{
    const {Orari , Anno, Mese} = props
    const [testo,setTesto] = useState<string>("") 
    const [, setText] = useState<string>()
    const GlobalData = useContext(OrarioDataContext);
    const [File,setFile] = useState<string[]>([])
    let Color = "black"
    let OreOrd = 0
    let OreStra = 0
    let OrePre = 0
    let OreFest = 0
    let OreViaggio = 0
    let Estero = 0
    useEffect(() => {
        let links = [process.env.PUBLIC_URL + "/ore_dipendente.tex"];
        const action = testo
        async function main() {
            const files = await Promise.all(
                links.map((link) => fetch(link)
                .then((res) => res.text()),
                )
            );
            setTesto(files[0]);
            if(action !== "Aggiorna" && action !== ""){
                const f = ReadFileModel();
            }
        }
        main();
    
        }, [testo]);
        
        const ReadFileModel=()=>{
            let content = cleanContent(testo);
            setText(content.text);
            AggiungiOreDipendente(content.arr);
        }

        const cleanContent = (t:string) => {
            t =t.replace(/^\s*[\r\n]/gm, "");
            let array = t.split(new RegExp(/[\r\n]/gm));
            const arr = array.join("\n")            
            return {text:arr , arr:array}
        };

        function AggiungiOreDipendente(arr:string[]) {
            DataAdaptation(arr,"\\def \\tecnico","\\def \\tecnico {" + GlobalData?.tecnico + "}")
            const IndexSezioneDettaglio = arr.findIndex((t) => t === "\\sectionmark{Ore Dipendente} ")
            const IndexSezioneFinale = arr.findIndex((t) => t === "\\sectionmark{Parte Finale}")
            const FileParte1 = arr.slice(0,IndexSezioneDettaglio)        
            const FileParte2 = arr.slice(IndexSezioneFinale)
            const f1=FileParte1.join("\n")
            const f2=FileParte2.join("\n")
            const SezioneOrari = [""]
            const SezioneFinale = [""]
            const NumGiorni = new Date(Anno, Mese, 0).getDate();
            

            for (let index = 1; index < NumGiorni+1; index++) {
                const Data = new Date(Anno, (Mese) - 1,index);
                const Filtro = Orari.filter((o:IModelOrario) => { 
                    try {
                        const d = new Date(o.Data)
                        return (DateCompareUTC(d,Data) && o.Tecnico === GlobalData?.tecnico)
                    } catch (error) {}
                })

                const {oo,ov,of,op,os,estero} = Somma(Filtro)
                OreOrd = OreOrd + oo
                OreStra = OreStra + os
                OreFest = OreFest + of
                OrePre = OrePre + op
                OreViaggio = OreViaggio + ov
                Estero = Estero + estero
                if (Filtro.length > 0){       
                    const NumRecord = Filtro.length                                 
                    Filtro.map((o:IModelOrario,Indice:number)=>{                                 
                        let Color = "black"
                        let Ore = []
                        Ore.push(o)
                        const {oo,ov,op,of,os,o_permesso} = Somma(Ore)
                        const Dat = format(o.Data,"dd-MM-yyyy");
                        const d = new Date(o.Data)
                        const GiornoTesto = d.GiornoTesto && d.GiornoTesto() || "" 
                        let Note = "";
                        if(o.Estero === "true") {Note = "Diaria estero"}
                        if(o.Tipo === "Viaggio") {Color = "blue"} 
                        if(o.Tipo !== "Lavoro" && o.Tipo !== "Viaggio"){Color = "red"}                      
                        if((o.Data.isHoliday && o.Data.isHoliday() ||  
                            Data.getDay() === 0 ||  Data.getDay() === 6) && o.Tipo !== "Viaggio")
                            {Color = "green"}
                        
                        if(o.Tipo === "Lavoro" || o.Tipo === "Viaggio"){
                            SezioneOrari.push("\\color{", Color , "}",GiornoTesto, " & " , Dat ," & ","\\color{" ,Color , "}",(oo+ov+op+of+os).toString(), " & " ,"\\color{" ,Color , "}", o.Tipo || "" , " & " , Note , " & " + "\n" )
                        }else{
                            SezioneOrari.push("\\color{", Color , "}",GiornoTesto, " & " , Dat ," & ","\\color{" ,Color , "}",(o_permesso).toString(), " & " ,"\\color{" ,Color , "}", o.Tipo || "" , " & " , Note , " & " + "\n" )
                        }

                        if(Indice === NumRecord-1) {SezioneOrari.push("\\hline")}
                        return false
                        }         
                    )
                }else if(!Data.isHoliday() && Data.getDay() !== 6 && Data.getDay() !== 0){
                    Color = "red";
                    const Dat = format(Data,"dd-MM-yyyy");
                    const d = new Date(Data)
                    const GiornoTesto = d.GiornoTesto && d.GiornoTesto() || "" 
                    SezioneOrari.push("\\color{", Color , "}",GiornoTesto, " & " , Dat ," & ","\\color{" ,Color , "}","0", " & " ,"\\color{" ,Color , "}", "Orario assente" || "" , " & " , "Orario assente" , " & " + "\n" )
                    SezioneOrari.push("\\hline")
                }
                
            }
            SezioneFinale.push("\\end{longtable}")
            SezioneFinale.push("\\end{center}")
            SezioneFinale.push("\\hline")
            SezioneFinale.push("\\textbf{ Ore ordinarie : " , OreOrd.toString() , "} \\\\" ,"\n")
            SezioneFinale.push("\\textbf{ Ore straordinarie : " , OreStra.toString() , "} \\\\" ,"\n")
            SezioneFinale.push("\\textbf{ Ore Prefestive : " , OrePre.toString() , "} \\\\" ,"\n")
            SezioneFinale.push("\\textbf{ Ore Festive : " , OreFest.toString() , "} \\\\" ,"\n")
            SezioneFinale.push("\\textbf{ Ore Viaggio : " , OreViaggio.toString() , "} \\\\" ,"\n")
            SezioneFinale.push("\\textbf{ Trasferte estero : " , Estero.toString() , "} \\\\" ,"\n")
                
            setFile([f1, ...SezioneOrari,...SezioneFinale , f2])
            const testo=File.join("\n");
            setText(testo)
            
        }
    return <>       
    {
        GlobalData?.isAdmin &&
        <Button className="m-1" variant="contained" onClick={()=>DownloadOreDipendente(File,GlobalData?.tecnico + "-" + Mese + "-" + Anno || "")}>
        Download Ore dipendente
    </Button>
    }
    </>
}



