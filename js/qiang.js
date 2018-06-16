$(function(){
	window.T = window.t;
	console.log('init!');
	ajaxGetQiangPage(1);
	window.activePageNum = 1;
	$('#page-num ul').on('click',function(e){
		var $cur=$(e.target),toPageNum;
		//console.log($cur.html());
		$cur.html().indexOf('上一页') !== -1 && (toPageNum = activePageNum - 1);
		$cur.html().indexOf('下一页') !== -1 && (toPageNum = activePageNum + 1);
		toPageNum===undefined && (toPageNum=parseInt($cur.html()));
		console.log('activePageNum:'+activePageNum+',toPageNum:'+toPageNum);
		if(toPageNum <=0 || activePageNum == toPageNum) return;
		ajaxGetQiangPage(toPageNum,function(data){
			//显示前端页面
			//console.log(data);
			data.list.length == 0 && alert('该页（'+toPageNum+'）无数据！');
			data.pageNum !== toPageNum && alert('该页'+toPageNum+'无数据！系统自动切到第'+data.pageNum+'页');
			activePageNum = data.pageNum;
			$('#page-num li').removeClass('disabled').removeClass('active');
			activePageNum == 1 && $($('#page-num li')[0]).addClass('disabled');
			if(activePageNum<=3){
				$($('#page-num li')[activePageNum]).addClass('active');
			}else{
				for(var i=1;i<=5;i++){
					$($('#page-num li')[i]).find('a').html(activePageNum-3+i);
					i==3 && $($('#page-num li')[i]).addClass('active');
				}
			}
		})
	})
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
function ajaxGetQiangPage(pageNum,callback){
	var load = layer.load(2, {
		shade: [0.5,'#fff'] //0.1透明度的白色背景
	});
	$.ajax({
		async:true,
		type:'post', 
		data:JSON.stringify({"startsTime": (getNextHour().format('yyyy-MM-dd hh')+':00:00')
				,"source": "1"
				,"pageSize":16
				,"pageNum":pageNum
				,"quantityF": 1
				}),
		contentType:'application/json;charset=UTF-8',
		url:'http://192.168.88.123:8088/quick-buy/fnd/quickbuy/qiang/getPage',
		dataType:'json',
		success: function (data) {
			console.log('获取第'+pageNum+'页');
			if(data.code=='0'){
				var list = {"list": data.data.list}
				var $tplQiang = $("#qiang_list_tpl");
				var tmpl = new T($tplQiang.html()), qiangListHtml = tmpl.render(list);
				$("#qiang-list").html(qiangListHtml);
				callback && callback(data.data);
			}else{
				alert('获取数据失败！错误信息：'+data.message);
			}
			layer.close(load);
		},
		error: function (e) {
			alert("获取Json数据失败！"+JSON.stringify(e));		
			layer.close(load);
		}
	});
}