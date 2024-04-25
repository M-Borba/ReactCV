import { useEffect, useRef, useState } from "react";
import Paper from '@mui/material/Paper';
import { TextInput } from "./TextInput.js";
import { BertMessage, UserMessage } from "./Message";
import { Message } from './chatUtils'
import * as qna from '@tensorflow-models/qna';
import CircularProgress from '@mui/material/CircularProgress';
import { makeStyles } from '@mui/styles';
import ErrorIcon from '@mui/icons-material/Error';




const passage = `
Hello, hi.
Martín Borba is a computer engineer from Fing UDELAR in Montevideo, Uruguay, having graduated in 2024.
Martín was born on August 28, 1998, making me 25 years old. 
With a strong passion for artificial intelligence, particularly machine learning, I've dedicated my academic and professional career to exploring its endless possibilities.
My thesis focused on object detection, specifically on detecting damages in wind turbine blades, showcasing my interest in applying AI to real-world challenges.
Outside of work, I lead an active lifestyle and love to learn. I like training, lifting weights, or running along the beautiful "rambla" in Montevideo. 
I'm also an avid cyclist, basketball player, and chess enthusiast. 
In my fretime, I like watching series and movies, especially NBA basketball games. 
Currently, I reside in Montevideo with my two beloved pets, a cat, and a dog.
`;


// or you can specify the model url.
// config = {modelUrl: 'https://yourown-server/qna/model.json'};
// customModel = await qna.load(config);



const useStyles = makeStyles(() => ({
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
  }));

export default function Chat() {
  const classes = useStyles();
  const [messages,setMessages] = useState<Message[]>([{type:"bert",text:"Hello, ask me anything you want to know about Martín"}])
  const bertModel = useRef<any>(null);
  const [modelSetup, setModelSetup] = useState<string>('notStarted');

    useEffect(() => {
    const loadModel = async () => {
      try {
        setModelSetup('loading');
        const loadedModel = await qna.load();
        console.log("loadedModel",loadedModel)
        bertModel.current = loadedModel;
        setModelSetup('done');
        return true;
      } catch (error) {
        console.error('Error loading QnA model:', error);
        setModelSetup('error');

        return false
      }
    };

    loadModel();

    // Cleanup function
    return () => {
      // Optionally, you can clean up any resources here
    };
  }, []);

  const onSubmit = (text: string)=> {
    setMessages(prevMessages => [...prevMessages, { type: "user", text }]);
      console.log("---",bertModel?.current?.findAnswers, text, passage)
      bertModel?.current.findAnswers(text, passage)
      .then((answers: any) => {
        console.log('Answers: ', answers);
        setMessages(prevMessages => [...prevMessages, { type: "bert", text: answers[0]?.text || "...mmm I don't know" }]);
      })
      .catch((error:any) => {
        console.error('Error finding answers:', error);
        setMessages(prevMessages => [...prevMessages, { type: "bert", text: "An error occurred while processing your question" }]);
      });
    
  }
  return (
    <div className={classes.container}>
      <Paper className={classes.paper}>
        <Paper id="style-1" className={classes.messagesBody}>
          {modelSetup=='loading' && <CircularProgress />}
          {modelSetup === 'error' && (<><ErrorIcon /> Could not load model :(</>)}
          {modelSetup==='done' && messages.map(msg=> 
            msg.type=='bert' ? 
            <BertMessage message={msg.text}/> : 
            <UserMessage message={msg.text}/> )}
        </Paper>
        <TextInput text={""} handleSubmit={onSubmit} />
      </Paper>
    </div>
  );
}
