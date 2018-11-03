$(function(){
	window.T = window.t;
	console.log('init!');
	window.activePageNum = 0;
	window.pageSize = 20;
	var condition = {};
	$('#query-startsTimeF').val(new Date().format('yyyy-MM-dd hh:mm:ss'));
	$('#query-startsTimeT').val(getNextHour5().format('yyyy-MM-dd hh')+':59:59');
	if(window.location.href.indexOf('permission=admin')===-1){
		$('#query-startsTimeF').attr("disabled","disabled");
		$('#query-startsTimeT').attr("disabled","disabled");
	}
	$('#page-num ul a').on('click',function(e){
		var $cur=$(e.target),toPageNum;
		if ($cur.parent().hasClass('disabled')) return false;
		$cur.html().indexOf('上一页') !== -1 && (toPageNum = activePageNum - 1);
		$cur.html().indexOf('下一页') !== -1 && (toPageNum = activePageNum + 1);
		toPageNum===undefined && (toPageNum=parseInt($cur.html()));
		console.log('old activePageNum:'+activePageNum+',toPageNum:'+toPageNum);
		if(toPageNum <=0 || activePageNum == toPageNum) return;
		ajaxGetQiangPage(toPageNum,pageSize,condition,function(data){
			//显示前端页面
			setTimeout(function(){$('#back-to-top')[0].click();},10);
			data.list.length == 0 && layer.msg('该页（'+toPageNum+'）无数据！');
			data.pageNum !== toPageNum && layer.msg('该页'+toPageNum+'无数据！系统自动切到第'+data.pageNum+'页');
			activePageNum = data.pageNum;
			console.log('new activePageNum:'+activePageNum);
			dealPageNum(data.list.length);
		})
	})
	
	$('#page-num li')[1].getElementsByTagName('a')[0].click();
	
	$('#query-btn').on('click',function(){
		condition.title = $('#query-title').val()||'';
		if(condition.title) condition.title = '%'+condition.title+'%';
		condition.startsTimeF=$('#query-startsTimeF').val();
		condition.startsTimeT=$('#query-startsTimeT').val();
		condition.couponFlag=$('#query-couponFlag').val();
		if($('#query-recommendFlag').prop("checked")){
			condition.recommendFlag="Y";
		}else{
			condition.recommendFlag="";
		}
		//console.log(condition);
		ajaxGetQiangPage(1,pageSize,condition,function(data){
			data.list.length == 0 && layer.msg('该页（1）无数据！');
			activePageNum = data.pageNum;
			dealPageNum(data.list.length);
		});
	})
	
	$('#query-btn-more').on('click',function(){
		$('.more-part').toggleClass('show-more-part');
	})
	
	$('#query-form').on('submit',function(){
		$('#query-btn')[0].click();
		return false;
	})
	
	//倒计时的广告，只在电脑端显示
	if (false && document.body.clientWidth>=768){
		layer.open({
		  type: 1,
		  title: false,
		  closeBtn: 1, //显示关闭按钮
		  shade: [0],
		  area: ['400px', '300px'],
		  offset: 'rb', //右下角弹出
		  time: 4500, //自动关闭
		  shadeClose: true,
		  anim: 2,
		  content: '<div id="qiang-ad"><img style="-webkit-user-select:none; width:400px; height:300px;cursor:pointer;" src="https://samt007.github.io/quick-buy-web/images/qiang-ad.jpg"></div>', //['images/qiang-ad.jpg', 'no'], //iframe的url，no代表不显示滚动条
		  success: function(layero, index){
			  //console.log(layero, index);
			  //$(layero).find('img').css({"width":'340px',"height":'215px'})
			  $('#qiang-ad').on('click',function(){
				  window.open('https://pan.baidu.com/s/1Xc6riV2eHfJorUIGXZVxwA');
			  })
			  $('#layui-layer-shade2').css('display','none');
		  },
		  end: function(){ //此处用于演示
		  }
		});
	}
})
// 例子： 
// (new Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
function getNextHour(){
	var nextHourTime=new Date().getTime()+1000*60*60;
	console.log('next hour:',new Date(nextHourTime).format("yyyy-MM-dd hh:mm:ss"));
	return new Date(nextHourTime);
}
function getNextHour5(){
	var nextHourTime=new Date().getTime()+5*1000*60*60;
	console.log('next hour:',new Date(nextHourTime).format("yyyy-MM-dd hh:mm:ss"));
	return new Date(nextHourTime);
}
function objToUrl(j) {
	var k = [];
	for (var a in j) {
		k.push(a + "=" + (j[a] || "").toString())
	}
	return k.join("&")
}
function ajaxGetQiangPage(pageNum,pageSize,condition,callback){
	var load = layer.load(0, {
		shade: [0.4,'#fff'], //0.1透明度的白色背景
		success: function(layero){
			console.log(layero);
			$(layero).css({'width':'60px','left':'49%'});
		}
	});
	//var url = 'http://192.168.88.123:8088/quick-buy/fnd/quickbuy/qiang/getPage';
	var url = 'http://59.36.15.120:8889/quick-buy/fnd/quickbuy/qiang/getPage';
	$.ajax({
		async:true,
		type:'get', 
		data: objToUrl({
			"startsTimeF": condition.startsTimeF ||(new Date().format('yyyy-MM-dd hh:mm:ss'))
			,"startsTimeT": condition.startsTimeT ||(getNextHour5().format('yyyy-MM-dd hh')+':59:59')
			,"source": "1"
			,"pageSize":pageSize
			,"pageNum":pageNum
			,"quantityF": 1
			,"couponFlag": condition.couponFlag||""
			,"paimaiFlag": condition.paimaiFlag||"N"
			,"recommendFlag": condition.recommendFlag||""
			,"title": condition.title ? encodeURI(condition.title):""
			,"token": "1qaz3edc5tgb7ujm9ol"
			}),
		contentType:'application/json;charset=UTF-8',
		url: url,
		dataType:'json',
		timeout: 3000, //超时时间：3秒
		success: function (data) {
			layer.close(load);
			console.log('获取第'+pageNum+'页');
			if(data.code=='0'){
				var list = {"list": data.data.list}
				var $tplQiang = $("#qiang_list_tpl");
				var tmpl = new T($tplQiang.html()), qiangListHtml = tmpl.render(list);
				$("#qiang-list").html(qiangListHtml);
				callback && callback(data.data);
			}else{
				layer.alert('获取数据失败！错误信息：'+data.message);
			}
		},
		error: function (e) {		
			layer.close(load);
			layer.alert("提示：获取倒计时数据失败！请稍后重试！");
		}
	});
}
function dealPageNum(dataLength){//处理分页显示
	$('#page-num li').removeClass('disabled').removeClass('active');//下面的代码是处理页面的样式。
	if(activePageNum<=3){
		for(var i=1;i<=5;i++){
			$($('#page-num li')[i]).find('a').html(i);
		}
		$($('#page-num li')[activePageNum]).addClass('active');
	}else{
		for(var i=1;i<=5;i++){
			$($('#page-num li')[i]).find('a').html(activePageNum-3+i);
			i==3 && $($('#page-num li')[i]).addClass('active');
		}
	}
	activePageNum == 1 && $($('#page-num li')[0]).addClass('disabled');//第一页要失效上一页
	if(dataLength<pageSize){//说明已经到了最后一页了，需要将后面的页数都失效
		for(var i=1;i<=5;i++){
			var dealPageNum = parseInt($($('#page-num li')[i]).find('a').html());
			//console.log(dealPageNum);
			dealPageNum > activePageNum && $($('#page-num li')[i]).addClass('disabled');
		}
		$($('#page-num li')[6]).addClass('disabled');//下一页也要失效
	}
	
}
