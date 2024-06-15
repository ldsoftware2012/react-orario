import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';

export const ComponentChangeWorkType = (props:IComponentChangeWorkType)=>{


    return(
    <>
        <FormControl>
            <FormLabel id="demo-row-radio-buttons-group-label">Tipo</FormLabel>
            <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
            >
                <FormControlLabel checked={props.value==="Lavoro"}  control={<Radio />} label="Lavoro" onChange={(event)=>{props.onChange(event,"Lavoro")}}/>
                <FormControlLabel checked={props.value==="Viaggio"}  control={<Radio />} label="Viaggio" onChange={(event)=>{props.onChange(event,"Viaggio")}} />
                <FormControlLabel checked={props.value==="Riposo trasferta"}  control={<Radio />} label="Riposo trasferta" onChange={(event)=>{props.onChange(event,"Riposo trasferta")}}/>
                <FormControlLabel checked={props.value==="Ferie"}  control={<Radio />} label="Ferie" onChange={(event)=>{props.onChange(event,"Ferie")}}/>
                <FormControlLabel checked={props.value==="Permesso"}  control={<Radio />} label="Permesso" onChange={(event)=>{props.onChange(event,"Permesso")}}/>
                <FormControlLabel checked={props.value==="Malattia"}  control={<Radio />} label="Malattia" onChange={(event)=>{props.onChange(event,"Malattia")}} />
                <FormControlLabel checked={props.value==="Donazione"}  control={<Radio />} label="Donazione" onChange={(event)=>{props.onChange(event,"Donazione")}}/>
            </RadioGroup>
    </FormControl>    
    </>
    )
}


export interface IComponentChangeWorkType{
    onChange: (event:any,value:string) => void;  
    value : string;      
}