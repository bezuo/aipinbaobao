/*
 用于存放项目中的公共脚本
*/

;(function($){

	"use strict"
	// 图片懒加载插件
	$.fn.lazyImgLoad = function (options) {

		var $this = $(this);

		options = options || {};

		// 为图片添加一个未加载之前的占位背景图
		var addImgBg = function () {

			var imgBackground = options.backgroundImg;

			if(imgBackground && $this.attr("data-url") != null) {
				$this.parent().css({
					backgroundImage: "url("+ imgBackground +")",
					backgroundSize: "cover"
				});
			}
		};
		addImgBg();

		// 顶部是否可加载
		var _top = function (element) {

			var _imgTop,
				// winHeight: 获取屏幕高度;
				winHeight = $(window).height(),

				// scrollHeight: 获取滑动的距离;
				scrollHeight = $(window).scrollTop(),
				
				// longHeight: 获取提前加载的距离;
				longHeight = options.distance ? options.distance : 0;

			// 距头部可加载图片的高度;
			_imgTop = longHeight ? winHeight + scrollHeight + longHeight : winHeight + scrollHeight;

			// 判断元素是否处于图片应加载区域;
			return _imgTop >= element.offset().top ? true : false;
		};

		// 底部是否可加载
		var _bottom = function (element) {

			var scrollHeight = $(window).scrollTop();

			return scrollHeight <= element.offset().top + element.height() ? true : false;
		};

		// 判断是否满足上下都能加载的条件
		var inViewport = function (element) {

			return _top(element) && _bottom(element) ? true : false;
		};

		var imgLoad = function () {

			$this.each(function() {

				var that = this;

				if(that.src == ""){
					var _bool = inViewport($(that));
					if(_bool) {
						// // strSrc: 获取图片的路径
						// // strAlt: 获取图片描述文字;
						var strSrc = $(that).attr("data-url"),
							strAlt = $(that).attr("data-alt");

						$(that).attr({
							src: strSrc,
							alt: strAlt
						}).removeAttr("data-url").removeAttr("data-alt");

						// function imgLoadOK(img, callback) {
						// 	var timer = setInterval(function() {
						// 		if (img.complete) {
						// 			callback()
						// 			clearInterval(timer)
						// 		}
						// 	}, 1000);
						// }

				  //       imgLoadOK(that, function(){
				  //       	$(that).parent().css("background", "none");
				  //       });
					}
				}
			});
		};

		// 绑定load事件
		window.addEventListener("load", imgLoad, false);

		// 绑定滚动事件
		window.addEventListener("scroll", imgLoad, false);
	};

	// 弹出窗————对话框;
	$.fn.dialog = function (options) {
			
		var objDialog, dialogText, cancelText, okText, that = $(this);

		dialogText = typeof options == "object" ? options.text : options;

		okText = options.btnOK != "undefined" ? options.btnOK : false;

		cancelText = options.btnCancel != "undefined" ? options.btnCancel : false;

		var popDialog = function () {

			objDialog = okText ? dialogTip1(dialogText, okText, cancelText) : dialogTip2(dialogText);

			$("body").append(objDialog);

			$(document).on("click", ".btn-cancel", function(){
				$(".mask-box").remove();
			});
		};

		that.length != 0 ? that.get(0).addEventListener("click", popDialog, false) : false;
	};	

	// 在APP中调用网页时隐藏部分元素
	$.fn.hideElement = function (options) {

		var strKey, element, direction, styleDir,
			$this = $(this), 
			url = location.href;

		strKey = typeof options == "string" ? options : options.strKey;

		var modify = function () {

			$this.hide();

			// 获取方向
			direction = options.direction || null;
			styleDir = direction ? "padding-" + direction : false;

			// 获取元素
			element = options.element || null;
			if(!element) return false;

			$(element).css(styleDir,0);
		};

		url.indexOf(strKey) > -1 ? modify() : false;
	};

	// 倒计时插件
	$.fn.countdown = function (options){

		var that = $(this).not(".conduct"), t;

		var completion = function(value){ return value < 10 ? "0" + value : value; };

		var timing = function(obj, n) {

			!(that.hasClass("conduct")) ? that.addClass("conduct") : false;

			if(n >= 0) {
				
				t = setTimeout(function(){ timing(obj, n) },1000);

				obj.text(formatSeconds(n));

				if(n == 0){ clearTimeout(t) }
				
				n--;
			};
		};

		// 时间计算;
		function formatSeconds(n) {

			var hours = 0, minutes = 0, seconds = n;

			if(n > 60) {

				minutes = parseInt(n/60);
				// 求余的值就为秒钟
				seconds = Math.floor(n%60);

				if(minutes >= 60){
					// 整除得到小时
					hours = parseInt(minutes/60);
					// 求余得到分钟
					minutes = Math.floor(minutes%60);
				}
			}

			hours = completion(hours);
			minutes = completion(minutes);
			seconds = completion(seconds);

			return hours+" : "+minutes+" : "+seconds;
		}

		// 循环对象;
		that.each(function() {

			// var n, nArray = $(this).text().split(':');
			// n = parseInt(nArray[0])*3600 + parseInt(nArray[1])*60 + parseInt(nArray[2]);

			var n = parseInt($(this).attr("data-end"))/1000;
			timing($(this), n);
		});
	};

	// 查看图片
	$.fn.viewImg = function (options) {

		var that = $(this);

		// 创建图片
		var createImg = function (string, objects) {

			for(var i = 0; i < objects.length; i++){
				string += "<li><img src="+ objects[i].getAttribute('src') +" /></li>";
			};

			return string;
		};

		var createPoint = function (string, objects) {
			for(var i = 0; i < objects.length; i++){
				string += "<span></span>";
			};

			return string;
		};

		// 打开图片
		var pop = function () {

			var i = that.index($(this)),
			h_height = $(window).height(),
			w_width = $(window).width(),
			liImg = "",
			point = "",
			divStr = $("<section class='slide-view'>" +
						"<ul>"+ createImg(liImg, that) +"</ul>" + 
						"<div class='slide-cur'>"+ createPoint(point, that) +"</div>" +
					"</section>");

			$("body").append(divStr);

			$(".slide-view ul").css({
				"-webkit-transform": "translateX(-"+ i*w_width+"px)",
				"-moz-transform": "translateX(-"+ i*w_width+"px)",
				"-ms-transform": "translateX(-"+ i*w_width+"px)",
				"-o-transform": "translateX(-"+ i*w_width+"px)",
				"transform": "translateX(-"+ i*w_width+"px)"
			});
			$(".slide-view").animate({opacity: 1}, 500);			
			$(".slide-view li").eq(i).addClass("pop-img");
			$(".slide-cur span").eq(i).addClass("cur");			
			$(".add-kf").hide();

			// 绑定事件
			$(".slide-view").get(0).addEventListener("tap", function(){
				$(this).remove();
				$(".add-kf").show();
			}, false);

		};

		that.each(function() {
			this.addEventListener("tap", pop, false);
		});
	};

	// 滑动居顶效果
	$.fn.scrollFixed = function (options){

		var that = $(this);
		var options = options ? options : null;
		var u = navigator.userAgent;
		var recalculateLimits = that.offset().top;

		if(!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
			
			window.addEventListener("touchmove", function() {
				$(this).scrollTop() > recalculateLimits ? options.addClass("tab-fixed") : options.removeClass("tab-fixed");				
			},false);

			$(window).scroll(function() {
				$(this).scrollTop() > recalculateLimits ? options.addClass("tab-fixed") : options.removeClass("tab-fixed");
			}, false);

		} else {
			
			$(window).scroll(function() {
				if($(this).scrollTop() > recalculateLimits) {
					options.hide();
					options.addClass("tab-fixed");
					options.show();
				} else {
					options.hide();
					options.removeClass("tab-fixed");
					options.show();
				}
			}, false);
		}
	};

	// 向下滑动显示顶部栏
	$.fn.showTop = function (options) {

		var that = this.get(0),startPos, endPos, isScrolling, _heightStart, _heightEnd,
		
		options = options ? options : null,

		slider = {
			//判断设备是否支持touch事件
			touch:('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch,

			//事件
			events:{
				slider: that,
				handleEvent:function(event){
					if(event.type == 'touchstart'){
						this.start(event);
					}else if(event.type == 'touchmove'){
						this.move(event);
					}else if(event.type == 'touchend'){
						this.end(event);
					} else {
						this.scrollBtm(event);
					}
				},

				//滑动开始
				start: function(event){
					//touches数组对象获得屏幕上所有的touch，取第一个touch
					var touch = event.targetTouches[0];
					//取第一个touch的坐标值
					startPos = {x:touch.pageX,y:touch.pageY,time:+new Date};
					//这个参数判断是垂直滚动还是水平滚动
					isScrolling = 0;
					_heightStart = $(that).scrollTop();
					this.slider.addEventListener('touchmove', this, false);
					this.slider.addEventListener('touchend', this, false);
				},

				//移动
				move: function(event){
					//当屏幕有多个touch或者页面被缩放过，就不执行move操作
					if(event.targetTouches.length > 1 || event.scale && event.scale !== 1) return;
					var touch = event.targetTouches[0];
					endPos = {x:touch.pageX - startPos.x,y:touch.pageY - startPos.y};
					_heightEnd = $(that).scrollTop();
					//isScrolling为1时，表示纵向滑动，0为横向滑动
					isScrolling = Math.abs(endPos.x) < Math.abs(endPos.y) ? 1:0;
					if(isScrolling === 1){
						//阻止触摸事件的默认行为，即阻止滚屏
						// event.preventDefault();
					}		
				},

				//滑动释放
				end: function(event){
					//滑动的持续时间
					var duration = +new Date - startPos.time;

					console.log($(that).scrollTop());
					if(Number(duration) > 10){
						if(isScrolling === 1){
							//判断是上移还是下移，当偏移量大于10时执行
							if(endPos.y < -10 || _heightEnd < _heightStart){
								// alert('上');
								$(options).removeClass("top-fixed").css("zIndex", "1");
							}else if(endPos.y > 10){
								// alert('下');
								$(options).addClass("top-fixed").css("zIndex", "9999");
							}
						}
						startPos = endPos = null;
						return false;
					}

					//解绑事件
					this.slider.removeEventListener('touchmove', this, false);
					this.slider.removeEventListener('touchend', this, false);
				},

				scrollBtm: function(event) {
					console.log(this)
					console.log($(that).scrollTop());
				}
			}
		}

		window.addEventListener("touchstart", slider.events, false);
	};

	// 弹出层————用户验证
	$.fn.verificationUser = function(options) {

		var self = $(this), 
			_number = options ? options.num : false,
			_url = options ? options.url : false;

		// 显示弹出层;
		var openVerification = function(){
			
			// 判断之前是否已经存在验证弹出层
			if($(".pop-yanz-box").length === 0) { 
				var str =  "<section class='pop-yanz-box'>" +
								"<section class='pop-yanz pop-img'>" +
									"<span class='iconfont pop-yanz-close'>&#xe6cc;</span>" +
									"<span class='font12 pop-first'>您的VIP专属号为</span>" +
									"<div class='pop-number'>"+_number+"</div>" +
									"<div class='pop-content'>添加下方客服好友发送您的vip专属号订单方能生效</div>" +
									"<div class='pop-img-1'>" +
										"<img src="+_url + ">" +
									"</div>" +
									"<p class='pop-text'>您可以跳过此步骤先完成下单流程，团成后在确认添加客服激活您的订单，等待收货。</p>" +
								"</section>" +
							"</section>";

				if($(".mask-box1").length !== 0) {
					$(".mask-box1").show();
					$("body").append(str);
				} else {
					$("body").append("<section class='mask-box1'></section>");
					$("body").append(str);					
				}

				$(".pop-yanz-close").get(0).addEventListener("tap", closeVerification, false);

			} else {
				$(".mask-box1").show();
				$(".pop-yanz-box").show();
			}
		};

		// 关闭验证弹出层
		var closeVerification = function () {
			$(".mask-box1").hide();
			$(".pop-yanz-box").remove()
		};

		self.length != 0 ? self.get(0).addEventListener("tap", openVerification, false) : false;
	};
})(Zepto);


// 链接跳转
$(document).on("tap", "[data-href]", function(){
	// 获取跳转链接;
	var strURL = $(this).attr("data-href"),
	// 是否为淘宝、天猫的链接
	t_bool = (strURL.indexOf("taobao.com") > 0) || (strURL.indexOf("tmall.com") > 0),	
	
	// 判断是否在微信中
	ua = navigator.userAgent.toLowerCase(),
	is_weixn = ua.match(/MicroMessenger/i)=="micromessenger" ? true : false;

	if(is_weixn && t_bool) {
		inviteTips({
			title: "Oh No！非常遗憾",
			content: "微信无法直达淘宝页面，您需要点击右上角，在浏览器中打开购买。",
			btn : "我知道了"
		});
	} else {
		location.href = strURL;
	}
	event.stopPropagation();
});

function toastTips(string) {
	
	var _div = $("<div>"+string+"</div>");
	
	_div.css({
		"position": "fixed",
		"zIndex": "9999",
		"top": "50%",
		"left": "50%",
		"maxWidth": "80%",
		"padding": "1rem",
		"line-height": "1.8rem",
		"fontSize": "1.5rem",
		"color": "rgb(255,255,255)",
		"transform": "translate(-50%, -50%)",
		"backgroundColor": "rgba(0,0,0,.6)",
		"borderRadius": ".8rem"
	});

	$("body").append(_div);

	setTimeout(function(){_div.remove()}, 2000);
}

// 微信中打开提示分享邀请
function inviteTips(options) {

	var title = options.title ? "<h2>"+options.title+"</h2>" : "",
	content = options.content ? "<p>"+options.content+"</p>" : "",
	btn = options.btn ? "<a href='#' class='close'>"+options.btn+"</a>" : "",

	htmlDom="<section class='mask-box'>" +
					"<div class='invite-box'>" +
						"<span class='iconfont icons-arrow'>&#xe618;</span>" +
						title + content + btn +
					"</duv>" +
				"</section>";

	$("body").append(htmlDom);

	var objDom = $(".invite-box").parent();
	// 关闭邀请提示层
	objDom.get(0).addEventListener("tap", function(){
		$(this).remove();
	}, false);

	// 添加动画特效
	setTimeout(function(){
		$(".invite-box").css({
			"-webkit-transition": "-webkit-transform .3s",
		    "-moz-transition": "-moz-transform .3s",
		    "transition": "transform .3s",
		    "-webkit-transform": "translate3d(0,0,0)",
			"-webkit-transform": "translate3d(0,0,0)",
		    "transform": "translate3d(0,0,0)"
		});
	}, 200);
};

$(".invite").each(function(){
	$(this).get(0).addEventListener("click",function(){
		inviteTips({
			title: "齐心协力买好货",
			content: "点击右上角分享给好友一起参团吧！",
			btn: "我知道了"
		});
	}, false);
});

function dialogTip1(dialogText, okText, cancelText){

	var objDialog = "<div class='mask-box'>" + 
					"<div class='dialog'>" +
						"<div class='dialog-show'>" +
							"<div class='dialog-Content'>" +
								"<p class='dialog-text'>"+ dialogText +"</p>" +
							"</div>" +

							"<div class='dialog-btn'>" +
								"<button class='btn-ok'>"+ okText +"</button>" +
								"<button class='btn-cancel'>"+ cancelText +"</button>" +
							"</div>" +
						"</div>" +
					"</div>" +
				"</div>";

	return objDialog;
}

function dialogTip2(dialogText){
	
	var objDialog = "<div class='mask-box'>" + 
					"<div class='dialog'>" +
						"<div class='dialog-show'>" +
							"<div class='dialog-Content'>" +
								"<p class='dialog-text'>"+ dialogText +"</p>" +
							"</div>" +
						"</div>" +
					"</div>" +
				"</div>";

	return objDialog;
}

// 错误提示
var error = function (options){

	var htmlDOM,

	error_text = typeof options == "object" ? options.text : options,

	_btnOK = "ok" in options ? options.ok : false,

	_btnCancel = "cancel" in options ? options.cancel : false;

	htmlDOM = _btnOK ? dialogTip1(error_text, _btnOK, _btnCancel) : dialogTip2(error_text);

	$("body").append(htmlDOM);
	
	if(!_btnOK) {

		setTimeout(function(){
			$(".mask-box").remove();
		},2200);

	} else {

		$(document).on("click", ".btn-cancel", function(){
			$(".mask-box").remove();
		});
	}	
};

// 设置cookie值
function setCookie(name) {

	var result, oDate = new Date(),
	
	ua = navigator.userAgent.toLowerCase();

	result = ua.match(/MicroMessenger/i) == "micromessenger" ? true : false
	
	oDate.setDate(oDate.getDate());
	
	document.cookie=name+'='+encodeURIComponent(result)+';expires='+oDate;
}

// 根据是否在微信中打开设置cookie值
setCookie("browser");

// 点击隐藏弹出层
function maskHide() {
	$(".mask-box").css("display","none");
	$(".anmite-show").addClass("anmite-hide");
}

// 添加收货地址方法;
function addDOM() {

	var obj = $(".mask-box");

	if (obj.length != 0) {

		$("body").find(".mask-box").show();
		$("#add-address").length != 0 ? $("#add-address").removeClass("anmite-hide") : addAddress();

	} else {

		$("body").append("<section class='mask-box'></section>");
		addAddress();

		$(".mask-box").get(0).addEventListener("tap", function(){
			$(".mask-box").css("display","none");
			$(".anmite-show").addClass("anmite-hide");
		}, false);
	}

	function addAddress () {
		var _dom = "<section class='addressBox anmite-show' id='add-address'>" +
					"<div class='address'>" +
						"<h3>添加收货地址</h3>" +
						"<div class='addressForm'>" +
							"<ul>" +
								"<li>" +
									"<label>收货人</label>" +
									"<span class='ipt-text'><input type='text' id='userName' placeholder='姓名' /></span>" +
								"</li>" +

								"<li>" +
									"<label>联系电话</label>" +
									"<span class='ipt-text'><input type='tel' id='telephone' placeholder='手机或固话' /></span>" +
								"</li>" +

								"<li>" +
									"<label>收货地点</label>" +
									"<span class='ipt-text' id='city-picker'>" +
										"<em>请选择收货地址</em>" +
									"</span>" +
								"</li>" +

								"<li>" +
									"<label>街道信息</label>" +
									"<span class='ipt-text'>" +
										"<select class='street-select' id='street'>" +
											"<option>街道门牌信息（选填）</option>" +
										"</select>" +
									"</span>" +
								"</li>" +

								"<li>" +
									"<label>详细地点</label>" +
									"<span class='ipt-text'><input type='text' placeholder='详细地点' /></span>" +
								"</li>" +

								"<li>" +
									"<label>邮政编码</label>" +
									"<span class='ipt-text'><input type='number' id='zipCode' placeholder='邮政编码(选填）' /></span>" +
								"</li>" +
							"</ul>" +
						"</div>" +
					"</div>" +
					"<button class='btn-next' id='addNext'>下一步</button>" +
				"</section>";

		$("body").append(_dom);
		
		// 绑定添加地址————事件方法;
		ele("city-picker").addEventListener("tap", firstFun, false);

		// 绑定下一步————提交地址按钮事件;
		$("#addNext").get(0).addEventListener("tap", submitAddress, false);

		// 对请求回来的数据进行拼接成字符串;
		function resultli(cityArray) {
			var result = "";	
			for(var i = 0; i < cityArray.length; i++) {
				result += "<li data-id="+cityArray[i].id+">"+cityArray[i].name+"</li>";
			}
			return result;
		}

		function ele(str) { return document.getElementById(str) }

		// 获取当前元素索引值
		var _index = function(obj, cur) {
			for(var i = 0, len = obj.length; i < len; i++) {
				if(obj[i] == cur) return i;
			}
		};

		// 省级行政单位选择;
		function firstFun() {

			$("input").blur();
			// 此变量为通过Ajax请求返回的数据
			var firstArray = [
					{"id":"110000","name":"北京市","shortName":"北京"},
					{"id":"120000","name":"天津市","shortName":"天津"},
					{"id":"130000","name":"河北省","shortName":"河北"},
					{"id":"140000","name":"山西省","shortName":"山西"},
					{"id":"210000","name":"辽宁省","shortName":"辽宁"},
					{"id":"220000","name":"吉林省","shortName":"吉林"},
					{"id":"230000","name":"黑龙江省","shortName":"黑龙江"},
					{"id":"310000","name":"上海市","shortName":"上海"},
					{"id":"320000","name":"江苏省","shortName":"江苏"},
					{"id":"330000","name":"浙江省","shortName":"浙江"},
					{"id":"340000","name":"安徽省","shortName":"安徽"},
					{"id":"350000","name":"福建省","shortName":"福建"},
					{"id":"360000","name":"江西省","shortName":"江西"},
					{"id":"370000","name":"山东省","shortName":"山东"},
					{"id":"410000","name":"河南省","shortName":"河南"},
					{"id":"420000","name":"湖北省","shortName":"湖北"},
					{"id":"430000","name":"湖南省","shortName":"湖南"},
					{"id":"440000","name":"广东省","shortName":"广东"},
					{"id":"450000","name":"广西壮族自治区","shortName":"广西"},
					{"id":"460000","name":"海南省","shortName":"海南"},
					{"id":"500000","name":"重庆市","shortName":"重庆"},
					{"id":"510000","name":"四川省","shortName":"四川"},
					{"id":"610000","name":"陕西省","shortName":"陕西"}
				];

			var pageHtml = ele("addressSelect"),
				selectedNode = ele("selected");

			// 为地址选择添加显示动画; 
			pageHtml.setAttribute("class","page-fixed address-select address-select-show");

			if(!ele("firstSelect")){

				var firstNode = document.createElement("ul");
				firstNode.setAttribute("id", "firstSelect");

				// 插入省级行政单位
				firstNode.innerHTML = resultli(firstArray);
				selectedNode.parentNode.appendChild(firstNode);

				// 为插入的元素绑定事件
				var liNode = firstNode.getElementsByTagName("li");
				for(var i = 0; i < liNode.length; i++) {
					liNode[i].addEventListener("tap", secondFun, false);
				}
			}
		}

		// 市级行政单位选择;
		function secondFun() {
			
			var that = this;
			if(that == window) return;

			// 通过Ajax请求返回的数据
			var	secondArray = [{"id":"110100","name":"北京市","shortName":"北京"}];

			var selectedNode = ele("selected");	
			
			var setliNode = document.createElement("li") 
			setliNode.innerHTML = that.innerHTML;

			// 隐藏上一级行政单位;
			that.parentNode.style.display = "none";

			// 插入已选列表;
			selectedNode.appendChild(setliNode);
			// 为已选中的元素添加事件
			selectedNode.getElementsByTagName("li")[0].addEventListener("tap", reselect, false);

			if(!ele("secondSelect")) {

				var secondNode = document.createElement("ul");
				secondNode.setAttribute("id", "secondSelect");

				// 插入市级行政单位;
				secondNode.innerHTML = resultli(secondArray);
				selectedNode.parentNode.appendChild(secondNode);

				// 为插入的元素绑定事件
				var liNode = secondNode.getElementsByTagName("li");
				for(var i = 0; i < liNode.length; i++) {
					liNode[i].addEventListener("tap", thirdFun, false);
				}
			}
		}

		// 区、县级行政单位选择;
		function thirdFun() {
			
			var that = this;
			if(that == window) return;

			// 通过Ajax请求返回的数据
			var thirdArray = [
					{"id":"110114","name":"昌平区","shortName":"昌平"},
					{"id":"110105","name":"朝阳区","shortName":"朝阳"},
					{"id":"110101","name":"东城区","shortName":"东城"},
					{"id":"110115","name":"大兴区","shortName":"大兴"},
					{"id":"110111","name":"房山区","shortName":"房山"},
					{"id":"110106","name":"丰台区","shortName":"丰台"},
					{"id":"110108","name":"海淀区","shortName":"海淀"},
					{"id":"110116","name":"怀柔区","shortName":"怀柔"},
					{"id":"110109","name":"门头沟区","shortName":"门头沟"},
					{"id":"110228","name":"密云县","shortName":"密云"},
					{"id":"110117","name":"平谷区","shortName":"平谷"},
					{"id":"110107","name":"石景山区","shortName":"石景山"},
					{"id":"110113","name":"顺义区","shortName":"顺义"},
					{"id":"110112","name":"通州区","shortName":"通州"},
					{"id":"110102","name":"西城区","shortName":"西城"},
					{"id":"110229","name":"延庆县","shortName":"延庆"}
				];
			
			var selectedNode = ele("selected");	
			
			var setliNode = document.createElement("li") 
			setliNode.innerHTML = that.innerHTML;

			// 隐藏上一级行政单位;
			that.parentNode.style.display = "none";

			// 插入已选列表;
			selectedNode.appendChild(setliNode);
			// 为已选中的元素添加事件
			selectedNode.getElementsByTagName("li")[1].addEventListener("tap", reselect, false);

			if(!ele("thirdSelect")) {

				var thirdNode = document.createElement("ul");
				thirdNode.setAttribute("id", "thirdSelect");

				// 插入省级行政单位;
				thirdNode.innerHTML = resultli(thirdArray);
				selectedNode.parentNode.appendChild(thirdNode);

				// 为插入的元素绑定事件
				var liNode = thirdNode.getElementsByTagName("li");
				for(var i = 0; i < liNode.length; i++) {
					liNode[i].addEventListener("tap", fourthFun, false);
				}
			}
		}

		// 街道信息
		function fourthFun() {

			var that = this;
			if(that == window) return;

			// 通过Ajax请求返回的数据
			var	fourthArray = [
					{"id":"110114113","name":"百善镇","shortName":"百善镇"},
					{"id":"110114115","name":"北七家镇","shortName":"北七家镇"},
					{"id":"110114001","name":"城北街道","shortName":"城北街道"},
					{"id":"110114005","name":"城南街道","shortName":"城南街道"},
					{"id":"110114112","name":"崔村镇","shortName":"崔村镇"},
					{"id":"110114007","name":"东小口","shortName":"东小口"},
					{"id":"110114006","name":"回龙观","shortName":"回龙观"},
					{"id":"110114010","name":"霍营街道","shortName":"霍营街道"},
					{"id":"110114118","name":"流村镇","shortName":"流村镇"},
					{"id":"110114003","name":"马池口","shortName":"马池口"},
					{"id":"110114002","name":"南口","shortName":"南口"},
					{"id":"110114111","name":"南邵镇","shortName":"南邵镇"},
					{"id":"110114004","name":"沙河","shortName":"沙河"},
					{"id":"110114119","name":"十三陵镇","shortName":"十三陵镇"},
					{"id":"110114008","name":"天通苑北街道","shortName":"天通苑北街道"},
					{"id":"110114009","name":"天通苑南街道","shortName":"天通苑南街道"},
					{"id":"110114110","name":"小汤山镇","shortName":"小汤山镇"},
					{"id":"110114116","name":"兴寿镇","shortName":"兴寿镇"},
					{"id":"110114104","name":"阳坊镇","shortName":"阳坊镇"},
					{"id":"110114120","name":"延寿镇","shortName":"延寿镇"}
				];

			var liNode = ele("selected").getElementsByTagName("li");

			var streetNode = ele("street");

			var streetChild = "";

			if(fourthArray.length != 0) {
				streetChild = "<option value='暂不选择'>暂不选择</option>";
				for (var i = 0; i < fourthArray.length; i++) {
					streetChild += "<option value="+fourthArray[i].name+">"+fourthArray[i].name+"</option>";
				};
			} else {
				streetChild = "<option value='暂不选择'>暂不选择</option>";
			}
			
 			streetNode.innerHTML = streetChild;

			streetNode.setAttribute("style", "rgb(153,153,153)");

			var result = "";
			for(var i = 0; i < liNode.length; i++) {
				result += "<span id="+"city"+(i+1)+">"+liNode[i].innerHTML+"</span>";
			}

			result += "<span id='city3'>"+that.innerHTML+"</span>";

			ele("city-picker").innerHTML = result;
			
			ele("street").addEventListener("change", selectFun, false);

			ele("addressSelect").setAttribute("class","page-fixed address-select");
		}

		// 重新选择省级行政单位;
		function reselect() {

			var that = this,
				curNode = that.parentNode,
				_parents = curNode.parentNode,
				liNode = curNode.getElementsByTagName("li"),
				ulNode = _parents.getElementsByTagName("ul");

			// 被点击元素的索引值;
			var curIndex = _index(liNode, that);

			// 删除已被添加的同级地址;
			for(var i = liNode.length-1; i >= curIndex; i--) {
				curNode.removeChild(liNode[i]);
			}

			// 显示当前可选项;
			for(var i = ulNode.length-1; i > curIndex; i--) {
				
				if(i == curIndex+1) {
					ulNode[i].style.display = "block";
					break;
				}
				_parents.removeChild(ulNode[i]);
			}
		}

		// 改变选择街道信息的文字颜色
		function selectFun() {

			var _index = this.selectedIndex;
			console.log(_index);
			_index != 0 ?
				this.setAttribute("style","color: rgb(68,68,68)"):
				this.setAttribute("style","color: rgb(153,153,153)");
		}
	}
}

// 获取文本值
function nodeText(object, str){ return object.find(str).text() }

// 选择收货地址;
function selected() {

	var that = $(this),_phone,_receiver,_address;
	_phone = nodeText(that, ".phone");
	_receiver = nodeText(that, ".receiver");
	_address = nodeText(that, ".order-address")

	// 更改选中、未选中状态;
	$(".confirm").attr("class", "confirm iconfont icons-confirm")
	that.find(".confirm").attr("class", "confirm iconfont icons-confirm-active");

	// 更改地址显示;
	$("#phone").text(_phone);
	$("#receiver").text(_receiver);
	$("#address").text(_address);
	transitions()
}

// 添加收货地址;
$(".add-address").on("click", function(){addDOM()});

// 收货地址page返回;
$("#pageBack").on("click", function(){transitions()});

$("#pageBack01").on("click", function(){
	setTimeout(function(){
		$("#addressSelect").removeClass("address-select-show");
	});
});

// 转场动画
function transitions() {
	setTimeout(function(){
		$(".pageAddress").removeClass("addressShow");
		$(".pageOrder").removeClass("orderHide");
	},500)
}

// 选择收货地址;
$(".addressItem").each(function(){
	$(this).get(0).addEventListener("tap", selected, false);
});

// 更换收货地址;
$(".orderAddress").each(function(){
	$(this).get(0).addEventListener("tap", selected, false);
});

function changeAddress() {
	$(".pageAddress").addClass("addressShow");
	$(".pageOrder").addClass("orderHide");
}

// 删除收货地址
$(".address-delete").each(function(){
	this.getElementsByTagName("a")[0].addEventListener("tap", deleteAddress, false);
});

// 提交新收货地址
function submitAddress() {

	var that = $(this);

	var submitNext = function () {
		var number = "222";
		// 姓名	
		var _userName = getValue($("#userName")),
			// 电话
			_telephone = getValue($("#telephone")),
			// 收货地址
			_addressText = $("#city-picker").text() + $("#street").find("option:selected").val();
			// 邮编
			_zipCode = getValue($("#zipCode"));
			
			// 用于插入收货地址列表
		var htmlDOM01 = "<div class='addressItem-box'>" +
							"<div class='addressItem' id="+ number +">" +
								"<span class='confirm iconfont icons-confirm-active'>&#xe609;</span>" +
								"<div class='order-contact'>" +
									"<em class='fn-right phone'>"+ _telephone +"</em>" +
									"<span class='receiver'>收货人："+ _userName +"</span>" +
								"</div>" +
								"<p class='order-address'>收货人地址："+ _addressText +"</p>" +
							"</div>" +
							"<div class='address-delete'><a href='javascript:void(0)'><span class='iconfont'>&#xe61b;</span>删除</a></div>" +
						"</div>";

		// 隐藏弹出的收货地址;
		maskHide();

		// 将添加的收货地址置为高亮状态
		$(".icons-confirm-active").attr("class","confirm iconfont icons-confirm");
		// 将收货地址添加至收货地址列表
		$(".addressPage").prepend(htmlDOM01);

		$(".address-delete").find("a").get(0).addEventListener("tap", deleteAddress, false);
		
		// 绑定事件,用于选择收货地址
		$(".addressItem").each(function(){
			this.addEventListener("tap", selected, false);
		});

		if($(".orderAddress").length == 0) {

			var htmlDOM02 = "<div class='orderAddress addrChange' id="+ number +">" +
								"<span class='fn-left iconfont receipt-img'>&#xe617;</span>" +
								"<div class='order-info01'>" +
									"<span class='fn-right iconfont order-arrow'>&#xe60c;</span>" +
									"<div class='order-contact'>" +
										"<span class='fn-right phone' id='phone'>"+ _telephone +"</span>" +
										"<em class='receiver' id='receiver'>收货人："+ _userName +"</em>" +
									"</div>" +
									"<p class='order-address' id='address'>收货人地址："+ _addressText +"</p>" +
								"</div>" +
							"</div>";

			$(".addAddress").after(htmlDOM02);
			$(".addAddress").remove();
			$(".addrChange").get(0).addEventListener("tap", changeAddress, false);

		} else {
		
			$("#phone").text(_telephone);
			$("#receiver").text("收货人："+ _userName);
			$("#address").text("收货人地址："+ _addressText);
		}

		transitions();
	}

	// 获取value
	function getValue(option) { return option.val() }

	that.get(0).addEventListener("tap",submitNext, false);
};

// 删除收货地址
function deleteAddress(){

	var that = $(this),
		selected = that.parents(".addressItem-box"),
		selectedIcon = selected.find(".icons-confirm-active");

	if(selectedIcon.length == 0) {
		error({
			text:"请再次确认删除该收货地址",
			ok: "确定",
			cancel: "取消"
		});

		$(document).on("tap", ".btn-ok", function(that){
			console.log(that);
			alert("删除收货地址");
		});
	}
		else
	{
		error({
			text:"默认选中收货地址不能被删除"
		});
	}
}

//为页面html动态设置font-size值
(function (doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
    recalc = function () {
        var clientWidth = docEl.clientWidth;
        if (!clientWidth) return;
        docEl.style.fontSize = clientWidth / 37.5 + 'px';
    };
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);//resize
    doc.addEventListener('DOMContentLoaded', recalc, false);//reload
})(document, window);