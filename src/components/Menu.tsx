import {
  faAdd,
  faCalculator,
  faCalendarTimes,
  faHome,
  faList,
  faSignOut,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import { Dropdown, DropdownButton, Nav, Navbar } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import { OrarioDataContext } from "../App";
import "../App.css";
import Logo from "../logo.png";

export function Menu() {
  const GlobalData = useContext(OrarioDataContext);

  return (
    <div>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand>
          <img src={Logo} alt="React Logo" className="App-logo" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav>
            <NavLink to={"/"} className="nav-link">
              <FontAwesomeIcon icon={faHome} />
            </NavLink>
          </Nav>

          {GlobalData?.isLogged && (
            <Nav className="mr-auto">
              {/* <NavLink to={"/insertday"} className="nav-link"
                ><FontAwesomeIcon icon={faAdd}/>Aggiungi</NavLink> */}

              <DropdownButton
                id="dropdown-basic-button"
                variant="dark"
                title="Modifica"
              >
                <Dropdown.Item>
                  <NavLink to={"/updateDataday?Method=Add"} className="nav">
                    <FontAwesomeIcon icon={faAdd} className="px-1"/>
                    Aggiungi
                  </NavLink>
                </Dropdown.Item>
              </DropdownButton>

              <NavLink to={"/orario?Tipo=Lista"} className="nav-link">
                <FontAwesomeIcon icon={faCalendarTimes} className="px-1"/>
                Lista
              </NavLink>
              <NavLink
                to={"/orariocommessa?Tipo=Commesse"}
                className="nav-link"
              >
                <FontAwesomeIcon icon={faList} className="px-1"/>
                Commesse
              </NavLink>
              <NavLink to={"/orarioanalisi"} className="nav-link">
                <FontAwesomeIcon icon={faCalculator} className="px-1"/>
                Analisi
              </NavLink>
            </Nav>
          )}
        </Navbar.Collapse>
      </Navbar>

      {GlobalData?.isLogged && (
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

          <div className="topnav-right px-2">
            <FontAwesomeIcon icon={faUser} /> {GlobalData?.tecnico}
          </div>
        </div>
      )}
    </div>
  );
}
