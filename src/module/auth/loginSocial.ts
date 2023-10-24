import authFir from '@react-native-firebase/auth';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import appleAuth from '@invertase/react-native-apple-authentication';
import Store from '@store/store';
import auth from './reducer';

async function facebookLogin() {
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

    if (result.isCancelled) {
        return Promise.reject();
    }

    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
        throw 'Something went wrong obtaining access token';
    }

    // Create a Firebase credential with the AccessToken
    const facebookCredential = authFir.FacebookAuthProvider.credential(data.accessToken);
    Store.dispatch(auth.actions.setLogging(true));

    // Sign-in the user with the credential
    return authFir().signInWithCredential(facebookCredential);
}

async function googleLogin() {
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = authFir.GoogleAuthProvider.credential(idToken);
    Store.dispatch(auth.actions.setLogging(true));
    // // Sign-in the user with the credential
    return authFir().signInWithCredential(googleCredential);
}

async function appleLogin() {
    //Start the sign-in request
    const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });
    Store.dispatch(auth.actions.setLogging(true));
    // Ensure Apple returned a user identityToken
    if (!appleAuthRequestResponse.identityToken) {
        throw 'Apple Sign-In failed - no identify token returned';
    }
    // Create a Firebase credential from the response
    const { identityToken, nonce, fullName } = appleAuthRequestResponse;
    const appleCredential = authFir.AppleAuthProvider.credential(identityToken, nonce);
    // Sign the user in with the credential
    var firebaseCredential = await authFir().signInWithCredential(appleCredential);
    return {
        ...firebaseCredential,
        fullName,
    };
}

export { facebookLogin, googleLogin, appleLogin };
