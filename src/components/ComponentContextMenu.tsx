import { Add, ContentCopy, ContentPaste, Euro } from '@mui/icons-material';
import { Button, Divider, Popover, Stack, Typography } from '@mui/material';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import { useContext, useEffect, useState } from 'react';
import { url_DeleteDay } from '../data/config';
import { OrarioDataContext } from '../App';
import { Popup2 } from './Popup2';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AirlineSeatIndividualSuiteIcon from '@mui/icons-material/AirlineSeatIndividualSuite';
import EggIcon from '@mui/icons-material/Egg';
import { Delete } from '../data/Datasource';

export const ComponentContextMenu = (props:IComponentContextMenu)=>{
    const GlobalData = useContext(OrarioDataContext);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [visible, ] = useState(true)
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

//Chiudi finestra dopo selezione orario
useEffect(() => {
}, [props.onClick])

async function EliminaRow(index: number) {
    try {
    const url = url_DeleteDay + "?id=" + index;
    await Delete(url);
    GlobalData?.setIsDataUpdated(true);
    } catch (error) {
    console.log(error);
    }
}

    let day = props.data || new Date()
    let ore = props.ore || 0

    return(
        <>
            <Button aria-describedby={id} variant="outlined" onClick={handleClick} color='primary'  hidden={!visible}>
                ...
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
                            <Button endIcon={<Add/>} title='Aggiungi' color='success' onClick={(event)=>props.onClick(event,"Aggiungi",props.id)}>Nuovo</Button>   
                            
                            {props.id !== -1 && 
                                <Popup2 color='error' IconText={"Elimina"} Type='Elimina' QuestionText='Vuoi veramente eliminare?' onCancel={handleClose} onConfirm={()=>{EliminaRow(props.id);handleClose()}}></Popup2>
                            }
                            
                            {props.id !== -1 &&
                                <Button endIcon={<ContentCopy/>} title='Copia' onClick={(event)=>{props.onClick(event,"Copia",props.id);handleClose()}}>Copia</Button>
                            }
                            
                            {GlobalData?.giornoCopiato.id !== -1 && 
                                <Button endIcon={<ContentPaste/>} title='Incolla' onClick={(event)=>{props.onClick(event,"Incolla",props.id);handleClose()}}>Incolla</Button>
                            }
                            
                            
                        </Stack>
                            
                        <Divider sx={{ backgroundColor: "teal", height: "3px", margin: "16px 0" }} />
                        <Stack direction="row" spacing={1} className='mb-1'>
                            <Button endIcon={<Euro/>} title='Acconti' color='primary' onClick={(event)=>props.onClick(event,"Acconti",props.id)}>Acconti</Button>   
                        </Stack>

                        <Divider sx={{ backgroundColor: "teal", height: "3px", margin: "16px 0" }} />
                        <Stack direction="row" spacing={1} className='mb-1'>

                            {!day.isHoliday() && !day.isWeekEnd() && ore>0 &&
                                <Button endIcon={<AccessTimeIcon/>} title='Permesso' color='error' onClick={(event)=>props.onClick(event,"Permesso",props.id)}>Permesso</Button>
                            }                                                        

                            {!day.isHoliday() && !day.isWeekEnd() && ore>0 &&
                                <Button endIcon={<BeachAccessIcon/>} title='Ferie' color='error' onClick={(event)=>props.onClick(event,"Ferie",props.id)}>Ferie</Button>
                            }   
                        </Stack>
                        <Stack direction="row" spacing={1} className='mb-1'>
                            {!day.isHoliday() && !day.isWeekEnd() && ore>0 &&
                                <Button endIcon={<AirlineSeatIndividualSuiteIcon/>} title='Malattia' color='error' onClick={(event)=>props.onClick(event,"Malattia",props.id)}>Malattia</Button>
                            }          
                            
                            {!day.isHoliday() && !day.isWeekEnd() && ore>0 &&
                                <Button endIcon={<EggIcon/>} title='Donazione ' color='error' onClick={(event)=>props.onClick(event,"Donazione",props.id)}>Donazione</Button>
                            }  
                        </Stack>
                    </Typography>
                    </Popover>
    </>
    )
}

export interface IComponentContextMenu{
    onClick: (event:any,action:string,id:number) => void;
    id:number;
    data?:Date;
    ore?:number;
}