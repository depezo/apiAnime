import { DocumentSnapshot } from "firebase-functions/v1/firestore";
import { Tag } from "./tag";

const admin = require('firebase-admin');
const firestore = admin.firestore();
const wallpaperReference = firestore.collection('extra_features').doc('wallpapers_base');
const FieldValue = admin.firestore.FieldValue;

interface Wallpaper {
    id: String,
    title: String,
    url_img: String,
    url_storage: String,
    likes: String[],
    dislikes: String[],
    tags: Tag[],
    user: String,
    by_search_count: number,
    by_downloads_count: number,
    collections: String[],
    width: number,
    height: number,
    typeResolution: TypeResolution,
    status: String
}

enum TypeResolution {
    HD,
    FHD,
    QHD,
    UHD
}

interface Section {
    description: String,
    position: number,
    type: String,
    query: String
}

export async function getSectionWallpaper(query: String, userId: String){
    if(userId != 'null'){
        console.log(userId)
    }
    let items: Wallpaper[] = [];
    switch (query){
        case "getMostPopularTag":
            await getMostPopularTag().then((values: Wallpaper[]) => {
                items = values;
            });
            break;
    }
    return items
}

async function getMostPopularTag(){
    const wallpaper: Wallpaper[] = [];
    try {
        const snapshotWalls = await wallpaperReference.collection('wallpapers').limit(10).get();
        snapshotWalls.forEach((doc:any) => {
            wallpaper.push(doc.data());
        })
    } catch (error) {
        console.log(error);
    }
    return wallpaper;
}

export async function getSectionsWallpaperHome(){
    const sections: Section[] = [];
    try {
        const snapshot = await wallpaperReference.collection('sections').get();
        snapshot.forEach((doc: any) => {
            sections.push(doc.data());
        });
    } catch (error) {
        console.log(error);
    }
    return sections;
}

export async function getTopWeekWallpapers() {
    const wallpapers: Wallpaper[] = [];
    try {
        const snapshot = await wallpaperReference.collection('wallpapers').where('status', '==', 'approved').orderBy('by_search_count','desc').limit(10).get();
        snapshot.forEach((doc: any) => {
            wallpapers.push(doc.data());
        });
    } catch (error) {
        console.log(error);
    }
    return wallpapers;
}

export async function addNewWallpaper(wallpaper: Wallpaper) {
    let status = 'FAIL';
    try {
        const document = wallpaperReference.collection('wallpapers').doc();
        for (let i = 0; i < wallpaper.tags.length; i++) {
            const tagName = wallpaper.tags[i].description.toLowerCase();
            wallpaper.tags[i].description = tagName;
            await wallpaperReference.collection('tags').doc(tagName).set({
                wallpaper_count: FieldValue.increment(1),
                description: tagName,
                id: tagName
            }, { merge: true })
        }
        await wallpaperReference.collection('wallpapers').doc(document.id).set({
            id: document.id,
            title: wallpaper.title,
            url_img: wallpaper.url_img,
            url_storage: wallpaper.url_storage,
            tags: wallpaper.tags,
            user: wallpaper.user,
            width: wallpaper.width,
            height: wallpaper.height,
            typeResolution: wallpaper.typeResolution,
            by_search_count: 0,
            by_downloads_count: 0,
            status: 'approved'
        });
        status = 'OK';
    } catch (error) {
        console.log(error);
    }
    return status;
}