import { Backdrop, Box, SpeedDial, SpeedDialAction, SpeedDialIcon, colors } from '@mui/material';
import Battery0BarOutlinedIcon from '@mui/icons-material/Battery0BarOutlined';
import BatteryCharging20OutlinedIcon from '@mui/icons-material/BatteryCharging20Outlined';
import BatteryStdOutlinedIcon from '@mui/icons-material/BatteryStdOutlined';
import BatteryCharging30OutlinedIcon from '@mui/icons-material/BatteryCharging30Outlined';
import ArrowDropDownCircleOutlinedIcon from '@mui/icons-material/ArrowDropDownCircleOutlined';

import { useState } from 'react';
import { green, red } from '@mui/material/colors';

const actions = [
    { icon: <Battery0BarOutlinedIcon />, name: 'Mezza' },
    { icon: <BatteryStdOutlinedIcon />, name: 'Standard' },
    { icon: <BatteryCharging20OutlinedIcon />, name: '0.5' },
    { icon: <BatteryCharging30OutlinedIcon />, name: '1' },
];



export const ComponentSpeedDial = (props:IComponentSliderDial)=>{
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    


    return(
        <>        
        <Box sx={{overlay:'inherit' ,height: 0, transform: 'translateZ(0px)', flexGrow: 1 ,color:red}}>
            <Backdrop open={open} />
            <SpeedDial
                ariaLabel="SpeedDial tooltip example"
                sx={{ position: 'absolute', top: -5, right: -15}}
                //sx={{ '& .MuiFab-primary': { backgroundColor: 'lightgray', color: 'blue' ,width:30 , height:30} }}
                icon={<ArrowDropDownCircleOutlinedIcon />}
                onClose={handleClose}
                onOpen={handleOpen}
                open={open}     
                direction='down'   
        >
        {actions.map((action) => (
        <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen
            onClick={handleClose}
            />
        ))}
    </SpeedDial>
    </Box>
        </>
    )

}

export interface IComponentSliderDial{
    onClick: (event:any,action:string) => void;
}