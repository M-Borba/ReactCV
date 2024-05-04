import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import IconButton from '@mui/material/IconButton';
import { useTheme} from '@mui/material/styles';

const ColorModeButton = ({onClick}:any) => {
 const theme = useTheme();
 console.log("theme",theme, typeof onClick)

    return (
    <IconButton  
        sx={{
            position: 'sticky',
            zIndex:'1',
            top: '5%',
            float:"right",
            bgcolor: theme.palette.background.default,
        }} 
        onClick={()=>onClick()} 
    >
        {theme.palette.mode === 'dark' ? <Brightness4Icon /> : <Brightness7Icon />  }
    </IconButton>
    )
};

export default ColorModeButton;