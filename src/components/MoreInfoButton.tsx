import IconButton from '@mui/material/IconButton';
import Popover from '@mui/material/Popover';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CloseIcon from '@mui/icons-material/Close';

import { useState } from 'react';

interface MoreInfoButtonProps {
  title: string;
  content: any;
}
const MoreInfoButton= ({ title, content }:MoreInfoButtonProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

const handleClose = (e: any) => {
  if (e.target instanceof SVGElement)  
   setAnchorEl(null);
   else
   setAnchorEl(null); // remove if only want to close with X button
};


  const open = Boolean(anchorEl);

  return (
    <div>
      <IconButton 
       color="primary"
       onClick={handleClick }
       sx={{backgroundColor: 'white'}}
      >
        <HelpOutlineIcon />
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        disableRestoreFocus // Prevents focus restoration after popover is closed
      >
        <div style={{ padding: '16px' }}>
         <CloseIcon onClick={handleClose}/>
          <h3>{title}</h3>
          <p>{content}</p>
       
        </div>
      </Popover>
    </div>
  );
};
export default MoreInfoButton;
