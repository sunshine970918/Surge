var url = $request.url;
var body = $response.body;

function adAppName(adUrls) {
  if (/^https?:\/\/edith\.xiaohongshu\.com\/api\/sns\/v1\/system_service\/config\?/.test(adUrls)) return "小红书-开屏广告-config";
  if (/^https?:\/\/edith\.xiaohongshu\.com\/api\/sns\/v2\/system_service\/splash_config$/.test(adUrls)) return "小红书-开屏广告-splash_config"
  if (/^https?:\/\/edith\.xiaohongshu\.com\/api\/sns\/v6\/homefeed\/categories\?/.test(adUrls)) return "小红书-信息流广告";
  return "";
}

if (!body) $done({});
switch (adAppName(url)) {
  case "小红书-开屏广告-config":
    try {
      let obj = JSON.parse($response.body);
      //obj.data.tabbar.tabs = Object.values(obj.data.tabbar.tabs).filter((item) => !item.title == "购买");
      delete obj.data.store;
      delete obj.data.splash;
      delete obj.data.loading_img;
      body = JSON.stringify(obj);
    } catch (error) {
      console.log(`小红书-开屏广告-config, 出现异常`);
    }
    break;
  case "小红书-开屏广告-splash_config":
    try {
      let obj = JSON.parse(body);
      obj.data.ads_groups.forEach((i) => {
        i.start_time = 2208960000; // Unix 时间戳 2040-01-01 00:00:00
        i.end_time = 2209046399; // Unix 时间戳 2040-01-01 23:59:59
        if (i.ads) {
          i.ads.forEach((j) => {
            j.start_time = 2208960000; // Unix 时间戳 2040-01-01 00:00:00
            j.end_time = 2209046399; // Unix 时间戳 2040-01-01 23:59:59
          });
        }
      });
      body = JSON.stringify(obj);
    } catch (error) {
      console.log(`小红书-开屏广告-splash_config, 出现异常`);
    }
    break;
  case "小红书-处理信息流广告":
    try {
      let obj = JSON.parse(body);
      obj.data = obj.data.filter((d) => !d.ads_info);
      body = JSON.stringify(obj);
    } catch (error) {
      console.log(`小红书-处理信息流广告, 出现异常`);
    }
    break;
}

$done({ body });
