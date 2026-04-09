import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  wrapForm: {
    display: "flex",
    justifyContent: "center",
    width: "95%",
    margin: 'auto',
    paddingBottom: "0.5rem",
  },
  wrapText: {
    width: "100%"
  },
  button: {
  },
}));

export const TextInput = ({ handleSubmit }: any) => {
  const classes = useStyles();
  const [text, setText] = useState("")

  const localSubmit = (e: any) => {
    e.preventDefault()
    if (!text) return
    handleSubmit(text)
    setText("")
  }

  return (
    <>
      <form className={classes.wrapForm} noValidate autoComplete="off" onSubmit={localSubmit}>
        <TextField
          id="standard-text"
          label="Chat with MBert"
          className={classes.wrapText}
          multiline
          onChange={(e: any) => { setText(e.target.value) }}
          value={text}
          sx={{margin:"1%"}}
          minRows={2}
        />
        <Button 
         variant="contained"
         color="primary"
         className={classes.button}
         onClick={localSubmit}
         sx={{margin:"1%"}}
        >
          <SendIcon />
        </Button>
      </form>
    </>
  )
}
