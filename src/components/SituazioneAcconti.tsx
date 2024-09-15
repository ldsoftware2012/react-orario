import { Footer } from "./Footer";
import { Menu } from "./Menu";
import { useContext, useEffect } from "react";
import { OrarioDataContext } from "../App";
import "../css/Acconti.css"
import { ListaTecnici } from "../data/Datasource";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleRight } from "@fortawesome/free-solid-svg-icons";
import { IAcconto } from "../interface/interface";
import { format } from "date-fns";
import React from "react";


export default function SituazioneAcconti(){
const GlobalData = useContext(OrarioDataContext);
const AccontoRow = (props:any)=>{
    const {acconto} = props
    const data = format(acconto.Data, "dd/MM/yyyy");
    return(<>    
        <td>{acconto.Cliente}</td>
        <td>{acconto.Tecnico}</td>
        <td>{data}</td>
        <td className="text-success">€ {acconto.Entrata}</td>
        <td className="text-danger">€ {acconto.Uscita}</td>
        <td>{acconto.Fattura}</td>
        <td>{acconto.Note}</td>
        {acconto.Fattura != "" && <td>✅</td>}
        {acconto.Fattura == "" && <td>❌</td>}
        {GlobalData?.isAdmin && <td><Link to={"/updateAcconto?Data=" + acconto.Data + "&Tecnico=" + acconto.Tecnico}><FontAwesomeIcon icon={faArrowCircleRight}/></Link></td>}
</>)}    


const Total = ()=>{
    let entrate = 0.0
    let uscite = 0.0
    GlobalData?.acconti.filter((a)=>a.Tecnico == GlobalData.tecnico).map((a:IAcconto)=>{
            entrate = entrate + a.Entrata
            uscite += a.Uscita
    })

    const diff = entrate-uscite
    const sit_entrate = diff >= 0 ? "€" + diff : ""
    const sit_uscite = diff < 0 ? "€" + diff : ""

    return(
    <>
    <React.Fragment>
        <tr></tr>
        <tr>
            <th>Totale</th>
            <td></td>
            <td></td>
            <td className="text-success"><b>€ {entrate}</b></td>
            <td className="text-danger"><b>€ {uscite}</b></td>
        </tr>
        <tr>
            <th>Situazione</th>
            <td></td>
            <td></td>
            <td className="text-success"><b>{sit_entrate}</b></td>
            <td className="text-danger"><b>{sit_uscite}</b></td>
        </tr>
    </React.Fragment>
</>)}    

useEffect(() => {

}, [])


    return (
        <>
        <Menu/> 
        <legend className="text-center mt-4">Situazione Acconti</legend>      
        <div className="m-5">
            {GlobalData?.isAdmin && <ListaTecnici />}
        </div>
        <div className="d-flex flex-row ticky-top w-100  mb-3">
            
            <table className="text-center">
                <tbody>

                <tr>
                    <th>Cliente</th>
                    <th>Tecnico</th>
                    <th>Data</th>
                    <th>Entrata €</th>
                    <th>Uscita €</th>
                    <th>Fattura</th>
                    <th>Note</th>
                </tr>    

                {
                    GlobalData?.acconti.filter((a:IAcconto)=>a.Tecnico==GlobalData.tecnico).map((a)=>{
                        return(
                            <>
                            <tr>
                                <AccontoRow acconto={a}/>
                            </tr>
                            </>
                        )
                    })
                }

                <Total/>            
                </tbody>
            </table>
        </div>
        <Footer/>
        </>
    )
}