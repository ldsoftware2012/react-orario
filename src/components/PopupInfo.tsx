import { Button, Modal } from "react-bootstrap";

export default function PopupInfo({
  setClose = () => {},
  Titolo = "",
  Descrizione = "",
}) {
  return (
    <>
      <Modal show centered>
        <Modal.Header>
          <Modal.Title>{Titolo}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{Descrizione}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setClose()}>
            Chiudi
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
