import Ionic from 'ionic-scripts';
import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';
import { MeteorCameraUI } from 'meteor/okland:camera-ui';
import { Controller } from 'angular-ecmascript/module-helpers';
import { Chats, Messages } from '../../../lib/collections';

export default class ChatCtrl extends Controller {
  constructor() {
    super(...arguments);
 
    this.chatId = this.$stateParams.chatId;
    this.isIOS = Ionic.Platform.isWebView() && Ionic.Platform.isIOS();
    this.isCordova = Meteor.isCordova;    
 
    this.helpers({
      messages() {
        return Messages.find({ chatId: this.chatId });
      },        
      data() {
        return Chats.findOne(this.chatId);
      }
    });

    this.autoScroll();
  }

  sendPicture() {
    MeteorCameraUI.getPicture({}, (err, data) => {
      if (err) return this.handleError(err);
 
      this.callMethod('newMessage', {
        picture: data,
        type: 'picture',
        chatId: this.chatId
      });
    });
  }

  sendImageURL() {
    const promptPopup = this.$ionicPopup.prompt({
      title: 'Send Image',
      template: 'Past Image URL',
      okType: 'button-positive button-clear'
    });

    promptPopup.then((res) => {
      if (!res) return;

      this.callMethod('newMessage', {
        picture: res,
        type: 'picture',
        chatId: this.chatId
      });      
    });
  }

  sendMessage() {
    if (_.isEmpty(this.message)) return;
 
    this.callMethod('newMessage', {
      text: this.message,
      type: 'text',
      chatId: this.chatId
    });
 
    delete this.message;    
  }

  handleError(err) {
    if (err.error == 'cancel') return;
    this.$log.error('Profile save error ', err);
 
    this.$ionicPopup.alert({
      title: err.reason || 'Save failed',
      template: 'Please try again',
      okType: 'button-positive button-clear'
    });
  }  

  autoScroll() {
    let recentMessagesNum = this.messages.length;
    
    this.autorun(() => {
      const currMessagesNum = this.getCollectionReactively('messages').length;
      console.log(currMessagesNum);
      const animate = recentMessagesNum != currMessagesNum;
      recentMessagesNum = currMessagesNum;

      if(currMessagesNum){
        this.callMethod('lastReadMessage', this.getCollectionReactively('messages')[currMessagesNum-1]);
      }

      this.scrollBottom(animate);
    });
  }

  inputUp () {
    if (this.isIOS) {
      this.keyboardHeight = 216;
    }

    this.scrollBottom(true);
  }

  inputDown () {
    if (this.isIOS) {
      this.keyboardHeight = 0;
    }

    this.$ionicScrollDelegate.$getByHandle('chatScroll').resize();
  }

  closeKeyboard () {
    if (this.isCordova) {
      cordova.plugins.Keyboard.close();
    }
  }

  scrollBottom(animate) {
    this.$timeout(() => {
      this.$ionicScrollDelegate.$getByHandle('chatScroll').scrollBottom(animate);
    }, 300);
  }  
}
 
ChatCtrl.$name = 'ChatCtrl';
ChatCtrl.$inject = ['$stateParams', '$timeout', '$ionicScrollDelegate', '$ionicPopup', '$log'];