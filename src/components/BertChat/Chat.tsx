import { useEffect, useRef, useState } from "react";
import Paper from '@mui/material/Paper';
import { TextInput } from "./TextInput.js";
import { BertMessage, UserMessage } from "./Message";
import { Message } from './chatUtils'
import * as qna from '@tensorflow-models/qna';
import CircularProgress from '@mui/material/CircularProgress';
import { makeStyles } from '@mui/styles';
import ErrorIcon from '@mui/icons-material/Error';
import Stack from '@mui/material/Stack';
import chatBackground from "./../../assets/aiChatBackground.jpeg";




const calculateAge = (birthDate: Date) => {
  const diff = Date.now() - birthDate.getTime();
  const ageDate = new Date(diff); 
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

const age = calculateAge(new Date(1998, 7, 28));

const initialPassage = `Martín Borba is a Computer Engineer from Fing UDELAR in Montevideo , Uruguay . He graduated in February 2024 .
Martín was born on August 28 , 1998 , making him ${age} years old .
He has a strong passion for artificial intelligence, especially machine learning, which these days has multiple applications.
His thesis focused on detecting damages in wind turbine blades using AI .
Martín leads an active lifestyle . 
His likes training, going for a run , 3d printing, cycling and playing basketball .
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
"What activities does he like?",
"What was his thesis about?",
"What sports does he practice?",
"Where does he currently live",
"What type of lifestyle does Martin has?"
]

const sentenceFallback = (question: string) => {
  const normalizedQuestion = question.toLowerCase();
  const sentences = initialPassage
    .split(".")
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  const keywordGroups = [
    ["who", "martin"],
    ["old", "born", "age"],
    ["from", "live", "montevideo", "uruguay"],
    ["like", "likes", "activities", "sports"],
    ["artificial", "intelligence", "machine", "learning", "thesis"],
  ];

  const matchedKeywords = keywordGroups.find((group) =>
    group.some((keyword) => normalizedQuestion.includes(keyword)),
  );

  if (!matchedKeywords) {
    return sentences[0];
  }

  const matchedSentence = sentences.find((sentence) =>
    matchedKeywords.some((keyword) => sentence.toLowerCase().includes(keyword)),
  );

  return matchedSentence || sentences[0];
};

const useStyles = makeStyles(() => ({
    paper: {
      width: "100%",
      minHeight: "44rem",
      maxWidth: "none",
      display: "flex",
      alignItems: "stretch",
      flexDirection: "column",
      position: "relative",
      background:"rgba(226, 232, 240, 0.94)",
      borderRadius: "18px",
    },
    container: {
      overflowY: "hidden",
      justifyContent:"flex-start",
      alignItems:"stretch",
      flexDirection: "column",
      gap:"1rem",
      width: "100%",
      minHeight: "56rem",
      display: "flex",
      background:"grey",
      padding:"1rem",
      boxSizing: "border-box",
      backgroundImage: `url(${chatBackground})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      borderRadius:"18px",
    },
    messagesBody: {
      width: "calc(100% - 2rem)",
      margin: "1rem",
      overflowY: "auto",
      minHeight: "34rem",
      flex: 1,
      background:"rgba(15, 23, 42, 0.78)",
      borderRadius: "14px",
      padding: "0.75rem 0",
      boxSizing: "border-box",
    },
    helperText: {
      color: "#e2e8f0",
      fontSize: "0.95rem",
      lineHeight: 1.5,
      background: "rgba(15, 23, 42, 0.62)",
      borderRadius: "14px",
      padding: "0.9rem 1rem",
    },
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
        const modelUrl = new URL(
          `${import.meta.env.BASE_URL}qna_model/model.json`,
          window.location.origin,
        ).toString();
        console.log("modelUrl",modelUrl)
        const loadedModel = await qna.load({ modelUrl, fromTFHub: false });
        console.log("loadedChatModel",loadedModel)
        bertModel.current = loadedModel;
        setModelSetup('done');
        return true;
      } catch (error) {
        console.log('Error loading local QnA model bundle:', error);
        setModelSetup('fallback');
        return false;
      }
    };

    loadModel();

    // Cleanup function
    return () => {
      // Optionally, you can clean up any resources here
    };
  }, []);

  const onSubmit = (text: string)=> {
    if (modelSetup === "fallback") {
      setMessages(prevMessages => [
        ...prevMessages,
        { type: "user", text },
        { type: "bert", text: sentenceFallback(text) },
      ]);
      return;
    }

    if (!bertModel.current || modelSetup !== "done") {
      setMessages(prevMessages => [
        ...prevMessages,
        { type: "bert", text: "El modelo aún no está listo." },
      ]);
      return;
    }

    setMessages(prevMessages => [...prevMessages, { type: "user", text }]);
      bertModel?.current.findAnswers(text, initialPassage)
      .then((answers: any[]) => {
        console.log('Answers: ', answers);
        setMessages(prevMessages => [...prevMessages, { type: "bert", text: answers[0]?.text || "...mmm I don't know" }]);
      })
      .catch((error: unknown) => {
        console.log('Error finding answers:', error);
        setMessages(prevMessages => [...prevMessages, { type: "bert", text: "An error occurred while processing your question" }]);
      });
    
  }
  return (
    <div className={classes.container}>
      {modelSetup === 'fallback' && (
        <div className={classes.helperText}>
          Local QnA model files are incomplete, so the chat is running in fallback mode with
          answers extracted from the embedded profile summary.
        </div>
      )}
      <Paper className={classes.paper}>
        <Paper id="style-1" className={classes.messagesBody}>
          {modelSetup=='loading' && <CircularProgress />}
          {modelSetup==='done' && messages.map((msg,index)=> 
            msg.type=='bert' ? 
            <BertMessage message={msg.text} key={(index+msg.text)}/> : 
            <UserMessage message={msg.text} key={(index+msg.text)}/> )}
          {modelSetup==='fallback' && messages.map((msg,index)=> 
            msg.type=='bert' ? 
            <BertMessage message={msg.text} key={(index+msg.text)}/> : 
            <UserMessage message={msg.text} key={(index+msg.text)}/> )}
          {modelSetup === 'notStarted' && (<><ErrorIcon /> Initializing chat...</>)}
        </Paper>
        <TextInput handleSubmit={onSubmit} />
      </Paper>
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
          (question,index) => 
            <div style={{ cursor: "pointer"}} key={index+question} >
              <UserMessage message={question} onClick={()=>onSubmit(question)}/>
            </div>
        )}
        </Stack>
    </div>
  );
}
