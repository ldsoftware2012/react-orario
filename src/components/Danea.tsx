import { useContext, useState } from "react";
import { DownloadDanea, ListaClienti } from "../data/Datasource";
import { IModelOrario } from "../interface/interface";
import { OrarioDataContext } from "../App";
import DatePicker from "react-datepicker";
import Select from 'react-select';
import { Button } from "react-bootstrap";

export default function Danea(props:any){
    const GlobalData = useContext(OrarioDataContext);
    const [cliente, setCliente] = useState("")
    const [startDate, setStartDate] = useState(new Date())
    const [listino, setListino] = useState<{value: string; label: string;} | null>({label:"Standard",value:"Standard"})
    const [iva, setIva] = useState<{value: string; label: string;} | null>({label:"22%",value:"22"})

    const HandleDownloadDanea = (orari : IModelOrario[])=>{       
        const tecnico = GlobalData?.tecnici.find((t) => t.Tecnico == GlobalData.tecnico) || {Tecnico:"",Acronimo:"",Indirizzo:""}
        const cl = GlobalData?.clienti.find((c) => c.Cliente == cliente) || {Cliente:"",Indirizzo:"",Piva:"",Localita:""}      
        DownloadDanea(orari,tecnico,cl,startDate.FormatoYY_MM_DD(),listino?.value || "Standard", iva?.value || "22")
    }
    
    function Listini(){
        const options = [{value:"Standard",label:"Standard"},{ value:"Selmec_2020",label:"Selmec_2020"}]
        return(
            <Select
                defaultValue={listino}
                options={options}
                onChange={setListino}
            />
        )
    }

    function Iva(){
        const options = [{value:"22",label:"22%"},{ value:"N8c",label:"N8c"}]

        return(
            <Select            
                defaultValue={iva}
                options={options}
                onChange={setIva}
            />
        )
    }

    function DataFattura() {
        return (
        <>
            <DatePicker
            id="data_inizio"
            dateFormat="dd/MM/yyyy"
            showIcon
            selected={startDate}
            onChange={(date) => (date != null ? setStartDate(date) : new Date())}
            />
        </>
        );
    }


    return(        
        <> 
        {GlobalData?.isAdmin &&    
        <div className="Container-fluid m-5 col-6 bg-light">
            <legend className="text-center">Danea</legend>
            <div className="px-4">
                <div>
                    <ListaClienti 
                        placeholder = "Seleziona un cliente"
                        // defaultValue={cliente}
                        value={cliente}
                        onChange={setCliente}
                    />
                </div>
                <div><DataFattura/></div>
                <div><Listini /></div>
                <div><Iva/></div>
                <div className="text-center"><Button 
                    onClick={()=>HandleDownloadDanea(props.Orari)}>
                    Download
                </Button>
                </div>
            </div> 
        </div>
        }
        </>        
    )
}