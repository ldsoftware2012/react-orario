import { Button, Paper, Popover, Stack, Typography, styled } from '@mui/material';
import { green } from '@mui/material/colors';

import { useEffect, useState } from 'react';


export const ComponentHoursPreset = (props:IComponentSliderDial)=>{

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
}, [props.onClick])

    return(
        <>
            <Button aria-describedby={id} variant="contained" onClick={handleClick} color='warning'  hidden={!visible}>
                Preset
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
                            <Item><Button onClick={(event)=>props.onClick(event,"Mattina")}>Mattina</Button></Item>
                            <Item><Button onClick={(event)=>props.onClick(event,"Pomeriggio")}>Pomeriggio</Button></Item>
                            <Item><Button onClick={(event)=>props.onClick(event,"Standard")}>Giornata</Button></Item>
                        </Stack>
                        <Stack direction="row" spacing={2}>
                            <Item><Button onClick={(event)=>props.onClick(event,"0.5")}>+0.5</Button></Item>
                            <Item><Button onClick={(event)=>props.onClick(event,"1")}>+1</Button></Item>
                            <Item><Button onClick={(event)=>props.onClick(event,"1.5")}>+1.5</Button></Item>
                            <Item><Button onClick={(event)=>props.onClick(event,"2")}>+2</Button></Item>
                        </Stack>
                        <Stack direction="row" spacing={2}>
                            <Item><Button onClick={(event)=>props.onClick(event,"2.5")}>+2.5</Button></Item>
                            <Item onClick={(event)=>props.onClick(event,"3")}><Button>+3</Button></Item>
                            <Item onClick={(event)=>props.onClick(event,"3.5")}><Button>+3.5</Button></Item>
                            <Item><Button onClick={(event)=>props.onClick(event,"4")}>+4</Button></Item>
                        </Stack>
                    </Typography>
                    </Popover>
    </>
    )
}

export interface IComponentSliderDial{
    onClick: (event:any,action:string) => void;
}