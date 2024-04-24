import React, { useEffect, useRef, useState } from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";
import { TextInput } from "./TextInput.js";
import { BertMessage, UserMessage } from "./Message";
import { Message } from './chatUtils'
import * as qna from '@tensorflow-models/qna';
import CircularProgress from '@mui/material/CircularProgress';




const passage = `
I'm Martin, a 25-year-old computer engineer who loves AI and enjoys various activities. 
Feel free to ask me anything about my background, interests, or projects!
`;


// or you can specify the model url.
// config = {modelUrl: 'https://yourown-server/qna/model.json'};
// customModel = await qna.load(config);

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      width: "80vw",
      height: "80vh",
      maxWidth: "500px",
      maxHeight: "700px",
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      position: "relative",
      background:"lightgrey"

    },
    paper2: {
      width: "80vw",
      maxWidth: "500px",
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      position: "relative"

    },
    container: {
      width: "100vw",
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background:"grey"
    },
    messagesBody: {
      width: "calc( 100% - 20px )",
      margin: 10,
      overflowY: "scroll",
      height: "calc( 100% - 80px )",
      background:"darkgrey"
    }
  })
);



export default function Chat() {
  const classes = useStyles();
  const [messages,setMessages] = useState<Message[]>([{type:"bert",text:"Hello, ask me anything you want to know about Martín"}])
  const bertModel = useRef(null);
  const [isLoading, setLoading] = useState(true);

    useEffect(() => {
    const loadModel = async () => {
      try {
        const loadedModel = await qna.load();
        bertModel.current =loadedModel;
        setLoading(false);
      } catch (error) {
        console.error('Error loading QnA model:', error);
        setLoading(false);
      }
    };

    loadModel();

    // Cleanup function
    return () => {
      // Optionally, you can clean up any resources here
    };
  }, []);

  const onSubmit = (text: string)=> {
    setMessages([...messages,{type:"user",text}])
    console.log("bertModel",bertModel)
    bertModel?.current.findAnswers(text, passage).then((answers: any) => {
      console.log('Answers: ', answers);
      setMessages([...messages,{type:"bert",text:answers[0].text}])
    });
    
  }
  return (
    <div className={classes.container}>
      <Paper className={classes.paper} zDepth={2}>
        <Paper id="style-1" className={classes.messagesBody}>
          {isLoading ? <CircularProgress /> : messages.map(msg=> 
            msg.type=='bert' ? 
            <BertMessage message={msg.text}/> : 
            <UserMessage message={msg.text}/> )}
        </Paper>
        <TextInput text={""} handleSubmit={onSubmit} />
      </Paper>
    </div>
  );
}
