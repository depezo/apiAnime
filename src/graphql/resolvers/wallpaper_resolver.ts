import { getTagsByString } from "../../data/wallpaper/tag";
import { addNewWallpaper, getSectionWallpaper, getSectionsWallpaperHome, getTopWeekWallpapers } from "../../data/wallpaper/wallpaper";

const wallpaperResolver = {
    Query: {
        getTagsByString(root:void, args:any){
            return getTagsByString(args.input);
        },
        getTopWeekWallpapers(root: void, args: any){
            return getTopWeekWallpapers();
        },
        getSectionsWallpaperHome(root: void, args: any){
            return getSectionsWallpaperHome();
        },
        getSectionWallpaper(root: void, args: any){
            return getSectionWallpaper(args.query,args.userId);
        }
    },
    Mutation: {
        addNewWallpaper(root:void, args: any){
            return addNewWallpaper(args.wallpaper);
        }
    }
}

export default wallpaperResolver;