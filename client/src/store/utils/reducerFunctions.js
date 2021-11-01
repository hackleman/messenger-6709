export const addMessageToStore = (state, payload) => {
  const { message, sender } = payload;

  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
    };
    
    if (!message.read && message.senderId === newConvo.otherUser.id) {
      newConvo.unreadCount = 1
    }

    newConvo.latestMessageText = message.text;
    return [newConvo, ...state];
  }

  return state.map((convo) => {
    if (convo.id === message.conversationId) {
      const convoCopy = {...convo}
      convoCopy.messages.push(message);
      convoCopy.latestMessageText = message.text;
      if (!message.read && message.senderId === convo.otherUser.id) {
        convoCopy.unreadCount += 1
      }
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const updateReadMessagesInStore = (state, data) => {
  return state.map((convo) => {
    if(convo.otherUser.id === data.user1) {
      const convoCopy = { ...convo };
      convoCopy.messages.map(message => {
        if (message.senderId === data.user2) {
          message.read = true
        }
        return message
      })
      convoCopy.unreadCount = 0
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

export const setActiveUserToStore = (state, { user, active }) => {
  return state.map((convo) => {
    if (convo.otherUser.id === user) {
      const convoCopy  = { ...convo };
      convoCopy.otherUser.active = active;
      return convoCopy
    }

    return convo
  })
}
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
