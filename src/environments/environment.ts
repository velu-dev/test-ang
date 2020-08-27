// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
export const environment = {
  production: false,

   baseUrl: 'https://dev01api.simplexam.com/', //Dev
  //  baseUrl: 'https://tst01api.simplexam.com/', //Test
  // baseUrl: 'http://192.168.1.231:3000/', //Natarajan-local
  // baseUrl: 'http://192.168.1.122:3000/', //Rajan-local
  // baseUrl: 'http://localhost:3000/', //local

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
        domain: 'localhost', // GLobal local IP
        // domain: 'd2re2whflovy37.cloudfront.net', //dev server
        // domain: '192.168.1.208', // Velu's IP
        // domain: '192.168.1.100', // Venkatesan Mariyappan's IP
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

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
