import {
  faCalculator,
  faCalendarTimes,
  faHome,
  faInfo,
  faList,
  faMoneyBill,
  faPerson,
  faSignOut,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import { Nav, Navbar } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import { OrarioDataContext } from "../App";
import "../App.css";
import Logo from "../logo.png";

export function Menu() {
const GlobalData = useContext(OrarioDataContext);

const userDisplay = () => {
  return(
      <>
        <div>
          <div className="topnav-right px-2">
            <Link
              className=""
              to="/"
              onClick={() => {
                GlobalData?.setIsLogged(false);
                GlobalData?.setTecnico && GlobalData?.setTecnico("");
              }}
              >
              <FontAwesomeIcon icon={faSignOut} />
            </Link>
          </div>

          <div className="topnav-right px-2 text-white">
            <FontAwesomeIcon icon={faUser} /> {GlobalData?.tecnico}
          </div>
        </div>
      </>
      )
    }

  return (
    <div style={{margin:"7%"}}>
      <Navbar className="navbar navbar-expand-sm bg-dark navbar-dark fixed-top" collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand>
          <img src={Logo} alt="React Logo" className="App-logo" />
        </Navbar.Brand>
          {GlobalData?.isLogged && userDisplay()}
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav>
              <NavLink to={"/"} className="nav-link">
                <FontAwesomeIcon icon={faHome} />
              </NavLink>
            </Nav>
            
            {GlobalData?.isLogged && (
              <Nav className="mr-auto ">
                  <NavLink to={"/situazioneacconti"} className="nav-fill nav-link">
                    <FontAwesomeIcon icon={faMoneyBill} className="px-1"/>
                    Gestione <br/> Acconti
                  </NavLink>
                <NavLink to={"/orario?Tipo=Lista"} className="nav-link">
                  <FontAwesomeIcon icon={faCalendarTimes} className="px-1"/>
                  Report <br/> Giornaliero
                </NavLink>
                <NavLink
                  to={"/orariocommessa?Tipo=Commesse"}
                  className="nav-link"
                >
                  <FontAwesomeIcon icon={faList} className="px-1"/>
                  Report <br/> Commesse
                </NavLink>
                <NavLink to={"/orarioanalisi"} className="nav-link">
                  <FontAwesomeIcon icon={faCalculator} className="px-1"/>
                  Visualizza <br/> Calendario
                </NavLink>

                <NavLink to={"/listacommesse"} className="nav-link">
                  <FontAwesomeIcon icon={faList} className="px-1"/>
                  Lista <br/> Commesse
                </NavLink>
                
                {GlobalData.isAdmin && <NavLink to={"/listaclienti"} className="nav-link">
                  <FontAwesomeIcon icon={faPerson} className="px-1"/>
                  Lista <br/> Clienti
                </NavLink>}

                {<NavLink to={"/info"} className="nav-link">
                  <FontAwesomeIcon icon={faInfo} className="px-1"/>
                  Info
                </NavLink>}
              </Nav>
            )}
          </Navbar.Collapse>
        </Navbar>


    </div>
  );
}
