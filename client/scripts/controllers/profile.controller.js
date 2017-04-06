import { _ } from 'meteor/underscore';
import { MeteorCameraUI } from 'meteor/okland:camera-ui';
import { Controller } from 'angular-ecmascript/module-helpers';
 
export default class ProfileCtrl extends Controller {
  constructor() {
    super(...arguments);
 
    const profile = this.currentUser && this.currentUser.profile;
    this.name = profile ? profile.name : '';
  }

  updatePicture () {
    MeteorCameraUI.getPicture({ width: 60, height: 60 }, (err, data) => {
      if (err) return this.handleError(err);
 
      this.$ionicLoading.show({
        template: 'Updating picture...'
      });
 
      this.callMethod('updatePicture', data, (err) => {
        this.$ionicLoading.hide();
        this.handleError(err);
      });
    });
  }

  updateImageURL() {
    const promptPopup = this.$ionicPopup.prompt({
      title: 'Update Image',
      template: 'Past Image URL',
      okType: 'button-positive button-clear'
    });

    promptPopup.then((res) => {
      if (!res) return;

      this.callMethod('updatePicture', res);
    });
  }  
 
  updateName() {
    if (_.isEmpty(this.name)) return;
 
    this.callMethod('updateName', this.name, (err) => {
      if (err) return this.handleError(err);
      this.$state.go('tab.chats');
    });
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
}
 
ProfileCtrl.$name = 'ProfileCtrl';
ProfileCtrl.$inject = ['$state', '$ionicLoading', '$ionicPopup', '$log'];