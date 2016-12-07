
//保存最后的组合结果信息
var SKUResult = {}, _ppathIdmap, skuSelectedArray = [];

// 获取cookie信息中的可能存在的sku购物车信息与商品ID
var goodsID = 15415664,
	goodsIDCookie = 15415664,
	skuCookie = [
		{
			count: 7,
			imgUrl: "http://gd3.alicdn.com/bao/uploaded/i3/2628086722/TB2X_GgmFXXXXbBXpXXXXXXXXXX_!!2628086722.jpg",
			price: "18",
			productSkuId: "3147270890549",
			propertyInfo: "颜色分类:黑色;拖把头个数:3个;类型:金属篮;拖把杆类型:加强杆+不锈钢盘"
		},
		{
			count: 5,
			imgUrl: "http://gd4.alicdn.com/bao/uploaded/i4/2628086722/TB2fn0vgFXXXXawXXXXXXXXXXXX_!!2628086722.jpg",
			price: "200",
			productSkuId: "3147270890545",
			propertyInfo: "颜色分类:紫色;拖把头个数:3个;类型:金属篮;拖把杆类型:加强杆+不锈钢盘"
		}
	];

function skuContent(str, data, buyType, price) {
	
	var num = 9, floorPrice
	_skuMap = data.data.skuMap;

	for(attribute in _skuMap){     	
     	num += parseInt(_skuMap[attribute].quantity);
	}
	
	// 判断是否可添加购买数量
	var pushClass = num > 1 ? "btn-increase-active" : "btn-increase-not";
	
	var content ="<section class='mask-box'></section>" +
				"<section class='skuBox anmite-show' id='skuSelect'>" +
					"<div class='commodity'>" +
						"<span class='fn-left commodity-img'>" +
							"<img data-src='http://gd3.alicdn.com/bao/uploaded/i3/TB1vqAkLXXXXXXAXXXXXXXXXXXX_!!0-item_pic.jpg_600x600.jpg' id='img' />" +
						"</span>" +
						"<div class='commodity-tit-price'>" +
							"<h3 class='commodity-tit'>国行联保Canon/佳能微单相机EOS M2 18-55STM镜头eosm2单电数码</h3>" +
							"<em class='commodity-price'><span class='text-color'>¥<i id='price'>151</i></span></em>" +
							"<span class='add-cart'>加入购物车</span>" +

							// 购物车加减
							"<span class='number-control brcolor'>" +
								"<span class='iconfont btn-increase'>&#xe60a;</span>" +
								"<span class='fn-right curnum' id='quantity' data-max='4149'>1</span>" +
								"<span class='iconfont btn-decrease'>&#xe603;</span>" +
							"</span>" +

						"</div>" +
					"</div>" +

					"<div class='sku-control'><dl id='sku-control'>"+str+"</dl></div>" +

					"<div class='buy-number'>" +
						// 单个sku加减;
						"<span class='number-control number-control-nocart'>" +
							"<span class='fn-right iconfont btn-increase'>&#xe60a;</span>" +
							"<span class='fn-right num-nocart' max='50'>1</span>" +
							"<span class='fn-right iconfont btn-decrease'>&#xe603;</span>" +
						"</span>" +

						"<em>购买数量</em>" +
					"</div>" +

					"<div class='sku-btn-box' style='display:none;'>" +
						"<button class='btn-sku btn-sku-active'>结 算</button>" +
						"<span class='iconfont icon-cart icon-cart-active' id='cartShopping'>&#xe621;" +
							"<i class='cart-num'>0</i>" +
						"</span>" +
						"<em class='sku-total sku-total-active'>¥" +
							"<i class='totalPrice'>0</i>" +
						"</em>" +
					"</div>" +
					"<button class='btn-next' id='skuNext'>下一步</button>" +
					"<input type='hidden' id='skuId'><input type='hidden' id='skuInfo'>"+
					"<input type='hidden' id='buyType' value='"+buyType+"'>"+
				"</section>";

	// 所有存在库存的SKU组合;
	_ppathIdmap = data.data.ppathIdmap;

	// sku库存与价格
	var _skuMap = data.data.skuMap;

	// 将json对象转化成字符串;
	var _character = JSON.stringify(_ppathIdmap);
	// 去除首尾的花括符以及字符串中的双引号;
	_character = _character.substring(1,_character.length-1).replace(/\"/g, "");	

	$("body").append(content);
	$("body").children().eq(0).addClass("page-box");

	/* 	
	*	获取商品ID与cookie中的sku信息
	* 	并返回新的已选sku信息
	*/ 
	if(goodsIDCookie == goodsID && !!skuCookie) {		

		for(var i = 0, len = skuCookie.length; i < len; i++) {

			for(attribute in _ppathIdmap) {

				var attrID = _ppathIdmap[attribute];

				if(skuCookie[i].productSkuId == attrID) {

					var ppathIdmapArray = attribute.split(";");
					
					for(var j = 0, leng = ppathIdmapArray.length; j < leng; j++) {

					}

					var _price = $("#buyType").val() == "group" ? _skuMap[attrID].groupPrice : _skuMap[attrID].price;
					skuCookie[i].price = _price;
					skuSelectedArray.push(skuCookie[i]);
					floorPrice = attribute;
					break;
				}
			}
		}
	}	

	// 点击商品缩略图显示大图;
	document.getElementById("img").addEventListener("tap", function(){

		var $that = $(this),
			_src = $that.attr("src"),
			divNode = document.getElementById('de-pic-box');

		if(!divNode) {
			// 创建元素显示商品大图
			var imgBoxNode = document.createElement("div"),
				imgNode = document.createElement("img");

			imgNode.setAttribute("src", _src);
			imgBoxNode.setAttribute("id", "de-pic-box");
			imgBoxNode.setAttribute("style","display:block");

			// 将元素显示在页面上
			imgBoxNode.appendChild(imgNode);
			document.body.appendChild(imgBoxNode);

			// 添加事件用于点击隐藏大图
			imgBoxNode.addEventListener("tap", function() {
				this.style.display = "none";
			}, false);
		}
			else
		{
			divNode.getElementsByTagName("img")[0].setAttribute("src", _src);
			divNode.setAttribute("style","display:block");
		}

	}, false);

	// 点击加入购物车
	$(".add-cart").get(0).addEventListener("tap", joinCart, false);

	// 点击购物车	
	document.getElementById("cartShopping").addEventListener("tap", clickCart, false);
	
	// sku数量添加
	$(".btn-increase").each(function(){
		this.addEventListener("tap", skuPlus, false);
	})

	// sku数量减少
	$(".btn-decrease").each(function(){
		this.addEventListener("tap", skuMinus, false);
	})

	// 提交sku选择
	// $(".btn-sku").get(0).addEventListener("tap", skuSubmit, false);

	initSKU(skuArray(_character, _skuMap));

	var nodes = $(".sku-control label");

	if(nodes.length > 0) {

		floorPrice = !!floorPrice ? floorPrice.split(";") : data.data.floorPrice.split(";");

		for(var i = 0; i < nodes.length; i++) {

			nodes[i].addEventListener("click", clickSKU, false);

			var skuMapId = $(nodes[i]).parent().prev("dt").attr("data-value") +":"+ $(nodes[i]).attr("data-value");

			for(var j = 0; j < floorPrice.length; j++) {

				if(floorPrice[j] == skuMapId) {
					nodes[i].click()
					break;
				}
			}

			nodes[i].removeEventListener("click", clickSKU, false);

			// 绑定事件
			nodes[i].addEventListener("tap", clickSKU, false);
		}
	}

	// 如果cookie中存在之前的购物车信息;
	if(skuSelectedArray.length != 0) {

		var cartNum = 0, totalPrice = 0,
			len = skuSelectedArray.length;
		
		for(var i = 0; i < len; i++) {
			// cookie中存放的每个sku组合的个数与单价;
			var _num = parseInt(skuSelectedArray[i].count),
				_price = parseFloat(skuSelectedArray[i].price);
			cartNum += _num;
			totalPrice += parseFloat(_price*_num);
		}

		$(".cart-num").text(cartNum);
		$(".totalPrice").text(totalPrice.toFixed(2));

		var skuID = $("#skuId").val();
		for(var i = 0; i < len; i++) {
			if(skuSelectedArray[i].productSkuId == skuID) {
				$("#quantity").text(skuSelectedArray[i].count);
				$(".add-cart").css("display", "none").next().css("display", "block");
				break;
			}
		}
		$(".buy-number").css("display", "none").next().css("display", "block").next().css("display", "none");
	}
	
	$(".mask-box").get(0).addEventListener("tap", maskHideFun, false);
}

function skuSelect(obj) {

	//  购买类型  团购  单买
	var buyType = obj.hasClass("btn-buy01") ? "single" : "group";

	var _price = obj.find("em").text();
		_price = _price.substr(1, _price.length);

	// 不存在sku选择界面的时候发起请求
	if($(".skuBox").length == 0) {
		$.ajax({
	        type: 'GET',
	        url: 'json/sku.json',
	        dataType: 'json',
	        success: function(data){

	            var result = '',
	            optionsProps = data.data.skuProps,
	            skukeys = JSON.stringify(data.data.ppathIdmap),
	            floorPrice = data.data.floorPrice.split(";");

	            for(var i = 0; i < optionsProps.length; i++){
	                
	                var _values = optionsProps[i].values, label="",
	                _dt = "<dt data-item="+ i +" data-value="+optionsProps[i].propId+">"+optionsProps[i].propName+"</dt>";

	                for (var j = 0; j < _values.length; j++) {

	                	var _bool = false,
	                		key = optionsProps[i].propId +":"+ _values[j].valueId;

	                	for(var n = 0; n < floorPrice.length; n++) {

	                		if(floorPrice[n] == key) {
	                			_bool = true;
	                		}
	                	}

	                	if(skukeys.indexOf(key) > 0) {

		                	if(_values[j].imgUrl) {

		                		// _bool ?

				                	// label+="<label class='checked' data-img="+_values[j].imgUrl+" data-value="+_values[j].valueId+">"+_values[j].name+"</label>":
				                	label+="<label data-img="+_values[j].imgUrl+" data-value="+_values[j].valueId+">"+_values[j].name+"</label>"

		                	} else {

		                		// _bool ?

			                		// label+="<label class='checked' data-value="+_values[j].valueId+">"+_values[j].name+"</label>" :
			                		label+="<label data-value="+_values[j].valueId+">"+_values[j].name+"</label>"
		                	}

		                } else {

			                label;
		                }
	            	};

	                result += _dt + "<dd>"+label+"</dd>";
	            };

	            // buyType :单买(single)  团购(group)
	            skuContent(result, data, buyType, _price);
	        },
	        error: function(){
	            alert('Ajax error!');
	        }
	    });
	} else {
		$(".mask-box").css("display","block");
		$(".skuBox").removeClass("anmite-hide");
	}
}

// 获取sku组合信息
function skuArray(str, skuMap) {

	var skuMapData = {};

	arry = str.split(",");
	for(var i=0; i< arry.length; i++) {
		
		arry[i] = arry[i].replace(/\;/g,",");
		// 找出字符串中的最后一个":";
		var index = arry[i].lastIndexOf(":")+1;

		arry[i] = replacePos(arry[i], index, ",");

		arry[i] = arry[i].split(",");

		for(var j = 0; j < arry[i].length; j++) {

			var n = arry[i][j].indexOf(":") + 1;
			arry[i][j] = arry[i][j].substring(n, arry[i][j].length);
		}

		var skuMapId = arry[i][arry[i].length - 1];
		arry[i] = arry[i].splice(0, arry[i].length - 1).join(";");

		skuMapData[arry[i]] = skuMap[skuMapId];
	}

	return skuMapData;
}

// 移除字符串中指定位置的指定字符;
function replacePos(strObj, pos, replacetext) {
   var str = strObj.substr(0, pos-1) + replacetext + strObj.substring(pos, strObj.length);
   return str;
}

function clickSKU(){

	var a = $(this), skuIdStr, valueId = "",skuInfo = ""
		oddImgURL = $("#img").attr("data-src"),
		buyType = $("#buyType").val(),
		oddprice = $("#price").text();

	if(!$(this).hasClass("disabled")) {

		// console.log("1111"); 
		// 获取可能存在的图片
		var imgURL = a.attr("data-img");
		imgURL != null ? (a.hasClass("checked") ? $("#img").attr("src",oddImgURL) : $("#img").attr("src",imgURL)) : false;

		// 修改是否高亮显示
		a.toggleClass("checked").siblings().removeClass("checked");

		var e = $(".checked");
		if (e.length) {
			var s = [];
			e.each(function() {
				s.push($(this).attr("data-value"))
			}),
			s.sort(function(t, a) {
				return parseInt(t) - parseInt(a)
			});
			var n = s.length;
			var i = buyType == "single" ? SKUResult[s.join(";")].prices : SKUResult[s.join(";")].groupPrices,
			l = Math.max.apply(Math, i),
			o = Math.min.apply(Math, i);

			// 设置价格;
			$("#price").text(l > o ? o + "-" + l: l);
			
			// 设置库存
			// $("#quantity").attr("max",SKUResult[s.join(";")].quantity);

			// 设置最多可购买
			// var num = parseInt($("#quantity").text());
			// var maxNum = parseInt($("#quantity").attr("max"));

			// num > maxNum ? $("#quantity").text(maxNum) : $("#quantity").text(num);

			$(".sku-control label").not(e).not(a).each(function() {
				var a = $(this).siblings(".checked"),
				e = [];
				if (a.length) for (var i = a.attr("data-value"), l = 0; n > l; l++) s[l] != i && e.push(s[l]);
				else e = s.concat();
				e = e.concat($(this).attr("data-value")),
				e.sort(function(t, a) {
					return parseInt(t) - parseInt(a)
				}),						
				SKUResult[e.join(";")] ? $(this).removeClass("disabled") : $(this).addClass("disabled");
			})

		} else { 

			$("#price").text(oddprice);
			$(".sku-control label").each(function() {
				SKUResult[$(this).attr("data-value")] ? $(this).removeClass("disabled") : $(this).addClass("disabled");
			});
		}
	}

	$(".checked").each(function(){
		valueId += $(this).parent("dd").prev().attr("data-value")+":"+($(this).attr("data-value"))+";";

		var skuType = $(this).parent().prev().text(),
			typeValue = $(this).text();
		// sku组合的文字信息;
		skuInfo += skuType +":"+ typeValue +"  ";
	});

	valueId = valueId.substring(0, valueId.length-1);

	skuIdStr = _ppathIdmap[valueId];
	
	$("#skuId").val(skuIdStr);

	$("#skuInfo").val(skuInfo);

	// 在已选的数组对象中查找此次选择的sku是否已存在于购物车中
	for(var i = 0, len = skuSelectedArray.length; i < len; i++) {

		var skuSelectedValue = skuSelectedArray[i].productSkuId;

		if( skuIdStr != skuSelectedValue) {

			$(".brcolor").css("display", "none");
			$(".add-cart").css("display", "block");

		} else {

			var num = skuSelectedArray[i].count;
			$("#quantity").text(num);
			$(".add-cart").css("display", "none");
			$(".brcolor").css("display", "block");
			break;
		}
	}	
}

//获得对象的key
function getObjKeys(obj) {
	if (obj !== Object(obj)) throw new TypeError('Invalid object');
	var keys = [];
	for (var key in obj)
		if (Object.prototype.hasOwnProperty.call(obj, key))
			keys[keys.length] = key;
	return keys;
}
 
//把组合的key放入结果集SKUResult
function add2SKUResult(combArrItem, sku) {
	var key = combArrItem.join(";");
	//SKU信息key属性
	if(SKUResult[key]) {
		SKUResult[key].quantity += sku.quantity;
		SKUResult[key].prices.push(sku.price);
		SKUResult[key].groupPrices.push(sku.groupPrice);
	} else {
		SKUResult[key] = {
			quantity : sku.quantity,
			prices : [sku.price],
			groupPrices :[sku.groupPrice]
		};
	}
}
 
// 初始化得到结果集
function initSKU(skuMapData) {

	var i, j, skuKeys = getObjKeys(skuMapData);

	for(i = 0; i < skuKeys.length; i++) {
		// 一条SKU信息key
		var skuKey = skuKeys[i];
		// 一条SKU信息value
		var sku = skuMapData[skuKey];
		// SKU信息key属性值数组
		var skuKeyAttrs = skuKey.split(";");

		skuKeyAttrs.sort(function(value1, value2) {
			return parseInt(value1) - parseInt(value2);
		});
		 
		//对每个SKU信息key属性值进行拆分组合
		var combArr = arrayCombine(skuKeyAttrs);
		for(j = 0; j < combArr.length; j++) {
			add2SKUResult(combArr[j], sku);
		}

		//结果集接放入SKUResult
		SKUResult[skuKeyAttrs.join(";")] = {
			quantity:sku.quantity,
			prices:[sku.price],
			groupPrices:[sku.groupPrice]
		}
	}
}
 
// 从数组中生成指定长度的组合;
function arrayCombine(targetArr) {
	if(!targetArr || !targetArr.length) {
		return [];
	}
	 
	var len = targetArr.length;
	var resultArrs = [];
	 
	// 所有组合
	for(var n = 1; n < len; n++) {

		var flagArrs = getFlagArrs(len, n);
		while(flagArrs.length) {
			var flagArr = flagArrs.shift();
			var combArr = [];
			for(var i = 0; i < len; i++) {
				flagArr[i] && combArr.push(targetArr[i]);
			}
			resultArrs.push(combArr);
		}
	}

	return resultArrs;
}
 
// 获得从m中取n的所有组合
function getFlagArrs(m, n) {
	if(!n || n < 1) {
		return [];
	}
	 
	var resultArrs = [],
		flagArr = [],
		isEnd = false,
		i, j, leftCnt;
	 
	for (i = 0; i < m; i++) {
		flagArr[i] = i < n ? 1 : 0;
	}
	 
	resultArrs.push(flagArr.concat());
	 
	while (!isEnd) {
		leftCnt = 0;
		for (i = 0; i < m - 1; i++) {

			if (flagArr[i] == 1 && flagArr[i+1] == 0) {

				for(j = 0; j < i; j++) {
					flagArr[j] = j < leftCnt ? 1 : 0;
				}
				flagArr[i] = 0;
				flagArr[i+1] = 1;
				var aTmp = flagArr.concat();
				resultArrs.push(aTmp);

				if(aTmp.slice(-n).join("").indexOf('0') == -1) {
					isEnd = true;
				}

				break;
			}
			flagArr[i] == 1 && leftCnt++;
		}
	}
	return resultArrs;
}

// 判断sku组合是否有漏选;
function judgment() {

	var  _bool = true;
	len = $(".checked").length;
	// 判断各类型是否被选中
	if(len != $(".sku-control dt").length) {

		for(var i = 0; i < $(".sku-control dt").length; i++) {

			var dtNode = $(".sku-control dt").get(i),
				klassName = $(dtNode).text();

			if($(dtNode).next("dd").find(".checked").length == 0) {
				toastTips("您尚未选择"+klassName);
				_bool = false;
				break;
			}
		}
	}
	return _bool;
}

// 获取选择的sku信息;
function skuSelected() {
	var selectedNode = {}, 
		_productSkuId = $("#skuId").val(),
		_imgUrl = "",
		_count = $("#quantity").text(),
		_propertyInfo = [],
		_price = $("#price").text(),
		skuClass = $("#sku-control dt");

	skuClass.each(function(){
		
		var skukey = $(this).next().find(".checked");

		// 获取组合的sku信息;
		_propertyInfo.push($(this).text() +":"+ skukey.text());
		// 获取图片URL
		var imgLink = skukey.attr("data-img");
		if(imgLink != null) _imgUrl = imgLink;
	});

	selectedNode.productSkuId = _productSkuId;
	selectedNode.imgUrl = _imgUrl;
	selectedNode.count = parseInt(_count);
	selectedNode.price = _price;
	selectedNode.propertyInfo = _propertyInfo.join(";");

	skuSelectedArray.push(selectedNode);

	// // 因为订单提交走的也是购物车模式;
	// // 所以这里最好针对点击的button做一个判断;
	// // 是开启了购物车模式还是点击的下一步购买;
	// var node = document.getElementById('skuNext');
	// return skuSelectedArray = this != node ? skuSelectedArray.push(selectedNode) : [selectedNode];

	return skuSelectedArray;
}

// 加入购物车
function joinCart(){

	var $that = $(this);

	// 判断sku选项是否全部选择完毕;
	if(!judgment()) return;

	if($(".buy-number").css("display") != "none") {
		var curnum = $(".num-nocart").text();
		$("#quantity").html(curnum);
	} 
		else 
	{
		$("#quantity").html("1");
	}

	// 隐藏单买模式、显示购物车模式;
	$(".buy-number").css("display", "none").next().css("display", "block").next().css("display", "none");

	// 隐藏按钮、显示数字与加减;
	$that.css("display","none").next().css("display", "block");
	var _price = parseFloat($("#price").text());
	var _cart = $(".icon-cart");
	_cart.addClass("icon-cart-active");
	_cart.prev().addClass("btn-sku-active");
 
	if($(".cart-num").text() == 0) {
		var totalNum = $("#quantity").text();
		$(".cart-num").text(totalNum);
		_cart.next().find(".totalPrice").text(parseFloat(_price*totalNum).toFixed(2));
	}
		else
	{
		var num = parseInt($(".cart-num").text()) + 1,
			_totalPrice = parseFloat($(".totalPrice").text());
		_totalPrice = parseFloat(_totalPrice + _price).toFixed(2);

		$(".totalPrice").text(_totalPrice);
		$(".cart-num").text(num);
	}

	skuSelected();
	// console.log(skuSelectedArray);
	// var obj = JSON.stringify(skuSelectedArray);
	// localStorage.lastname = obj;
	// console.log(JSON.parse(localStorage.lastname));
}

// 添加sku数量
function skuPlus(){

	var $that = $(this),
		curNum = parseInt($that.next().text()),
		_bool = $that.parent().hasClass("brcolor");

	// 购物车模式添加
	if(_bool || $(".buy-number").css("display") != "block") {

		var i = skuArrayIndex($that),
			num = parseInt(skuSelectedArray[i].count),
			_price = parseFloat(skuSelectedArray[i].price);
			
		var node = $("<span class='animate-point' />");
		$that.parent().append(node);

		skuSelectedArray[i].count = num + 1;

		setTimeout(function(){
			
			var _totalNum = parseInt($(".cart-num").text()) + 1,
				_totalPrice = parseFloat($(".totalPrice").text());
				 
			_totalPrice = parseFloat(_totalPrice + _price).toFixed(2);

			$(".cart-num").text(_totalNum);
			$(".animate-point").eq(0).remove();
			$(".totalPrice").text(_totalPrice);

		}, 1000);

	}
	$(this).next().text((curNum+1));
	console.log("1111");
}

// 减去sku数量
function skuMinus(){
	
	var $that = $(this);

	if(skuArrayIndex($that) == undefined) {		
		var curNum = parseInt($(".num-nocart").text());
		if(curNum != 1) 
		$(".num-nocart").text(curNum-1);
		return false;
	};

	var i = skuArrayIndex($that),
		num = parseInt(skuSelectedArray[i].count),
		_price = parseFloat(skuSelectedArray[i].price),
		_totalNum = parseInt($(".cart-num").text()) - 1,
		_totalPrice = parseFloat($(".totalPrice").text());
		_totalPrice = parseFloat(_totalPrice - _price).toFixed(2);

	if(_totalNum == 0) {

		if(!!$("#shoppingCart").length) {
			maskHideFun();
		}
		
		$(".cart-num").text("0");
		// 隐藏购物车模式,显示单买模式
		$(".buy-number").css("display", "block").next().css("display", "none").next().css("display", "block");
		$(".num-nocart").text("1");
		$(".commodity .number-control").css("display", "none");
		$(".add-cart").css("display", "block");
		skuSelectedArray.splice(i, 1);
	}
		else
	{
		if(num > 1) {
			$(this).prev(".curnum").text((num-1));
			$(".cart-num").text(_totalNum);
			$(".totalPrice").text(_totalPrice);
			$that.prev().text(num-1);
			skuSelectedArray[i].count = num - 1;
		}
			else  
		{				
			$(".cart-num").text(_totalNum);
			$(".totalPrice").text(_totalPrice);
			if(!$("#shoppingCart").length) {
				$(".commodity .number-control").css("display", "none");
				$(".add-cart").css("display", "block");			
			} else {
				$(this).parents(".sku-item").remove();
			}
			skuSelectedArray.splice(i, 1);
		}
	}
}

// 获取当前的sku在数组对象中的第几项;
function skuArrayIndex(_object){

	var _skuId = _object ? _object.parent().next("input").val() : false,
		selected = _skuId ? _skuId : $("#skuId").val();

	for(var i = 0, len = skuSelectedArray.length; i < len; i++) {
		var str = skuSelectedArray[i].productSkuId;
		if(str === selected) return i;
	}
}

// 点击购物车
function clickCart(){
	
	var that = $(this), str = "", total = 0, totalPrice = 0;
	if(!that.hasClass("icon-cart-active")) return;

	for(var i = 0, len = skuSelectedArray.length; i < len; i++) {

		var skuName = "",
			num = parseInt(skuSelectedArray[i].count),
			unitPrice = parseFloat(skuSelectedArray[i].price),
			skuValues = skuSelectedArray[i].productSkuId,
			propertyName = skuSelectedArray[i].propertyInfo,
			nameArry = propertyName.split(";");

			for(var j = 0, leng = nameArry.length; j < leng; j++) {

				var skuAttr = nameArry[j].split(":");

				for(var k = 0, lenNum = skuAttr.length; k < lenNum; k++) {

					if(k == 1) {
						skuName += "<span class='sku-info'><em>#</em>"+ skuAttr[k] +"</span>";
						break;
					}
				}
			}
			
		str += "<div class='sku-item'>" +
					"<div class='sku-item-box'>"+ skuName +"</div>" +
					"<span class='number-control number-control1'>" +
						"<span class='iconfont btn-increase'>&#xe60a;</span>" +
						"<span class='fn-right curnum'>"+ num +"</span>" +
						"<span class='iconfont btn-decrease'>&#xe603;</span>" +
					"</span>" +
					"<input type='hidden' value="+ skuValues +" />" +
				"</div>";

		totalPrice += parseFloat(num*unitPrice);
		total += num;
	}

	var cartPage = "<section class='skuBox skuBox-cart anmite-show' id='shoppingCart'>" + str +						
						"<div class='icon-cart-box'>" +
							"<span class='iconfont icon-cart icon-cart-active'>&#xe621;<i class='cart-num'>"+total+"</i></span>" +
						"</div>" +

						"<div class='sku-btn-box'>" +
							"<button class='btn-sku btn-sku-active'>结 算</button>" +
							"<em class='sku-total sku-total-active' style='margin-left:1.5rem;'>¥<i class='totalPrice'>"+totalPrice.toFixed(2)+"</i></em>" +
						"</div>" +
					"</section>";

	$("#skuSelect").addClass("anmite-hide");

	$("body").append(cartPage);

	var cartNode = document.getElementById("shoppingCart"),
		minusNode = $(cartNode).find(".btn-decrease"),
		plusNode = $(cartNode).find(".btn-increase");

	// 减少sku数量;
	minusNode.each(function(){
		this.addEventListener("tap", skuMinus, false);	
	});

	// 添加sku数量;
	plusNode.each(function(){
		this.addEventListener("tap", skuPlus, false);
	});
}

// 关闭弹出层
function maskHideFun(){

	if($(".skuBox-cart").length != 0) {

		var i = skuArrayIndex();

		$(".skuBox-cart").remove();

		if(i == undefined) {
			$(".commodity .number-control").css("display", "none");
			$(".add-cart").css("display", "block");
		}
			else 
		{
			var	num = skuSelectedArray[i].count;
			$("#quantity").text(num);
		}
		$("#skuSelect").removeClass("anmite-hide");
	}
		else
	{
		$(".mask-box").css("display", "none");
		$("#skuSelect").addClass("anmite-hide");
		$("body").children().eq(0).removeClass("page-box");
	}
}


// function skuSubmit() {
// 	skuSelected();
// 	console.log(skuSelectedArray);
// }
