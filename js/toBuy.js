
var url = location.href;
if(url.indexOf("from=share") != -1){
	$(".top-fixed a").attr("href", "http://m.ipinbb.com/ipbb/goods/eval");
}

function Jump() {

	var URL = location.href,
		dataUrl = $(this).attr("data-url");

	URL.indexOf("from=APP") != -1 ? fromAPP(dataUrl) : (location.href = dataUrl);
}

function fromAPP(url) {

	var ua = navigator.userAgent,

		commodityId = UrlSearch(url).id;
	
		platformId = UrlSearch(url).platformId;

	// console.log(commodityId, platformId);
	if(ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1) {

		Android.showGoods(commodityId, platformId);

	} else if(ua.indexOf('iPhone') > -1 || ua.indexOf('Mac') > -1) {

		location.href = url;
		
		// return UrlSearch(url);
	}
}

function UrlSearch(url) {
	var name, value, request = {}; 
	var num = url.indexOf("?");
	url = url.substr(num+1); //取得所有参数   stringvar.substr(start [, length ]

	var arr=url.split("&"); //各个参数放到数组里
	for(var i=0;i < arr.length;i++){
		num=arr[i].indexOf("=");
		if(num>0){
			request[arr[i].substring(0,num)] = arr[i].substr(num+1);
		}
	}
	return request;
}

// APP中打开去除头尾部
$(".header").hideElement({strKey: "#from=APP", element: ".article", direction:"top"});

// 事件榜定
document.getElementById("toDetail").addEventListener("tap", Jump, false);