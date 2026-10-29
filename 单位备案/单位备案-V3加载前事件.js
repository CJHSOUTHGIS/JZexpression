let subFormMap = {
}
//#import CommonObject
let co = new CommonObject("PROJ_CHDWJBXX", subFormMap);
window.co = co;

//#import FormStyleDetailUtil
window.styleDeal = new FormStyleDetailUtil();

/**
 * 前端样式处理
 */
window.dealWithFontStyle = function () {
    //隐藏平台自带的按钮列
    if ($(".generate-btn-list") && $(".generate-btn-list").length > 0) {
        $($(".generate-btn-list")[0]).hide();
    }
    //首页加载
    //标题加载
    let stateLabel = '正常';
    if (co.getValue("SFYTCBA") == "1") {
        stateLabel = "已退出备案";
    }
    let score = co.getValue("最终得分", "VIEW_PROJ_CHDWJBXX_PJ", "用户ID", co.getValue("USERID"), true);
    let levelSrc = "/bootstrap/icon/sinfo_icon/greenIcon.png";
    let zzdj = co.getValue("zzdj")
    if (zzdj.indexOf("甲级") >= 0) {
        levelSrc = "/bootstrap/icon/sinfo_icon/zzdj/jj.png";
    } else if (zzdj.indexOf("乙级") >= 0) {
        levelSrc = "/bootstrap/icon/sinfo_icon/zzdj/yj.png";
    } else if (zzdj.indexOf("丙级") >= 0) {
        levelSrc = "/bootstrap/icon/sinfo_icon/zzdj/bj.png";
    } else if (zzdj.indexOf("丁级") >= 0) {
        levelSrc = "/bootstrap/icon/sinfo_icon/zzdj/dj.png";
    }
    let logoSrc = "/bootstrap/icon/sinfo_icon/cityIcon.png";
    window.styleDeal.sinfo_unitNavBoxVersion2(document.querySelector('#F55131802205E51FA8CF'), 'F55131802205E51FA8CF',
        {
            name: co.getValue("DWMC"),
            score: score + "分",
            status: stateLabel,
            logoSrc: logoSrc,
            levelSrc: levelSrc,
            levelLabel: zzdj == "甲级" ? "" : zzdj
        });

    //修改表格格式
    window.styleDeal.sInfo_customShowFormStyle('F7C911802210AD817862');
    window.styleDeal.sInfo_customShowFormStyle('F814A1802216CB05A3E9');
    window.styleDeal.sInfo_customShowFormStyle('FE8CF18022182ED831D8');
    window.styleDeal.sInfo_customShowFormStyle('F1CC418022183C8FB44B');
    window.styleDeal.sInfo_customShowFormStyle('FA5ED18022184AF0CF67');


    //注册地址合并
    co.setValue("ZCDZ", co.getAzoneText("ZCDZSF") + co.getAzoneText("ZCDZS") + co.getAzoneText("ZCDJX") + co.getValue("ZCXXDZ"));
    //办公地址合并
    co.setValue("BGDZ", co.getAzoneText("BGDZSF") + co.getAzoneText("BGDZS") + co.getAzoneText("BGDXQ") + co.getValue("BGXXDZ"));
}
window.dealWithFontStyle();
//隐藏头部按钮
window.hideUpBtn = hideUpBtn;

function hideUpBtn(key, bIsShow) {
    const {pollingFun} = window.top.IBaseExpressLib;
    pollingFun({
        runFlag: () => {
            var bPass = false;
            if ($("[name='" + key + "']").length > 0) {
                bPass = true;
            }
            return bPass
        },
        callback: () => {
            if (bIsShow) {
                $($("[name='" + key + "']")[0]).show();
            } else {
                $($("[name='" + key + "']")[0]).hide();
            }
        },
    })
}


