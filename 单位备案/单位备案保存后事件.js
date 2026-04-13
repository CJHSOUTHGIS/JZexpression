//针对 信息维护列表的加载后添加的监听赋值，当操作后回到树状图的时候刷新树
localStorage.setItem('SQL_CHDWBGLIST_F85BE175FEE2810AB24A','1');
console.log("480986757689567876789876");
let rid = $.F.getFieldValue("PROJ_CHDWJBXX.RID");
console.log(rid);
	$.ajax({
		url: "/sinfoweb//chdw/public/saveZzdjByRid",
		async: false,
		data: {rid:rid},
		type: "GET",
		// headers:{"Accept":"application/json, text/plain, */*"}, 
		// dataType: "json",
		contentType: "application/json;charset=UTF-8",
		// processData: false,
		success(data) {
      console.log("资质等级保存成功！" + JSON.stringify(data));
	    },
	    error: function (data) {
	        console.log("资质等级保存失败！" + JSON.stringify(data));
	    }
	});