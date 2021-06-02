// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
export const environment = {
  production: false,

  baseUrl: 'https://pd01api.simplexam.com/', //Dev
  //  baseUrl: 'https://tst01api.simplexam.com/', //Test
  // baseUrl: 'http://192.168.1.231:3000/', //Natarajan-local
  // baseUrl: 'http://192.168.1.122:3000/', //Rajan-local
  // baseUrl: 'http://localhost:3000/', //local
  smartyStreetsAPIKey: "75184436999002492",
  searchUrl: 'https://dev01esapi.simplexam.com/elastic/search',
  cookieSecure: false,

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
