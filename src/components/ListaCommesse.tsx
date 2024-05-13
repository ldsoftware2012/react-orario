import { useContext, useEffect, useState } from "react";
import { Menu } from "./Menu";
import { Col, Row } from "react-bootstrap";
import '../css/AnalisiMese.css';
import { Footer } from "./Footer";
import { Delete, GetRemoteData, UpdateCommessa } from "../data/Datasource";
import { url_Commesse, url_DeleteCommessa, url_UpdateCommessa } from "../data/config";
import { ICommesse } from "../interface/interface";
import Popup from "./Popup";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faSave } from "@fortawesome/free-regular-svg-icons";
import React from "react";
import { OrarioDataContext } from "../App";

export default function ListaCommesse(){
    const [commessa, setCommessa] = useState("")
    const [descrizione, setDescrizione] = useState("")
    const [commesse, setCommesse] = useState<ICommesse[]>([])
    const [resultRemoteOperation, setResultRemoteOperation] = useState<{status : Number, description:string}>();
    const GlobalData = useContext(OrarioDataContext);
    
    const LoadCommessaData = (e:string)=>{
        const comm=commesse.find((c)=>c.Commessa === e)
        if (comm != null) {
            setCommessa(comm.Commessa)
            setDescrizione(comm.Descrizione)
        }
    }

    const  HandleSaveData = async ()=>{
        const newdata : ICommesse = {
            Commessa : commessa,
            Descrizione : descrizione,
            DataInizio : new Date()
        }
        if (newdata.Commessa == "") { return}

        const result = await UpdateCommessa(url_UpdateCommessa, newdata);
        setResultRemoteOperation({status:result.status,description:result.description});

        if (result.status==1) {
            const comm = await GetRemoteData(url_Commesse)
            setCommesse(comm)
            GlobalData?.setCommesse(comm)
        }
    }

    const HandleDeleteData = async (ID:string)=>{
        try {
            if (ID == "") { return}
            const url = url_DeleteCommessa + "?id=" + ID;
            const result = await Delete(url)

            setResultRemoteOperation({status:result.status,description:result.description ||""});
            if (result.status == 1) {
                const comm = await GetRemoteData(url_Commesse)
                setCommesse(comm)
                setCommessa("")
                setDescrizione("")
            }
        } catch (error) {
            console.log(error);
        }
    }

    const HandleFiltraCommesse = async (commessa:string) =>{
        let all = await GetRemoteData(url_Commesse)
        let comm = all

        if (commessa.length > 0) {            
            comm = all.filter((c:ICommesse) => 
            c.Commessa.toUpperCase().substring(0,commessa.length) == commessa.toUpperCase())              
        }  
        setCommesse(comm)       
    }

    useEffect(() => {
        if (resultRemoteOperation?.status != 0) {
        const timeoutId = setTimeout(() => {
            setResultRemoteOperation({status:0,description:""})
        }, 3000);
        }
    }, [resultRemoteOperation])

    useEffect(() => {
        (async()=>{
            const comm = await GetRemoteData(url_Commesse)
            setCommesse(comm)
        })()
    }, [])
    

    return(
        <>
        <Menu />
        <div id="EditCommessa" className="bg-secondary-subtle mt-2">
            <br></br>
            <legend className="text-center"><h2>Commessa</h2></legend>
            <div className="input-group input-group-sm mb-3">
                <div className="input-group-prepend">
                    <span className="input-group-text" id="inputGroup-sizing-sm">Commessa</span>
                </div>
                <input type="text" 
                className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"
                value={commessa}
                onChange={(e)=>setCommessa(e.target.value)}
                />
            </div>
            
            <div className="input-group input-group-sm mb-3">
                <div className="input-group-prepend">
                    <span className="input-group-text" id="inputGroup-sizing-sm">Descrizione</span>
                </div>
                <input type="text" 
                className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"
                value={descrizione}
                onChange={(e)=>setDescrizione(e.target.value)}
                />        
            </div>
            {resultRemoteOperation?.status != null && <div className={resultRemoteOperation?.status === 1 ? "bg-success text-white" : "bg-danger text-white"}>{resultRemoteOperation?.description}</div>}
            <div className="input-group-prepend text-center m-3">
                <Popup IconColor="green"  Icon={faSave} Position="bottom" Label="Salva" MessageTitle="Salva" MessageDescription= "Vuoi salvare questa commessa?  " onConfirm={()=>HandleSaveData()}></Popup> 
                {GlobalData?.isAdmin && <Popup IconColor="red"  Icon={faTrash} Position="bottom" Label="Elimina" MessageTitle="Elimina" MessageDescription= "Vuoi eliminare la commessa?  " onConfirm={()=>HandleDeleteData(commessa)}></Popup>}
            </div>

            <legend className="text-center"><h2>Lista Commesse</h2></legend>
            
            <div className="input-group input-group-sm mb-3">
                <div className="input-group-prepend">
                        <span className="input-group-text" id="inputGroup-sizing-sm">Cerca...</span>
                    </div>
                    <input type="text" 
                    className="form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default"
                    onChange={(e)=>HandleFiltraCommesse(e.target.value)}
                    />
            </div>   
        </div>
        {
        commesse.map((c,index)=>{            
            const color = index % 2 == 0 ? "pari" : "dispari"
            return(         
            <React.Fragment key={index}>                
                <Row className="h-50" onClick={(e)=>LoadCommessaData(e.currentTarget.id)} id={c.Commessa}>
                    <Col className={`${color} Calendario Pointer`}>
                        <div className= "m-3"><b>{c.Commessa}</b> {c.Descrizione}</div>       
                    </Col>
                </Row>
            <Footer/> 
            </React.Fragment>
            )
        })
        }
        </>
    )
}