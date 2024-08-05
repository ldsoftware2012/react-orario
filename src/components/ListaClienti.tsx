import { useEffect, useState } from "react";
import { Menu } from "./Menu";
import { Col, Row } from "react-bootstrap";
import '../css/AnalisiMese.css';
import { Footer } from "./Footer";
import { Delete, GetRemoteData, UpdateCliente } from "../data/Datasource";
import { url_Clienti, url_DeleteCliente, url_UpdateCliente } from "../data/config";
import { ICliente } from "../interface/interface";
import Popup from "./Popup";
import { faMagnifyingGlass, faTrash } from "@fortawesome/free-solid-svg-icons";
import { faSave } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from "react-select"
import React from "react";
import { Alert, InputAdornment, TextField } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import { Cancel } from "@mui/icons-material";

export default function Clienti(){

    const [clienti, SetClienti] = useState<ICliente[]>([])
    const [cliente,SetCliente] = useState("")
    const [indirizzo,SetIndirizzo] = useState("")
    const [localita,SetLocalita] = useState("")
    const [provincia,SetProvincia] = useState("")
    const [tel,SetTel] = useState("")
    const [cell,SetCell] = useState("")
    const [fax,SetFax] = useState("")
    const [email,SetEmail] = useState("")
    const [piva,SetPiva] = useState("")
    const [cap,SetCap] = useState("")
    const [listino,SetListino] = useState<string>("")
    const listinooptions = [{value:"Selmec_2020",label:"Selmec_2020"},{value:"Standard",label:"Standard"}]
    const [resultRemoteOperation, setResultRemoteOperation] = useState<{status : Number, description:string}>();
    
    const LoadClientiData = (e:string)=>{
        const cl=clienti.find((c:ICliente)=>c.Cliente === e)
        if (cl != null) {
            SetCliente(cl.Cliente)
            SetIndirizzo(cl.Indirizzo)
            SetPiva(cl.Piva || "")
            SetLocalita(cl.Localita)
            SetProvincia(cl.Provincia || "")
            SetTel(cl.Tel ||"")
            SetCell(cl.Cell ||"")
            SetFax(cl.Fax ||"")
            SetEmail(cl.Email || "")
            SetCap(cl.CAP || "")
            SetListino(cl.Pricelist || "")
        }
    }

    const  HandleSaveData = async ()=>{
        const newdata : ICliente = {
            Cliente : cliente,
            Indirizzo : indirizzo,
            Localita : localita,
            CAP : cap,
            Cell : cell,
            Email : email,
            Fax : fax,
            Piva : piva,
            Pricelist : listino,
            Provincia : provincia,
            Tel : tel
        }
        if (newdata.Cliente === "") { return}

        const result = await UpdateCliente(url_UpdateCliente,newdata)
        setResultRemoteOperation({status:result.status,description:result.description});
        if (result.status === 1) {
            const clienti = await GetRemoteData(url_Clienti)
            SetClienti(clienti)
        }
    }

    const HandleDeleteData = async (ID:string)=>{
        try {
            if (ID === "") { return}
            const url = url_DeleteCliente + "?id=" + ID;
            const res = await Delete(url)
            if (res.status === 1) {
                const clienti = await GetRemoteData(url_Clienti)
                SetClienti(clienti)
                SetCliente("")
                SetIndirizzo("")
                SetPiva("")
                SetLocalita("")
                SetProvincia("")
                SetTel("")
                SetCell("")
                SetFax("")
                SetEmail("")
                SetCap("")
                SetListino("")
            }
        } catch (error) {
            console.log(error);
        }
    }

    const HandleFiltraCliente = async (cliente:string) =>{
        let all = await GetRemoteData(url_Clienti)
        let cl = all

        if (cliente.length > 0) {            
            cl = all.filter((c:ICliente) => 
            c.Cliente.toUpperCase().substring(0,cliente.length) === cliente.toUpperCase())              
        }  
        SetClienti(cl)       
    }

    useEffect(() => {
        if (resultRemoteOperation?.status !== 0) {
        }
    }, [resultRemoteOperation])

    useEffect(() => {
        (async()=>{
            const clienti = await GetRemoteData(url_Clienti)
            SetClienti(clienti)
        })()
    }, [])
    

    return(
        <>
        <Menu />
        <br></br>
        <div id="EditCliente" className="mt-2">
            <legend className="text-center"><h2>Cliente</h2></legend>
            <div className="m-2">

            <TextField
                label="Cliente"
                id="outlined-start-adornment"
                sx={{ m: 1, width: '100%' }}
                InputProps={{
                startAdornment: <InputAdornment position="start"></InputAdornment>,
                }}
                value={cliente}
                onChange={(e)=>SetCliente(e.target.value)}
            />

            <TextField
                label="Indirzizzo"
                id="outlined-start-adornment"
                sx={{ m: 1, width: '100%' }}
                InputProps={{
                startAdornment: <InputAdornment position="start"></InputAdornment>,
                }}
                value={indirizzo}
                onChange={(e)=>SetIndirizzo(e.target.value)}
            />

            <TextField
                label="Localita"
                id="outlined-start-adornment"
                sx={{ m: 1, width: '100%' }}
                InputProps={{
                startAdornment: <InputAdornment position="start"></InputAdornment>,
                }}
                value={localita}
                onChange={(e)=>SetLocalita(e.target.value)}
            />

            <TextField
                label="Provincia"
                id="outlined-start-adornment"
                sx={{ m: 1, width: '100%' }}
                InputProps={{
                startAdornment: <InputAdornment position="start"></InputAdornment>,
                }}
                value={provincia}
                onChange={(e)=>SetProvincia(e.target.value)}
            />

            <TextField
                label="Tel."
                id="outlined-start-adornment"
                sx={{ m: 1, width: '100%' }}
                InputProps={{
                startAdornment: <InputAdornment position="start"></InputAdornment>,
                }}
                value={tel}
                onChange={(e)=>SetTel(e.target.value)}
            /> 

            <TextField
                label="Cellulare"
                id="outlined-start-adornment"
                sx={{ m: 1, width: '100%' }}
                InputProps={{
                startAdornment: <InputAdornment position="start"></InputAdornment>,
                }}
                value={cell}
                onChange={(e)=>SetCell(e.target.value)}
            />

            <TextField
                label="Fax"
                id="outlined-start-adornment"
                sx={{ m: 1, width: '100%' }}
                InputProps={{
                startAdornment: <InputAdornment position="start"></InputAdornment>,
                }}
                value={fax}
                onChange={(e)=>SetFax(e.target.value)}
            />
                
            <TextField
                label="Email"
                id="outlined-start-adornment"
                sx={{ m: 1, width: '100%' }}
                InputProps={{
                startAdornment: <InputAdornment position="start"></InputAdornment>,
                }}
                value={email}
                onChange={(e)=>SetEmail(e.target.value)}
            />  
                
            <TextField
                label="P.Iva"
                id="outlined-start-adornment"
                sx={{ m: 1, width: '100%' }}
                InputProps={{
                startAdornment: <InputAdornment position="start"></InputAdornment>,
                }}
                value={piva}
                onChange={(e)=>SetPiva(e.target.value)}
            />

            <TextField
                label="CAP"
                id="outlined-start-adornment"
                sx={{ m: 1, width: '100%' }}
                InputProps={{
                startAdornment: <InputAdornment position="start"></InputAdornment>,
                }}
                value={cap}
                onChange={(e)=>SetCap(e.target.value)}
            />

            <Select 
                options={listinooptions} 
                value={{value: listino,label:listino}} 
                onChange={(e) => SetListino(e?.value || "")}/>
            </div>
                {/* {resultRemoteOperation?.status != null && <div className={resultRemoteOperation?.status === 1 ? "bg-success text-white" : "bg-danger text-white"}>{resultRemoteOperation?.description}</div>} */}
                {resultRemoteOperation?.status === 1 &&
                    <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                    {resultRemoteOperation?.description}
                </Alert>
                }

                {(resultRemoteOperation?.status === -1 || resultRemoteOperation?.status === -2) &&
                <Alert icon={<Cancel fontSize="inherit" />} severity="error">
                    {resultRemoteOperation?.description}
                </Alert>
                }  
                <Col className="col text-center m-3">
                    <Popup IconColor="green" Icon={faSave} Position="bottom" Label="Salva" MessageTitle="Salva" MessageDescription= "Vuoi salvare questo cliente?  " onConfirm={()=>HandleSaveData()}></Popup> 
                    <Popup IconColor="red" Icon={faTrash} Position="bottom" Label="Elimina" MessageTitle="Elimina" MessageDescription= "Vuoi eliminare il cliente?  " onConfirm={()=>HandleDeleteData(cliente)}></Popup>
                </Col>            
        </div>
            <legend className="text-center"><h2>Lista Clienti</h2></legend>
        <Row>
            <Col>
                <FontAwesomeIcon className="px-3" icon={faMagnifyingGlass}/>
                <input
                placeholder="Cerca cliente..."
                className="m-2 text-center w-50"
                onChange={(e)=>HandleFiltraCliente(e.target.value)}
                />   
            </Col>                  
        </Row>
        {
        clienti.map((c,index)=>{            
            const color = index % 2 === 0 ? "pari" : "dispari"
            return(         
            <React.Fragment key={index}>
                <Row className="h-50" onClick={(e)=>LoadClientiData(e.currentTarget.id)} id={c.Cliente}>
                    <Col className={`${color} Calendario Pointer`}>
                        <div className= "m-3"><b>{c.Cliente}</b> {c.Indirizzo}</div>       
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