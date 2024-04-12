const express = require('express')
var cors = require('cors')
const app = express()
const bodyParser = require('body-parser');

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

Date.prototype.toString_yyyymmdd = function() {
  var mm = this.getMonth() + 1; // getMonth() is zero-based
  var dd = this.getDate();

  return [this.getFullYear(),
          (mm>9 ? '' : '0') + mm,
          (dd>9 ? '' : '0') + dd
        ].join('/');
};

function CreateConnection(){
  const mysql = require('mysql')
  const connection = mysql.createConnection({
    port : 8306,
    host: '172.19.0.2',
    user: 'lacanale',
    password: 'Ldssas12',
    database: 'orario'
  })
  return connection
}

function CreateRemoteConnection(){
  const mysql = require('mysql')
  const connection = mysql.createConnection({
    port : 3307,
    host: 'localhost',
    user: 'lacanale',
    password: 'Ldssas12',
    database: 'orario'
  })
  return connection
}

app.get('/', (req, res) => {
  res.send('Server in ascolto sulla porta 3002  **')
})

app.get('/login/', (req, res) => {
  user = (req.query.user)
  password = (req.query.password)
  logged = false

  let sql = "SELECT * from tbl_utenti where Utente = '" + user + "' and password = MD5('" + password + "')"
  console.log(sql)

  connection = CreateConnection()
  connection.query(sql ,(err,data) => {
  if (err) return res.json("Error") 

  var cat1Array = []
    Object.keys(data).forEach(function(key){
      cat1Array = data[key]
      logged = true
    })

    if (logged) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).json(cat1Array)   
    }else{
      return res.status(404).json("error")
    }
    
  })
    connection.end()

})
app.get('/Orario/', (req, res) => {
  connection = CreateConnection()
  tecnico = (req.query.tecnico)
  cliente = (req.query.cliente)
  commessa = (req.query.commessa)
  fatturato = (req.query.fatturato)
  data_inizio = (req.query.datainizio)
  data_fine = (req.query.datafine)

  const DataCorrect = (cliente != 'undefined' && cliente != '') &&
                      (tecnico != 'undefined' && tecnico != '')


  if (DataCorrect) {
    let sql = "SELECT * from ore "
    tecnico == "Tutti *" ? sql = sql + "where tecnico like '%' " : sql = sql + " where tecnico = '" + tecnico + "'"
    cliente == "Tutti *" ? sql = sql + " and  cliente like '%' " : sql = sql + " and cliente = '" + cliente + "'"
    commessa == "Tutte *" ? sql = sql + " and  commessa like '%' " : sql = sql + " and commessa = '" + commessa + "'"
    sql = sql + " and DATA >= '" + data_inizio + "'"
    sql = sql + " and DATA <= '" + data_fine + "'"
    sql = sql +  (fatturato != undefined ?  " and fatturato='" + fatturato + "'" : "")
    sql = sql + " order by DATA ASC"

    console.log(sql)
    connection.query(sql ,(err,data) => {
    if (err) return res.json("Error") 
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(data)    
  })
    connection.end()
  }else{
    console.log("dati filtro non corretti tecnico=" + tecnico + " cliente = " + cliente)
    res.status(200)
  }
})
app.get('/OrarioByID/', (req, res) => {
  connection = CreateConnection()
  id = (req.query.id)


    let sql = "SELECT DISTINCT * from ore where id = " + id
    
    console.log(sql)
    connection.query(sql ,(err,data) => {
    if (err) return res.json("Error") 
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(data)    
  })

  connection.end()

})
app.get('/Clienti/', (req, res) => {

  connection = CreateConnection()

  const sql = "SELECT * from clienti order by cliente";
  connection.query(sql ,(err,data) => {
    if (err) return res.json("Error") 
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(data)    
  })

  connection.end()

})
app.get('/Commesse/', (req, res) => {
  connection = CreateConnection()

const sql = "SELECT * from commesse order by Commessa ASC";
connection.query(sql ,(err,data) => {
  if (err) return res.json("Error") 
  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json(data)    
})

connection.end()

})
app.get('/Acconti/', (req, res) => {
connection = CreateConnection()

const sql = "SELECT * from acconti order by Data";
connection.query(sql ,(err,data) => {
  if (err) return res.json("Error") 
  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json(data)    
})

connection.end()
})
app.get('/Tecnici/', (req, res) => {
  connection = CreateConnection()

const sql = "SELECT * from tecnici order by Tecnico";
connection.query(sql ,(err,data) => {
  if (err) return res.json("Error") 
  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json(data)    
})

connection.end()

})
app.post('/DeleteDay/', (req, res) => {  

  connection = CreateConnection()

  const sql = "DELETE from ore WHERE ID=" + req.query.id

  connection.query(sql ,(err,result) => {
    if (err) {
      console.log(err) 
      return res.status(404).json(err) 
    }

    console.log("Number of records deleted: " + result.affectedRows);   
    res.status(200).json(result.affectedRows)
  })

  connection.end()

})
app.post('/AddDay/', (req, res) => {  
  const data =new Date(req.body.newdata.Data)
  connection = CreateConnection()
  console.log("Data ricevuta = " , data,req.body.newdata.DataString)
  const newDay = {
    Data : req.body.newdata.DataString,
    Tecnico : req.body.newdata.Tecnico,
    Tipo : req.body.newdata.Tipo,
    Cliente : req.body.newdata.Cliente,
    Commessa : req.body.newdata.Commessa,
    Ora_IN1 : req.body.newdata.Ora_IN1,
    Ora_OUT1 : req.body.newdata.Ora_OUT1,
    Ora_IN2 : req.body.newdata.Ora_IN2,
    Ora_OUT2 : req.body.newdata.Ora_OUT2,
    Pranzo : req.body.newdata.Pranzo,
    Cena : req.body.newdata.Cena,
    Pernotto : req.body.newdata.Pernotto,
    Estero : req.body.newdata.Estero,
    Fatturato : req.body.newdata.Fatturato,
    Note : req.body.newdata.Note,
    Ore_Ord : req.body.newdata.Ore_Ord,
    Ore_Stra : req.body.newdata.Ore_Stra,
    Ore_Pre : req.body.newdata.Ore_Pre,
    Ore_Fest : req.body.newdata.Ore_Fest,
    Ore_Viaggio : req.body.newdata.Ore_Viaggio,
    Km : req.body.newdata.Km
  }

  const sql = "INSERT INTO ore (Data,Commessa,Tipo,Tecnico,Cliente" +
  ",Ora_IN1,Ora_OUT1,Ora_IN2,Ora_OUT2,Pranzo,Cena,Pernotto,Estero,Fatturato,Note,Ore_Ord,Ore_Stra," + 
  "Ore_Pre,Ore_Fest,Ore_Viaggio,Km) VALUES (" +
  "'" + req.body.newdata.DataString + "'," + 
  "'" +  newDay.Commessa + "'," + 
  "'" +  newDay.Tipo + "'," + 
  "'" +  newDay.Tecnico + "'," + 
  "'" +  newDay.Cliente + "'," + 
  "'" +  newDay.Ora_IN1 + "'," + 
  "'" +  newDay.Ora_OUT1 + "'," + 
  "'" +  newDay.Ora_IN2 + "'," + 
  "'" +  newDay.Ora_OUT2 + "'," + 
  "'" +  newDay.Pranzo + "'," + 
  "'" +  newDay.Cena + "'," + 
  "'" +  newDay.Pernotto + "'," + 
  "'" +  newDay.Estero + "'," + 
  "'" +  newDay.Fatturato + "'," + 
  "'" +  newDay.Note + "'," + 
  "'" +  newDay.Ore_Ord + "'," + 
  "'" +  newDay.Ore_Stra + "'," + 
  "'" +  newDay.Ore_Pre + "'," + 
  "'" +  newDay.Ore_Fest + "'," + 
  "'" +  newDay.Ore_Viaggio + "'," + 
  "'" +  newDay.Km + "'" + 
  ")"


  console.log(sql)

  connection.query(sql ,(err,result) => {
    if (err) {
      console.log(err) 
      return res.status(404).json(err) 
    }

    console.log("Number of records inserted: " + result.affectedRows);   
    res.status(200).json(result.affectedRows)
  })

  connection.end()

})
app.post('/UpdateCommessa/', (req, res) => { 
  connection = CreateConnection()
  const newdata = {
    Commessa : req.body.newdata.Commessa,
    Descrizione : req.body.newdata.Descrizione
  }

  console.log(newdata)
  // const sql = `UPDATE commesse Set Descrizione = "${newdata.Descrizione}" where Commessa = "${newdata.Commessa}" `
  const sql = `INSERT INTO commesse (Commessa,Descrizione) VALUES ('${newdata.Commessa}','${newdata.Descrizione}') ON DUPLICATE KEY UPDATE Descrizione = '${newdata.Descrizione}' `

  console.log(sql)

  connection.query(sql ,(err,result) => {
    if (err) {
      console.log(err) 
      return res.status(404).json(err) 
    }

    console.log("Number of records changed: " + result.affectedRows);   
    return res.status(200).json(result.affectedRows)
  })

  connection.end()
  return
  }
)
app.post('/UpdateAcconto/', (req, res) => { 
  connection = CreateConnection()
  const newdata = {
    ID : req.body.newdata.ID,
    Data : new Date(req.body.newdata.Data).toString_yyyymmdd(),
    Tecnico : req.body.newdata.Tecnico,
    Entrata : req.body.newdata.Entrata,
    Uscita : req.body.newdata.Uscita,
    Fattura : req.body.newdata.Fattura,
    Cliente : req.body.newdata.Cliente,
    Note : req.body.newdata.Note
  }

  let sql = ""
  console.log(newdata.ID)
  if(newdata.ID == undefined){
    sql = `INSERT INTO acconti (Data,Tecnico,Entrata,Uscita,Fattura,Note,Cliente) 
    VALUES ('${newdata.Data}','${newdata.Tecnico}','${newdata.Entrata}',
          '${newdata.Uscita}','${newdata.Fattura}','${newdata.Note}','${newdata.Cliente}') 
    ON DUPLICATE KEY UPDATE Tecnico = '${newdata.Tecnico}',Data = '${newdata.Data}',Entrata = '${newdata.Entrata}',Uscita = '${newdata.Uscita}',Note = '${newdata.Note}' `  
  }else{
    sql = `UPDATE acconti SET Tecnico = '${newdata.Tecnico}',Data = '${newdata.Data}',Entrata = '${newdata.Entrata}',Uscita = '${newdata.Uscita}',
          Fattura = '${newdata.Fattura}',Note = '${newdata.Note}', Cliente= '${newdata.Cliente}' WHERE ID = ${newdata.ID} `
  }

  console.log(sql)

  connection.query(sql ,(err,result) => {
    if (err) {
      return res.status(404).json(err) 
    }

    console.log("Number of records changed: " + result.affectedRows);   
    return res.status(200).json(result.affectedRows)
  })

  connection.end()
  return
  }
)
app.post('/UpdateCliente/', (req, res) => { 
  connection = CreateConnection()
  const newdata = {
    Cliente : req.body.newdata.Cliente,
    Indirizzo : req.body.newdata.Indirizzo,
    Localita : req.body.newdata.Localita,
    CAP : req.body.newdata.CAP,
    Cell : req.body.newdata.Cell,
    Email : req.body.newdata.Email,
    Fax : req.body.newdata.Fax,
    Piva : req.body.newdata.Piva,
    Pricelist : req.body.newdata.Pricelist,
    Provincia : req.body.newdata.Provincia,
    Tel : req.body.newdata.Tel
  }


  const sql = `INSERT INTO clienti (Cliente,Indirizzo,Localita,Provincia,Tel,Cell,Fax,Email,Piva,CAP,Pricelist) 
  VALUES ('${newdata.Cliente}','${newdata.Indirizzo}','${newdata.Localita}', 
  '${newdata.Provincia}','${newdata.Tel}','${newdata.Cell}','${newdata.Fax}','${newdata.Email}','${newdata.Piva}','${newdata.CAP}','${newdata.Pricelist}')
  ON DUPLICATE KEY UPDATE Cliente = '${newdata.Cliente}',Indirizzo = '${newdata.Indirizzo}', Localita = '${newdata.Localita}',Provincia = '${newdata.Provincia}',Tel = '${newdata.Tel}' ,
  Cell = '${newdata.Cell}',Fax = '${newdata.Fax}',Email = '${newdata.Email}'  ,Piva = '${newdata.Piva}',CAP = '${newdata.CAP}',Pricelist = '${newdata.Pricelist}' `  
  
  console.log(sql)

  connection.query(sql ,(err,result) => {
    if (err) {
      console.log(err)
      return res.status(404).json(err) 
    }

    console.log("Number of records changed: " + result.affectedRows);   
    return res.status(200).json(result.affectedRows)
  })

  connection.end()
  return
  }
)
app.post('/DeleteCommessa/', (req, res) => {  

  connection = CreateConnection()

  const sql = "DELETE from commesse WHERE Commessa ='" + req.query.id + "'"
  console.log(sql)
  connection.query(sql ,(err,result) => {
    if (err) {
      console.log(err) 
      return res.status(404).json(err) 
    }

    console.log("Number of records deleted: " + result.affectedRows);   
    res.status(200).json(result.affectedRows)
  })

  connection.end()

})
app.post('/DeleteAcconto/', (req, res) => {  

  connection = CreateConnection()

  const sql = "DELETE from acconti WHERE ID ='" + req.query.id + "'"
  console.log(sql)
  connection.query(sql ,(err,result) => {
    if (err) {
      console.log(err) 
      return res.status(404).json(err) 
    }

    console.log("Number of records deleted: " + result.affectedRows);   
    res.status(200).json(result.affectedRows)
  })

  connection.end()

})
app.post('/DeleteCliente/', (req, res) => {  

  connection = CreateConnection()

  const sql = "DELETE from clienti WHERE Cliente ='" + req.query.id + "'"
  console.log(sql)
  connection.query(sql ,(err,result) => {
    if (err) {
      console.log(err) 
      return res.status(404).json(err) 
    }

    console.log("Number of records deleted: " + result.affectedRows);   
    res.status(200).json(result.affectedRows)
  })

  connection.end()

})
app.post('/UpdateDay/', (req, res) => {  
  const data =new Date(req.body.newdata.Data)
  connection = CreateConnection()

  const newDay = {
    id : req.body.newdata.id,
    Data : data,
    Tecnico : req.body.newdata.Tecnico,
    Tipo : req.body.newdata.Tipo,
    Cliente : req.body.newdata.Cliente,
    Commessa : req.body.newdata.Commessa,
    Ora_IN1 : req.body.newdata.Ora_IN1,
    Ora_OUT1 : req.body.newdata.Ora_OUT1,
    Ora_IN2 : req.body.newdata.Ora_IN2,
    Ora_OUT2 : req.body.newdata.Ora_OUT2,
    Pranzo : req.body.newdata.Pranzo,
    Cena : req.body.newdata.Cena,
    Pernotto : req.body.newdata.Pernotto,
    Estero : req.body.newdata.Estero,
    Fatturato : req.body.newdata.Fatturato,
    Note : req.body.newdata.Note,
    Ore_Ord : req.body.newdata.Ore_Ord,
    Ore_Stra : req.body.newdata.Ore_Stra,
    Ore_Pre : req.body.newdata.Ore_Pre,
    Ore_Fest : req.body.newdata.Ore_Fest,
    Ore_Viaggio : req.body.newdata.Ore_Viaggio,
    Km : req.body.newdata.Km
  }

  const sql = `UPDATE ore SET Data = "${data.toString_yyyymmdd()}" 
  , Commessa = "${newDay.Commessa}" 
  , Tipo = "${newDay.Tipo}"
  , Tecnico = "${newDay.Tecnico}"
  , Cliente = "${newDay.Cliente}"
  , Ora_IN1 = "${newDay.Ora_IN1}"
  , Ora_OUT1 = "${newDay.Ora_OUT1}"
  , Ora_IN2 = "${newDay.Ora_IN2}"
  , Ora_OUT2 = "${newDay.Ora_OUT2}"
  , Pranzo = "${newDay.Pranzo}"
  , Cena = "${newDay.Cena}"
  , Pernotto = "${newDay.Pernotto}"
  , Estero = "${newDay.Estero}"
  , Fatturato = "${newDay.Fatturato}"
  , Note = "${newDay.Note}"
  , Ore_Ord = "${newDay.Ore_Ord}"
  , Ore_Stra = "${newDay.Ore_Stra}"
  , Ore_Pre = "${newDay.Ore_Pre}"
  , Ore_Fest = "${newDay.Ore_Fest}"
  , Ore_Viaggio = "${newDay.Ore_Viaggio}"
  , Km = "${newDay.Km}"
  WHERE id = ${newDay.id}`
  console.log(sql)

  connection.query(sql ,(err,result) => {
    if (err) {
      console.log(err) 
      return res.status(404).json(err) 
    }

    console.log("Number of records changed: " + result.affectedRows);   
    return res.status(200).json(result.affectedRows)
  })

  connection.end()
  return
})

app.listen(3002,()=>{
  console.log("Listening on port (daniele)" + 3002)
})

