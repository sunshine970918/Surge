// 2023-01-06 22:30

if (!$response.body) $done({});
const url = $request.url;
let obj = JSON.parse($response.body);

if (obj.data) {
  // 哔哩哔哩-强制设置的皮肤
  if (url.includes("/x/resource/show/skin")) {
    if (obj.data.common_equip) delete obj.data.common_equip;
  } else if (url.includes("/x/resource/show/tab/v2")) {
    // 哔哩哔哩-标签页
    if (obj.data.tab) {
      obj.data.tab = obj.data.tab.filter((item) => {
        if (
          item.name === "直播" ||
          item.name === "推荐" ||
          item.name === "热门" ||
          item.name === "影视"
        ) {
          return true;
        }
        return false;
      });
      fixPos(obj.data.tab);
    }
    if (obj.data.top) {
      obj.data.top = obj.data.top.filter((item) => {
        if (item.name === "游戏中心") return false;
        return true;
      });
      fixPos(obj.data.top);
    }
    if (obj.data.bottom) {
      obj.data.bottom = obj.data.bottom.filter((item) => {
        if (item.name === "发布" || item.name === "会员购") {
          return false;
        }
        return true;
      });
      fixPos(obj.data.bottom);
    }
  } else if (url.includes("/x/resource/top/activity")) {
    // 哔哩哔哩-右上角活动入口
    if (obj.data.hash && obj.data.online.icon) {
      obj.data.hash = "";
      obj.data.online.icon = "";
    }
  } else if (url.includes("/x/v2/account/mine")) {
    // 哔哩哔哩-我的页面
    // 标准版：
    // 396离线缓存 397历史记录 398我的收藏 399稍后再看 171个性装扮 172我的钱包 407联系客服 410设置
    // 港澳台：
    // 534离线缓存 8历史记录 4我的收藏 428稍后再看
    // 352离线缓存 1历史记录 405我的收藏 402个性装扮 404我的钱包 544创作中心
    // 概念版：
    // 425离线缓存 426历史记录 427我的收藏 428稍后再看 171创作中心 430我的钱包 431联系客服 432设置
    // 国际版：
    // 494离线缓存 495历史记录 496我的收藏 497稍后再看 741我的钱包 742稿件管理 500联系客服 501设置
    // 622为会员购中心 425开始为概念版id
    const itemList = new Set([396, 397, 398, 399]);
    obj["data"]["sections_v2"]?.forEach((element, index) => {
      let items = element["items"].filter((e) => {
        return itemList.has(e.id);
      });
      obj["data"]["sections_v2"][index].button = {};
      delete obj["data"]["sections_v2"][index].tip_icon;
      delete obj["data"]["sections_v2"][index].be_up_title;
      delete obj["data"]["sections_v2"][index].tip_title;
      for (let i = 0; i < obj["data"]["sections_v2"].length; i++) {
        if (
          obj.data.sections_v2[i].title === "推荐服务" ||
          obj.data.sections_v2[i].title === "更多服务" ||
          obj.data.sections_v2[i].title === "创作中心"
        ) {
          delete obj.data.sections_v2[i].title;
          delete obj.data.sections_v2[i].type;
        }
      }
      obj["data"]["sections_v2"][index]["items"] = items;
      delete obj.data.vip_section_v2;
      delete obj.data.vip_section;
      delete obj.data.live_tip;
      delete obj.data.answer;
      // 开启本地会员标识 2022-03-05 add by ddgksf2013
      obj.data.vip_type = 2;
      obj.data.vip.type = 2;
      obj.data.vip.status = 1;
      obj.data.vip.vip_pay_type = 1;
      obj.data.vip.due_date = 2208960000; // Unix 时间戳 2040-01-01 00:00:00
    });
  } else if (url.includes("/x/v2/account/myinfo")) {
    // 哔哩哔哩-会员清晰度
    obj.data.vip.type = 2;
    obj.data.vip.status = 1;
    obj.data.vip.vip_pay_type = 1;
    obj.data.vip.due_date = 2208960000; // Unix 时间戳 2040-01-01 00:00:00
  } else if (url.includes("/x/v2/feed/index")) {
    // 哔哩哔哩-推荐广告
    if (obj.data.items?.length) {
      obj.data.items = obj.data.items.filter((i) => {
        const { card_type: cardType, card_goto: cardGoto } = i;
        if (cardType && cardGoto) {
          if (cardType === "banner_v8" && cardGoto === "banner") {
            if (i.banner_item) {
              // 去除判断条件 首页横版内容全部去掉
              // for (const v of i.banner_item) {
              //   if (v.type) {
              //     if (v.type === "ad") return false;
              //   }
              // }
              return false;
            }
          } else if (
            cardType === "cm_v2" &&
            [
              "ad_web_s",
              "ad_av",
              "ad_web_gif",
              "ad_player",
              "ad_inline_3d"
            ].includes(cardGoto)
          ) {
            // ad_player大视频广告 ad_web_gif大gif广告 ad_web_s普通小广告 ad_av创作推广广告 ad_inline_3d 上方大的视频3d广告
            return false;
          } else if (cardType === "small_cover_v10" && cardGoto === "game") {
            // 游戏广告
            return false;
          } else if (cardType === "cm_double_v9" && cardGoto === "ad_inline_av") {
            // 创作推广-大视频广告
            return false;
          }
        }
        return true;
      });
    }
  } else if (url.includes("/x/v2/search/square")) {
    // 哔哩哔哩-热搜广告
    delete obj.data;
  } else if (url.includes("/x/v2/splash")) {
    // 哔哩哔哩-开屏广告
    if (obj.data.show) delete obj.data.show;
  } else if (url.includes("/pgc/page/cinema/tab")) {
    // 哔哩哔哩-观影页广告
    if (obj.result && obj.result.modules) {
      obj.result.modules?.forEach((module) => {
        // 头部banner
        if (module.style.startsWith("banner")) {
          module.items = module.items.filter(
            (i) => !(i.source_content && i.source_content.ad_content)
          );
        }
      });
    }
  } else if (url.includes("/xlive/app-room/v1/index/getInfoByRoom")) {
    // 哔哩哔哩-直播广告
    if (obj.data.activity_banner_info) obj["data"]["activity_banner_info"] = null;
  }
}

// 修复pos
function fixPos(arr) {
  for (let i = 0; i < arr.length; i++) {
    arr[i].pos = i + 1;
  }
}

body = JSON.stringify(obj);
$done({ body });
