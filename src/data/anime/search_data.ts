const cheerio = require('cheerio');
const axios = require('axios').default;

interface SearchAnime {
    id: number
    title: String
    synopsis: String
    url_page: String
    url_img: String
    type: String
    episodes: number
    score: number
}

export function getSearchAnimes(request: string, page: number) {
    const limit = page * 50 - 50;
    const uri = 'https://myanimelist.net/anime.php?cat=anime&q=' + request + '&show=' + limit + '&genre_ex%5B%5D=12';
    return getSearchDataAnime(uri);
}

export function getLetterAnimes(letter:string,page:number){
    const limit = page * 50 - 50;
    const uri = 'https://myanimelist.net/anime.php?letter=' + letter + '&show=' + limit;
    return getSearchDataAnime(uri);
}

export async function getSearchDataAnime(url:string){
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const dataSA = $('#content > .js-categories-seasonal > table > tbody > tr');
        var search_animes : SearchAnime[] = [];
        dataSA.map(function (i: any, value: any) {
            if (i > 0) {
                var id = 0;
                var title = "";
                var synopsis = "";
                var url_img = "";
                var url_page = "";
                var type = "";
                var episodes = 0;
                var score = 0.0;
                const data = $(value).find('td');
                var stateH = false;
                data.map(function (i: any, value: any) {
                    switch (i) {
                        case 0:
                            id = Number(String($(value).find('.borderClass > .picSurround > a').attr('href')).split('/anime/')[1].split('/')[0]);
                            url_page = $(value).find('.borderClass > .picSurround > a').attr('href');
                            url_img = String($(value).find('.borderClass > .picSurround > a > img').attr('data-src')).replace('r/50x70/','');
                            break;
                        case 1:
                            title = $(value).find('.hoverinfo_trigger > strong').text();
                            synopsis = String($(value).find('.pt4').text()).replace('read more.','');
                            const dataHover = String($(value).find('.hoverinfo-contaniner').text());
                            console.log(dataHover);
                            break;
                        case 2:
                            type = String($(value).text()).trimStart().trimEnd();
                            break;
                        case 3:
                            if(String($(value).text()).trim() != '-'){
                                episodes = Number($(value).text());
                            }
                            break;
                        case 4:
                            if(String($(value).text()).trim() != 'N/A'){
                                score = Number($(value).text());
                            }
                            break;
                        default:
                            break;
                    }
                });
                search_animes.push({
                    id,
                    title,
                    synopsis,
                    url_page,
                    url_img,
                    type,
                    episodes,
                    score
                });
            }
        });
        return search_animes;
    } catch (error) {
        console.log(error);
    }
}