const development: boolean = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'; 

export let server= "ldsoftware.synology.me"
 // Il synology fa il port forwardind della 3003 sulla 3002 in https
 // Configurato nel pannello di controllo dentro portale di accesso, proxy inverso sul synology


export let port = "3003";

if(development){
    server = "localhost"
    port ="3002"
}


export const version = "1.2.0"

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
export const url_UploadFile = "http://"+ server + ":" + port + "/Upload"

