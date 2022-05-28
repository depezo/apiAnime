import { DataSnapshot } from "firebase-functions/v1/database";

const admin = require('firebase-admin');
const serviceAccount = require('../../animeapp-a8b2c-firebase-adminsdk-qul5q-c256baff7f.json');

var firestore = admin.firestore();
var realtime = admin.database();
firestore.settings({ ignoreUndefinedProperties: true })

/*admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://animeapp2test-default-rtdb.firebaseio.com/'
});*/

export async function migrateTest(){
    var migrate = "";
    await realtime.ref('users').get().then((snapshot: DataSnapshot) => {
        if(snapshot.exists()){
            snapshot.forEach((value: DataSnapshot) =>{
                console.log('adding ' + value.key)
                firestore.collection('users').doc(value.key).set({
                    email: value.val().email,
                    username: value.val().username,
                    url_photo: value.val().url_photo
                });
                if(value.child('animes_fav').val() != null){
                    value.child('animes_fav').val().forEach(async (e: any) =>{
                        await firestore.collection('users').doc(value.key).collection('animes_fav').add(e);
                    }); 
                }
                if(value.child('last_anime').val() != null){
                    value.child('last_anime').val().forEach(async (e: any) =>{
                        await firestore.collection('users').doc(value.key).collection('last_anime').add(e);
                    });
                }
                if(value.child('episodes_watched').hasChildren()){ 
                    value.child('episodes_watched').forEach((e: DataSnapshot) =>{
                        firestore.collection('users').doc(value.key).collection('episodes_watched').doc(e.key).set({
                            episodes: e.val()
                        });
                    }); 
                }                               
            });
            migrate = "migrated";
        }else{
            migrate = "no data to migrate";
            console.log("No data.");
        }
    }).catch((error:any) => {
        migrate = "fail migrated";
        console.log(error);
    });
    return migrate;
}

//********* MIGRATE USERS **********//
/* await realtime.ref('users').get().then((snapshot: DataSnapshot) => {
        if(snapshot.exists()){
            snapshot.forEach((value: DataSnapshot) =>{
                console.log('adding ' + value.key)
                firestore.collection('users').doc(value.key).set({
                    email: value.val().email,
                    username: value.val().username,
                    url_photo: value.val().url_photo
                });
                if(value.child('animes_fav').val() != null){
                    value.child('animes_fav').val().forEach(async (e: any) =>{
                        await firestore.collection('users').doc(value.key).collection('animes_fav').add(e);
                    }); 
                }
                if(value.child('last_anime').val() != null){
                    value.child('last_anime').val().forEach(async (e: any) =>{
                        await firestore.collection('users').doc(value.key).collection('last_anime').add(e);
                    });
                }
                if(value.child('episodes_watched').hasChildren()){
                    value.child('episodes_watched').forEach((e: DataSnapshot) =>{
                        firestore.collection('users').doc(value.key).collection('episodes_watched').doc(e.key).set({
                            episodes: e.val()
                        });
                    }); 
                }                               
            });
            migrate = "migrated";
        }else{
            migrate = "no data to migrate";
            console.log("No data.");
        }
    }).catch((error:any) => {
        migrate = "fail migrated";
        console.log(error);
    });*/

//********* MIGRATE COMMENTS **********//

/* 
await realtime.ref('anime').get().then(async (snapshot: DataSnapshot) => {
        if(snapshot.exists()){
            snapshot.forEach((value:DataSnapshot) => {
                console.log(value.child('comments').val(), value.key);
                value.child('comments').val().forEach(async (element: any) => {
                    await firestore.collection('anime').doc(value.key).collection('comments').add(element);
                });
            });
            migrate = "migrated";
        }else{
            migrate = "no data to migrate";
            console.log("No data.");
        }
    }).catch((error:any) => {
        migrate = "fail migrated";
        console.log(error);
    });
*/


//********* MIGRATE GENRES **********//
/*realtime.ref('genres').get().then((snapshot: any) => {
        if(snapshot.exists()){
            snapshot.val().forEach(async (element:any) => {
                console.log(element.id);
                await firestore.collection('genres').doc(element.id.toString()).set(element);
            });
            migrate = "migrated";
        }else{
            migrate = "no data to migrate";
            console.log("No data.");
        }
    }).catch((error:any) => {
        migrate = "fail migrated";
        console.log(error);
    });*/


