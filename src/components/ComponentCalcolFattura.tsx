import { useContext, useEffect, useState } from "react";
import { GetListaClienti, GetRemoteData, Somma, Tecnici } from "../data/Datasource";
import { OrarioDataContext } from "../App";
import { IModelOrario } from "../interface/interface";
import { url_Orario } from "../data/config";
import { format } from "date-fns";
import { Alert } from "@mui/material";



export const  ComponentCalcolaFattura = (props:any)=>{
    const {Anno,Mese} = props
    const GlobalData = useContext(OrarioDataContext);
    const NumGiorni = new Date(Anno, Mese, 0).getDate();
    const [dataload,Setdataload] = useState<Boolean>(false)
    const [Orario, setOrario] = useState<IModelOrario[]>([])
    let data1 = new Date(Anno, Mese - 1, 1 );
    let data2 = new Date(Anno, Mese - 1, NumGiorni );

    const data_inizio = format(data1, "yyyy/MM/dd");
    const data_fine = format(data2, "yyyy/MM/dd");
    useEffect(() => {
        (async()=>{
            Setdataload(false)
            const orario = await GetRemoteData(
                url_Orario +
                "?tecnico=" +
                GlobalData?.tecnico +
                "&cliente=" +
                "Tutti *" +
                "&commessa=" +
                "Tutte *" +
                "&datainizio=" +
                data_inizio +
                "&datafine=" +
                data_fine
            );

            setOrario(orario)
            Setdataload(true)
        })()
    }, [])
    

    type ITotali = {
        Cliente:string,
        oo:number,
        os:number,
        ov:number,
        op:number,
        of:number,
        estero :number,
    }
    const Totali:ITotali[] = []

    const Clienti = GetListaClienti(Orario)
    if (Clienti.length > 0){
        Clienti.map((c) =>{
            const Filtro = Orario.filter((o)=>(o.Cliente === c && o.Cliente !== "LD Software"))
            if (Filtro.length > 0){
                const {oo,ov,op,of,os,estero} = Somma(Filtro)
                Totali.push({Cliente : Filtro[0].Cliente , oo:oo, ov:ov,os:os,op:op,of:of,estero:estero })
            }
        })
    }


    return<>    
    <Alert>
        
        {Totali.map((t)=>{

        // const {oo,ov,op,of,os,estero} = Somma(Orario)
        const Tecnico = Tecnici.find((t)=>t.Nickname === GlobalData?.tecnico)
        const ore_ord = t.oo * (Tecnico?.Ore_Ord || 0)
        const ore_stra =t.os * (Tecnico?.Ore_Stra || 0)
        const ore_viaggio = t.ov * (Tecnico?.Ore_Viaggio || 0)
        const ore_pref = t.op * (Tecnico?.Ore_Pref || 0)
        const ore_fest = t.of * (Tecnico?.Ore_Fest || 0)
        const est = t.estero * (Tecnico?.Estero || 0)
        const totale = ore_ord + ore_fest +ore_pref + ore_stra + ore_viaggio + est


        return(
            <table>
            <th>{t.Cliente}</th>
            <tr>
                <td>Ore ordinarie ({t.oo})</td>
                <td>€ {ore_ord}</td>
            </tr>
            <tr>
                <td>Ore straordinarie ({t.os})</td>
                <td>€ {ore_stra}</td>
            </tr>
            <tr>
                <td>Ore viaggio ({t.ov})</td>
                <td>€ {ore_viaggio}</td>
            </tr>
            <tr>
                <td>Ore prefestive ({t.op})</td>
                <td>€ {ore_pref}</td>
            </tr>
            <tr>
                <td>Ore festive ({t.of})</td>
                <td>€ {ore_fest}</td>
            </tr>
            <tr>
                <td>Estero ({t.estero})</td>
                <td>€ {est}</td>
            </tr>
            <tr>
                <td><b>Totale </b></td>
                <td><b>€ {totale}</b> </td>
            </tr>
        </table>
            )
        })
    }


    </Alert>
    </>
}