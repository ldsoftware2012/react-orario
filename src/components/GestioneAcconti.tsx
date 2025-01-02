import { useContext, useEffect, useState } from "react"
import { DateCompareUTC, IAcconto } from "../interface/interface"
import { OrarioDataContext } from "../App"
import DatePicker from "react-datepicker"
import Popup from "./Popup"
import { faSave } from "@fortawesome/free-regular-svg-icons"
import { Menu } from "./Menu"
import { Footer } from "./Footer"
import { Delete, GetRemoteData, ListaClienti, ListaTecniciLocal, UpdateAcconto } from "../data/Datasource"
import { url_Acconti, url_DeleteAcconto, url_UpdateAcconto, url_UploadFile } from "../data/config"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Button, Col, Row } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClose, faTrash } from "@fortawesome/free-solid-svg-icons"
import axios from 'axios'

export default function GestioneAcconti(){
    const GlobalData = useContext(OrarioDataContext);
    const [id,SetID] = useState<number>()
    const [data, setData] = useState<Date>(new Date())
    const [entrata, setEntrata] = useState<number>()
    const [uscita, setUscita] = useState<number>()
    const [note, setNote] = useState("")
    const [tecnico,SetTecnico] = useState("")
    const [fattura, SetFattura] = useState("")
    const [Parameters] = useSearchParams();
    const [acconto,SetAcconto] = useState<IAcconto>()
    const [cliente, SetCliente] = useState("")
    const [error,setError] = useState<{state?:number,description:string}>()
    const navigate = useNavigate();
    const [file, setFile] = useState<File | null>(null);
    const [resultRemoteOperation, setResultRemoteOperation] = useState<{status : Number, description:string}>();
    const [status, setStatus] = useState<
    "initial" | "uploading" | "success" | "fail"
    >("initial");
    
    let Data = Parameters.get("Data") || "";
    if(Data==null) {Data = new Date().toString()} 
    const Tecnico = Parameters.get("Tecnico") || "";



//Load page
useEffect(() => {
    setData(new Date(Data))
    const acc = GlobalData?.acconti.find((a)=>{
        var d = new Date(a.Data)
        var data_ = new Date(Data)
        return DateCompareUTC(d,data_)  && a.Tecnico==Tecnico
    }) 

    SetTecnico(Tecnico)
    
    if(acc){
        SetAcconto(acc)
        SetID(acc.ID)
        setEntrata(acc?.Entrata) 
        setUscita(acc?.Uscita) 
        setNote(acc?.Note || "")
        SetFattura(acc?.Fattura || "")
        SetCliente(acc.Cliente)
    }
}, [])

useEffect(() => {
    if (resultRemoteOperation?.status != 0) {
    const timeoutId = setTimeout(() => {
        setResultRemoteOperation({status:0,description:""})
    }, 3000);
    }
}, [resultRemoteOperation])


const handleSaveAcconto: any = async()=> {
    setError({state:-1,description:""})
    const newdata : IAcconto = {
        ID : id,
        Data : data,
        Entrata : entrata || 0,
        Uscita : uscita || 0,
        Note : note,
        Fattura : fattura,
        Tecnico : tecnico,
        Cliente : cliente
    }
    if (cliente == "") {setError({description:"Selezionare cliente"}); return}
    if (newdata.Tecnico == "") {setError({description:"Selezionare tecnico"}); return}
    if(newdata.Entrata == 0 && newdata.Uscita == 0){setError({description:"Impostare un valore su entrata o uscita"}); return}    
    
    console.log("tecnico=",tecnico)
    const result = await UpdateAcconto(url_UpdateAcconto, newdata);
    setResultRemoteOperation({status:result.status,description:result.description});

    if(result.status==1){  
        const acc = await GetRemoteData(url_Acconti)
        GlobalData?.setAcconti(acc)}
        setError({state: result.status, description:result.description})
        navigate(-1)   
}
const handleDeleteAcconto: any = async()=> {
        const url = url_DeleteAcconto + "?id=" + id;
        const result = await Delete(url);
        if(result.status==1){
            const acc = await GetRemoteData(url_Acconti)
            GlobalData?.setAcconti(acc)}
            setError({state: result.status, description:result.description.toString()})   
            navigate(-1)         
        }



    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(cliente)
        if (e.target.files) {
        setStatus("initial");
        setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (file) {
        setStatus("uploading");
    
        const formData = new FormData();
        formData.append("file", file);
        formData.append('fileName', file.name);
        console.log("formdata",formData)

        const config = {
            headers: {
            'content-type': 'multipart/form-data',
            },
        };

        axios.post(url_UploadFile, formData, config).then((response) => {
            console.log(response.data);
            setStatus("success")
        });

        
        }
    };


    const handleUpload2 = async () => {
        if (file) {
        setStatus("uploading");
    
        const formData = new FormData();
        formData.append("file", file);
    
        try {
            const result = await fetch("https://httpbin.org/post", {
            method: "POST",
            body: formData,
            });
    
            const data = await result.json();
    
            console.log(data);
            setStatus("success");
        } catch (error) {
            console.error(error);
            setStatus("fail");
        }
        }
    };

    const Result = ({ status }: { status: string }) => {
        if (status === "success") {
        return <p>✅ File uploaded successfully!</p>;
        } else if (status === "fail") {
        return <p>❌ File upload failed!</p>;
        } else if (status === "uploading") {
        return <p>⏳ Uploading selected file...</p>;
        } else {
        return null;
        }
    };

    return(
    <>
    <Menu/>
    <div className="Container fluid bg-light m-5">
        <Row>
            <Col className="text-end"><Button  onClick={()=>navigate(-1)} className="btn btn-outline-dark bg-light m-2 rounded"><FontAwesomeIcon icon={faClose}/></Button></Col>
        </Row>
        <legend className="text-center mt-5">Gestione Acconti</legend>

        <div className="m-5 px-3">
            <ListaClienti 
                value={cliente} 
                onChange={SetCliente}/>
            <ListaTecniciLocal 
                value={tecnico}
                onChange={SetTecnico}
            />
            <DatePicker
                id="data_fattura"
                className="m-2"
                dateFormat="dd/MM/yyyy"
                showIcon
                selected={data}
                onChange={(data) => (data != null ? setData(data) : new Date())}
            />

            {/* <CurrencyInput        
                id="input-entrata"
                title="Entrata"
                className="text-success m-2"
                allowNegativeValue={false}
                name="input-entrata"
                placeholder="Entrata"    
                //prefix="€ "
                decimalSeparator=","
                decimalsLimit={4}
                value={entrata}
                onValueChange={(value, name, values) => setEntrata(parseFloat(value || "0,0"))}
            />
            <CurrencyInput        
                id="input-uscita"
                title="Uscita"
                className="text-danger m-2"
                allowNegativeValue={false}
                name="input-uscita"
                placeholder="Uscita"    
                //prefix="€ "
                decimalSeparator=","
                decimalsLimit={4}                
                value={uscita}                
                onValueChange={(value, name, values) => setUscita(values?.float || 0.0)}
            />        */}

            <input
                type="number"
                title="Entrata €"
                className="text-success m-2"
                placeholder="Entrata"
                value={entrata}
                onChange={(e)=>setEntrata(parseFloat(e.target.value))}
            />
            <input
                type="number"
                title="Uscita €"
                className="text-danger m-2"
                placeholder="Uscita"
                value={uscita}
                onChange={(e)=>setUscita(parseFloat(e.target.value))}
            />
            <div >
                <input 
                    className="col-12"
                    type="text"
                    placeholder="Note"
                    value={note}
                    onChange={(e)=>{setNote(e.target.value)}}
                />
            </div>
            <div className="mt-2">
                <input 
                    className="col-12"
                    type="text"
                    placeholder="Fattura"
                    value={fattura}
                    onChange={(e)=>{SetFattura(e.target.value)}}
                />
            </div>

            <div>
                <input id="file" type="file" onChange={handleFileChange} />
            </div>
            

            { (
        <button onClick={handleUpload} className="submit">
            Upload a file
        </button>
        )}
        <Result status={status} />

            <div className="text-center m-2">
            <div className={error?.state == 1 ? "bg-success" : "bg-danger"}>{error?.description}</div>
            <Popup Icon={faSave} 
                Label=" Salva" 
                Position="up" 
                MessageTitle="Salvataggio Acconto" 
                MessageDescription="Vuoi salvare questo acconto?"
                onConfirm={()=>handleSaveAcconto()}
                />  
            <Popup Icon={faTrash} 
                Label=" Elimina" 
                Position="up" 
                MessageTitle="Eliminazione Acconto" 
                MessageDescription="Vuoi eliminare questo acconto?"
                onConfirm={()=>handleDeleteAcconto()}
                />        
            </div>
        </div>
    </div>
        <Footer/>
    </>
    )
}
