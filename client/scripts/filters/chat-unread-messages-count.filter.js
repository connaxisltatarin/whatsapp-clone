import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';
import { Filter } from 'angular-ecmascript/module-helpers';
 
export default class ChatUnreadMessagesCountFilter extends Filter {
  filter(chat) {
    if (!chat) return;

    const field = "unreadMessagesCount_" + Meteor.userId();
    return chat[field];
  }
}
 
ChatUnreadMessagesCountFilter.$name = 'chatUnreadMessagesCount';