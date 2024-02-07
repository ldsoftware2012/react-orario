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

const sql = "SELECT * from commesse order by commessa";
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

  const newDay = {
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
    Note : req.body.newdata.Note,
    Ore_Ord : req.body.newdata.Ore_Ord,
    Ore_Stra : req.body.newdata.Ore_Stra,
    Ore_Pre : req.body.newdata.Ore_Pre,
    Ore_Fest : req.body.newdata.Ore_Fest,
    Ore_Viaggio : req.body.newdata.Ore_Viaggio,
    Fatturato : req.body.newdata.Fatturato,
    Km : req.body.newdata.Km
  }

  const sql = "INSERT INTO ore (Data,Commessa,Tipo,Tecnico,Cliente" +
  ",Ora_IN1,Ora_OUT1,Ora_IN2,Ora_OUT2,Pranzo,Cena,Pernotto,Estero,Note,Ore_Ord,Ore_Stra," + 
  "Ore_Pre,Ore_Fest,Ore_Viaggio,Fatturato,Km) VALUES (" +
  "'" +  data.toString_yyyymmdd() + "'," + 
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
  "'" +  newDay.Note + "'," + 
  "'" +  newDay.Ore_Ord + "'," + 
  "'" +  newDay.Ore_Stra + "'," + 
  "'" +  newDay.Ore_Pre + "'," + 
  "'" +  newDay.Ore_Fest + "'," + 
  "'" +  newDay.Ore_Viaggio + "'," + 
  "'" +  newDay.Fatturato + "'," + 
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
    Note : req.body.newdata.Note,
    Ore_Ord : req.body.newdata.Ore_Ord,
    Ore_Stra : req.body.newdata.Ore_Stra,
    Ore_Pre : req.body.newdata.Ore_Pre,
    Ore_Fest : req.body.newdata.Ore_Fest,
    Ore_Viaggio : req.body.newdata.Ore_Viaggio,
    Fatturato : req.body.newdata.Fatturato,
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
  , Note = "${newDay.Note}"
  , Ore_Ord = "${newDay.Ore_Ord}"
  , Ore_Stra = "${newDay.Ore_Stra}"
  , Ore_Pre = "${newDay.Ore_Pre}"
  , Ore_Fest = "${newDay.Ore_Fest}"
  , Ore_Viaggio = "${newDay.Ore_Viaggio}"
  , Fatturato = "${newDay.Fatturato}"
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

