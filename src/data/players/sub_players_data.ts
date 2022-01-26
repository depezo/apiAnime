import { getDataOnDB } from "./lat_players_data";

const cheerio = require('cheerio');
const axios = require('axios').default;
const { gotScraping } = require('got-scraping');

export interface Episode {
    type:String
    url:String
    language:string
}

export async function getSubEpisodes(name:string,episode:number){
    const urlAFX = generateUrlAFX(name,episode);
    const urlJK = await generateUrlJK(name,episode);
    var episodes = await getSubEpisodeAFX(urlAFX);
    var dataJK = await getSubEpisodeJK(urlJK);
    for (var val of dataJK){
        episodes.push(val);
    }
    //console.log(episodes);
    return episodes;
}

function generateUrlAFX(name:string,episode:number){
    var nameAFX = name.replace('.','').replace(', ','-').replace(': ','-').replace(/\s/g,'-').toLowerCase();
    const url = 'https://www.animefenix.com/ver/' + nameAFX + '-' + episode;
    console.log(url);
    return url;
}

async function generateUrlJK(name:string,episode:number){
    var nameJK = name.replace('.','').replace(', ','-').replace(': ','-').replace(/\s/g,'-').toLowerCase();
    const names = await getDataOnDB('sub_es');
    names.map(function(i:any,value:any){
        if (i.includes(name)) {
            if(i.split(',')[0]===name){
                if (i.includes(',')) {
                    nameJK = i.split(',')[1];
                } 
            }            
        }
    });
    const url = 'https://jkanime.net/' + nameJK + '/' + episode;
    return url;
}

async function getSubEpisodeAFX(url:string) {
    var episodes : Episode[] = [];
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const script = $('.player-container > script');
        var tags = [];
        var dataT = String($(script).html()).split('] = "');
        for (var val of dataT) {
            if (val.includes('iframe')) {
                tags.push(val.split('";')[0].trimStart().trimEnd());
            }
        }
        for (var val of tags) {
            const iframe = cheerio.load(val);
            if (!String(iframe('iframe').attr('src')).includes('um2.php')) {
                episodes.push({
                    type:'secondary',
                    url:iframe('iframe').attr('src'),
                    language:'sub_es'
                });
            }
        }
        //console.log(episodes);
        return episodes;
    } catch (error) {
        console.log(error);
        return episodes;
    }
}

async function getSubEpisodeAFLV() {
    try {
        const url = 'https://www3.animeflv.net/ver/komisan-wa-comyushou-desu-1';
        var data = '';
        await gotScraping.get(url).then((body: any) => {
            data = body.body;
        });
        data = data.split('</head>')[1].split('</html>')[0];
        const $ = cheerio.load(data);
        const scripts = $('script');
        var video: String[] = [];
        var dataJson = '';
        scripts.map(function (i: any, value: any) {
            if (String($(value).html()).includes('var videos = {"SUB":')) {
                dataJson = String($(value).html()).split('var videos =')[1].split(';')[0];
            }
        });
        //const json  = JSON.parse(dataJson);
        console.log(dataJson);
        //getPlayers();
    } catch (error) {
        console.log(error);
    }
}

async function getSubEpisodeJK(url:string) {
    var episodes: Episode[] = [];
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const scripts = $('script');
        var video: String[] = [];
        scripts.map(function (i: any, value: any) {
            if (String($(value).html()).includes('var video = [];')) {
                var tags = [];
                var dataT = String($(value).html()).split("] = '");
                for (var val of dataT) {
                    if (val.includes('iframe')) {
                        tags.push(val.split("';")[0].trimStart().trimEnd());
                    }
                }
                for (var val of tags) {
                    const iframe = cheerio.load(val);
                    if (!String(iframe('iframe').attr('src')).includes('um2.php')) {
                        video.push(iframe('iframe').attr('src'));
                    }
                }
            }
        });
        for (var val of video){
            if(val.includes('jk.php') || val.includes('um.php')){
                const dataU = String(await getDirectLink(val));
                if(dataU != ""){
                    episodes.push({
                        type:'primary',
                        url: dataU,
                        language:'sub_es'
                    });
                }                
            }else{
                episodes.push({
                    type:'secondary',
                    url: val,
                    language:'sub_es'
                });
            }
        }
        return episodes;
        //getPlayers();
    } catch (error) {
        console.log(error);
        return episodes;
    }
}

async function getDirectLink(url:String) {
    var urlDirect :String = "";
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data)
        if(url.includes('um.php')){
            const scripts = $('script');
            scripts.map(function(i:any,value:any){
                if(String($(value).html()).includes('var parts = {')){
                    urlDirect = String($(value).html()).split("swarmId: '")[1].split("',")[0];
                }
            });
        }
        return urlDirect;
    } catch (error) {
        console.log(error);
        return urlDirect;
    }
}