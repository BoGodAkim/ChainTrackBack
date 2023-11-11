import * as firebase from 'firebase-admin';

const GOOGLE_APPLICATION_CREDENTIALS = require('/Users/akimbahadziazh/hackathon/otwock-back/otwockalert-firebase-adminsdk-dyn77-11c8782379.json');

export const notificationsProviders = [
  {
    provide: 'FIREBASE',
    useFactory: () => {
      const firebaseCredentials = GOOGLE_APPLICATION_CREDENTIALS; //JSON.parse(GOOGLE_APPLICATION_CREDENTIALS);
      return firebase.initializeApp({
        credential: firebase.credential.cert(firebaseCredentials),
      });
    },
  },
];
