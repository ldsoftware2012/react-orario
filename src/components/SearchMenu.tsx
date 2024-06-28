import { useContext, useEffect, useRef, useState } from "react";
import {  GetRemoteData, ListaClienti, ListaTecnici, MapToOptions,} from "../data/Datasource";
import {  ISearchParameter} from "../interface/interface";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {  url_Orario,} from "../data/config";
import { format } from "date-fns";
import { Accordion } from "react-bootstrap";
import { OrarioDataContext } from "../App";
import Select from "react-select"

export default function SearchMenu() {
  const [fatturato, setfatturato] = useState<string>("false");
  const [cliente, setCliente] = useState("Tutti *");
  const [commessa, setCommessa] = useState("");
  const hasLoadedBefore = useRef(true);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [isEnabledFiltro, setisEnabledFiltro] = useState(true);
  const [filter, setFilter] = useState(false);
  const [searchParameter] = useState<ISearchParameter>({});

  const GlobalData = useContext(OrarioDataContext);
  //load page
  useEffect(() => {
    if (hasLoadedBefore.current) {
      try {
        (async () => {
          setCommessa("Tutte *");
          setCliente(GlobalData?.searchParameter.Cliente || "Tutti *");
          setCommessa(GlobalData?.searchParameter.Commessa || "Tutte *");
          setStartDate(GlobalData?.searchParameter.Data1 || new Date());
          setEndDate(GlobalData?.searchParameter.Data2 || new Date());
          setfatturato(GlobalData?.searchParameter.Fatturato || "false");
          setFilter(true);
        })();
      } catch (error) {}
    }
    hasLoadedBefore.current = false;
  }, []);

  useEffect(() => {
    let valid = true;
    if (startDate > endDate) {
      valid = false;
    }
    setisEnabledFiltro(valid);
    GlobalData?.setData_ref(startDate)
  }, [startDate, endDate]);

  //update data
  useEffect(() => {
    try {
      const data_inizio = format(startDate, "yyyy/MM/dd");
      const data_fine = format(endDate, "yyyy/MM/dd");
      GlobalData?.setIsDataUpdated(false);
      setFilter(false);
      //get remote data

      if (GlobalData?.tecnico !== "" && cliente !== "") {
        (async () => {
          GlobalData?.setIsDataLoad(false);
          const orario = await GetRemoteData(
            url_Orario +
              "?tecnico=" +
              GlobalData?.tecnico +
              "&cliente=" +
              cliente +
              "&commessa=" +
              commessa +
              "&datainizio=" +
              data_inizio +
              "&datafine=" +
              data_fine +
              "&fatturato=" +
              fatturato
          );

          GlobalData?.setOrario && GlobalData.setOrario(orario);
          GlobalData?.setIsDataLoad(true);
        })();
      }
    } catch (error) {}
  }, [filter, GlobalData?.isdataUpdated]);

  useEffect(() => {
    if (filter) {
      searchParameter.Cliente = cliente;
      searchParameter.Commessa = commessa;
      searchParameter.Data1 = startDate;
      searchParameter.Data2 = endDate;
      searchParameter.Fatturato = fatturato;
      GlobalData?.setSearchParameter(searchParameter);

      setCliente(GlobalData?.searchParameter.Cliente || "Tutti *");

      console.log("aggiornato search parameter = ", searchParameter);
    }
  }, [filter]);

  function ListaCommesse() {
    const options = MapToOptions(GlobalData?.commesse,"Commessa","Tutte *")
    return (
      <>
        {/* <label className="m-2">Commessa</label> */}
        <Select 
          options={options} 
          value={{value: commessa,label:commessa}}
          onChange={(e)=>setCommessa(e?.value || "")}
        />
      </>
    );
  }

  function TipoFiltroData() {

    function MesiPassati(mesi:number): void {
      var today = new Date();
      const days = new Date(today.getFullYear(), today.Mese() - mesi, 0).getDate();

      const data_inizio = new Date(
        today.getFullYear(),
        today.Mese() - mesi - 1,
        1,
        12
      );
      const data_fine = new Date(
        today.getFullYear(),
        today.Mese() - mesi - 1,
        days,
        12
      );
      setStartDate(data_inizio);
      setEndDate(data_fine);
    }
    return (
      <>
        <button
          type="button"
          onClick={() => MesiPassati(2)}
          className="btn btn-warning m-2"
        >
          2 Mesi fa
        </button>
        <button
          type="button"
          onClick={() => MesiPassati(1)}
          className="btn btn-warning m-2"
        >
          Mese Scorso
        </button>
        <button
          type="button"
          onClick={() => MesiPassati(0)}
          className="btn btn-warning m-2"
        >
          Mese Corrente
        </button>
      </>
    );
  }

  function DataInizio() {
    return (
      <>
        {/* <label htmlFor="data_inizio" className="m-2">
          Dal
        </label> */}
        <DatePicker
          id="data_inizio"
          className="m-2"
          dateFormat="dd/MM/yyyy"
          showIcon
          selected={startDate}
          onChange={(date) => (date != null ? setStartDate(date) : new Date())}
        />
      </>
    );
  }

  function DataFine() {
    return (
      <>
        {/* <label htmlFor="data_fine" className="m-2">
          Al
        </label> */}
        <DatePicker
          id="data_fine"
          className="m-2"
          dateFormat="dd/MM/yyyy"
          showIcon
          selected={endDate}
          onChange={(date) => (date != null ? setEndDate(date) : new Date())}
        />
      </>
    );
  }

  function Fatturato() {
    return (
      <>
        <label className="m-2">Evaso</label>
        <input
          type="checkbox"
          checked={fatturato == "true"}
          onChange={(e) =>
            setfatturato(e.target.checked == true ? "true" : "false")
          }
        ></input>
      </>
    );
  }

  return (
    <>
      <div className="d-flex flex-row  w-100  mb-3 mt-5">
        <Accordion defaultActiveKey="0" className="w-100">
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <h3>Parametri filtro</h3>
            </Accordion.Header>
            <Accordion.Body className="bg-secondary-subtle bg-gradient">
              <div>
                <label>Tecnico</label>
                {GlobalData?.isAdmin && <ListaTecnici />}   
                <label>Cliente</label>             
                <ListaClienti 
                  defaultvalue="Tutti *"
                  value={cliente}
                  onChange={setCliente}
                />
                <label>Commessa</label>
                <ListaCommesse />
                <div className="d-flex ">
                  <TipoFiltroData />
                </div>
                <div>
                <label>Dal</label>
                  <DataInizio />
                  <label>Al</label>
                  <DataFine />
                  <Fatturato />
                </div>
                <div className="d-flex justify-content-center">
                  {GlobalData?.isLogged && (
                    <button
                      type="button"
                      className="btn btn-danger"
                      disabled={!isEnabledFiltro}
                      onClick={() => {
                        setFilter(true);
                      }}
                    >
                      Esegui
                    </button>
                  )}
                </div>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </>
  );
}
