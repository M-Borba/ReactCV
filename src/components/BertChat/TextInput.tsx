import TextField from '@material-ui/core/TextField';
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import SendIcon from '@material-ui/icons/Send';
import Button from '@material-ui/core/Button';
import { SetStateAction, useState } from 'react';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapForm : {
        display: "flex",
        justifyContent: "center",
        width: "95%",
        margin: `${theme.spacing(0)} auto`
    },
    wrapText  : {
        width: "100%"
    },
    button: {
        //margin: theme.spacing(1),
    },
  })
);


export const TextInput = ({handleSubmit}) => {
    const classes = useStyles();
    const [text,setText] = useState("") 
    const localSubmit = (e: any)=>{
        e.preventDefault()
        if(!text) return
        handleSubmit(text)
        setText("")
    }

    return (
        <>
            <form className={classes.wrapForm}  noValidate autoComplete="off" onSubmit={localSubmit}>
            <TextField
                id="standard-text"
                label="Chat with MBert"
                className={classes.wrapText}
                onChange={(e: any )=>{setText(e.target.value)}}
                value={text} 
            />
            <Button variant="contained" color="primary" className={classes.button} onClick={localSubmit}>
                <SendIcon />
            </Button >
            </form>
        </>
    )
}



