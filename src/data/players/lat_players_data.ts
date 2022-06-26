import { Episode } from "./sub_players_data";
const cheerio = require('cheerio');
const axios = require('axios').default;
const serviceAccount = require('../../animeapp-a8b2c-firebase-adminsdk-qul5q-c256baff7f.json');
const admin = require('firebase-admin');
const { gotScraping } = require('got-scraping');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://animeapp2test-default-rtdb.firebaseio.com/'
    //databaseURL: 'https://testingproject-6874f-default-rtdb.firebaseio.com'
});
const firestore = admin.firestore();

export async function getLatEpisodes(name: string, episode: number, idAnime: number) {
    var episodes: Episode[] = [];
    try {
        const data = await firestore.collection('last_episodes_uploaded').doc(idAnime.toString()).collection('dub_es').doc(episode.toString()).get();
        if(data.exists){
            episodes = data.get('episodes');
        }else{
            const namesLat = await getDataOnDB("latino");
            var source = '';
            var secondNameAHD = '';
            var nameHej = '';
            var typeHej = '';
            namesLat.map(function (i: any, value: any) {
                if (i.includes(name)) {
                    if (i.includes('#')) {
                        if(i.split('#')[0]===name){
                            source = 'ahd';
                            secondNameAHD = i.split('#')[1];
                        }                    
                    }else if(i.includes(',,')){
                        if(i.split(',,')[0]===name){
                            if(i.includes(';')){
                                typeHej = 'm';
                                source = 'hej';
                                nameHej = i.split(',,;')[1];
                            }else{
                                typeHej = 'e';
                                source = 'hej';
                                nameHej = i.split(',,')[1];
                            }
                        }    
                    }
                }
            });
            if (source == 'ahd' || source == '') {
                const urlAHD = generateUrlAHD(source == 'ahd' ? secondNameAHD : name, episode);
                episodes = await getLatEpisodesAHD(urlAHD);
            }else if(source == 'hej'){
                const urlHEJ = generateUrlHEJ(nameHej, episode,typeHej);
                episodes = await getLatEpisodesHEJ(urlHEJ);
            }
        }
        return episodes;
    } catch (error) {
        console.log(error)
        return episodes;
    }
}

function getPrimaryAndDownload(episodes: Episode[]) {
    try {
        for (const item of episodes){
            switch (item.url){
                case "fireload.com":
                    return getFireloadPrimary(item.url);
            }
        }
    } catch (error) {
        console.log(error);
    }
}

export async function getFireloadPrimary(url: String){
    try {
        const {data} = await axios.get(url);
        const $ = cheerio.load(data);
        const player = $('.fileInfo > .download-timer > btn');
        const urlPrimary = player.attr('href');
        console.log(player);
    } catch (error) {
        console.log(error);
    }
}


function generateUrlAHD(name: string, episode: number) {
    const nameAHD = name.replace('.', '').replace(', ', '-').replace(': ', '-').replace(/\s/g, '-').toLowerCase();
    const url = 'https://www.animelatinohd.com/ver/' + nameAHD + '/' + episode;
    //console.log(url);
    return url;
}

function generateUrlHEJ(name: string, episode: number,type:string) {
    var url = '';
    if(type=='e'){
        url = 'https://henaojara.com/ver/episode/' + name + '-espanol-latino-hd-1x' + episode;
    }else{
        url = 'https://henaojara.com/' + name;
    }
    //console.log(url);
    return url;
}

export async function getDataOnDB(type: string) {
    var data: string[] = [];
    try {
        await admin.database().ref('animes_extra/' + type).once('value').then((snap: any) => snap.val()).then((val: any) => {
            val.map(function (i: any, value: any) {
                //console.log(i);
                data.push(i);
            });
        });
        return data;
    } catch (error) {
        console.log(error);
        return data;
    }
}

async function getLatEpisodesHEJ(url: string) {
    var episodes: Episode[] = [];
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const players = $('.TPlayerTb');
        players.map(function (i: any, value: any) {
            var url = '';
            if (i == 0) {
                url = String($(value).find('iframe').attr('src'));
            } else {
                const iframe = String($(value).html()).replace('&gt;&lt;', '=""><').replace('&gt;', '>').replace('&lt;', '<');
                url = String($(iframe).attr('src')).replace("amp;", "").replace("#038;", "");

            }
            episodes.push({
                type: 'secondary',
                url: url,
                language: 'lat',
                downloable: false,
                type_downloable: "NONE"
            });
        });
        //console.log(episodes);
        return episodes;
    } catch (error) {
        console.log(error);
        return episodes;
    }
}

async function getLatEpisodesAHD(url: string) {
    var episodes: Episode[] = [];
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const dataJson = JSON.parse($('#__NEXT_DATA__').html());
        for (var val of dataJson.props.pageProps.data.players[1]) {
            if (val.languaje == '1') {
                let type_downloable = "NONE";
                let downloable = false;
                if(String(val.code).endsWith('.mp4')){
                    downloable = true;
                    type_downloable = "DIRECT"
                }
                if (String(val.code).includes('od.lk') || String(val.code).includes('animelatinohd-my.sharepoint.com')) {
                    episodes.push({
                        type: 'primary',
                        url: val.code,
                        language: 'lat',
                        downloable: downloable,
                        type_downloable: type_downloable
                    });
                } else {
                    episodes.push({
                        type: 'secondary',
                        url: val.code,
                        language: 'lat',
                        downloable: false,
                        type_downloable: "NONE"
                    });
                }
            }
        }
        return episodes;
    } catch (error) {
        console.log(error);
        return episodes;
    }
}