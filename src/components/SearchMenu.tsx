import { useContext, useEffect, useRef, useState } from "react";
import {
  GetRemoteClientiData,
  GetRemoteCommesseData,
  GetRemoteOrarioData,
  GetRemoteTecniciData,
} from "../data/Datasource";
import {
  ICliente,
  ICommesse,
  ISearchParameter,
  ITecnico,
} from "../interface/interface";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import {
  url_Clienti,
  url_Commesse,
  url_Orario,
  url_Tecnici,
} from "../data/config";
import { format, setDate } from "date-fns";
import { Accordion } from "react-bootstrap";
import { OrarioDataContext } from "../App";
import { start } from "repl";

export default function SearchMenu() {
  const [fatturato, setfatturato] = useState<string>("false");
  const [cliente, setCliente] = useState("Tutti *");
  const [commessa, setCommessa] = useState("");
  const hasLoadedBefore = useRef(true);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [isEnabledFiltro, setisEnabledFiltro] = useState(true);
  const [filter, setFilter] = useState(false);
  const [searchParameter, setSearchParameter] = useState<ISearchParameter>({});

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
    console.log(
      "cliente = ",
      GlobalData?.searchParameter.Cliente,
      "commessa = ",
      GlobalData?.searchParameter
    );
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

      if (GlobalData?.tecnico != "" && cliente != "") {
        (async () => {
          GlobalData?.setIsDataLoad(false);
          const orario = await GetRemoteOrarioData(
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

  function ListaTecnici() {
    return (
      <>
        <div hidden={!GlobalData?.isAdmin}>
          <label className="m-2">Tecnico</label>
          <select
            className="m-2"
            onChange={(tecnico) =>
              tecnico.target.value != null
                ? GlobalData?.setTecnico &&
                  GlobalData?.setTecnico(tecnico.target.value)
                : ""
            }
            value={GlobalData?.tecnico}
          >
            {GlobalData?.tecnici.map((c) => {
              return <option>{c.Tecnico}</option>;
            })}
          </select>
        </div>
      </>
    );
  }

  function ListaClienti() {
    return (
      <>
        <label className="m-2">Cliente</label>
        <select
          className="m-2"
          value={cliente}
          onChange={(cliente) =>
            cliente.target.value != null ? setCliente(cliente.target.value) : ""
          }
        >
          <option>Tutti *</option>
          {GlobalData?.clienti.map((c, index) => {
            return <option key={index}>{c.Cliente}</option>;
          })}
        </select>
      </>
    );
  }

  function ListaCommesse() {
    return (
      <>
        <label className="m-2">Commessa</label>
        <select
          className="m-2"
          value={commessa}
          onChange={(commessa) =>
            commessa.target.value != null
              ? setCommessa(commessa.target.value)
              : ""
          }
        >
          <option>Tutte *</option>
          {GlobalData?.commesse.map((c) => {
            return <option>{c.Commessa}</option>;
          })}
        </select>
      </>
    );
  }

  function TipoFiltroData() {
    function MeseCorrente(): void {
      var today = new Date();
      const days = new Date(today.getFullYear(), today.Mese(), 0).getDate();
      const data_inizio = new Date(
        today.getFullYear(),
        today.Mese() - 1,
        1,
        12
      );
      const data_fine = new Date(
        today.getFullYear(),
        today.Mese() - 1,
        days,
        12
      );
      setStartDate(data_inizio);
      setEndDate(data_fine);
    }

    function MeseScorso(): void {
      var today = new Date();
      const days = new Date(today.getFullYear(), today.Mese() - 1, 0).getDate();

      const data_inizio = new Date(
        today.getFullYear(),
        today.Mese() - 2,
        1,
        12
      );
      const data_fine = new Date(
        today.getFullYear(),
        today.Mese() - 2,
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
          onClick={() => MeseScorso()}
          className="btn btn-warning m-2"
        >
          Mese Scorso
        </button>
        <button
          type="button"
          onClick={() => MeseCorrente()}
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
        <label htmlFor="data_inizio" className="m-2">
          Dal
        </label>
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
        <label htmlFor="data_fine" className="m-2">
          Al
        </label>
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
      <div className="d-flex flex-row ticky-top w-100  mb-3">
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <h3>Parametri filtro</h3>
            </Accordion.Header>
            <Accordion.Body className="bg-primary bg-gradient">
              <div>
                <ListaTecnici />
                <ListaClienti />
                <ListaCommesse />
                <div className="d-flex flex-row">
                  <TipoFiltroData />
                  <DataInizio />
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
