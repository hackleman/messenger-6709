import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
  setActiveUser,
  updateReadData
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
    const { user, otherUser } = users;
    let active = false;
    if (otherUser === store.getState().user.id) {
      active = true
    }
    store.dispatch(setActiveUser({
      user,
      active
    }))
  })

  socket.on("update-read-data", (data) => {
    const { otherUser } = data;

    if (otherUser === store.getState().user.id) {
      store.dispatch(updateReadData(data))
    }
  })

  socket.on("new-message", (data) => {
    store.dispatch(setNewMessage(data.message, data.sender));
  });
});

export default socket;
