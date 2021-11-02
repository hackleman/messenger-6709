import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
  updateOtherReadData
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

  socket.on("update-read-data", (users) => {
    if (users.recipient === store.getState().user.id) {
      store.dispatch(updateOtherReadData(users))
    }
  })

  socket.on("new-message", (data) => {
    const recipient = store.getState().user.id === data.recipient
    store.dispatch(setNewMessage(data.message, recipient, data.sender));
  });
});

export default socket;
