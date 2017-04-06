import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';
import { Filter } from 'angular-ecmascript/module-helpers';
 
export default class UserPictureFilter extends Filter {
  filter(user) {
    if (!user) return;
 
    let hasPicture = user.profile && user.profile.picture;
 
    return hasPicture ? user.profile.picture : '/user-default.svg';
  };
}
 
UserPictureFilter.$name = 'userPicture';