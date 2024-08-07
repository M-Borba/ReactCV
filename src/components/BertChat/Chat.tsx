import { ChangeEvent, useEffect, useRef, useState } from "react";
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { TextInput } from "./TextInput.js";
import { BertMessage, UserMessage } from "./Message";
import { Message } from './chatUtils'
import * as qna from '@tensorflow-models/qna';
import CircularProgress from '@mui/material/CircularProgress';
import { makeStyles } from '@mui/styles';
import ErrorIcon from '@mui/icons-material/Error';
import MoreInfoButton from "../MoreInfoButton.js";
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import chatBackground from "./../../assets/aiChatBackground.jpeg";




const initialPassage = `Martín Borba is a Computer Engineer from Fing UDELAR in Montevideo , Uruguay . He graduated in February 2024 .
Martín was born on August 28 , 1998 , making him 25 years old .
He has a strong passion for artificial intelligence, especially machine learning, which these days has multiple applications.
His thesis focused on detecting damages in wind turbine blades using AI .
Martín leads an active lifestyle . 
His likes training, going for a run , cycling , playing basketballs .
In his free time, he likes to do activities like sports, watching movies or NBA basketball games.
The sports that Martín practices are cycling, basketball, running, judo and chess. 
Martín currently lives in Montevideo .`;


// or you can specify the model url.
// config = {modelUrl: 'https://yourown-server/qna/model.json'};
// customModel = await qna.load(config);

const questionSamples = [
"Who is Martín?",
"How old is Martín?",
"When was he born?",
"Where is he from?",
"What does he like?",
"What part of artificial intelligence does he like?",
"What activities does he do?",
"What was his thesis about?",
"What sports does he practice?",
"Where does he currently live",
"What type of lifestyle does Martin has?"
]

const useStyles = makeStyles(() => ({
    paper: {
      width: "80%",
      height: "80%",
      maxWidth: "500px",
      maxHeight: "700px",
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      position: "relative",
      background:"lightgrey"

    },
    paper2: {
      width: "80%",
      maxWidth: "500px",
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      position: "relative"

    },
    container: {
      "overflow-y": "hidden",
      justifyContent:"space-around",
      alignItems:"flex-start",
      gap:"10%",
      width: "100%",
      height: "90vh",
      display: "flex",
      background:"grey",
      padding:"2%",
      backgroundImage: `url(${chatBackground})`,
      backgroundSize: "cover",
      borderRadius:"10px",
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
  const [passage,setPassage]=useState<string>(initialPassage);
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
        console.log('Error loading QnA model:', error);
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
      bertModel?.current.findAnswers(text, passage)
      .then((answers: any) => {
        console.log('Answers: ', answers);
        setMessages(prevMessages => [...prevMessages, { type: "bert", text: answers[0]?.text || "...mmm I don't know" }]);
      })
      .catch((error:any) => {
        console.log('Error finding answers:', error);
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
        <MoreInfoButton
        title=" What is this chat?"
        content={<div>
                 <Typography variant="body2" paragraph>
                  This BERT model, which stands for Bidirectional Encoder Representations from Transformers, has been specifically trained on a question-answering (QnA) dataset.{" "}
                  When provided with a 'passage' as input text, it can effectively respond to questions related to that passage.{" "}
                  However, it's important to mention that the model can only provide answers that are directly present or implied within the provided text.{" "}
                  Additionally, BERT is widely used in various applications, including natural language processing tasks such as text classification, sentiment analysis, and language understanding.{" "}
                  It powers features in Google Search, enabling more accurate and relevant search results by understanding the context and semantics of search queries.{" "}
                  Furthermore, the background image is also generated by another AI model known as 'OpenArt SDXL'.{" "}
                  Try changing the passage to get new responses.
                </Typography>

                  <br></br>
                  <TextField
                    id="outlined-textarea"
                    label="Passage"
                    value={passage}
                    multiline
                    fullWidth
                    onChange={(e:ChangeEvent<HTMLInputElement>)=>setPassage(e.target.value)}
                  />
                </div> }
        />
      <Stack 
        width="100%" 
        spacing={2} 
        sx={{
          maxHeight: '90%',
          overflowY: 'auto',
          "scrollbar-width": "none",
        }}
      >
        {questionSamples.map(
          (question) => 
            <div style={{ cursor: "pointer"}} >
              <UserMessage message={question} onClick={()=>onSubmit(question)}/>
            </div>
        )}
        </Stack>
    </div>
  );
}
