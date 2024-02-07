import { Button, Modal } from "react-bootstrap";

export default function PopupConfirm({
  setClose = () => {},
  onConfirmation = () => {},
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
          <Button variant="secondary" onClick={() => setClose()}>
            Chiudi
          </Button>
          <Button variant="primary" onClick={() => onConfirmation()}>
            Conferma
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
