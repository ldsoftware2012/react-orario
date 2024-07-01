import { AddTask } from "@mui/icons-material";
import { Alert, Button, Popover, Stack, Switch, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { OrarioDataContext } from "../App";

export const ComponentListaOpzioni = (props:any) =>
{
    const {config,onChange} = props
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    const GlobalData = useContext(OrarioDataContext);
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
            checked={config.VisualizzaDescrizioneCommessa}                        
            onChange={(e)=>onChange(e,'VisualizzaDescrizioneCommessa')}
            ></Switch><span>Descrizione Commesse</span>
        </div>
        <div>
        <Switch 
            checked={config.VisualizzaOrediLavoro}
            onChange={(e)=>onChange(e,'VisualizzaOrediLavoro')}            
        ></Switch><span>Ore Di Lavoro</span>
        </div>
        <div>
        <Switch 
            checked={config.VisualizzaColoriCommessa}
            onChange={(e)=>onChange(e,'VisualizzaColoriCommessa')}            
        ></Switch><span>Colori Commesse</span>
        </div>
        <div>
        <Switch                           
            checked={config.VisualizzaSoloGiorniNonCompleti}
            onChange={(e)=>onChange(e,'VisualizzaSoloGiorniNonCompleti')}            
        ></Switch><span>Giorni non completi</span>
        </div>
        <div>
        {GlobalData?.isAdmin && <Switch                           
            checked={config.VisualizzaCalcoloFattura}
            onChange={(e)=>onChange(e,'VisualizzaCalcoloFattura')}            
        ></Switch>}{GlobalData?.isAdmin && <span>Calcolo fattura</span>}
        </div>
        </Alert>                            
        </Stack>
    </Typography>
    </Popover>
    </>)

}