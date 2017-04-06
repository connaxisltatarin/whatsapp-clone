import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Chats, Messages } from '../lib/collections';
 
Meteor.methods({
  newMessage(message) {
    if (!this.userId) {
      throw new Meteor.Error('not-logged-in',
        'Must be logged in to send message.');
    }

    check(message, Match.OneOf(
      {
        text: String,
        type: String,
        chatId: String
      },
      {
        picture: String,
        type: String,
        chatId: String
      }
    ));    

    message.timestamp = new Date();
    message.userId = this.userId;
 
    const messageId = Messages.insert(message);

    message._id = messageId;
    Chats.update(message.chatId, { $set: { lastMessage: message } });
 
    return messageId;
  },

  lastReadMessage(message) {
    if (!this.userId) {
      throw new Meteor.Error('not-logged-in',
        'Must be logged in to send message.');
    }

    let chat = Chats.findOne(message.chatId);
    let otherUserId = _.without(chat.userIds, this.userId)[0];
    let lastOtherReadMessage = chat["lastReadMessage_" + otherUserId];

    let conditions = { chatId: message.chatId, userId: this.userId };

    if (lastOtherReadMessage) {
      conditions["timestamp"] = {$gt: lastOtherReadMessage.timestamp};
    } 

    let unreadMessagesCount = Messages.find(conditions).count();

    var set = {};
    set["lastReadMessage_" + this.userId] = {_id: message._id, timestamp: message.timestamp};
    set["unreadMessagesCount_" + this.userId] = 0;
    set["unreadMessagesCount_" + otherUserId] = unreadMessagesCount;
    Chats.update(message.chatId, { $set: set });
  },  

  updateName(name) {
    if (!this.userId) {
      throw new Meteor.Error('not-logged-in',
        'Must be logged in to update his name.');
    }
 
    check(name, String);
 
    if (name.length === 0) {
      throw Meteor.Error('name-required', 'Must provide a user name');
    }
 
    return Meteor.users.update(this.userId, { $set: { 'profile.name': name } });
  },

  newChat(otherId) {
    if (!this.userId) {
      throw new Meteor.Error('not-logged-in',
        'Must be logged to create a chat.');
    }
 
    check(otherId, String);
    const otherUser = Meteor.users.findOne(otherId);
 
    if (!otherUser) {
      throw new Meteor.Error('user-not-exists',
        'Chat\'s user not exists');
    }
 
    const chat = {
      userIds: [this.userId, otherId],
      createdAt: new Date()
    };
 
    const chatId = Chats.insert(chat);
 
    return chatId;
  },

  removeChat(chatId) {
    if (!this.userId) {
      throw new Meteor.Error('not-logged-in',
        'Must be logged to remove a chat.');
    }
 
    check(chatId, String);
 
    const chat = Chats.findOne(chatId);
 
    if (!chat || !_.include(chat.userIds, this.userId)) {
      throw new Meteor.Error('chat-not-exists',
        'Chat not exists');
    }
 
    Messages.remove({ chatId: chatId });
 
    return Chats.remove({ _id: chatId });
  },

  updatePicture(data) {
    if (!this.userId) {
      throw new Meteor.Error('not-logged-in',
        'Must be logged in to update his picture.');
    }
 
    check(data, String);
 
    return Meteor.users.update(this.userId, { $set: { 'profile.picture': data } });
  },

  logToConsole: function(msg) {
    console.log(msg)
  }
});