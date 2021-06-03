export const environment = {
  production: true,
  baseUrl: 'https://pd01api.simplexam.com/', //pd
  searchUrl: 'https://pd01esapi.simplexam.com/elastic/search',
  cookieSecure : true,
  smartyStreetsAPIKey: "75184436999002492",
  Amplify: {
    Auth: {
      identityPoolId: 'us-west-2:5fb1a6ae-6ac6-42d4-bb16-cd142debe7b9',
      region: 'us-west-2',
      identityPoolRegion: 'us-west-2',
      userPoolId: 'us-west-2_aQ0qNXHJW',
      userPoolWebClientId: '1r37muhb5fv6l74rpnrh269ds3',
      mandatorySignIn: true,
      authenticationFlowType: 'USER_SRP_AUTH',
      cookieStorage: {
        // REQUIRED - Cookie domain (only required if cookieStorage is provided)
        domain: 'pd01app.simplexam.com', //pd server
        // OPTIONAL - Cookie path
        path: '/',
        // OPTIONAL - Cookie expiration in days
        expires: 1,
        // OPTIONAL - Cookie secure flag
        // Either true or false, indicating if the cookie transmission requires a secure protocol (https).
        secure: true
      },
    }
  }
};
