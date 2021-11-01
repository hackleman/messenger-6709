import React from "react";
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
  boldText: {
    color: '#000000',
    fontWeight: 800
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
  const classes = useStyles();
  const { conversation } = props;
  const { latestMessageText, otherUser, unreadCount } = conversation;
  
  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography 
          className={[classes.previewText, (unreadCount > 0) && classes.boldText]}
        >
          {latestMessageText}
        </Typography>
      </Box>
      {
        (unreadCount > 0) && 
          <Box className={classes.unreadBubble}>
            { unreadCount }
          </Box>
      }

    </Box>
  );
};

export default ChatContent;
