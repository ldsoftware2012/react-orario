import { Add, Cancel, ContentCopy, ContentPaste, Euro } from '@mui/icons-material';
import { Button, Icon, IconButton, Paper, Popover, Stack, Typography, styled } from '@mui/material';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import { useContext, useEffect, useState } from 'react';
import Popup from './Popup';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { url_DeleteDay } from '../data/config';
import { OrarioDataContext } from '../App';
import { Delete } from '../data/Datasource';
import { Popup2 } from './Popup2';


export const ComponentContextMenu = (props:IComponentContextMenu)=>{
    const GlobalData = useContext(OrarioDataContext);
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [visible, setvisible] = useState(true)
    const [buttonSelected, setbuttonSelected] = useState("")
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(0),
        textAlign: 'center',
        color: theme.palette.text.primary,        
    }));


//Chiudi finestra dopo selezione orario
useEffect(() => {
}, [props.onClick])

async function EliminaRow(index: number) {
    try {
    const url = url_DeleteDay + "?id=" + index;
    const del = await Delete(url);
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
                            <IconButton title='Aggiungi' color='success' onClick={(event)=>props.onClick(event,"Aggiungi",props.id)}><Add></Add></IconButton>   
                            {props.id !== -1 && <Popup2 Type='Elimina' QuestionText='Vuoi veramente eliminare?' onCancel={handleClose} onConfirm={()=>{EliminaRow(props.id);handleClose()}}></Popup2>}
                            <IconButton title='Acconti' color='info' onClick={(event)=>props.onClick(event,"Acconti",props.id)}><Euro></Euro></IconButton>   
                            {!day.isHoliday() && !day.isWeekEnd() && ore>0 &&<IconButton title='Permesso' color='warning' onClick={(event)=>props.onClick(event,"Permesso",props.id)}><BeachAccessIcon></BeachAccessIcon></IconButton>}
                            <IconButton title='Copia' onClick={(event)=>{props.onClick(event,"Copia",props.id);handleClose()}}><ContentCopy></ContentCopy></IconButton>
                            {GlobalData?.giornoCopiato.id !== -1 && <IconButton title='Incolla' onClick={(event)=>{props.onClick(event,"Incolla",props.id);handleClose()}}><ContentPaste></ContentPaste></IconButton>}
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