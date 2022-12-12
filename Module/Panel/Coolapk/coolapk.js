var url = $request.url;
var body = $response.body;

function adAppName(adUrls) {
  if (/^https?:\/\/api.coolapk.com\/v6\/feed\/detail/.test(adUrls)) return "酷安-detail";
  if (/^https?:\/\/api.coolapk.com\/v6\/feed\/replyList/.test(adUrls)) return "酷安-replyList";
  if (/^https?:\/\/api.coolapk.com\/v6\/main\/dataList/.test(adUrls)) return "酷安-dataList";
  if (/^https?:\/\/api.coolapk.com\/v6\/main\/indexV8/.test(adUrls)) return "酷安-index";
  return "";
}

if (!body) $done({});
switch (adAppName(url)) {
  case "酷安-replyList":
    try {
      let obj = JSON.parse(body);
      obj.data = Object.values(obj.data).filter((item) => item.id);
      body = JSON.stringify(obj);
    } catch (error) {
      console.log(`酷安-replyList, 出现异常`);
    }
    break;
  case "酷安-detail":
    try {
      let obj = JSON.parse(body);
      obj.data.hotReplyRows = Object.values(obj.data.hotReplyRows).filter(
        (item) => item["id"]
      );
      obj.data.include_goods_ids = [];
      obj.data.include_goods = [];
      body = JSON.stringify(obj);
    } catch (error) {
      console.log(`酷安-detail, 出现异常`);
    }
    break;
  case "酷安-dataList":
    try {
      let obj = JSON.parse(body);
      obj.data = Object.values(obj.data).filter((item) =>
        !(item["entityTemplate"] == "sponsorCard" || item.title == "精选配件")
      );
      body = JSON.stringify(obj);
    } catch (error) {
      console.log(`酷安-dataList, 出现异常`);
    }
    break;
  case "酷安-index":
    try {
      let obj = JSON.parse(body);
      obj.data = Object.values(obj.data).filter((item) =>
        !(
          item["entityTemplate"] == "sponsorCard" ||
          item.entityId == 8639 ||
          item.entityId == 33066 ||
          item.entityId == 32557 ||
          item.title.indexOf("值得买") != -1
        )
      );
      body = JSON.stringify(obj);
    } catch (error) {
      console.log(`酷安-index, 出现异常`);
    }
    break;
}

$done({ body });
