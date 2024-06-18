import { server,version } from "../data/config";
import { Menu } from "./Menu";

export default function Info(){
    return(<>
        <Menu />
        <br></br>
        <div className="info mt-5 text-center">
            <p>Author : Lacanale Daniele</p>
            <p>ver {version}</p>
            <p>Server : {server}</p>
        </div>        
    </>)
}