import React from "react";
import { Box, Badge } from "@material-ui/core";
import { BadgeAvatar, ChatContent } from "../Sidebar";
import { makeStyles } from "@material-ui/core/styles";
import { setActiveConversation } from "../../store/utils/thunkCreators";
import { connect } from "react-redux";

const useStyles = makeStyles((theme) => ({
  badge: {
    verticalAlign: 'center',
    borderRadius: 8,
    height: 80,
    boxShadow: "0 2px 10px 0 rgba(88,133,196,0.05)",
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    "&:hover": {
      cursor: "grab"
    },
    '& .MuiBadge-anchorOriginTopRightRectangle': {
      top: '2.5rem'
    }
  },
  root: {
    display: "flex",
    alignItems: "center",
  }
}));

const Chat = (props) => {
  const classes = useStyles();
  const { conversation } = props;
  const { otherUser } = conversation;

  const handleClick = async () => {
    await props.setActiveConversation({
      user: props.user,
      recipient: otherUser,
      conversationId: conversation.id
    });
  };

  return (
    <Badge
      color="primary"
      badgeContent={conversation.unreadCount}
      className={classes.badge}
      onClick={() => handleClick(conversation)}
    >
      <Box  className={classes.root}>
        <BadgeAvatar
          photoUrl={otherUser.photoUrl}
          username={otherUser.username}
          online={otherUser.online}
          sidebar={true}
        />
        <ChatContent conversation={conversation} />
     </Box>
    </Badge>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveConversation: (id) => {
      dispatch(setActiveConversation(id));
    }
  };
};

const mapStateToProps = (state) => {
  return {
      user: state.user
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
