import React, { useEffect, useState } from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: 20,
    marginRight: 20,
    flexGrow: 1,
  },
  username: {
    fontWeight: "bold",
    letterSpacing: -0.2,
  },
  previewText: {
    fontSize: 12,
    color: "#9CADC8",
    letterSpacing: -0.17,
  },
  unreadBubble: {
    fontSize: 12,
    fontWeight: "bold",
    backgroundImage: "linear-gradient(225deg, #6CC1FF 0%, #3A8DFF 100%)",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignSelf: "center",
    width: 18,
    height: 18,
    color: '#ffffff'
  }
}));

const ChatContent = (props) => {
  const [displayUnread, setDisplayUnread] = useState(false)
  const [unreadMessageCount, setUnreadMessageCount] = useState(0)

  const classes = useStyles();
  const { conversation } = props;
  const { latestMessageText, otherUser } = conversation;
  
  useEffect(() => {
    const messages = props.conversation.messages;
    const latest = messages[messages.length - 1];

    // get count if latest message is unread
    if (
      latest &&
      latest.senderId === props.conversation.otherUser.id &&
      latest.read === false
    ) {
      let count = 0;

      for(let i = messages.length - 1; i >= 0; i--) {
        if (
          messages[i].senderId === props.conversation.otherUser.id &&
          messages[i].read === false
        ) {
          count += 1
        } else {
          break;
        }
      }

      setUnreadMessageCount(count)
      setDisplayUnread(true)
    } else {
      setDisplayUnread(false)
    }
  }, [props, classes.boldText])

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography className={classes.previewText} style={displayUnread ? {fontWeight: 800, color: "#000000"} : {fontWeight: 400}}>
          {latestMessageText}
        </Typography>
      </Box>
      {
        displayUnread ? 
          <Box className={classes.unreadBubble}>
            { unreadMessageCount }
          </Box> : <></>
      }

    </Box>
  );
};

export default ChatContent;
