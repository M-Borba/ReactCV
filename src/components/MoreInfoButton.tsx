import IconButton from '@mui/material/IconButton';
import Popper from '@mui/material/Popper';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme} from '@mui/material/styles';
import { useState } from 'react';

interface MoreInfoButtonProps {
  title: string;
  content: any;
  onClick?: Function;
  onClose?: Function;
}
const MoreInfoButton = ({ title, content, onClick,onClose }:MoreInfoButtonProps) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
      onClick?.()
  };

  const handleClose = (e: any) => {
    if (e.target instanceof SVGElement)  
      setAnchorEl(null);
    else
      setAnchorEl(null); // remove if only want to close with X button
    onClose?.()
  };


  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton 
       color="primary"
       onClick={handleClick }
       sx={{ bgcolor: theme.palette.background.paper}}
      >
        <HelpOutlineIcon />
      </IconButton>
      <Popper
        open={open}
        anchorEl={anchorEl}
        placement="bottom-start"
        // disableScrollLock={false}
        // disableRestoreFocus // Prevents focus restoration after popover is closed
      >
        <div 
        style={{ 
          padding: '16px',
          width:"60vw",
          borderRadius:"10px",
          backgroundColor:theme.palette.background.paper ,
        }}
        >
          <h3><CloseIcon onClick={handleClose}/>&nbsp;&nbsp;{title}</h3>
          <p>{content}</p>
       
        </div>
      </Popper>
    </>
  );
};
export default MoreInfoButton;
