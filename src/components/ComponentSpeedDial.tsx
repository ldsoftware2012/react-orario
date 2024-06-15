import { SpeedDial, SpeedDialAction, SpeedDialProps, styled } from '@mui/material';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import Battery0BarOutlinedIcon from '@mui/icons-material/Battery0BarOutlined';
import BatteryCharging20OutlinedIcon from '@mui/icons-material/BatteryCharging20Outlined';
import BatteryStdOutlinedIcon from '@mui/icons-material/BatteryStdOutlined';
import BatteryCharging30OutlinedIcon from '@mui/icons-material/BatteryCharging30Outlined';
import BatteryCharging50OutlinedIcon from '@mui/icons-material/BatteryCharging50Outlined';
import BatteryCharging60OutlinedIcon from '@mui/icons-material/BatteryCharging60Outlined';
import BatteryCharging80OutlinedIcon from '@mui/icons-material/BatteryCharging80Outlined';
import BatteryCharging90OutlinedIcon from '@mui/icons-material/BatteryCharging90Outlined';

import { useState } from 'react';

const actions = [
    { icon: <Battery0BarOutlinedIcon />, name: 'Mezza' },
    { icon: <BatteryStdOutlinedIcon />, name: 'Standard' },
    { icon: <BatteryCharging20OutlinedIcon />, name: '0.5' },
    { icon: <BatteryCharging30OutlinedIcon />, name: '1' },
    { icon: <BatteryCharging50OutlinedIcon />, name: '1.5' },
    { icon: <BatteryCharging60OutlinedIcon />, name: '2' },
    { icon: <BatteryCharging80OutlinedIcon />, name: '2.5' },
    { icon: <BatteryCharging90OutlinedIcon />, name: '3' },
];

export const ComponentSpeedDial = (props:IComponentSliderDial)=>{
    const [direction, setDirection] = useState<SpeedDialProps['direction']>('right');
    const [hidden, setHidden] = useState(true);
    
    const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
    position: 'relative','&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
        bottom: theme.spacing(0),
        right: theme.spacing(0),
    },
    '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
        top: theme.spacing(0),
        left: theme.spacing(0),
    },
    }));
    

//<button onClick={event => handleClick(event, 100)}>
    return(
        <>
        <StyledSpeedDial
        ariaLabel="SpeedDial playground example"
        hidden={hidden}
        icon={<AccessTimeOutlinedIcon />}
        direction={direction}
        >
        {actions.map((action) => (
            <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={event => {
                props.onClick(event ,action.name)
                setHidden(true)
            }
            }
            />
        ))}
        </StyledSpeedDial>
        </>
    )

}

export interface IComponentSliderDial{
    onClick: (event:any,action:string) => void;
}