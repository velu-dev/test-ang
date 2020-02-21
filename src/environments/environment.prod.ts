export const environment = {
  production: true,
  baseUrl: 'https://dev01api.simplexam.com/', //dev

  //authentication
  signIn:'auth/Authentication/signin',
  signUp:'auth/Authentication/signup',
  signupVerify: 'auth/Authentication/signup-verify',
  resetPassword: 'admin-api/admin/reset-admin-password',

  Amplify: {
    Auth: {
      identityPoolId: 'us-west-2:e5dd97f0-5920-4932-bd14-c26fa8f988c0',
      region: 'us-west-2',
      identityPoolRegion: 'us-west-2',
      userPoolId: 'us-west-2_6wyQzuC6i',
      userPoolWebClientId: '264h43856dgphrnp2pn3gakgpc',
      mandatorySignIn: true,
      authenticationFlowType: 'USER_SRP_AUTH',
      cookieStorage: {
        // REQUIRED - Cookie domain (only required if cookieStorage is provided)
        domain: 'dev01app.simplexam.com', //dev server
        // OPTIONAL - Cookie path
        path: '/',
        // OPTIONAL - Cookie expiration in days
        expires: 1,
        // OPTIONAL - Cookie secure flag
        // Either true or false, indicating if the cookie transmission requires a secure protocol (https).
        secure: false
      },
    }
  }
};
