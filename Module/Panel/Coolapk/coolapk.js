// 酷安 replyList
if (/^https?:\/\/api.coolapk.com\/v6\/feed\/replyList/.test(url)) {
  let obj = JSON.parse(body);
  obj.data = Object.values(obj.data).filter((item) => item.id);
  body = JSON.stringify(obj);
}

 酷安 index
if (/^https?:\/\/api.coolapk.com\/v6\/main\/indexV8/.test(url)) {
  let obj = JSON.parse(body);
  obj.data = Object.values(obj.data).filter(
    (item) =>
      !(
        item["entityTemplate"] == "sponsorCard" ||
        item.entityId == 8639 ||
        item.entityId == 33066 ||
        item.entityId == 32557 ||
        item.title.indexOf("值得买") != -1
      )
  );
  body = JSON.stringify(obj);
}

 酷安 dataList
if (/^https?:\/\/api.coolapk.com\/v6\/main\/dataList/.test(url)) {
  let obj = JSON.parse(body);
  obj.data = Object.values(obj.data).filter(
    (item) =>
      !(item["entityTemplate"] == "sponsorCard" || item.title == "精选配件")
  );
  body = JSON.stringify(obj);
}

 酷安 detail
if (/^https?:\/\/api.coolapk.com\/v6\/feed\/detail/.test(url)) {
  let obj = JSON.parse(body);
  obj.data.hotReplyRows = Object.values(obj.data.hotReplyRows).filter(
    (item) => item["id"]
  );
  obj.data.include_goods_ids = [];
  obj.data.include_goods = [];
  body = JSON.stringify(obj);
}
