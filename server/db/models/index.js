const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");
const UsersConversations = require("./usersConversations");

// associations

User.hasMany(Conversation);
User.belongsToMany(Conversation, { through: UsersConversations});
Conversation.belongsToMany(User, { through: UsersConversations});
Conversation.belongsTo(User, { as: "user1" });
Conversation.belongsTo(User, { as: "user2" });

Message.belongsTo(Conversation);
Conversation.hasMany(Message);

module.exports = {
  User,
  Conversation,
  Message
};
