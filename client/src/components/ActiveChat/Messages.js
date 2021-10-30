import React from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";

const Messages = (props) => {
  const { messages, otherUser, userId } = props;

  return (
    <Box>
      {messages.map((message, idx) => {
        const time = moment(message.createdAt).format("h:mm");
        const last = idx === messages.length - 1

        return message.senderId === userId ? (
          <SenderBubble 
            key={message.id} 
            text={message.text} 
            time={time} 
            last={last} 
            read={message.read} 
            photoUrl={otherUser.photoUrl} 
          />
        ) : (
          <OtherUserBubble 
            key={message.id} 
            text={message.text} 
            time={time} 
            otherUser={otherUser} 
          />
        );
      })}
    </Box>
  );
};

export default Messages;
