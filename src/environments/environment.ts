// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  Amplify: {
    Auth: {
      identityPoolId: "us-west-2:e5dd97f0-5920-4932-bd14-c26fa8f988c0",
      region: "us-west-2",
      identityPoolRegion: "us-west-2",
      userPoolId: "us-west-2_4NfuUmY7O",
      userPoolWebClientId: "28ualvkodspj8haps15rogik79",
      //userPoolWebClientIdSecret:'1ohn1ja654cb1eh6bbbgv2h3q9leipv3m023qabrf0fslgkk9lvi',
      mandatorySignIn: true,
      authenticationFlowType: "USER_SRP_AUTH"
      
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
