import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
  setActiveUser,
  updateReadData,
  updateReadCount
} from "./store/conversations";

const socket = io(window.location.origin);

socket.on("connect", () => {
  console.log("connected to server");

  socket.on("add-online-user", (id) => {
    store.dispatch(addOnlineUser(id));
  });

  socket.on("remove-offline-user", (id) => {
    store.dispatch(removeOfflineUser(id));
  });

  socket.on("set-active-user", (users) => {
    const { user1, user2 } = users;
    let active = false;
    if (user2 === store.getState().user.id) {
      active = true
    }
    store.dispatch(setActiveUser({
      user: user1,
      active
    }))
  })

  socket.on("update-read-data", (data) => {
    const { user2 } = data;

    if (user2 === store.getState().user.id) {
      store.dispatch(updateReadData(data))
    }
  })

  socket.on("new-message", (data) => {
    store.dispatch(setNewMessage(data.message, data.sender));
    store.dispatch(updateReadCount(data.message.senderId));
  });
});

export default socket;
