<template>
  <div class="main_app">
    <header class="header">
      <img src="@/assets/logo.png">
      <div class="header-texts">
        <p class="title">YandexGPT</p>
        <p class="desc">пересказ страницы от нейросети</p>
      </div>
    </header>
    <div class="wrapper" v-if="Object.keys(sharingData).length">
      <div class="content">
        <p class="title">
          {{ sharingData.title }}
        </p>
        <ul class="content-list" v-for="partData of sharingData.desc" :key="partData.id">
          <template v-if="partData.theses">
            <li>
              <h3 @click="moveToTime(partData.start_time)">
                <span class="content-time"> {{ formatSecs(partData.start_time) }} </span>
                {{ partData.content }}
              </h3>
              <ul class="content-list" v-for="thesisData of partData.theses" :key="thesisData.id">
                <li>{{ thesisData.content }}</li>
              </ul>
            </li>
          </template>
          <template v-else>
            <li> {{ partData.content }}</li>
          </template>
        </ul>
      </div>
      <div class="content-copy" v-if="sharingData?.sharingUrl">
        <a :href="sharingData.sharingUrl" target="_blank">{{ sharingData.sharingUrl }}</a>
        <button @click="copyToClipboard(sharingData.sharingUrl)">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
            <g fill="none" fill-rule="evenodd">
              <path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z"/>
              <path fill="#C1C1C2" d="M9 2a2 2 0 0 0-2 2v2h2V4h11v11h-2v2h2a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H9ZM4 7a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H4Zm0 2h11v11H4V9Z"/>
            </g>
          </svg>
        </button>
      </div>
    </div>
    <div class="loading" v-else>
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
        <path fill="none" stroke="#888888" stroke-dasharray="15" stroke-dashoffset="15" stroke-linecap="round" stroke-width="2" d="M12 3C16.9706 3 21 7.02944 21 12">
          <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="15;0"/>
          <animateTransform attributeName="transform" dur="1.5s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/>
        </path>
      </svg>
    </div>
  </div>
</template>

<script>
import { apiWrapper } from '@/api/apiWrapper.js'

export default {
  name: 'popupView',
  data () {
    return {
      loading: true,
      sharingData: {},
    }
  },
  created: async function () {
    const currentURL = await this.getTab();
    const urlType = this.getURLType(currentURL);
    console.log(currentURL)

    let data = await apiWrapper.getSharingUrl(currentURL, urlType);
    console.log(data)
    if (!(data !== undefined && Object.keys(data).length)) {
      data = {
        status: "error",
        title: "Ошибка выполнения",
        desc: [
          {
            id: 0,
            content: "Произошла ошибка при выполнение одного из запросов. Оставьте обратную связь об этой ошибке, и мы попытаемся ее решить."
          }
        ]
      }
    }

    this.sharingData = data;
  },
  methods: {
    async copyToClipboard(text) {
      return await navigator.clipboard.writeText(text);
    },
    async getTab() {
      let queryOptions = { active: true, currentWindow: true };
      let tabs = await chrome.tabs.query(queryOptions);
      const url = tabs[0].url;
      return url;
    },
    getURLType(url) {
      const hostname = new URL(url).hostname;
      const youtubeTest = /^(www.|m.)?youtube(-nocookie)?.com$/
      return youtubeTest.test(hostname) ? 'video' : 'article';
    },
    formatSecs(secs) {
      const hours = Math.floor(secs / 3600);
      secs = secs - hours * 3600;
      const mins = Math.floor(secs / 60);
      secs = secs - mins * 60;
      return `${hours ? this.formatDate(hours)+':' : '' }${this.formatDate(mins)}:${this.formatDate(secs)}`;
    },
    formatDate(dateString) {
      // format X hours, minutes and etc to 0X. Ex. 1 -> 01, 12 -> 12
      return ('0' + dateString).slice(-2);
    },
    // moveToTime(secs) {
    //   const video = document.querySelector('video');
    //   console.log(video)
    //   if (!video) {
    //     return false;
    //   }

    //   video.currentTime = secs;
    //   return true;
    // }
  }
}

</script>

<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: "Segoe UI", BlinkMacSystemFont, Arial, sans-serif;
    font-size: 14px;
    color: #C1C1C2;
    background: #2E2F34;
  }

  .main_app {
    width: 350px;
    max-height: 600px;
    padding: 16px;
    overflow: auto;
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .main_app::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

  .header {
    display: flex;
  }

  .header > img {
    margin-top: 5px;
    margin-right: 5px;
    width: 16px;
    height: 16px;
  }

  .header-texts {
    display: flex;
    flex-direction: column;
    align-content: center;
  }

  .title {
    font-weight: bold;
    color: #fff;
  }

  .content {
    border-radius: 8px;
    background: #43474F;
    color: #BFC0C3;
    padding: 16px;
    margin: 16px 0;
  }

  .content-list {
    margin: 0 16px;
  }

  .content-copy {
    display: flex;
    align-items: center;
  }

  .content-copy a {
    text-decoration: none;
    color: #C1C1C2;
  }

  .content-copy a:hover {
    text-decoration: underline;
    color: #FF5317;
  }

  .content-copy > button {
    margin-left: 10px;
    background: transparent;
    border: none;
    border-radius: 4px;
    padding: 4px;
    width: 24px;
    height: 24px;
    cursor: pointer;
  }

  .content-copy > button:hover {
    background: #58595D;
  }

  .loading {
    display: flex;
    justify-content: center;
    margin: 40px 0;
  }

  .content-time {
    color: #FF5317;
  }

</style>