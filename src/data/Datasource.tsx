import { IModelOrario } from "../interface/interface";

export async function GetRemoteCycleData(url:string){
    const response = await fetch(url)
    const data = await response.json(); 
    return data
}

export async function GetRemoteFunctionsData(url:string){
    const response = await fetch(url)
    const data = await response.json(); 
    return data
}

export async function GetRemoteOrarioData(url:string){
    const response = await fetch(url)
    const data = await response.json(); 
    return data
}

export async function GetRemoteOrarioDataByID(url:string){
    const response = await fetch(url)
    const data = await response.json(); 
    return data
}

export async function GetRemoteClientiData(url:string){
    const response = await fetch(url)
    const data = await response.json(); 
    return data
}

export async function GetRemoteCommesseData(url:string){
    const response = await fetch(url)
    const data = await response.json(); 
    return data
}

export async function GetRemoteTecniciData(url:string){
    const response = await fetch(url)
    const data = await response.json(); 
    return data
}

export async function GetLogin(url:string){
    const response = await fetch(url)
    const data = await response.json(); 
    return data
}

export async function UpdateDay(url:string,newdata:IModelOrario) {
    const requestOptions:RequestInit = {
        method: 'POST',
        mode : 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({newdata})
    };


    try {
        // Simuliamo una richiesta asincrona, ad esempio con fetch
        const response = await fetch(url, requestOptions)
    
        // Verifica lo stato della risposta
        if (!response.ok) {
        //   throw new Error(`Errore HTTP! Stato: ${response.status}`);
        return ("Errore durante aggiornamento!")
        }
    
        // Leggi il corpo della risposta come JSON
        const data = await response.json();
    
        // Restituisci il risultato della funzione asincrona
        // return (data)
        return ("Aggiornamento eseguito correttamente");
    } catch (error) {
        // Gestisci gli errori durante la richiesta
        console.error('Errore durante la richiesta:', error);
        return ("Errore durante aggiornamento!" + error)
        //throw error; // Puoi anche propagare l'errore se lo desideri
    }
    }
    

export async function AddDay(url:string,newdata:IModelOrario) {
    const requestOptions:RequestInit = {
        method: 'POST',
        mode : 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({newdata})
    };


    try {
        // Simuliamo una richiesta asincrona, ad esempio con fetch
        const response = await fetch(url, requestOptions)
    
        // Verifica lo stato della risposta
        if (!response.ok) {
        //   throw new Error(`Errore HTTP! Stato: ${response.status}`);
        return ("Errore durante inserimento!")
        }
    
        // Leggi il corpo della risposta come JSON
        const data = await response.json();
    
        // Restituisci il risultato della funzione asincrona
        // return (data)
        return ("Inserimento eseguito correttamente");
    } catch (error) {
        // Gestisci gli errori durante la richiesta
        console.error('Errore durante la richiesta:', error);
        return ("Errore durante inserimento!" + error)
        //throw error; // Puoi anche propagare l'errore se lo desideri
    }
    }
    
    
export async function DeleteDay(url:string) {
    const requestOptions:RequestInit = {
        method: 'POST',
        mode : 'cors',
        headers: { 'Content-Type': 'application/json' },
        // body: JSON.stringify({newdata})
    };


    try {
        // Simuliamo una richiesta asincrona, ad esempio con fetch
        const response = await fetch(url, requestOptions)
    
        // Verifica lo stato della risposta
        if (!response.ok) {
        //   throw new Error(`Errore HTTP! Stato: ${response.status}`);
        return ("ERROR")
        }
    
        // Leggi il corpo della risposta come JSON
        const data = await response.json();
    
        // Restituisci il risultato della funzione asincrona
        // return (data)
        return ("OK");
    } catch (error) {
        // Gestisci gli errori durante la richiesta
        console.error('Errore durante la richiesta:', error);
        return ("ERROR" + error)
        //throw error; // Puoi anche propagare l'errore se lo desideri
    }
    }
