export const addMessageToStore = (state, payload) => {
  const { message, recipient, sender } = payload;

  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
    };

    if (!message.read && recipient) {
      newConvo.unreadCount = 1;
    }
    if (message.read && !recipient) {
      newConvo.lastMessageRead = message.id
    }

    newConvo.latestMessageText = message.text;
    return [newConvo, ...state];
  }

  return state.map((convo) => {
    if (convo.id === message.conversationId) {
      const convoCopy = {...convo}
      convoCopy.messages.push(message);
      convoCopy.latestMessageText = message.text;

      if (!message.read && recipient) {
        convoCopy.unreadCount += 1;
      }
      if (message.read && !recipient) {
        convoCopy.lastMessageRead = message.id
      }

      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const updateReadMessagesInStore = (state, user) => {
  return state.map((convo) => {
    if (convo.otherUser.username === user) {
      const convoCopy = { ...convo }
      convoCopy.unreadCount = 0
      return convoCopy;
    }
    return convo
  })
};

export const updateOtherMessagesInStore = (state, users) => {
  return state.map((convo) => {
    if (convo.otherUser.id === users.user) {
      const convoCopy = { ...convo }
      const messages = convoCopy.messages.filter(message => message.senderId === users.recipient)
      if (messages.length > 0) {
        const latestMessage = messages[messages.length - 1]
        latestMessage.read = true
        convoCopy.lastMessageRead = latestMessage.id
      }
      return convoCopy
    }
    return convo
  })
};

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = true;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = false;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = { otherUser: user, messages: [] };
      newState.push(fakeConvo);
    }
  });

  return newState;
};

export const addNewConvoToStore = (state, recipientId, message) => {
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      const convoCopy = { ...convo }
      convoCopy.id = message.conversationId;
      convoCopy.messages.push(message);
      convoCopy.latestMessageText = message.text;
      return convoCopy;
    } else {
      return convo;
    }
  });
};
