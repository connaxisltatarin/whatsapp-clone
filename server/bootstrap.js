import Moment from 'moment';
import { Chats, Messages } from '../lib/collections';
import { Accounts } from 'meteor/accounts-base';

Meteor.startup(function() {
    if (Meteor.users.find().count() != 0) return;

    Accounts.createUserWithPhone({
      phone: '987654321',
      profile: {
        name: 'Gonza'
      }
    });
});