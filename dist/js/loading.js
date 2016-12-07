(function() {
    var pageDiv = document.createElement("div");
    pageDiv.setAttribute("class","page-mask");
    
    var loadDiv = document.createElement("div");
    loadDiv.setAttribute("class","loading-box");
    
    pageDiv.appendChild(loadDiv);

    var s = document.getElementById("page");
    	
    s.parentNode.insertBefore(pageDiv, s);

	// s.style.display = "none";

	//监听加载状态改变
    document.onreadystatechange = completeLoading;

    //加载状态为complete时移除loading效果
    function completeLoading() {
        if (document.readyState == "complete") {
        	// s.style.display = "block";			
			pageDiv.parentNode.removeChild(pageDiv);
        }
    }
})();

 