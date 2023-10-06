const API_DOMAIN = 'foswly-sa.toil.cc';

const options = {
  method: "POST",
  mode: "cors",
  cache: "no-cache",
  headers: {
    "Content-Type": "application/json",
  },
};

export const yandexStatus = {
  'StatusSuccessVideo': 0,
  'StatusInProgress': 1,
  'StatusSuccess': 2,
  'StatusError': 3,
  'StatusNotFoundInCache': 4,
  'StatusFetchError': 999,
  'StatusAPISuccess': 'success',
  'StatusAPIError': 'error'
}

export const yandexErrorCode = {
  [1]: "Страница не найдена. Пожалуйста, проверьте ссылку или попробуйте другую.",
  [2]: "Нейросеть не смогла извлечь текст статьи. Попробуйте другую.",
  [3]: "Статья слишком длинная, нейросети пока не умеют пересказывать такие статьи. Попробуйте другую.",
  [4]: "Страница не найдена. Пожалуйста, проверьте ссылку или попробуйте другую.",
  [5]: "Что-то пошло не так. Попробуйте вернуться позже или выберите другую статью",
  [6]: "Нейросети пока не умеют пересказывать такие статьи. Попробуйте другую.",
  [7]: "Что-то пошло не так. Попробуйте вернуться позже или выберите другую статью",
  [8]: "Нейросети пока не умеют пересказывать такие видео. Попробуйте другую.", // not the real error text
  [9]: "Что-то пошло не так. Попробуйте вернуться позже или выберите другую статью",
  [10]: "Версия браузера устарела. Клиент должен показать сообщение с предложением обновить браузер.",
  [11]: "Нейросети пока не умеют пересказывать такие статьи. Попробуйте другую.",
  [12]: "Нейросети пока не умеют пересказывать такие статьи. Попробуйте другую.",
  [21]: "Нейросети пока не умеют пересказывать такие длинные видео. Попробуйте другое.", // not the real error text
}

export const yandexRequests = {
  async universalFetch(partOfURL, fetchOptions = options) {
    // fetch data from api in json format
    try {
      const res = await fetch(`https://${API_DOMAIN}/${partOfURL}`, fetchOptions)
                      .catch(err => {
                        console.error(err);
                        throw `Failed to fetch from /api/${partOfURL}`;
                      })
                      ;
      console.log(res);
      const resJSON = res.json()
                      .catch(err => {
                        console.log(err);
                        throw `Failed to parse summary from /api/${partOfURL}`;
                      })
      return resJSON;
    } catch (err) {
      console.log(err)
      return {
        status: 999, // custom error code (FETCH FAILED)
      }
    }
  },

  async getSharingUrl(url) {
    // Url is url to article (website)
    // Ex.: https://journal.tinkoff.ru/news/yandexgpt-summary/
    let fetchOptions = {...options};
    fetchOptions.body = JSON.stringify({
      "article_url": url
    });
    console.log(fetchOptions)
    return await yandexRequests.universalFetch('sharing-url', fetchOptions)
  },

  async getSharingData(token) {
    // Token is a part of the url.
    // Ex.: In URL "https://300.ya.ru/hQwoyXuM" hQwoyXuM is token
    let fetchOptions = {...options};
    fetchOptions.body = JSON.stringify({
      "token": token
    });
    return await yandexRequests.universalFetch('sharing', fetchOptions)
  },

  async generation(body) {
    // read documentation: https://foswly-sa.toil.cc/docs
    let fetchOptions = {...options};
    fetchOptions.body = JSON.stringify(body);
    return await yandexRequests.universalFetch('generation', fetchOptions)
  },
};
