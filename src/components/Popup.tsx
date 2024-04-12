import { IconDefinition, faCheck, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";
import { Button, Overlay, Tooltip } from "react-bootstrap";
import { Placement } from "react-bootstrap/esm/types";

type AppProps = {
    MessageTitle? : string,
    MessageDescription? : string,
    Label? : string,
    Icon : IconDefinition,
    IconColor? : string,
    Position? : string,
    Disabled? : boolean,
    onConfirm? : ()=>any,
    onCancel? : ()=>any
}

export default function Popup(props : AppProps) {
const [show, setShow] = useState(false);
const target = useRef(null);

const {MessageTitle,Icon,Label,MessageDescription,Position,Disabled,IconColor,onCancel,onConfirm} = props

function getPlacement() : Placement {
    switch (Position) {
        case "right":
            return "right"
        case "left":
            return "left"    
        case "top":
            return "top"
        case "bottom":
            return "bottom"   
        default:
            return "top";
    }
}

return (
    <>
    <span className="m-2">
        {MessageTitle !== "" && (
        <Button disabled = {Disabled} className="bg-light text-black " ref={target} onClick={() => setShow(!show)}>
        <FontAwesomeIcon icon={Icon} color={IconColor}></FontAwesomeIcon>{Label}
        </Button>
        )}
        <Overlay  target={target.current} show={show} placement={getPlacement()}>
        {(props) => (
            <div className="border border-1 border-black rounded-5 bg-light text-center" id="overlay-example" {...props} >
                <h1 className="text-black px-5">{MessageTitle}</h1>
                <h4 className="text-black px-5">{MessageDescription}</h4>                
                <button
                    disabled = {Disabled}
                    type="button"
                    className="btn bg-light border px-5 m-2"
                    onClick={(e) => {
                    setShow(false);
                    onCancel && onCancel();
                    }}
                    title="Chiudi"
                >
                    <FontAwesomeIcon icon={faClose} /> 
                </button>
                <button
                    disabled = {Disabled}
                    type="button"
                    className="btn btn-success px-5"
                    onClick={() => {
                    setShow(false);
                    onConfirm && onConfirm();
                    }}
                >
                    <FontAwesomeIcon icon={faCheck} /> 
                </button>                
            </div>    
        )}
        </Overlay>
    </span>
    </>
);
}
