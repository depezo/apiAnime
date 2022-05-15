import { getDataOnDB } from "../players/lat_players_data";
import { Genre } from "./genres_data";
import { Producer, ShortProducer } from "./producer_data";
const translate = require('translate');
const cheerio = require('cheerio');
const axios = require('axios').default;

interface Anime {
    id: number
    title: string
    url_img: string
    synopsis: string
    score: number
    episodes: number
    synonyms: string
    type: string
    status: boolean
    broadcast: string
    source: string
    aired: Aired
    genres: Genre[]
    duration: string
    rating: string
    url_video: string
    url_characters: string
    studio: ShortProducer
    external_links: ExternalLink[]
    related_anime: RelatedAnime[]
    recommendations: Recommendation[]
}

interface Aired {
    from: Date
    to: Date
}

interface RelatedAnime {
    id: number
    type: String
    title: String
    url_page: String
}

interface Date {
    day: number,
    month: number,
    year: number
}

interface Picture {
    url_short: String
    url_large: String
}

interface ExternalLink {
    name: string
    url: string
}

interface Recommendation {
    id: number
    title: string
    url_page: string
    url_img: string
}

export interface TinyAnime {
    id: number
    title: String
    url_img: String
    url_page: String
}

export async function getPictures(url: string) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const dataU = $('.js-scrollfix-bottom-rel > table > tbody > tr > td');
        var pictures: Picture[] = [];
        dataU.map(function (i: any, value: any) {
            if ($(value).find('.picSurround > a').attr('href') != null) {
                const url_short = $(value).find('.picSurround > a > img').attr('data-src');
                const url_large = $(value).find('.picSurround > a').attr('href');
                pictures.push({
                    url_short,
                    url_large
                });
            }
        });
        return pictures;
    } catch (error) {
        console.log(error);
    }
}

export async function getAnimeData(idA: number,hentai_status: boolean) {
    try {
        const uri = 'https://myanimelist.net/anime/' + idA;
        const { data } = await axios.get(uri);
        const $ = cheerio.load(data);
        const id = idA;
        const url_img = $(".borderClass > div > div > a > img").attr("data-src");
        const title = $(".h1-title > div > h1 > strong").text();
        const synopsisNT = String($("#content > table > tbody > tr > td > .js-scrollfix-bottom-rel > table > tbody > tr > td > p").text()).replace('[Written by MAL Rewrite]', '');
        var score = 0.0;
        if (String($(".score-label").html()).trim() != 'N/A') {
            score = Number(String($(".score-label").html()).trim());
        }
        const dataE = $(".borderClass > div > .spaceit_pad");
        const url_video = $(".video-promotion > a").attr("href");
        const dataRA = $('.anime_detail_related_anime > tbody > tr');
        const dataR = $('#anime_recommendation > .anime-slide-outer > ul > li');
        var synonyms = "";
        var type = "";
        var status = false;
        var episodes = 0;
        var broadcast = "";
        var source = "";
        var duration = "";
        var rating = "";
        var genres: Genre[] = [];
        var external_links: ExternalLink[] = [];
        var related_anime: RelatedAnime[] = [];
        var recommendations: Recommendation[] = [];
        var typeRA = "";
        var titleRA = "";
        var url_pageRA = "";
        var idR = 0;
        var titleR = "";
        var url_pageR = "";
        const dataUC = $('.pb24 > div > .floatRightHeader');
        var url_characters = '';
        var url_imgR = ""
        dataUC.map(function (i: any, value: any) {
            if (String($(value).text()).includes('More characters')) {
                url_characters = 'https://myanimelist.net/' + $(value).find('a').attr('href');
            }
        });
        dataR.map(function (i: any, value: any) {
            if (String($(value).find('a').attr('href')).includes('recommendations')) {
                idR = Number(String($(value).find('a').attr('href')).split('/anime/')[1].replace(idA.toString(), '').replace('-', ''));
            } else {
                idR = Number(String($(value).find('a').attr('href')).split('/anime/')[1].split('/')[0]);
            }
            url_imgR = String($(value).find('a > img').attr('data-src')).replace('r/90x140/', '')
            titleR = $(value).attr('title');
            url_pageR = 'https://myanimelist.net/anime/' + idR;
            recommendations.push({
                id: idR,
                title: titleR,
                url_page: url_pageR,
                url_img: url_imgR
            });
        });
        dataRA.map(function (i: any, value: any) {
            typeRA = String($(value).find('.ar').text()).replace(':', '');
            titleRA = $(value).find('.borderClass > a').text();
            url_pageRA = 'https://myanimelist.net' + $(value).find('.borderClass > a').attr('href');
            var idRA = 0
            if (url_pageRA.includes('/anime/')) {
                idRA = Number(url_pageRA.split('/anime/')[1].split('/')[0])
            }
            related_anime.push({
                id: idRA, type: typeRA, title: titleRA, url_page: url_pageRA
            });
        });
        const dataEL = $(".borderClass > div > .pb16 > a");
        dataEL.map(function (i: any, value: any) {
            const name = $(value).html();
            const url = $(value).attr('href');
            external_links.push({ name, url });
        });
        var from: Date = { day: 0, month: 0, year: 0 };
        var to: Date = { day: 0, month: 0, year: 0 };
        var studio: ShortProducer = { id: 0, description: "" }
        dataE.map(function (i: any, value: any) {
            if (String($(value).text()).includes('Episodes')) {
                if (String($(value).text()).split('\n')[2].trim() != "Unknown") {
                    episodes = Number(String($(value).text()).split('\n')[2].trim());
                }
            } else if (String($(value).text()).includes('Synonyms')) {
                synonyms = String($(value).text()).replace('Synonyms:', '').trimStart().trimEnd();
            } else if (String($(value).text()).includes('Studios')) {
                if (!String($(value).text()).includes('None found')) {
                    studio.id = Number(String($(value).find('a').attr('href')).split('/producer/')[1].split('/')[0]);
                    studio.description = String($(value).find('a').attr('title'));
                }
            }
            else if (String($(value).text()).includes('Type')) {
                type = $(value).find('a').html();
            } else if (String($(value).text()).includes('Status')) {
                if (String($(value).text()).replace('Status:', '').trimStart().trimEnd().includes('Currently Airing')) {
                    status = true;
                }
            } else if (String($(value).text()).includes('Broadcast')) {
                broadcast = String($(value).text()).replace('Broadcast:', '').trimStart().trimEnd();
            } else if (String($(value).text()).includes('Source')) {
                source = String($(value).text()).replace('Source:', '').trimStart().trimEnd();
            } else if (String($(value).text()).includes('Genre') || String($(value).text()).includes('Theme') || String($(value).text()).includes('Demographic')) {
                const secondData = $(value).find("a");
                secondData.map(function (i: any, te: any) {
                    const id = Number(String($(te).attr("href")).split("/")[3]);
                    const description = $(te).text();
                    genres.push({ id, description });
                });
            } else if (String($(value).text()).includes('Duration')) {
                duration = String($(value).text()).replace('Duration:', '').trimStart().trimEnd();
            } else if (String($(value).text()).includes('Rating')) {
                rating = String($(value).text()).replace('Rating:', '').split('-')[0].trimStart().trimEnd();
            } else if (String($(value).text()).includes('Aired')) {
                const aired = String($(value).text()).replace('Aired:', '').trimEnd().trimStart();
                if (!aired.includes('Not available')) {
                    var fromData = "";
                    var toData = "";
                    if (aired.includes(' to ')) {
                        toData = aired.split(' to ')[1].replace(',', '');
                        if (!toData.includes('?')) {
                            const dataD = toData.split(' ');
                            const month = getNumberMonth(dataD[0]);
                            const day = Number(dataD[1]);
                            const year = Number(dataD[2]);
                            to.day = day;
                            to.month = month;
                            to.year = year;
                        }
                        fromData = aired.split(' to ')[0].replace(',', '');
                        if (!fromData.includes('?')) {
                            const dataD = fromData.split(' ');
                            const month = getNumberMonth(dataD[0]);
                            var day = 0;
                            if(Number(dataD[1])<=31){
                                day = Number(dataD[1]);
                            }
                            const year = Number(dataD[2]);
                            from.day = day;
                            from.month = month;
                            from.year = year;
                        }
                    } else {
                        fromData = aired.split(' to ')[0].replace(',', '');
                        if (!fromData.includes('?')) {
                            const dataD = fromData.split(' ');
                            const month = getNumberMonth(dataD[0]);
                            const day = Number(dataD[1]);
                            const year = Number(dataD[2]);
                            from.day = day;
                            from.month = month;
                            from.year = year;
                        }
                    }
                }
            }
        });
        if (episodes == 0) {
            if(hentai_status){
                episodes = await getCountHEpisodes(title);
            }else{
                episodes = await getCountEpisodes(title);
            }            
        }
        const aired: Aired = { from, to };
        var synopsis = await translate(synopsisNT, "es");
        const anime: Anime = { id, title, url_img, synopsis, score, episodes, synonyms, type, status, broadcast, source, genres, duration, rating, url_video, studio, external_links, related_anime, recommendations, aired, url_characters };
        return anime;
    } catch (error) {
        console.log(error);
    }
}

async function getCountHEpisodes(title: string){
    var episodes = 0;
    try {
        var name = title.replace('.','').replace(', ','-').replace(': ','-').replace(/\s/g,'-').replace('!','').toLowerCase();
        const names = await getDataOnDB('hentai');
        names.map(function (i: any, value: any) {
            if (i.includes(title)) {
                if (i.split(',,')[0] === title) {
                    if (i.includes(',,')) {
                        name = i.split(',,')[1];
                    }
                }
            }
        });
        const url = 'https://hentaila.com/hentai-' + name;
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const count = $('.episodes-list > article');
        count.map(function(i:any,value:any){
            episodes++;
        });
        return episodes;
    } catch (error) {
        console.log(error);
        return episodes;
    }
}

async function getCountEpisodes(name: string) {
    try {
        var episodes = 0;
        var nameJK = name.replace('.', '').replace(', ', '-').replace(': ', '-').replace(/\s/g, '-').toLowerCase();
        const names = await getDataOnDB('sub_es');
        names.map(function (i: any, value: any) {
            if (i.includes(name)) {
                if (i.split(',')[0] === name) {
                    if (i.includes(',')) {
                        nameJK = i.split(',')[1];
                    }
                }
            }
        });
        const url = "https://jkanime.net/" + nameJK;
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const dataNumbers = $('.anime__pagination > .numbers');
        dataNumbers.map(function (i: any, value: any) {
            episodes = Number(String($(value).text()).split(' - ')[1])
        });
        return episodes;
    } catch (error) {
        return 0;
    }
}

function getNumberMonth(dayR: string) {
    var day = 0;
    switch (dayR) {
        case 'Jan':
            day = 1;
            break;
        case 'Feb':
            day = 2;
            break;
        case 'Mar':
            day = 3;
            break;
        case 'Apr':
            day = 4;
            break;
        case 'May':
            day = 5;
            break;
        case 'Jun':
            day = 6;
            break;
        case 'Jul':
            day = 7;
            break;
        case 'Aug':
            day = 8;
            break;
        case 'Sep':
            day = 9;
            break;
        case 'Oct':
            day = 10;
            break;
        case 'Nov':
            day = 11;
            break;
        case 'Dec':
            day = 12;
            break;
        default:
            break;
    }
    return day;
}