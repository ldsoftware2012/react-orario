import { useContext, useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { url_Login } from "../data/config";
import { GetLogin } from "../data/Datasource";
import { IUtente } from "../interface/interface";
import { OrarioDataContext } from "../App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignIn } from "@fortawesome/free-solid-svg-icons";

export default function Login() {
  const GlobalData = useContext(OrarioDataContext);
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [utente, setutente] = useState<IUtente>();
  const [error, setError] = useState("");

  const handleLogin = async () => {
    const login = await GetLogin(
      url_Login + "?user=" + user + "&password=" + password
    );

    if (login.Utente != null && login.Utente != undefined) {
      setutente(login);
    } else {
      setError("Utente non trovato");
    }
  };

  useEffect(() => {
    console.log("utente=" + utente?.Utente);
    if ((utente != undefined && utente != null) || GlobalData?.isLogged) {
      GlobalData?.setIsLogged(true);
      GlobalData?.setTecnico &&
        GlobalData?.setTecnico(utente?.Utente ? utente.Utente : "");
      if (utente?.Gruppo == "admin") {
        GlobalData?.setIsAdmin(true);
      }
      setError("");
    } else {
      GlobalData?.setIsLogged(false);
      GlobalData?.setIsAdmin(false);
      console.log("non trovato");
    }

    return () => {};
  }, [utente]);

  return (
    <Container className="mt-5 col-md-4 border">
      <h2>Login</h2>
      <Form>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Utente</Form.Label>
          <Form.Control
            type="text"
            placeholder="Inserisci utente"
            value={user}
            onChange={(e) => {
              setUser(e.target.value);
              setError("");
            }}
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
          />
        </Form.Group>
        {error != "" && <p className="bg-danger mt-2">Utente non trovato!</p>}

        <div className="d-flex justify-content-center mt-2">
          {!GlobalData?.isLogged && (
            <Button variant="primary" type="button" onClick={handleLogin}>
              <FontAwesomeIcon icon={faSignIn} />
            </Button>
          )}
        </div>
      </Form>
    </Container>
  );
}
