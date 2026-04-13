let subFormMap = {
    "HCZZ": {
        title: "测绘资质信息",
        formId: "981a388d-6e89-4457-9b85-e84c81eab0d9",
        formUrl: "/formdesigner-web/generateForm.html?formId=981a388d-6e89-4457-9b85-e84c81eab0d9&type=5",
        table: "F85FF1752A047D406C3F",
        tableName: "PROJ_CHDWZZXX"
    },
    "RYXX": {
        title: "人员信息",
        formId: "8fea2b0e-f26a-4892-94bd-aa72a2712377",
        formUrl: "/formdesigner-web/generateForm.html?formId=8fea2b0e-f26a-4892-94bd-aa72a2712377&type=5",
        table: "F8DF01752A392F40FB81",
        tableName: "PROJ_CYRYXX"
    },
    "YQXX": {
        title: "仪器信息",
        formId: "7dcc5a83-59d9-4d5f-a2f2-3e804ea7457a",
        formUrl: "/formdesigner-web/generateForm.html?formId=7dcc5a83-59d9-4d5f-a2f2-3e804ea7457a&type=5",
        table: "F81C418098C5ECFBFEF8",
        tableName: "PROJ_YQSBXX"
    }
}
//#import CommonObject
window.co = new CommonObject("PROJ_CHDWJBXX", subFormMap);
//业务类型的公用方法
//#import CommonPorjectObject
window.commonPorjectObject = new CommonPorjectObject();
//#import FormStyleDetailUtil
window.styleDeal = new FormStyleDetailUtil();
//可能出现的现场和开发环境不一样的控件id
window.specialControlId = {
    "拟入驻地址单元格1": "F1A95183BBB53426922E",
    "拟入驻地址单元格2": "FED5E183BBB5457C7F3A",
    "拟入驻地址单元格3": "F1F53183BBB5A42A8E62",
}
//创建后无法使用co，改到加载前
function doAfterCreate(){
    co.Dom.domIsLoaded(()=>{
        let bPass = false;
        if(window.isAfterCreate){
            bPass = true;
        }
        return bPass;
    },null,()=>{
        let selectparam = { "jid": co.params.jid, "rid": co.params.rid };
        co.Progress.baseProgressFake("正在同步单位备案信息...", 10000, "提示", null, null);
        $.ajax({
            url: "/sinfoweb/chdw/copyInfo",
            type: 'get',
            data: selectparam,
            async: true,
            success: function (data) {
                //因为下拉筛选，需要延迟赋值才行
                let sZCDZS = "";
                let sBGDZS = "";
                let sZCDJX = "";
                let sBGDXQ = "";
                for (let key in data) {
                    if (key == "ZCDZS") {
                        sZCDZS = data[key];
                    } else if (key == "BGDZS") {
                        sBGDZS = data[key];
                    } else if (key == "ZCDJX") {
                        sZCDJX = data[key];
                    } else if (key == "BGDXQ") {
                        sBGDXQ = data[key];
                    }
                    co.setDomainValue(key, data[key]);
                }
                setTimeout(() => {
                    co.setDomainValue("ZCDZS", sZCDZS);
                    co.setDomainValue("BGDZS", sBGDZS);
                    setTimeout(() => {
                        co.setDomainValue("ZCDJX", sZCDJX);
                        co.setDomainValue("BGDXQ", sBGDXQ);
                    }, 0);
                }, 0);
                co.Subform.refresh(co.subFormMap.RYXX.table);
                co.Subform.refresh(co.subFormMap.HCZZ.table);
                co.Subform.refresh(co.subFormMap.YQXX.table);
                co.Progress.baseProgressClose();
            }
        });
        window.isAfterCreate = false;
    })
}
doAfterCreate();

/**
 * 隐藏头部按钮
 * @param key
 * @param bIsShow
 */
window.hideUpBtn = function (key, bIsShow) {
    if (bIsShow) {
        co.PageTab.showMenuBtn(key);
    } else {
        co.PageTab.hideMenuBtn(key);
    }
}

//隐藏按钮  在审核环节--包括注册的审核和变更的审核
window.changeBtn = changeBtn;

function changeBtn() {
    let oCurT = co.params.taskInfo;
    let taskDefinitionKey = oCurT.taskDefinitionKey;
    let endTime = oCurT.endTime;
    if ((taskDefinitionKey == "e3rvkga9e00n" || taskDefinitionKey == "euekght12to") && !endTime) {
        let xzz = co.getValue('SHJG')
        if (xzz == "") {
            // window.hideUpBtn("returned", false);// 隐藏退回
            window.hideUpBtn("returned", false);// 隐藏提交
            window.hideUpBtn("submit", false);// 隐藏提交
            // window.hideUpBtn("save", false);// 隐藏保存
        }
        if (xzz == "通过") {
            window.hideUpBtn("returned", false);// 隐藏退回
            window.hideUpBtn("submit", true);// 显示提交
            // window.hideUpBtn("save", true);// 显示保存
        }
        if (xzz == "不通过") {
            window.hideUpBtn("returned", true);//显示退回
            window.hideUpBtn("submit", false);// 隐藏提交
            // window.hideUpBtn("save", true);// 显示保存
        }
    }
}

/**
 * 跳转到某个标签某个控件
 * @param controlId
 * @param i
 * @param key
 */
window.dumpTo = function (controlId, i, key) {//1605170634000_81378
    $('#' + controlId + ' .sg-tab-nav-scroll .sg-tab-tab:eq(' + i + ')').click();
    if (key) {
        setTimeout(() => {
            document.getElementById(key).scrollIntoView()
        }, 10)
    }
}
//标签页显示隐藏旧的代码注释========start
// 产品注释的原因：
// 原本================7：不良记录   8：良好记录  9：审核页面
// 加了开票信息后========7：开票信息   8：不良记录  9：良好记录  10：审核页面
// 隐藏的index变了，于是将新的隐藏显示改为window.showOrHideTab方法
// 现场有可能这部分代码是在加载后，也有可能标签也不同index不同，请开发谨慎更新
// if (!window.t) {
//     window.t = $.W.getTask();
// }
// let t = window.t;
//
// if (t) {
//     let oCurTask = t[t.length - 1];
//     if (oCurTask.taskDefinitionKey == "e7oekga9c1ac" || oCurTask.taskDefinitionKey == "e5zbkght0wpt") {//信息登记 变更申请
//         //隐藏不良记录、良好记录、审核页面
//         $('.nav-text.sg-tab-nav.is-top-bottom div:nth-child(7)').hide();
//         $('.nav-text.sg-tab-nav.is-top-bottom div:nth-child(8)').hide();
//         if (!co.getValue("SHJG")) {
//             $('.nav-text.sg-tab-nav.is-top-bottom div:nth-child(9)').hide();
//         }
//     } else if (oCurTask.taskDefinitionKey == "e3rvkga9e00n" || oCurTask.taskDefinitionKey == "euekght12to") {//登记审核 变更审核
//         //隐藏不良记录、良好记录
//         if (!oCurTask.endTime) {
//             $('.nav-text.sg-tab-nav.is-top-bottom div:nth-child(7)').hide()
//             $('.nav-text.sg-tab-nav.is-top-bottom div:nth-child(8)').hide();
//             window.changeBtn();
//         }
//     }
// }
//标签页显示隐藏旧的代码注释========end
/**
 * 显示或者隐藏标签
 */
window.showOrHideTab = function () {
    let hideKpxxTab = true;//是否隐藏开票信息标签
    let sfquXmjf = co.getValue("SFQYXMJF", "PROJ_JDCX", "1", "1", true);//查询系统是否配置了项目缴费启用
    if (sfquXmjf === "1") {
        hideKpxxTab = false;
    }
    if(hideKpxxTab){
        $('.nav-text.sg-tab-nav.is-top-bottom div:nth-child(7)').hide()//隐藏开票信息
    }
    if (co.params.taskInfo && (co.params.taskInfo.taskDefinitionKey === "e7oekga9c1ac" || co.params.taskInfo.taskDefinitionKey === "e5zbkght0wpt")) {
        //信息登记 变更申请
        $('.nav-text.sg-tab-nav.is-top-bottom div:nth-child(8)').hide();//隐藏不良记录
        $('.nav-text.sg-tab-nav.is-top-bottom div:nth-child(9)').hide(); //隐藏良好记录
        if (!co.getValue("SHJG")) {//有审核结果说明是打回的，不影响审核页面
            $('.nav-text.sg-tab-nav.is-top-bottom div:nth-child(10)').hide(); //隐藏审核页面
        }
    }
    if (co.params.taskInfo && (co.params.taskInfo.taskDefinitionKey === "e3rvkga9e00n" || co.params.taskInfo.taskDefinitionKey === "euekght12to")) {
        //登记审核 变更审核
        if (!co.params.taskInfo.endTime) {//未归档
            $('.nav-text.sg-tab-nav.is-top-bottom div:nth-child(8)').hide()//隐藏不良记录
            $('.nav-text.sg-tab-nav.is-top-bottom div:nth-child(9)').hide(); //隐藏良好记录
            window.changeBtn();
        }
    }
}
// function nextPage(index) {
//   // 实现原理，下面添加的按钮，模拟div被点击
//   // 1602724781000_67482为表单中标签页ID .sg-tab-tab.is-top-bottom为每个table也div点击的类样式
//   let divItem = $("#1605170634000_81378 .sg-tab-tab.is-top-bottom");
//   divItem[index + 1].click();
// }

// function previousPage(index) {
//   // 实现原理，下面添加的按钮，模拟div被点击
//   // 1602724781000_67482为表单中标签页ID .sg-tab-tab.is-top-bottom为每个table也div点击的类样式
//   let divItem = $("#1605170634000_81378 .sg-tab-tab.is-top-bottom");
//   divItem[index - 1].click();
// }



/**
 * 获取sInfoWeb下载地址
 * @param fileName
 * @param macroPath
 */
window.getSInfoWebDownLoadUrl = function (fileName, macroPath, sInfoUrl) {
    //改为使用co定义的方法，减少工作量，不直接改使用此方法的地方，后续的所有使用都可以直接使用co的方法
    return co.File.getSInfoWebDownLoadUrl({"fileName": fileName, "macroPath": macroPath, "sInfoUrl": sInfoUrl});
}
window.xmjfDeal = function (){
    let sfquXmjf = co.getValue("SFQYXMJF", "PROJ_JDCX", "1", "1", true);//查询系统是否配置了项目缴费启用
    if (sfquXmjf === "1") {
        let disabled = true;
        if (co.params.taskInfo
            && (co.params.taskInfo.taskDefinitionKey === "e7oekga9c1ac" || co.params.taskInfo.taskDefinitionKey === "e5zbkght0wpt")
            && co.params.taskInfo.assignee === co.User.userId()) {
            disabled = false;
        }


        //文件上传控件自定义为多文件控件
        window.styleDeal.sinfo_uploadMultiFileWithProgress({
            uploadLoadTipTxt: "支持拓展名：.rar,.zip,.doc,.docx,.pdf,.jpg.......",
            selector: document.getElementById("F227918514C91D001BD5"),
            getCurrentFileData: () => co.getValue('SKFJ'),
            setCurrentFileData: (currentFileNewData) => co.setDomainValue("SKFJ", currentFileNewData, true),
            getSInfoWebDownLoadUrl: window.getSInfoWebDownLoadUrl,
            showUploadBtn: !disabled,
            showDeleteBtn: !disabled
        })
        //改两个支付码的文件上传控件样式
        //微信收款码
        window.styleDeal.sinfo_uploadFileWithImage({
            controlId: 'FF0DC18514C98B4F316A',
            selector: document.getElementById("FF0DC18514C98B4F316A"),
            format: ['gif', 'jpeg', 'jpg', 'png', 'svg'],
            multiple: false,
            disabled: disabled,
            uploadParams: {
                srcType: 0,
                isPreview: true,
                fileInfo: JSON.stringify({taskId: co.params.jid}),
                prefixFolder: '/' + co.params.jid + '/' + co.params.rid + '/PROJ_CHDWJBXX'
            },
            getCurrentFileData: () => co.getValue('SKWXSKM'),
            setCurrentFileData: (currentFileNewData) => co.setDomainValue("SKWXSKM", currentFileNewData, true),
            getSInfoWebDownLoadUrl: window.getSInfoWebDownLoadUrl
        })
        //支付宝付款码
        window.styleDeal.sinfo_uploadFileWithImage({
            controlId: 'F6B3718514C99C710D87',
            selector: document.getElementById("F6B3718514C99C710D87"),
            format: ['gif', 'jpeg', 'jpg', 'png', 'svg'],
            multiple: false,
            disabled: disabled,
            uploadParams: {
                srcType: 0,
                isPreview: true,
                fileInfo: JSON.stringify({taskId: co.params.jid}),
                prefixFolder: '/' + co.params.jid + '/' + co.params.rid + '/PROJ_CHDWJBXX'
            },
            getCurrentFileData: () => co.getValue('SKZFBSKM'),
            setCurrentFileData: (currentFileNewData) => co.setDomainValue("SKZFBSKM", currentFileNewData, true),
            getSInfoWebDownLoadUrl: window.getSInfoWebDownLoadUrl
        })

    }
}

window.getFileViewKey = function (fieId) {
    let fileUrl = co.getValue("WJSC", "PROJ_FILE_CONFIG", "WJM", fieId, true);
    if (!fileUrl) {
        co.Message.error_middle("未配置模板");
        return;
    }
    let nameAndUrls = fileUrl.split("::");
    let url = nameAndUrls[0].split("|")[1];
    let viewUrl = "";
    let postData = {
        macroPath: url,
        rebuild: 1
    };
    $.ajax({
        url: "/filemgr/comm/filePreview",
        contentType: 'application/x-www-form-urlencoded',
        type: 'post',
        async: false,
        data: postData,
        success: function (data) {
            if (data.code !== '0') {
                Sgui.$msg.error(data.msg)
            } else {
                viewUrl = location.origin + data.result[0]
                console.log(viewUrl);
                $.showdialog({
                    url: `<div style=' max-height: 500px;'>
              <img src=${viewUrl}  alt="示例图片" />				

              </div>`,
                    footerHide: true,
                    width: "85%",
                    height: "95%",
                    title: "样例"
                })
                return false;
            }
        }
    });
}
// window.dwbgNextPage = nextPage;
// window.dwbgPreviousPage = previousPage;
/**
 * 显示隐藏拟入驻地址的判断
 * 注册地址【ZCDZSF】【ZCDZS】【ZCDJX】、办公地址【BGDZSF】【BGDZS】【BGDXQ】
 * 1、当注册地址、办公地址都在系统最高行政区下的时候，拟入驻地址【XZQ】这一行隐藏，行政区审核人判断取注册地址【ZCDZSF】【ZCDZS】【ZCDJX】、办公地址【BGDZSF】【BGDZS】【BGDXQ】
 * 2、当注册地址、办公地址都不在系统最高行政区下的时候，拟入驻地址【XZQ】这一行显示，且必填判断规则，行政区审核人判断取拟入驻地址【XZQ】
 */
window.showOrHideXzqColTd = function () {
    let zcdzsf = co.getDomainValue("ZCDZSF");//注册地址省
    let zcdzs = co.getDomainValue("ZCDZS");//注册地址市
    let zcdjx = co.getDomainValue("ZCDJX");//注册地址县
    let bgdzsf = co.getDomainValue("BGDZSF");//办公地址省
    let bgdzs = co.getDomainValue("BGDZS");//办公地址市
    let bgdxq = co.getDomainValue("BGDXQ");//办公地址县
    let xzq = co.getDomainValue("XZQ");//拟入驻地址
    let hide = false;
    window.judgeXzqStr = "";
    let heightXzq = co.getValue("TOPZONE", "PROJ_ENVIRONMENTCONFIG", "1", "1", true);
    if (!heightXzq) {
        hide = true;
    }else{
        if (zcdjx.indexOf(heightXzq) === 0) {//先判断注册地址
            hide = true;
            window.judgeXzqStr = zcdjx;
        } else if (bgdxq.indexOf(heightXzq) === 0) {//再判断办公地址
            hide = true;
            window.judgeXzqStr = bgdxq;
        }
        if (!window.judgeXzqStr) {
            window.judgeXzqStr = xzq
        }
    }
    if (hide) {//隐藏拟入驻地址单元行
        co.Ctrl.setHide(window.specialControlId["拟入驻地址单元格1"], true);
        co.Ctrl.setHide(window.specialControlId["拟入驻地址单元格2"], true);
        co.Ctrl.setHide(window.specialControlId["拟入驻地址单元格3"], true);
        co.setDomainValue("XZQ", "");
    } else {//显示拟入驻地址单元行
        co.Ctrl.setHide(window.specialControlId["拟入驻地址单元格1"], false);
        co.Ctrl.setHide(window.specialControlId["拟入驻地址单元格2"], false);
        co.Ctrl.setHide(window.specialControlId["拟入驻地址单元格3"], false);
    }
}
/**
 * 替换办公地址坐标描述的自定义控件
 */
window.domReplaceBgdzzbms = function (){
    window.styleDeal.sInfo_renderToA("FD59918AAB5BA21220D3",co.getDomainValue("BGDZZBMS"))
}
window.doBeforeLoading = function () {
    window.showOrHideTab();//隐藏标签页

    window.xmjfDeal();

    //将已读的用户标记上
    let needMarkFlowStep = [
        "e3rvkga9e00n",//登记审核
        "euekght12to"//变更审核
    ];
    if (needMarkFlowStep.length > 0) {
        if (co.params.taskInfo && needMarkFlowStep.indexOf(co.params.taskInfo.taskDefinitionKey) >= 0) {
            let ydyhId = co.getDomainValue("YDYHID", true);
            let ydyhIdArr = [];
            if (ydyhId) {
                ydyhIdArr = ydyhId.split(",");
            }
            if (ydyhIdArr.indexOf(co.User.userId()) == -1) {
                ydyhIdArr.push(co.User.userId());
                co.setDomainValue("YDYHID", ydyhIdArr.join(","), true);
            }
        }
    }

    //拟入驻地址级联控件下拉赋值
    let xzqDropData = window.co.Azone.getAllDistrict();
    let xzqValue = co.getDomainValue("XZQ", true);
    co.setValue("XZQ", xzqValue);
    //显示或隐藏拟入驻地址单元格
    window.showOrHideXzqColTd();
    co.setValue("XZQ", xzqDropData).then(() => {
        co.setValue("XZQ", xzqValue);
        let kshrId = window.commonPorjectObject.setHanlerByXzqConfig("DWSHR", window.judgeXzqStr);
        co.setDomainValue("KSHRID", kshrId);
    })

    let fwqyValue = co.getDomainValue("FWQY", true);
    co.setValue("FWQY", fwqyValue);
    co.setValue("FWQY", xzqDropData).then(() => {
        co.setValue("FWQY", fwqyValue);
    })

    //替换办公地址坐标描述的自定义控件
    window.domReplaceBgdzzbms();
}
window.doBeforeLoading();