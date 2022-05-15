const admin = require('firebase-admin');
const serviceAccount = require('../../animeapp-a8b2c-firebase-adminsdk-qul5q-c256baff7f.json');

var firestore = admin.firestore();

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://animeapp2test-default-rtdb.firebaseio.com/'
});