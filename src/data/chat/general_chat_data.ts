import { UserData } from "../user/user_data";

const admin = require('firebase-admin');
const firestore = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

export async function sendMessage(message: String, user: UserData){
    let status = "";
    try {
        await firestore.collection('chat').doc('general').collection('messages').add({
            message: message,
            user: user,
            timestamp: FieldValue.serverTimestamp()
        });
        status = "OK"
    } catch (error) {
        console.log(error);
    }
}