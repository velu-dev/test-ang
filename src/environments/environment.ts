// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
export const environment = {
  production: false,

  baseUrl: 'http://192.168.1.231:3000/', //natarajan

  //authentication
  signUp:'signUp',

  Amplify: {
    Auth: {
      identityPoolId: 'us-west-2:e5dd97f0-5920-4932-bd14-c26fa8f988c0',
      region: 'us-west-2',
      identityPoolRegion: 'us-west-2',
      userPoolId: 'us-west-2_nH46VcXfj',
      userPoolWebClientId: '87eqflc6acglihb7bipvgnrlj',
      mandatorySignIn: true,
      authenticationFlowType: 'USER_SRP_AUTH',
      cookieStorage: {
        // REQUIRED - Cookie domain (only required if cookieStorage is provided)
            domain: 'localhost',
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
