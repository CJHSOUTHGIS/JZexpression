$.ajax({
	url: "http://localhost:8801/sinfoweb/shanXi/pushResultData?rids=" + $.F.getFieldValue("PROJ_CGHJB.RID"),
	contentType: 'application/json; charset=utf-8',
	type: 'get',
	async: true,
	success: function (d) {},
	error: function (d) {}
});
