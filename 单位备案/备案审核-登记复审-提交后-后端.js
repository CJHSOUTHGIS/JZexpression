$.ajax({
    url: "http://localhost:8801/sinfoweb/shanXi/pushCompanyData?rids=" + $.F.getFieldValue("PROJ_CHDWJBXX.TYSHXYDM"),
    contentType: 'application/json; charset=utf-8',
    type: 'get',
    async: true,
    success: function (d) {},
    error: function (d) {}
});
