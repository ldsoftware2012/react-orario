import { Accordion, AccordionDetails, AccordionSummary, Button, Paper, Popover, Stack, Typography, styled } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useEffect, useState } from 'react';



export const ComponentSelectHour = (props:IComponentSelectHour)=>{

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

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(0),
        textAlign: 'center',
        color: theme.palette.text.primary,        
    }));

//Chiudi finestra dopo selezione orario
useEffect(() => {
    setAnchorEl(null);
    setvisible(true)
    if(props.value===""){
        setvisible(false)
    }
}, [props.value])


    return(
        <>
            <Button aria-describedby={id} variant="contained" onClick={handleClick} color='info' hidden={!visible}>
                {props.value}
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

                    <Typography sx={{ p: 2 }}>
                        <Stack direction="row" spacing={1} className='mb-1'>
                            <Item><Button onClick={(event)=>props.onClick(event,"06:00")}>06:00</Button></Item>
                            <Item><Button onClick={(event)=>props.onClick(event,"06:30")}>06:30</Button></Item>
                            <Item><Button onClick={(event)=>props.onClick(event,"07:00")}>07:00</Button></Item>
                            <Item><Button onClick={(event)=>props.onClick(event,"07:30")}>07:30</Button></Item>
                        </Stack>
                        <Stack direction="row" spacing={1} className='mb-1'>
                            <Item><Button onClick={(event)=>props.onClick(event,"08:00")}>08:00</Button></Item>
                            <Item><Button onClick={(event)=>props.onClick(event,"08:30")}>08:30</Button></Item>
                            <Item><Button onClick={(event)=>props.onClick(event,"09:00")}>09:00</Button></Item>
                            <Item><Button onClick={(event)=>props.onClick(event,"09:30")}>09:30</Button></Item>
                        </Stack>
                        <Stack direction="row" spacing={1} className='mb-1'>
                            <Item><Button onClick={(event)=>props.onClick(event,"10:00")}>10:00</Button></Item>
                            <Item><Button onClick={(event)=>props.onClick(event,"10:30")}>10:30</Button></Item>
                            <Item><Button onClick={(event)=>props.onClick(event,"11:00")}>11:00</Button></Item>
                            <Item><Button onClick={(event)=>props.onClick(event,"11:30")}>11:30</Button></Item>
                        </Stack>
                        <Stack direction="row" spacing={1} className='mb-1'>
                            <Item><Button onClick={(event)=>props.onClick(event,"12:00")}>12:00</Button></Item>
                            <Item><Button onClick={(event)=>props.onClick(event,"12:30")}>12:30</Button></Item>
                            <Item><Button onClick={(event)=>props.onClick(event,"13:00")}>13:00</Button></Item>
                            <Item><Button onClick={(event)=>props.onClick(event,"13:30")}>13:30</Button></Item>
                        </Stack>
                        <Stack direction="row" spacing={1} className='mb-1'>
                            <Item><Button onClick={(event)=>props.onClick(event,"14:00")}>14:00</Button></Item>
                            <Item><Button onClick={(event)=>props.onClick(event,"14:30")}>14:30</Button></Item>
                            <Item><Button onClick={(event)=>props.onClick(event,"15:00")}>15:00</Button></Item>
                            <Item><Button onClick={(event)=>props.onClick(event,"15:30")}>15:30</Button></Item>
                        </Stack>    
                        <Stack direction="row" spacing={1} className='mb-1'>
                            <Item><Button onClick={(event)=>props.onClick(event,"16:00")}>16:00</Button></Item>
                            <Item><Button onClick={(event)=>props.onClick(event,"16:30")}>16:30</Button></Item>
                            <Item><Button onClick={(event)=>props.onClick(event,"17:00")}>17:00</Button></Item>
                            <Item><Button onClick={(event)=>props.onClick(event,"17:30")}>17:30</Button></Item>
                        </Stack>       
                        <Stack direction="row" spacing={1} className='mb-1'>
                            <Item><Button onClick={(event)=>props.onClick(event,"18:00")}>18:00</Button></Item>
                            <Item><Button onClick={(event)=>props.onClick(event,"18:30")}>18:30</Button></Item>
                            <Item><Button onClick={(event)=>props.onClick(event,"19:00")}>19:00</Button></Item>
                            <Item><Button onClick={(event)=>props.onClick(event,"19:30")}>19:30</Button></Item>
                        </Stack>  
                        <Stack direction="row" spacing={1} className='mb-1'>
                            <Item><Button onClick={(event)=>props.onClick(event,"20:00")}>20:00</Button></Item>
                            <Item><Button onClick={(event)=>props.onClick(event,"20:30")}>20:30</Button></Item>
                            <Item><Button onClick={(event)=>props.onClick(event,"21:00")}>21:00</Button></Item>
                            <Item><Button onClick={(event)=>props.onClick(event,"21:30")}>21:30</Button></Item>
                        </Stack>   

                        <Accordion>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
        >
        Altri...
        </AccordionSummary>
        <AccordionDetails>
        <Stack direction="row" spacing={1} className='mb-1'>
                            <Item><Button onClick={(event)=>props.onClick(event,"22:00")}>22:00</Button></Item>
                            <Item><Button onClick={(event)=>props.onClick(event,"22:30")}>22:30</Button></Item>
                            <Item><Button onClick={(event)=>props.onClick(event,"23:00")}>23:00</Button></Item>
                            <Item><Button onClick={(event)=>props.onClick(event,"23:30")}>23:30</Button></Item>
                        </Stack>   
                        <Stack direction="row" spacing={1} className='mb-1'>
                            <Item><Button onClick={(event)=>props.onClick(event,"00:00")}>00:00</Button></Item>
                            <Item><Button onClick={(event)=>props.onClick(event,"00:30")}>00:30</Button></Item>
                            <Item><Button onClick={(event)=>props.onClick(event,"01:00")}>01:00</Button></Item>
                            <Item><Button onClick={(event)=>props.onClick(event,"01:30")}>01:30</Button></Item>
                        </Stack>    
                        <Stack direction="row" spacing={1} className='mb-1'>
                            <Item><Button onClick={(event)=>props.onClick(event,"02:00")}>02:00</Button></Item>
                            <Item><Button onClick={(event)=>props.onClick(event,"02:30")}>02:30</Button></Item>
                            <Item><Button onClick={(event)=>props.onClick(event,"03:00")}>03:00</Button></Item>
                            <Item><Button onClick={(event)=>props.onClick(event,"03:30")}>03:30</Button></Item>
                        </Stack>  
                        <Stack direction="row" spacing={1} className='mb-1'>
                            <Item><Button onClick={(event)=>props.onClick(event,"04:00")}>04:00</Button></Item>
                            <Item><Button onClick={(event)=>props.onClick(event,"04:30")}>04:30</Button></Item>
                            <Item><Button onClick={(event)=>props.onClick(event,"05:00")}>05:00</Button></Item>
                            <Item><Button onClick={(event)=>props.onClick(event,"05:30")}>05:30</Button></Item>
                        </Stack>                                                                        
        </AccordionDetails>
        </Accordion>


                    </Typography>
                    </Popover>
    </>
    )
}

export interface IComponentSelectHour{
    onClick: (event:any,action:string) => void;
    value : string;
}