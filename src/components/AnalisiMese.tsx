import { Col, Row, Table } from "react-bootstrap";
import "../css/AnalisiMese.css";
import { useContext, useState } from "react";
import "../interface/interface";
import { Footer } from "./Footer";
import { OrarioDataContext } from "../App";
import { DisegnaGiorno } from "./DisegnaGiorno";
import React from "react";
import { Alert, Button, Checkbox, FormControlLabel, FormGroup, Popover, Stack, Switch, Typography } from "@mui/material";
import { IConfigDisegnaGiorno } from "../interface/interface";
import { AddTask, Label } from "@mui/icons-material";

export default function AnalisiMese(props: any) {
  const row = [1, 2, 3, 4, 5, 6];
  const col = [1, 2, 3, 4, 5, 6, 7];
  const {Anno,Mese} = props
  const GlobalData = useContext(OrarioDataContext);
  const [configDisegnaGiorno, setconfigDisegnaGiorno] = useState<IConfigDisegnaGiorno>({VisualizzaColoriCommessa:false}) 
  let Indice = 0;

  const d = new Date(Anno, (Mese) - 1);
  let primogiorno = d.getDay();
  if (primogiorno < 0) {primogiorno = 6;}
  if (primogiorno == 0) {primogiorno = 7;}
  const NumGiorni = new Date(Anno, Mese, 0).getDate();

  const ListaOpzioni = ()=>{
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const handleClose = () => {
      setAnchorEl(null);
  };
  

    return(
    <>

<Button aria-describedby={id} variant="contained" endIcon={<AddTask></AddTask>} onClick={handleClick} color='primary'>
                Opzioni
</Button>
                    <Popover       
                        id={id}          
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                        }}
                    >
                    <Typography sx={{ p: 2,backgroundColor:'white'}}>
                        <Stack direction="row" spacing={1} className='mb-1'>
                        <Alert>
                          <div>
                          <Switch 
                            checked={configDisegnaGiorno.VisualizzaDescrizioneCommessa}
                            onChange={()=>setconfigDisegnaGiorno({...configDisegnaGiorno, VisualizzaDescrizioneCommessa:!configDisegnaGiorno.VisualizzaDescrizioneCommessa})}
                            ></Switch><span>Descrizione Commesse</span>
                          </div>
                          <div>
                          <Switch 
                            checked={configDisegnaGiorno.VisualizzaOrediLavoro}
                            onChange={()=>setconfigDisegnaGiorno({...configDisegnaGiorno, VisualizzaOrediLavoro:!configDisegnaGiorno.VisualizzaOrediLavoro})}
                          ></Switch><span>Ore Di Lavoro</span>
                          </div>
                          <div>
                          <Switch 
                            checked={configDisegnaGiorno.VisualizzaColoriCommessa}
                            onChange={()=>setconfigDisegnaGiorno({...configDisegnaGiorno, VisualizzaColoriCommessa:!configDisegnaGiorno.VisualizzaColoriCommessa})}
                          ></Switch><span>Colori Commesse</span>
                          </div>
                          <Switch                           
                            checked={configDisegnaGiorno.VisualizzaSoloGiorniNonCompleti}
                            onChange={()=>setconfigDisegnaGiorno({...configDisegnaGiorno, VisualizzaSoloGiorniNonCompleti:!configDisegnaGiorno.VisualizzaSoloGiorniNonCompleti})}
                          ></Switch><span>Giorni non completi</span>
                        </Alert>                            
                        </Stack>
                    </Typography>
                    </Popover>
    </>)
  }

  return (
    <>
    <u><h1 className="text-center">{new Date(Anno,Mese,0).MeseTesto()} {Anno} </h1></u>
    <ListaOpzioni></ListaOpzioni>
    <Table className="Calendario">
        {row.map((row,index) => {
          return (     
            <>
            <React.Fragment key={index}>
              <Row key={row} className="Row">
                {col.map((col,indexCol) => {                  
                  Indice = Indice + 1;
                  return (    
                    <React.Fragment key={indexCol}>
                      <Col className="Col" id={Indice.toString()}>                    
                        {Indice >= primogiorno && (Indice <= NumGiorni + primogiorno - 1) 
                        && <DisegnaGiorno Config={configDisegnaGiorno} Data={new Date(Anno,Mese-1,Indice-primogiorno+1)} Orari={props.Orari}/>}
                      </Col>
                    </React.Fragment>             
                  );          
                })}
              </Row>
            </React.Fragment>
            </>       
          );
        }
        )}
    </Table>

    
    <Footer />
      
    </>
  );
}
