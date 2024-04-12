import { server,version } from "../data/config";
import { Menu } from "./Menu";

export default function Info(){
    return(<>
        <Menu />
        <br></br>
        <div className="info mt-5">
            <p>Server : {server}</p>
            <p>ver {version}</p>
        </div>        
    </>)
}