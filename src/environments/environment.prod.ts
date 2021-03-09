export const environment = {
  production: true,
  baseUrl: 'https://dev01api.simplexam.com/', //dev
  searchUrl: 'https://dev01esapi.simplexam.com/elastic/search',
  cookieSecure : true,
  smartyStreetsAPIKey: 74714131260891451,
  Amplify: {
    Auth: {
      identityPoolId: 'us-west-2:e5dd97f0-5920-4932-bd14-c26fa8f988c0',
      region: 'us-west-2',
      identityPoolRegion: 'us-west-2',
      userPoolId: 'us-west-2_sfn3xuu3h',
      userPoolWebClientId: '7gogn57qok12n2qpid9vo43107',
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
        secure: true
      },
    }
  }
};
