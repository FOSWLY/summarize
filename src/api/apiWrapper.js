import { yandexRequests, yandexStatus, yandexErrorCode } from '@/api/yandexRequests.js'
import { sleep } from "@/utils/utils.js"
import emitter from "tiny-emitter/instance";


export const apiWrapper = {
  checkStatusCode(res, urlType, endpoint = '...') {
    switch (res.status_code) {
      case yandexStatus.StatusFetchError:
        return {
          status: "error",
          title: "Ошибка запроса",
          desc: [
            {
              id: 0,
              content: `Не удалось совершить запрос к /api/${endpoint}`
            }
          ]
        }
      case yandexStatus.StatusError:
        return {
          status: "error",
          title: "Ошибка YandexGPT",
          desc: [
            {
              id: 0,
              content: yandexErrorCode[res.error_code]
            }
          ]
        }
      case yandexStatus.StatusSuccess:
        return urlType === 'article' ? {
          status: "success",
          title: res.title,
          desc: res.thesis,
          sharingUrl: res.sharing_url
        } : {
          status: "error",
          title: "Ошибка YandexGPT",
          desc: [
            {
              id: 0,
              content: yandexErrorCode[res.error_code]
            }
          ]
        }
      case yandexStatus.StatusSuccessVideo:
        return urlType === 'video' ? {
          status: "success",
          title: res.title,
          desc: res.keypoints,
          sharingUrl: res.sharing_url
        } : {
          status: "error",
          title: "Ошибка YandexGPT",
          desc: [
            {
              id: 0,
              content: yandexErrorCode[res.error_code]
            }
          ]
        }
      case yandexStatus.StatusInProgress:
        if (res.keypoints || res.thesis) {
          return {
            status: "generation",
            title: res.video_title ?? res.title,
            desc: res.type === 'article' ? res.thesis : res.keypoints,
          }
        }
    }
    return true;
  },

  async getSharingUrl(url, urlType) {
    if (urlType === 'video') {
      // skip sharing url because isn't working with video
      return await apiWrapper.generateSiteData(url, urlType);
    }

    const res = await yandexRequests.getSharingUrl(url);
    console.log("sharing-url", res);

    if (res.status === yandexStatus.StatusAPISuccess) {
      const sharingUrl = res.sharing_url;
      const sharingToken = sharingUrl.split('/').at(-1);
      if (sharingToken !== undefined) {
        const resSharingData = await yandexRequests.getSharingData(sharingToken);
        console.log("response /sharing", resSharingData)
        if (resSharingData.status_code === yandexStatus.StatusSuccess || resSharingData.status_code === yandexStatus.StatusSuccessVideo) {
          const data = {
            status: "success",
            title: resSharingData.title,
            desc: resSharingData.type === 'article' ? resSharingData.thesis : resSharingData.keypoints,
            sharingUrl: sharingUrl
          }
          emitter.emit("update-summarize", data);
          return data;
        }
      }
    }

    return await apiWrapper.generateSiteData(url, urlType);
  },

  async generateSiteData(url, urlType = 'article') {
    const genData = urlType === 'article' ? {
      'article_url': url
    } : {
      'video_url': url
    }

    let res = await yandexRequests.generation(genData);

    console.log(res);

    const status = apiWrapper.checkStatusCode(res, urlType);
    emitter.emit("update-summarize", status);

    if (typeof status === "object" && status.status !== "generation") {
      return status;
    }

    const interval = res.poll_interval_ms;
    const session_id = res.session_id;

    while (res.status_code === yandexStatus.StatusInProgress) {
      await sleep(interval)
      console.log('requesting session', session_id)

      res = await yandexRequests.generation({
        "session_id": session_id,
        ...genData
      });

      console.log(res);
      const status = apiWrapper.checkStatusCode(res, urlType);
      emitter.emit("update-summarize", status);
      if (typeof status === "object" && status.status !== "generation") {
        return status;
      }
    }
  }
}