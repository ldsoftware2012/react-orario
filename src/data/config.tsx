const development: boolean = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'; 

export let server= "ldsoftware.synology.me"
 // Il synology fa il port forwardind della 3003 sulla 3002 in https
 // Configurato nel pannello di controllo dentro portale di accesso, proxy inverso sul synology

//ver 1.1.2 : Aggiunta icona note al giorno + separato sommatoria orario per più commesse nello stesso giorno
//            aggiunta nuovo tipo = "Riposo trasferta" che non conteggia le ore ma conteggia i pernotti   
//ver 1.1.3 : Aggiunta la colorazione rossa quando viene impostata una commessa LD SOFTWARE  
//ver 1.1.4 : -Tolto l'obbligo di scegliere il modello per il rapporto di intervento, il modello è salvato
//             dentro la cartella public.
//            -Corretto dimensione campo cliente dentro la sezione rapporto di intervento
export let port = "3003";

if(development){
    server = "localhost"
    port ="3002"
}


export const version = "1.1.4"

export const url_Clienti = "http://" + server + ":" + port + "/Clienti/"
export const url_Acconti = "http://" + server + ":" + port + "/Acconti/"
export const url_Commesse = "http://" + server + ":" + port + "/Commesse"
export const url_Orario = "http://"  + server + ":" + port + "/Orario"
export const url_OrarioByID = "http://"+ server + ":" + port + "/OrarioByID"
export const url_Tecnici = "http://"+ server + ":" + port + "/Tecnici"
export const url_Login = "http://"+ server + ":" + port + "/Login"
export const url_AddDay ="http://"+ server + ":" + port + "/AddDay"
export const url_UpdateDay = "http://" + server + ":" + port + "/UpdateDay"
export const url_DeleteDay = "http://"+ server + ":" + port + "/DeleteDay"
export const url_DeleteCommessa = "http://"+ server + ":" + port + "/DeleteCommessa"
export const url_DeleteAcconto = "http://"+ server + ":" + port + "/DeleteAcconto"
export const url_DeleteCliente = "http://"+ server + ":" + port + "/DeleteCliente"
export const url_UpdateCommessa = "http://"+ server + ":" + port + "/UpdateCommessa"
export const url_UpdateAcconto = "http://"+ server + ":" + port + "/UpdateAcconto"
export const url_UpdateCliente = "http://"+ server + ":" + port + "/UpdateCliente"

