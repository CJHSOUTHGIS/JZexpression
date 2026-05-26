
var sZJJKMC = "iData";
debugger;
var dataCHSXArr = $.execsql(null, "根据测量事项获取质检接口名称", { "clsx": $.F.getFieldValue("PROJ_CGHJB.SSCG") }, null, null, null, null);
if (dataCHSXArr && dataCHSXArr.sql1 && dataCHSXArr.sql1.length > 0) {
    if (dataCHSXArr.sql1[0]["ZJJKMC"] == "SMEpro") {
        sZJJKMC = "SMEpro";
    }
}
//添加质检自动通过的开关
var bNeedAutoCheck = true;
var aXtConfigArr = $.execsql(null, "获取业务系统配置的系统基本配置", {}, null, null, null, null);
if (aXtConfigArr && aXtConfigArr.sql1 && aXtConfigArr.sql1.length > 0) {
    var oItem = aXtConfigArr.sql1[0];
    if (oItem["ZJTGKG"] == "1") {
        $.execsql(null, "修改成果汇交的质检状态", { "SFZJTG": "2", "RID": $.F.getFieldValue("PROJ_CGHJB.RID") }, null, null, null, null);
        $.F.setFieldValue("PROJ_CGHJB.SFZJTG", "2");
        shztShow();
        bNeedAutoCheck = false;
    }
}
if (bNeedAutoCheck) {
    if (sZJJKMC == "iData") {
        window.startAutoCheck(false);//idata质检
    } else if (sZJJKMC == "SMEpro") {
        window.startAutoCheckSme(false);//SME质检
    }
}