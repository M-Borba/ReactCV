import Avatar from '@mui/material/Avatar';
import { deepOrange } from '@mui/material/colors';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() =>({
    "@keyframes stretch": {
      "0%": {
        transform: "scale(0.9)"
      },
      "100%": {
        transform: "scale(1)"
      }
    },

    messageRow: {
      display: "flex"
    },
    messageRowRight: {
      display: "flex",
      justifyContent: "flex-end"
    },
    messageBlue: {
      animation: `$stretch 2s ease-in-out`,
      position: "relative",
      marginLeft: "20px",
      marginBottom: "10px",
      padding: "10px",
      color:"black",
      backgroundColor: "#A8DDFD",
      width: "60%",
      //height: "50px",
      textAlign: "left",
      font: "400 .9em 'Open Sans', sans-serif",
      border: "1px solid #97C6E3",
      borderRadius: "10px",
      "&:after": {
        content: "''",
        position: "absolute",
        width: "0",
        height: "0",
        borderTop: "15px solid #A8DDFD",
        borderLeft: "15px solid transparent",
        borderRight: "15px solid transparent",
        top: "0",
        left: "-15px"
      },
      "&:before": {
        content: "''",
        position: "absolute",
        width: "0",
        height: "0",
        borderTop: "17px solid #97C6E3",
        borderLeft: "16px solid transparent",
        borderRight: "16px solid transparent",
        top: "-1px",
        left: "-17px"
      }
    },
    messageOrange: {
      animation: `$stretch 2s ease-in-out`,
      position: "relative",
      marginRight: "20px",
      marginBottom: "10px",
      padding: "10px",
      backgroundColor: "#f8e896",
      width: "60%",
      color:"black",
      textAlign: "left",
      font: "400 .9em 'Open Sans', sans-serif",
      border: "1px solid #dfd087",
      borderRadius: "10px",
      "&:after": {
        content: "''",
        position: "absolute",
        width: "0",
        height: "0",
        borderTop: "15px solid #f8e896",
        borderLeft: "15px solid transparent",
        borderRight: "15px solid transparent",
        top: "0",
        right: "-15px"
      },
      "&:before": {
        content: "''",
        position: "absolute",
        width: "0",
        height: "0",
        borderTop: "17px solid #dfd087",
        borderLeft: "16px solid transparent",
        borderRight: "16px solid transparent",
        top: "-1px",
        right: "-17px"
      }
    },

    messageContent: {
      padding: 0,
      margin: 0
    },

    orange: {
      color: deepOrange[500],
      backgroundColor: deepOrange[500],
    },
    displayName: {
      marginLeft: "20px"
    }
  }));

export const BertMessage = (props:any) => {
  const message = props.message ? props.message : "no message";
  const classes = useStyles();
  return (
    <>
      <div className={classes.messageRow}>
        <Avatar
          alt="BERT"
          className={classes.orange}
          src="https://banner2.cleanpng.com/20180430/zwq/kisspng-bert-ernie-big-bird-count-von-count-oscar-the-grou-5ae7a032e87b11.8855431815251292669523.jpg"
        ></Avatar>
        <div>
          <div className={classes.displayName}>BERT</div>
          <div className={classes.messageBlue}>
            <div>
              <p className={classes.messageContent}>{message}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export const UserMessage = (props:any) => {
  const classes = useStyles();
  const message = props.message ? props.message : "no message";
  return (
    <div className={classes.messageRowRight}>
      <div className={classes.messageOrange}>
        <p className={classes.messageContent}>{message}</p>
      </div>
    </div>
  );
};
