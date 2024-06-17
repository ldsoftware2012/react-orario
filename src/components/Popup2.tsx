import { Add, Cancel, Check, Delete, Edit, Label } from '@mui/icons-material';
import { Alert, Button, IconButton, Paper, Popover, Stack, Typography, styled } from '@mui/material';
import { useEffect, useState } from 'react';


export const Popup2 = (props:IComponentContextMenu)=>{
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [visible, setvisible] = useState(true)
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
    setAnchorEl(null); 
}, [props.onCancel,props.onConfirm])

    return(
        <>
            <Button aria-describedby={id}  onClick={handleClick} color='primary'  hidden={!visible}>
                {props.IconText}
                {props.Type ==="Elimina" && <Delete color='error'></Delete>}
                {props.Type ==="Aggiungi" && <Add color='primary'></Add>}
                {props.Type ==="Modifica" && <Edit color='info'></Edit>}
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
                        <Alert severity="info">{props.QuestionText || "Confermi operazione?"}</Alert>                        
                        <Stack direction="row" spacing={1} className='mb-1'>
                        <Button color='error' startIcon={<Cancel />} onClick=
                        {()=>{
                            props.onCancel()
                            handleClose()
                        }}>
                            Annulla
                        </Button>
                        <Button color='success' endIcon={<Check />} onClick={
                            ()=>{
                                props.onConfirm()
                                handleClose()
                            }
                        }>
                            Conferma
                        </Button>
                        </Stack>
                    </Typography>
                    </Popover>
    </>
    )
}

export interface IComponentContextMenu{
    QuestionText?:string
    Type : string |"Aggiungi"|"Elimina"|"Modifica"
    IconText? : any;
    onConfirm:()=>any;
    onCancel : ()=>any;

}