import {
  CognitoUserPool,
  CognitoUserAttribute,
  CognitoUser,
  AuthenticationDetails,
} from 'amazon-cognito-identity-js';
import appConfig from './config';

export default {
  signup(username, email, password) {
    const poolData = {
      UserPoolId: appConfig.UserPoolId,
      ClientId: appConfig.UserPoolClientId,
    };
    const userPool = new CognitoUserPool(poolData);
    const attributeList = [];
    const dataEmail = {
      Name: 'email',
      Value: email,
    };
    const attributeEmail = new CognitoUserAttribute(dataEmail);
    attributeList.push(attributeEmail);
    return new Promise((resolve, reject) => {
      userPool.signUp(username, password, attributeList, null,
        (err, result) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            console.log(`username is ${result.user
              .getUsername()}`);
            resolve(result);
          }
        });
    });
  },
  confirm(username, confirmation_number) {
    const _this = this;
    const poolData = {
      UserPoolId: appConfig.UserPoolId,
      ClientId: appConfig.UserPoolClientId,
    };
    const userPool = new CognitoUserPool(poolData);
    const userData = {
      Username: username,
      Pool: userPool,
    };
    const cognitoUser = new CognitoUser(userData);
    return new Promise((resolve, reject) => {
      cognitoUser.confirmRegistration(confirmation_number,
        true, (err, result) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            console.log(`call result: ${result}`);
            _this.onChange(true);
            resolve(result);
          }
        });
    });
  },
  authenticate(email, password) {
    const _this = this;
    const authenticationData = {
      Username: email,
      Password: password,
    };
    const authenticationDetails = new AuthenticationDetails(authenticationData);
    const poolData = {
      UserPoolId: appConfig.UserPoolId,
      ClientId: appConfig.UserPoolClientId,
    };
    const userPool = new CognitoUserPool(poolData);
    const userData = {
      Username: email,
      Pool: userPool,
    };
    const cognitoUser = new CognitoUser(userData);
    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess(result) {
          console.log(`access token + ${result
            .getAccessToken().getJwtToken()}`);
          console.log(`idToken + ${result.idToken
            .jwtToken}`);
          console.log('Successfully logged in !');
          _this.onChange(true);
          resolve(result);
        },
        onFailure(err) {
          console.log(err);
          _this.onChange(false);
          reject(err);
        },
        newPasswordRequired() {
          const attributesData = {
            name: email,
          };
          cognitoUser.completeNewPasswordChallenge('Password1', attributesData, this);
        },
      });
    });
  },
  loggedIn() {
    const poolData = {
      UserPoolId: appConfig.UserPoolId,
      ClientId: appConfig.UserPoolClientId,
    };
    const userPool = new CognitoUserPool(poolData);
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser != null) {
      cognitoUser.getSession((err, session) => {
        if (err) {
          console.log(err);
          return false;
        }
        console.log(`session validity: ${session.isValid()}`);
        cognitoUser.getUserAttributes((attributes) => {
          if (err) {
            console.log(err);
            return false;
          }
          for (let i = 0; i < attributes.length; i += 1) {
            if (attributes[i].getName() === 'email') {
              console.log(`login user is ${
                attributes[i].getValue()}`);
            }
          }
        });
      });
      return true;
    }
    return false;
  },
  logout() {
    const poolData = {
      UserPoolId: appConfig.UserPoolId,
      ClientId: appConfig.UserPoolClientId,
    };
    const userPool = new CognitoUserPool(poolData);
    userPool.getCurrentUser().signOut();
    this.onChange(false);
    console.log('Successfully logged out.');
  },
  get_id_token() {
    const poolData = {
      UserPoolId: appConfig.UserPoolId,
      ClientId: appConfig.UserPoolClientId,
    };
    const userPool = new CognitoUserPool(poolData);
    const cognitoUser = userPool.getCurrentUser();
    let id_token = '';
    cognitoUser.getSession((err, result) => {
      id_token = result.getIdToken().getJwtToken();
    });
    return id_token;
  },
  onChange() { },
};
