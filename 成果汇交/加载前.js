let subFormMap = {
    "JSSC": {
        title: "技术审查问题记录",
        formId: "c5ad1195-b3aa-47cf-ac94-92384242877a",
        formUrl: "/formdesigner-web/generateForm.html?formId=c5ad1195-b3aa-47cf-ac94-92384242877a&type=5",
        controlId: "FFA1F183D5B0DBF31AD2",
        tableName: "PROJ_CGHJ_JSSCWTJL"
    },
    "YWSH": {
        title: "业务审核问题记录",
        formId: "967b1bf5-1d00-4ea6-bf2c-1839da5f0444",
        formUrl: "/formdesigner-web/generateForm.html?formId=967b1bf5-1d00-4ea6-bf2c-1839da5f0444&type=5",
        controlId: "F8575183EF01D5721AF8",
        tableName: "PROJ_CGHJB_YWSHWTJL"
    },
    "CGCC": {
        title: "成果抽查问题记录",
        formId: "258d34eb-addf-4641-9b2b-1f2e3eb79958",
        formUrl: "/formdesigner-web/generateForm.html?formId=258d34eb-addf-4641-9b2b-1f2e3eb79958&type=5",
        controlId: "FF67C183F36CF81C8829",
        tableName: "PROJ_CGHJB_CGCCWTJL"
    },
    "IMPORT_GIS": {
        title: "数据入库-GIS数据",
        formId: "032e658e-d64c-4865-b575-94fc7be7b363",
        formUrl: "/formdesigner-web/generateForm.html?formId=032e658e-d64c-4865-b575-94fc7be7b363&type=5",
        controlId: "F5846184BCD9ACB41577",
        tableName: "PROJ_SJRK_GIS",
        divControlId: "FBDF6184BCD945D67C44",//模块divId,
        titleControlId: "F0236184BCD971C9A061"
    },
    "IMPORT_HX": {
        title: "数据入库-红线数据",
        formId: "a6061797-8c4c-4b27-a8d7-b60146ff58c0",
        formUrl: "/formdesigner-web/generateForm.html?formId=a6061797-8c4c-4b27-a8d7-b60146ff58c0&type=5",
        controlId: "F832E184BCDA49BF53A1",
        tableName: "PROJ_SJRK_HX",
        divControlId: "F7D7F184BCDA17F76634",//模块divId,
        titleControlId: "F914E184BCDA37F096A3"
    },
    "BLSPWTJL": {
        title: "并联审批问题记录",
        formId: "7bf78d7b-1747-4c48-a0d8-b7b78e03499d",
        formUrl: "/formdesigner-web/generateForm.html?formId=7bf78d7b-1747-4c48-a0d8-b7b78e03499d&type=5",
        controlId: "F259E18C68834EB00CA4",
        tableName: "PROJ_BLSPSHWTJL"
    }
}
window.specialControlId = {
    "checkClaim": "06592a5c-aac3-4fb2-8c2e-b6bc8a0e2149",//抽查接办按钮
    "checkTable": "FF653183F368CF9E08BB",//成果抽查表格
    "checkTableTitleId": "F5D02183F36974EC8ED9",//成果抽查模块的标题控件ID
    "checkComplete": "2e41f84c-e2ec-494a-8202-72566112ce05",//抽查完成检查按钮
}
//#import CommonObject
let co = new CommonObject("PROJ_CGHJB", subFormMap);
window.co = co;
//#import FormStyleDetailUtil
window.styleDeal = new FormStyleDetailUtil();
//因为创建后的执行顺序有时候在一些比较卡的服务器会比加载前还慢，所以将创建后事件放到加载前之前来执行===================
//业务类型的公用方法
//#import CommonPorjectObject
window.commonPorjectObject = new CommonPorjectObject();

/**
 * 创建后事件
 */
window.doAfterCreate = function () {
    co.setDomainValue("CHDWUSERID", co.User.userId());
    window.ChangeCGSC();

}
co.Dom.domIsLoaded(() => {
    let ret = window.isNewCreate;
    return ret;
}, null, () => {
    doAfterCreate();
}, null);
//因为创建后的执行顺序有时候在一些比较卡的服务器会比加载前还慢，所以将创建后事件放到加载前之前来执行===================
/**
 * 由于平台无法解决这类需求，需要由js代码来实现
 */
window.changeFormStyle = function (tableId) {
    $("#" + tableId + " td p").css("padding", "0 0px");//p标签的左边距
    $("#" + tableId + " td p").css("line-height", "15px");//p标签的行高
}


/**
 * 隐藏模块的同时判断是否有隐藏导航栏，如果没有则需要隐藏
 * @param divId 模块表单div的控件ID
 * @param titleControlId 标题的控件ID
 */
window.hideDivAndHideNavigationBar = function (divId, titleControlId) {
    setTimeout(() => {
        co.Ctrl.setHide(divId, true);
        if ($("#1609729463000_35194 [data-id='" + titleControlId + "']") && $("#1609729463000_35194 [data-id='" + titleControlId + "']").length > 0) {
            $("#1609729463000_35194 [data-id='" + titleControlId + "']")[0].closest('li').remove();
        }
    }, 500)
}
/**
 * 记录已读用户ID
 */
function recordReadedUserIds() {
    let ydyhId = co.getDomainValue("YDYHID", true);
    let ydyhIdArr = [];
    if (ydyhId) {
        ydyhIdArr = ydyhId.split(",");
    }
    if (ydyhIdArr.indexOf(co.User.userId()) === -1) {
        ydyhIdArr.push(co.User.userId());
        co.setDomainValue("YDYHID", ydyhIdArr.join(","), true);
    }
}

/**
 * 获取sInfoWeb下载地址
 * @param fileName
 * @param macroPath
 */
window.getSInfoWebDownLoadUrl = function (fileName, macroPath, sInfoUrl) {
    //改为使用co定义的方法，减少工作量，不直接改使用此方法的地方，后续的所有使用都可以直接使用co的方法
    return co.File.getSInfoWebDownLoadUrl({"fileName": fileName, "macroPath": macroPath, "sInfoUrl": sInfoUrl});
}
/**
 * 获取sInfoWeb下载地址
 * @param fileName
 * @param macroPath
 */
window.getiBaseDownLoadUrl = function (fileName, macroPath) {
    //改为使用co定义的方法，减少工作量，不直接改使用此方法的地方，后续的所有使用都可以直接使用co的方法
    return co.File.getiBaseDownLoadUrl({"fileName": encodeURIComponent(fileName), "macroPath": macroPath});
}


/**
 * 成果模板下载
 */
function downLoadCgmb() {
    let bGet = false;
    let dataArr = co.Sql.execSql("根据测量事项获取成果模板", {"CLSX": co.getValue("SSCG")});
    if (dataArr && dataArr.sql1 && dataArr.sql1.length > 0) {
        let oData = dataArr.sql1[0];
        if (oData["CGBMB"]) {
            let sData = oData["CGBMB"];
            let aTemp = sData.split("|");
            let macroPath = aTemp[1];
            let fileName = aTemp[0];
            window.open(window.getSInfoWebDownLoadUrl(fileName, macroPath));
            bGet = true;
        }
    }
    if (!bGet) {
        co.Message.info_middle("未配置模板");
    }
}

window.sinfo_uploadSingleFileWithProgress = function (controlId, colKey, fileType, showUploadBtn, showDeleteBtn, showDownLoadBtn, doAfterSetValue, multiple) {
    if(!multiple){
        multiple = false;
    }
    window.styleDeal.sinfo_uploadSingleFileWithProgress({
        selector: document.getElementById(controlId),
        controlId: controlId,
        acceptFileType: fileType,
        multiple: multiple,
        showUploadBtn: showUploadBtn === undefined ? true : showUploadBtn,  // 不传默认true
        showDownLoadBtn: showDownLoadBtn === undefined ? true : showDownLoadBtn,  // 不传默认true
        showDeleteBtn: showDeleteBtn === undefined ? true : showDeleteBtn,  // 不传默认true
        uploadParams: {
            srcType: 0,
            isPreview: true,
            fileInfo: JSON.stringify({taskId: co.params.jid}),
            // 格式：/rid/表单_字段名（与系统一致，不包含jid）
            prefixFolder: '/' + co.params.rid + '/' + co.params.table + '_' + colKey
        },
        getCurrentFileData: () => co.getValue(colKey),
        setCurrentFileData: function (currentFileNewData) {
            co.setValueSync(colKey, currentFileNewData, "", "",true);
            if (doAfterSetValue) {
                doAfterSetValue();
            }
        },
        getSInfoWebDownLoadUrl: window.getSInfoWebDownLoadUrl,
        // 新增重试配置
        retryConfig: {
            maxRetries: 3,           // 最大重试次数
            retryDelay: 2000,        // 重试延迟(毫秒)
            retryDelayMultiplier: 2  // 延迟倍数递增
        },
        // 启用分片上传（该项目使用分片上传）
        enableChunkUpload: false,
        // 启用并行分片上传（提高上传速度）
        enableParallelUpload: true,
        // 最大并发分片数量（避免资源占用过多，建议2-5个）
        maxConcurrentChunks: 5
    })
}
/**
 * 计算当前时间是否是某个日期的一周前之后
 * @param targetStr
 * @returns {boolean}
 */
window.isCurrentAfterOneWeekBefore = function (targetStr) {
    // 解析目标时间字符串为Date对象（按本地时间处理）
    const targetDate = new Date(targetStr.replace(' ', 'T'));
    if (isNaN(targetDate.getTime())) {
        throw new Error('无效的时间字符串');
    }

    // 计算目标日期的前一周时间
    const oneWeekBefore = new Date(targetDate);
    oneWeekBefore.setDate(oneWeekBefore.getDate() - 7);

    // 获取当前时间
    const now = new Date();

    // 判断当前时间是否在前一周之后
    return now > oneWeekBefore;
}

window.sinfo_uploadMultipleFileWithProgress = function (controlId, colKey, fileType, showUploadBtn, showDeleteBtn, showDownLoadBtn, doAfterSetValue) {
    window.sinfo_uploadSingleFileWithProgress(controlId, colKey, fileType, showUploadBtn, showDeleteBtn, showDownLoadBtn, doAfterSetValue, true);
}
/**
 * 文件上传控件样式修改
 */
window.changeFileUploadControl = function () {
    /**
     * 成果上传：e79rkisi6m67
     * 成果确认：e2yykpjszacn
     * 技术审查：e3v4l8jvdbjs
     * 成果审核：et5klrmjihq
     * 空间入库：e16vkq7eijw7
     * 成果共享：e10ukisi6nbe
     * **/
    if (co.params.taskInfo) {
        //成果上传环节==================================================================================================
        let cgscAndBgscEdit = false;//成果上传和报告上传的是否可编辑，默认否
        if (co.params.taskInfo.taskDefinitionKey === "e79rkisi6m67") {
            if (co.params.taskInfo.assignee === co.User.userId()) {//当前办理人
                //⑤成果文件和报告文件上传可编辑
                cgscAndBgscEdit = true;
            } else {//非当前办理人
                //①成果文件和报告文件上传控件样式修改，同时不可编辑
            }
        }
        //文件控件样式修改
        if (cgscAndBgscEdit) {//可编辑
            //成果上传
            window.sinfo_uploadSingleFileWithProgress("FF0EB1838C79B44B9F65", "WJJSC", ".zip", true, true, true, window.doAfterUploadedWjjsc);
            //成果报告上传
            window.sinfo_uploadSingleFileWithProgress("F4C0B1838C85FDD641E8", "CGBGSC", ".pdf");
        } else {//不可编辑
            //成果上传
            window.sinfo_uploadSingleFileWithProgress("FF0EB1838C79B44B9F65", "WJJSC", ".zip", false, false, true, window.doAfterUploadedWjjsc);
            //成果报告上传
            window.sinfo_uploadSingleFileWithProgress("F4C0B1838C85FDD641E8", "CGBGSC", ".pdf", false, false);
        }

        //成果确认环节==================================================================================================
        if (co.params.taskInfo.taskDefinitionKey === "e2yykpjszacn") {
        }

        //技术审查环节==================================================================================================
        let jsscbgCanEdit = false;//技术审查质检报告的是否可编辑，默认否
        if (co.params.taskInfo.taskDefinitionKey === "e3v4l8jvdbjs") {
            if (co.params.taskInfo.assignee === co.User.userId()) {//当前办理人
                //②技术审查质检报告可编辑
                jsscbgCanEdit = true;
            } else {//非当前办理人
            }
        }
        //文件控件样式修改
        if (jsscbgCanEdit) {//可编辑
            window.sinfo_uploadSingleFileWithProgress("F36A21838C883472A161", "JSSCZJBG", ".pdf");
        } else {//不可编辑
            window.sinfo_uploadSingleFileWithProgress("F36A21838C883472A161", "JSSCZJBG", ".pdf", false, false, true);
        }

        //成果审核环节==================================================================================================
        let ywshzjCanEdit = false;//业务审核质检报告的是否可编辑，默认否
        if (co.params.taskInfo.taskDefinitionKey === "et5klrmjihq") {
            if (co.params.taskInfo.assignee === co.User.userId()) {//当前办理人
                //③业务审核质检报告可编辑
                ywshzjCanEdit = true;
            }
        }
        //文件控件样式修改
        if (ywshzjCanEdit) {//可编辑
            //业务审核质检报告
            window.sinfo_uploadSingleFileWithProgress("F79591838C88E94E8E95", "YWSHZJBG", "");
            //盖章成果
            window.sinfo_uploadSingleFileWithProgress("F55FA1838C898A085A82", "QZHCGWJ", "");
        } else {//不可编辑
            //业务审核质检报告
            window.sinfo_uploadSingleFileWithProgress("F79591838C88E94E8E95", "YWSHZJBG", "", false, false);
            //盖章成果
            window.sinfo_uploadSingleFileWithProgress("F55FA1838C898A085A82", "QZHCGWJ", "", false, false);
        }
        //空间入库环节==================================================================================================
        // let ywshzjkjrkDwgExcelCanEdit = false;//空间入库dwg和excel文件的是否可编辑，默认否
        if (co.params.taskInfo.taskDefinitionKey === "e16vkq7eijw7") {
            if (co.params.taskInfo.assignee === co.User.userId()) {//当前办理人
            }
        }
        //成果共享环节==================================================================================================
        if (co.params.taskInfo.taskDefinitionKey === "e10ukisi6nbe") {
        }

        if (!co.params.taskInfo.taskDefinitionKey) {//已归档
        }
    }
}

/**
 * 初始样式修改
 */
window.initialStyleModification = function () {
    //修改行高
    changeFormStyle("F84D71837DDC308405F7");//项目信息1
    changeFormStyle("FCC3D1837DF1BA203DD1");//项目信息2
    changeFormStyle("FDAB61837E01E5AE6CCE");//成果上传2
    changeFormStyle("F681818381ECCC56F879");//甲方确认
    changeFormStyle("FE6AE18381F5B97F2027");//技术审查
    changeFormStyle("FE30318381FAEF91D51B");//业务审核

    //不知道如何打包成果？您可以下载并参考：成果模板
    window.styleDeal.sinfo_singleLineText({
        vue: Sgui,
        selector: document.getElementById('F892F18383325DE9BAA6'), // 平台表单的预留格子的dom
        customParams: {
            controlId: 'F892F18383325DE9BAA6',
            firstLabel: '不知道如何打包成果？您可以下载并参考：',
            firstLabelStyle: {
                "font-size": "14px",
                "font-family": "Microsoft YaHei",
                "font-weight": "bold",
                "color": "#404040"
            }, // 文案特殊样式
            secondLabel: '成果模板',
            secondLabelStyle: {
                "font-size": "14px",
                "font-family": "Microsoft YaHei",
                "font-weight": "400",
                "color": "#999999"
            }, // 文案特殊样式
            secondLabelType: 'a',// 特殊文本信息类型,可缺省，默认普通文本  a代表有点击事件回调
            clickCallback: () => {
                downLoadCgmb();
            }
        }
    });
    //成果压缩包上传（支持zip格式）
    window.styleDeal.sinfo_singleLineText({
        vue: Sgui,
        selector: document.getElementById('F98731838347CF000474'), // 平台表单的预留格子的dom
        customParams: {
            controlId: 'F98731838347CF000474',
            firstLabel: '成果压缩包上传',
            firstLabelStyle: {
                "font-size": "14px",
                "font-family": "Microsoft YaHei",
                "font-weight": "400",
                "color": "#404040"
            }, // 文案特殊样式
            secondLabel: '（支持zip格式）',
            secondLabelStyle: {
                "font-size": "14px",
                "font-family": "Microsoft YaHei",
                "font-weight": "400",
                "color": "#999999"
            } // 文案特殊样式
        }
    });
    //成果报告上传（支持pdf格式）
    window.styleDeal.sinfo_singleLineText({
        vue: Sgui,
        selector: document.getElementById('F4EBD1838349CD52CB98'), // 平台表单的预留格子的dom
        customParams: {
            controlId: 'F4EBD1838349CD52CB98',
            firstLabel: '成果报告上传',
            firstLabelStyle: {
                "font-size": "14px",
                "font-family": "Microsoft YaHei",
                "font-weight": "400",
                "color": "#404040"
            }, // 文案特殊样式
            secondLabel: '（支持pdf格式）',
            secondLabelStyle: {
                "font-size": "14px",
                "font-family": "Microsoft YaHei",
                "font-weight": "400",
                "color": "#999999"
            } // 文案特殊样式
        }
    });

    //所有文件上传控件样式修改
    window.changeFileUploadControl();

    //修改可能存在的甲方确认样式
    window.changeJsdwConfirmStyle();

}
/**
 * 修改可能存在的甲方确认样式
 */
window.changeJsdwConfirmStyle = function (){
    let status = "尚未推送给甲方";//确认状态
    let timeStr = "";//确认时间
    let tszt = co.getDomainValue("TSZT",true);
    let qrzt = co.getDomainValue("QRZT",true);
    let qrsj = co.getDomainValue("QRSJ",true);
    if(tszt === "已推送" && qrzt === "已确认") {
        status = "甲方已确认";
        timeStr = qrsj;
    }else if(tszt === "已推送" && qrzt === "待确认"){
        status = "已推送给甲方待甲方确认";
    }else if(tszt === "未推送" && qrzt === "已退回"){
        status = "甲方退回";
    }
    window.styleDeal.sinfo_singleLineText({
        vue: Sgui,
        selector: document.getElementById('FB07A1852D33774B4507'), // 平台表单的预留格子的dom
        customParams: {
            controlId: 'FB07A1852D33774B4507',
            firstLabel: '状态：',
            firstLabelStyle: {
                "font-size": "14px",
                "font-family": "Microsoft YaHei",
                "font-weight": "400",
                "color": "#404040"
            }, // 文案特殊样式
            secondLabel: status,
            secondLabelStyle: {
                "font-size": "14px",
                "font-family": "Microsoft YaHei",
                "font-weight": "400",
                "color": "#404040"
            } // 文案特殊样式
        }
    });
    window.styleDeal.sinfo_singleLineText({
        vue: Sgui,
        selector: document.getElementById('F19181852D337EAA3776'), // 平台表单的预留格子的dom
        customParams: {
            controlId: 'F19181852D337EAA3776',
            firstLabel: '确认时间：',
            firstLabelStyle: {
                "font-size": "14px",
                "font-family": "Microsoft YaHei",
                "font-weight": "400",
                "color": "#404040"
            }, // 文案特殊样式
            secondLabel: timeStr,
            secondLabelStyle: {
                "font-size": "14px",
                "font-family": "Microsoft YaHei",
                "font-weight": "400",
                "color": "#404040"
            } // 文案特殊样式
        }
    });
}

/**
 * 悬浮展示被建设单位退回原因
 */
function showReturnReason() {
    //成果上传：e79rkisi6m67
    //成果确认：e2yykpjszacn
    //技术审查：e3v4l8jvdbjs
    //成果审核：et5klrmjihq
    //空间入库：e16vkq7eijw7
    //成果共享：e10ukisi6nbe
    if (co.params.taskInfoFull.length > 1) {
        for (let i = co.params.taskInfoFull.length - 2; i >= 0; i--) {
            if (co.params.taskInfoFull[i].taskDefinitionKey === "e2yykpjszacn") {
                if (co.params.taskInfoFull[i].taskStatus === "已结束,退回") {
                    let remark = co.getValue("REMARK","WORKFLOWOPERATIONRECORD","TASKID",co.params.taskInfoFull[i].id,true);
                    window.Vue.prototype.$msg.info({
                        content: "建设单位打回原因：" + remark,
                        duration: 0,
                        closable: true,
                        id: 'my-demo-id',
                        onClose: () => {
                            // this.$notice.info({
                            //   title: '消息已关闭'
                            // })
                        }
                    })
                }
                break;
            }
        }
    }

}

/**
 * 文件夹上传之后执行
 */
window.doAfterUploadedWjjsc = function () {
    try {
        //设置为质检未通过
        co.setValueMulti({
            "SFZJTG": "0",
            "WJJSC": co.getDomainValue("WJJSC"),
            "SMJCSFTG":""
        }, "", "", true);
        //修改质检状态
        window.shztShow();
        window.smztShow();
        co.Sql.execSql("根据成果汇交rid删除涉密检测失败数据", {"rid":co.getValue("RID")});
        if (co.getDomainValue('WJJSC') != "" && co.getDomainValue('WJJSC') != null && co.getDomainValue('WJJSC') != undefined) {
            let isSave = co.getDomainValue("RID", true) ? true : false;//是否保存过
            if (isSave) {//保存过则直接执行
                window.unzipAndUploadCGB();
            } else {//未保存过需要保存先，然后保存后执行
                window.unzipAfterSave = true;
                $(".generate-btn-list .btn-dropdown button:eq(0)").click();
            }
        } else {//删除
            co.Toolbox.showMask();
            //删除可能存在的解压后文件夹
            let cgunzip = co.getDomainValue("CGUNZIP");
            if (cgunzip) {
                co.Http.request({
                    url: "/sinfoweb/file/deleteDir",
                    async: false,
                    data: {
                        "dir": cgunzip
                    },
                    success: (ret) => {
                        co.setDomainValue("CGUNZIP", "", true);
                    },
                    error: (ret) => {
                    }
                })
            }
            //删除可能存在的成果报告
            let cgbgsc = co.getDomainValue("CGBGSC")
            if(cgbgsc){
                co.Http.request({
                    url: "/sinfoweb/file/deleteDir",
                    async: false,
                    data: {
                        "dir": cgbgsc.split("|")[1]
                    },
                    success: (ret) => {
                        co.setDomainValue("CGBGSC", "", true);
                        //成果报告上传控件二次赋值
                        window.sinfo_uploadSingleFileWithProgress("F4C0B1838C85FDD641E8", "CGBGSC", ".pdf");
                    },
                    error: (ret) => {
                    }
                })
            }
            //删除可能存在的已签章文件
            let qzhcgwj = co.getDomainValue("QZHCGWJ")
            if(qzhcgwj){
                co.Http.request({
                    url: "/sinfoweb/file/deleteDir",
                    async: false,
                    data: {
                        "dir": qzhcgwj.split("|")[1]
                    },
                    success: (ret) => {
                        co.setDomainValue("QZHCGWJ", "", true);
                        //盖章成果
                        window.sinfo_uploadSingleFileWithProgress("F55FA1838C898A085A82", "QZHCGWJ", "", false, false);
                    },
                    error: (ret) => {
                    }
                })
            }
            //更新成果汇交提交记录表数据
            window.recordCghjLogData(co.params.rid, false, true);
            //==========start删除可能存在的入库文件提取数据
            co.Sql.execSql("删除GIS数据入库子表数据", {"jid": co.params.jid});
            co.Sql.execSql("删除红线数据入库子表数据", {"jid": co.params.jid});
            co.setValueMultiSync({
                "NEEDGISRK": "0",
                "NEEDHXRK": "0"
            }, "", "", true);
            //==========end删除可能存在的入库文件提取数据
            //签章的状态修改为未签章 start====================
            co.setValueMultiSync({
                "CHDWSFQZ": "",
                "SHBMSFQZ": ""
            }, "","",true);
            //签章的状态修改为未签章   end====================

            co.Toolbox.hideMask();
        }
    } catch (e) {
        console.log(e);
    }
}

/**
 * 根据行政区找到配置页面，然后找到配置的各个环节办理人
 * 如果配置了测量事项则根据测量事项决定，否则就去没有测量事项的配置
 */
window.setHanlerByXzqConfig = function () {
    //根据行政区找到对应的行政区配置
    let xzqConfigRid = window.commonPorjectObject.setHanlerByXzqConfig("RID", co.getDomainValue("XZQCODE"));
    if (!xzqConfigRid) {
        return;
    }
    let clsx = co.getDomainValue("SSCG");
    //在行政区配置页面
    let handlerObj = window.commonPorjectObject.setHanlerByXzqClsxFlowStep(xzqConfigRid, clsx);
    //空间入库环节办理人另外用字段存起来，用于数据过滤用
    let importUsers = handlerObj["e16vkq7eijw7"];
    if (importUsers) {
        co.setDomainValue("IMPORTUSERS", importUsers)
    }
    co.setDomainValue("GHJKSHRID", JSON.stringify(handlerObj))
}

/**
 * 隐藏指定ID控件
 * @param key
 */
window.hideControl = function (key) {
    co.Dom.domIsLoaded(() => {
        let bPass = false;
        if (document.getElementById(key)) {
            bPass = true;
        }
        return bPass
    }, null, () => {
        co.Ctrl.setHide(key, true);
    }, null);
}

/**
 * 加载前隐藏一些控件和按钮
 */
window.hidControl = function () {
    let oCurT = co.params.taskInfo
    //成果上传：e79rkisi6m67
    //成果确认：e2yykpjszacn
    //技术审查：e3v4l8jvdbjs
    //成果审核：et5klrmjihq
    //空间入库：e16vkq7eijw7
    //成果共享：e10ukisi6nbe
    let taskDefinitionKey = oCurT.taskDefinitionKey;
    let assignee = oCurT.assignee;
    // if (taskDefinitionKey === "et5klrmjihq" || taskDefinitionKey === "e79rkisi6m67" || taskDefinitionKey === "e2yykpjszacn" || co.getValue("DWGFILE") === "" || co.getValue("DWGFILE") === null || co.getValue("DWGFILE") === undefined) {
    //     window.hideControl("1624325803000_1329");//隐藏空间数据入库
    // }
    // //如果不是成果上传环节和当前办理人，隐藏模板
    // if (taskDefinitionKey != "e79rkisi6m67" || assignee != $.O.getUserId()) {
    //     window.hideControl("F1C46177D44600FC1123");
    //     window.hideControl("F0D2417D0D9FD0BE3A93");
    // }
}
window.hidControl();

/**
 * 修改测绘成果
 * @constructor
 */
window.ChangeCGSC = function () {
    let jid = co.params.jid; //父表JID
    let rid = co.getValue("RID"); //父表RID
    let sSSCG = co.getValue('SSCG');
    let sDBSSCG = co.getDomainValue("SSCG",true);//可能存在的已保存过的成果类型
    let sDBDL =  co.getDomainValue("DL",true);//可能存在已保存过的大类
    let CLSXOBJ = co.Sql.execSql("根据测量事项字典代码查询中文名称", {"CODE": sSSCG});
    let clsxCn = "";
    let dlCn = "";
    if (CLSXOBJ['sql1'].length > 0) {
        clsxCn = CLSXOBJ['sql1'][0]["CLSX"];
        dlCn = CLSXOBJ['sql1'][0]["DL"];
    }
    co.setDomainValue("DL", dlCn);
    if (sSSCG != "" && (sSSCG != sDBSSCG || sDBSSCG === "" || sDBSSCG === null)) {
        //验证是否已经汇交过
        let data = co.Sql.execSql("查询当前案件编号的测绘事项是否已经汇交", {"ywbh": co.getValue("YWBH"), "clsx": sSSCG, "rid": rid});
        let obj = data['sql1'][0];
        if (obj.n != "0") {
            if (clsxCn) {
                co.Message.error_middle("【" + clsxCn + "】已经汇交！")
            } else {
                co.Message.error_middle("【" + sSSCG + "】已经汇交！")
            }
            co.setValue('SSCG', sDBSSCG);
            co.setValue('DL', sDBDL);
            return;
        }
        let data1 = co.Sql.execSql("查询某业务某测量事项的测量状态", {"ywbh": co.getValue("YWBH"), "clsx": sSSCG});
        let obj1 = data1['sql1'][0];
        //判断是否不再可办理状态
        if (obj1.CLZT != "测量中" && obj1.CLZT != "待开始") {
            co.Message.error_middle("测量事项【" + sSSCG + "】状态为：" + obj1.CLZT + "！")
            co.setValue('SSCG', sDBSSCG);
            co.setValue('DL', sDBDL);
            return;
        }
        if (sSSCG != sDBSSCG && sDBSSCG != "") {
            co.Dialog.confirm("重新选择将会重置已上传材料，是否确定？", "已经选择过汇交事项", () => {
                RefashCl(jid, rid, sSSCG);
            }, () => {
                co.setValue('SSCG', sDBSSCG);
                co.setValue('DL', sDBDL);
            })
        }
    }
}
// /**
//  * 刷新材料
//  * @param jid
//  * @param rid
//  * @param sSSCG
//  * @constructor
//  */
// window.RefashCl = function (jid, rid, sSSCG) {
//     co.Sql.execSql("根据jid删除汇交表的成果上传", {"jid": jid});
//     let selectparam = new Array();
//     //汇交清单
//     let data = co.Sql.execSql("根据测绘事项获取汇交清单", {"chsx": sSSCG});
//     let obj = data['sql1'];
//     let count = obj.length
//     for (let i = 0; i <= count - 1; i++) {
//         let info = obj[i];
//         let map = {};
//         //给子表赋值
//         map["PROJ_CGHJCHCGSCZBD.XH"] = info.XH;
//         map["PROJ_CGHJCHCGSCZBD.CGMC"] = info.CGMC;
//         map["PROJ_CGHJCHCGSCZBD.BXSC"] = info.BXSC;
//         map["PROJ_CGHJCHCGSCZBD.CHDWZJGX"] = info.CHDWZJGX;
//         map["PROJ_CGHJCHCGSCZBD.TSGJSDW"] = info.TSGJSDW;
//         map["PROJ_CGHJCHCGSCZBD.JID"] = jid;//jid和父表单的一致
//         map["PROJ_CGHJCHCGSCZBD.RID"] = "";
//         selectparam.push(map);
//     }
//     co.Subform.creates("0375d809-c66c-4214-9d0f-7cc77f2f1879", "PROJ_CGHJCHCGSCZBD", co.params.rid, "F73DC1766F699B7D9800", selectparam, () => {
//         co.Subform.refresh("F73DC1766F699B7D9800");
//     })
// }

/**
 * 在线质检1.0 idata质检
 * @param bIsSubmit
 */
window.startAutoCheck = function (bIsSubmit) {
    let getCglxValue = '';
    //小型项目特殊处理
    let dataSFXXXMArr = co.Sql.execSql("获取是否属于小型项目", {"ywbh": co.getValue("YWBH")});
    if (dataSFXXXMArr && dataSFXXXMArr.sql1 && dataSFXXXMArr.sql1.length > 0) {
        let sSFXXXM = dataSFXXXMArr.sql1[0]["SFXXXM"];
        if (sSFXXXM) {
            if (sSFXXXM === "1") {
                let sZL = co.getValue("ZL");
                if (sZL) {
                    let dataZLCHSXArr = co.Sql.execSql("测量事项子类质检类型查询", {
                        "clsx": co.getValue("SSCG"),
                        "zl": co.getValue("ZL")
                    });
                    if (dataZLCHSXArr && dataZLCHSXArr.sql1 && dataZLCHSXArr.sql1.length > 0) {
                        getCglxValue = dataZLCHSXArr.sql1[0]["ZJFA"];
                    }
                } else {
                    // 需要配置子类的测量事项
                    co.Message.error_middle('非自建房的请选择正确类型，不同的类型对应不同的质检规范');
                    return
                }
            }
        }
    }
    if (!getCglxValue) {
        let dataCHSXArr = co.Sql.execSql("根据测量事项获取IDATA质检项", {"clsx": co.getValue("SSCG")});
        if (dataCHSXArr && dataCHSXArr.sql1 && dataCHSXArr.sql1.length > 0) {
            getCglxValue = dataCHSXArr.sql1[0]["IDATA_ZJLX"];
        }
    }
    if (!getCglxValue) {
        // 质检启动失败！请联系超级管理员配置质检类型
        co.Message.error_middle('质检启动失败！请联系超级管理员配置质检类型')
        return
    }
    let zszl = co.getValue("WJJSC"); // 如果多选会出问题，后续需要优化，需要平台更新
    if (!zszl) {
        co.Message.error_middle('请上传成果压缩包')
        return;
    }
    // let fileName = zszl.split("|")[0] + "_质检结果.zip";
    let fileName = zszl.split("|")[0];
    // let downStr = "macroPath=" + zszl.split("|")[1];
    console.log(zszl)
    let downStr = zszl.split("|")[1]
    // let jid = co.params.jid;
    // let rid = co.getValue("RID");
    // let zjlx = co.getValue("CGLX");
    // let chdw = co.getValue("CHDWMC"); // 测绘单位
    // let xmbh = co.getValue("LHCHXMBH"); // 项目编号
    // let xmmc = co.getValue("LHCHXMMC"); // 项目名称-
    let getFileUrl = co.Config.getGlobalValue('InSiteNetworkDownLoadUrl');
    let task_id = '';

    let selectparam = {
        path: getFileUrl + '/file/public/downFileByPath?fileName=' + fileName + '&macroPath=' + downStr,
        task_id: '',
        CHLX: getCglxValue,
        CHDW: co.getValue('WTDW'),
        XMBH: co.getValue('GCBH'),
        XMMC: co.getValue('GCMC'),
        StrListJson: ""
    };
    $.ajax({
        url: "/sinfoweb/cghj/public/qualityInspectionCheck",
        //url: "http://192.168.92.1:9090/sinfoweb-hdy/cghj/public/qualityInspectionCheck",
        type: "POST",
        async: false,
        contentType: 'application/json',
        dataType: "JSON",
        data: JSON.stringify(selectparam),
        success: function (data) {
            if (data.code != 0) {
                co.Message.error_middle(data.desc);
            } else {
                //由于质检接口修改了返回格式，可能会是对象包一层，新版本会是字符串，所以做以下兼容
                let taskId = "";
                if ((typeof data.data) === "string") {
                    taskId = data.data;
                } else {
                    taskId = data.data.TaskId;
                }
                queryQuality(
                    taskId,
                    successCallback,
                    errorCallback
                );
            }
        },
        error: function (error) {
            co.Message.error_middle("质检错误，" + error.responseJSON.msg)
        },
    });

    // 生成uuid
    function uuid() {
        let s = [];
        let hexDigits = "0123456789abcdef";
        for (let i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";
        let uuid = s.join("");
        return uuid;
    }

    function queryQuality(taskId, successCallback, errorCallback) {
        let axiosConfig = {
            url: "/sinfoweb/cghj/public/qualityInspectionTaskProgress?taskId=" + taskId,
            //url: "http://192.168.92.1:9090/sinfoweb-hdy/cghj/public/qualityInspectionTaskProgress?taskId=" + taskId,
            type: "get",
            async: false,
        };
        window.parent.$sinfoUtil.modelProgress(
            window.Sgui,
            axiosConfig,
            successCallback,
            errorCallback,
            2000,
            "质检进度"
        );
    }

    function successCallback(data) {
        // 如果进度100了，则质检完成
        // console.log(data);
        if (data.pos.toString().includes("100")) {
            // 保存记录
            let xzdz = JSON.parse(data.data).zipurl;
            let sWJJSC = co.getValue("WJJSC");
            let aWJJSC = sWJJSC.split("|");
            let sNewTitle = aWJJSC[0].substring(0, aWJJSC[0].indexOf(".zip")) + "错误包.zip"
            $.ajax({
                //url: "http://192.168.92.1:9090/sinfoweb-hdy/cghj/public/changeDownUrl",
                url: "/sinfoweb/cghj/changeDownUrl",
                type: "POST",
                async: false,
                contentType: 'application/json',
                dataType: "text",
                data: JSON.stringify({
                    "zipurl": xzdz,
                    "sNewTitle": sNewTitle
                }),
                success: function (data) {
                    xzdz = data;
                },
                error: function (error) {
                    console.log("转换下载地址有误");
                },
            });
            // 错误数据为空（即质检没有错误），则修改质检状态
            if (JSON.parse(data.data).rowsList.length === 0) {
                co.setValue("SFZJTG", "2");
                co.setValue("SCZJCWB", xzdz);
                co.setValue("ZJJGJSON", "");
                // 修改页面红字审查
                shztShow();
                if (bIsSubmit) {
                    setTimeout(() => {
                        co.Dialog.confirm("质检通过，是否汇交？", "提交确认", () => {
                            co.Flow.co.Flow.readySubmitComplete();
                        })
                    }, 500);
                } else {
                    window.parent.$sinfoUtil.qualityInspectionResultsModel(
                        window.Sgui,
                        JSON.parse(data.data),
                        () => {
                            console.log('successCallback')
                        },
                        () => {
                            console.log('errorCallback')
                        },
                        (data) => {
                            window.downloadZjcwb();
                        },
                        '质检完成，存在{NUM}类错误，如下：'
                    );
                }
                console.log("123456");
            } else {
                co.setValue("SFZJTG", "1");
                co.setValue("SCZJCWB", xzdz);
                // 修改页面红字审查
                shztShow();
                co.setValue("ZJJGJSON", data.data);
                window.parent.$sinfoUtil.qualityInspectionResultsModel(
                    window.Sgui,
                    JSON.parse(data.data),
                    () => {
                        console.log('successCallback')
                    },
                    () => {
                        console.log('errorCallback')
                    },
                    (data) => {
                        window.downloadZjcwb();
                    },
                    '质检完成，存在{NUM}类错误，如下：'
                );
            }
        }
        $.ajax({
            //url: "http://192.168.92.1:9090/sinfoweb-hdy/cghj/public/updateCghjData",
            url: "/sinfoweb/cghj/updateCghjData",
            type: "POST",
            async: false,
            contentType: 'application/json',
            dataType: "text",
            data: JSON.stringify({
                "sczjcwb": encodeURIComponent(window.co.getValue("SCZJCWB")),
                "sfzjtg": window.co.getValue("SFZJTG"),
                "wjjsc": window.co.getValue("WJJSC"),
                "zjjgjson": window.co.getValue("ZJJGJSON"),
                "rid": window.co.getValue("RID")
            }),
            success: function (data) {
                console.log("保存成功！");
            },
            error: function (error) {
                console.log("保存失败");
                console.log(error);

            },
        });
        console.log("成功" + data);
    }

    function errorCallback(error) {
        shztShow();
        console.log("成功===" + error);
        co.Ctrl.setHide("1614671981000_17081");
        co.Ctrl.setHide("F5B7217AE5FFF97B3521");
        co.Ctrl.setHide("F074119582AE7743B3A3");
        co.Ctrl.setHide("F8B2319582ADBC9CB411");
        co.Message.error_middle("质检错误，" + error)
    }
}

window.startAutoCheck = startAutoCheck;

/**
 * 在线质检3.0 sme质检
 * @param bIsSubmit
 */
window.startAutoCheckSme = function (bIsSubmit) {
    let getCglxValue = ''
    //小型项目特殊处理
    let dataSFXXXMArr = co.Sql.execSql("获取是否属于小型项目", {"ywbh": co.getValue("YWBH")});
    if (dataSFXXXMArr && dataSFXXXMArr.sql1 && dataSFXXXMArr.sql1.length > 0) {
        let sSFXXXM = dataSFXXXMArr.sql1[0]["SFXXXM"];
        if (sSFXXXM) {
            if (sSFXXXM === "1") {
                let sZL = co.getValue("ZL");
                if (sZL) {
                    let dataZLCHSXArr = co.Sql.execSql("测量事项子类质检类型查询", {
                        "clsx": co.getValue("SSCG"),
                        "zl": co.getValue("ZL")
                    });
                    if (dataZLCHSXArr && dataZLCHSXArr.sql1 && dataZLCHSXArr.sql1.length > 0) {
                        getCglxValue = dataZLCHSXArr.sql1[0]["ZJFA"];
                    }
                } else {
                    // 需要配置子类的测量事项
                    co.Message.error_middle('非自建房的请选择正确类型，不同的类型对应不同的质检规范')
                    return
                }
            }
        }
    }
    if (!getCglxValue) {
        let dataCHSXArr = co.Sql.execSql("根据测量事项获取IDATA质检项", {"clsx": co.getValue("SSCG")});
        if (dataCHSXArr && dataCHSXArr.sql1 && dataCHSXArr.sql1.length > 0) {
            getCglxValue = dataCHSXArr.sql1[0]["IDATA_ZJLX"];
        }
    }
    //根据区县配置质检方案
    let dataSFQYSXZJFA=co.Sql.execSql("根据行政区和测量事项获取质检方案", {"xzq": co.getValue("XZQCODE"),"clsx":co.getValue("SSCG")});
    if(dataSFQYSXZJFA&&dataSFQYSXZJFA.sql1&&dataSFQYSXZJFA.sql1.length>0){
        getCglxValue =dataSFQYSXZJFA.sql1[0]['SMECGZJFA'];
    }
    if (!getCglxValue) {
        // 质检启动失败！请联系超级管理员配置质检类型
        co.Message.error_middle('质检启动失败！请联系超级管理员配置质检类型')
        return
    }
    let zszl = co.getValue("WJJSC"); // 如果多选会出问题，后续需要优化，需要平台更新
    if (!zszl) {
        co.Message.error_middle("请上传成果压缩包")
        return;
    }
    let fileName = zszl.split("|")[0];
    console.log(zszl)
    let downStr = zszl.split("|")[1]
    let getFileUrl = co.Config.getGlobalValue("InSiteNetworkDownLoadUrl");
    let iZipType = 0;
    if (co.getValue("SCZJCWB")) {
        iZipType = Number(co.getValue("SFDD"));
    }
    let oParam = {
        "data": [
            {
                "path": getFileUrl + '/file/public/downFileByPath?fileName=' + encodeURIComponent(fileName) +
                    '&macroPath=' + encodeURIComponent(downStr) + '&userId=00000001-0000-0000-0010-000000000001',
                // "type": "地下管线竣工测量",
                "type": getCglxValue,
                "zipType": iZipType
            }
        ]
    };
    $.ajax({
        url: "/sinfoweb/cghj/CheckWithScriptAsyn",
        type: "POST",
        async: false,
        contentType: 'application/json',
        dataType: "json",
        data: JSON.stringify(oParam),
        success: function (data) {
            if (data.code != 0) {
                co.Message.error_middle(data.desc,)
            } else {
                let taskId = "";
                //  调用查询接口
                if (data.data && data.data.TaskId) {
                    taskId = data.data.TaskId;
                } else {
                    taskId = data.data;
                }
                co.Toolbox.showMask();
                setTimeout(() => {
                    co.Toolbox.hideMask();
                    setTimeout(() => {
                        queryQuality(
                            taskId,
                            successCallback,
                            errorCallback
                        );
                    }, 0)
                }, 1000)
            }
        },
        error: function (error) {
            co.Message.error_middle("质检错误，" + error.responseJSON.msg)
        },
    });

    function queryQuality(
        taskId,
        successCallback,
        errorCallback
    ) {
        let axiosConfig = {
            url: "/sinfoweb/cghj/CheckWithScriptAsynQuery?taskId=" + taskId,
            type: "GET",
            async: false,
        };
        window.parent.$sinfoUtil.modelProgress(
            window.Sgui,
            axiosConfig,
            successCallback,
            errorCallback,
            2000,
            "质检进度"
        );
    }

    function successCallback(oReturn) {
        // 如果进度100了，则质检完成
        if (oReturn.pos.toString().includes("100")) {
            let aData = oReturn.data;
            if (aData.length === 0) {
                co.setValue("SFZJTG", "1");
                co.Message.error_middle("质检返回格式有误！")
            } else {
                let data = aData[0];
                let sZipurl = data.zipurl;
                let sWJJSC = co.getValue("WJJSC");
                let aWJJSC = sWJJSC.split("|");
                let sNewTitle = aWJJSC[0].substring(0, aWJJSC[0].indexOf(".zip")) + "质检结果包.zip"
                $.ajax({
                    //url: "http://192.168.92.1:9090/sinfoweb-hdy/cghj/public/changeDownUrl",
                    url: "/sinfoweb/cghj/changeDownUrl",
                    type: "POST",
                    async: false,
                    contentType: 'application/json',
                    dataType: "text",
                    data: JSON.stringify({
                        "zipurl": sZipurl,
                        "sNewTitle": sNewTitle
                    }),
                    success: function (data) {
                        sZipurl = data;
                    },
                    error: function (error) {
                        console.log("转换下载地址有误");
                    },
                });
                if (data.rowsList.length === 0) {
                    co.setValue("SFZJTG", "2");
                    // 保存记录
                    co.setValue("SCZJCWB", sZipurl);
                    shztShow();
                    if (bIsSubmit) {
                        if (data.total > 0) {
                            window.parent.$sinfoUtil.qualityInspectionResultsModel(
                                window.Sgui,
                                data,
                                () => {
                                    console.log('successCallback')
                                },
                                () => {
                                    console.log('errorCallback')
                                },
                                (data) => {
                                    window.downloadZjcwb();
                                },
                                '质检完成，存在{NUM}类错误，如下：'
                            );
                        } else {
                            setTimeout(() => {
                                let chdwqzpzqy = co.getValue("CHDWQZPZQY", "PROJ_DZQZ", "1", "1", true);
                                if (chdwqzpzqy == "1") {//需要签章
                                    window.signZipFile("测绘单位", true);
                                }else{
                                    co.Dialog.confirm("质检通过，是否汇交？", "提交确认", () => {
                                        co.Flow.readySubmitComplete();
                                    })
                                }
                            }, 500);
                        }
                    } else {
                        window.parent.$sinfoUtil.qualityInspectionResultsModel(
                            window.Sgui,
                            data,
                            () => {
                                console.log('successCallback')
                            },
                            () => {
                                console.log('errorCallback')
                            },
                            (data) => {
                                window.downloadZjcwb();
                            },
                            '质检完成，存在{NUM}类错误，如下：'
                        );
                    }
                } else {
                    co.setValue("SFZJTG", "1");
                    // 保存记录
                    co.setValue("SCZJCWB", sZipurl);
                    // 修改页面红字审查
                    shztShow();
                    co.setValue("ZJJGJSON", JSON.stringify(data));
                    window.parent.$sinfoUtil.qualityInspectionResultsModel(
                        window.Sgui,
                        data,
                        () => {
                            console.log('successCallback')
                        },
                        () => {
                            console.log('errorCallback')
                        },
                        (data) => {
                            window.downloadZjcwb();
                        },
                        '质检完成，存在{NUM}类错误，如下：'
                    );
                }
                $.ajax({
                    //url: "http://192.168.92.1:9090/sinfoweb-hdy/cghj/public/updateCghjData",
                    url: "/sinfoweb/cghj/updateCghjData",
                    type: "POST",
                    async: false,
                    contentType: 'application/json',
                    dataType: "text",
                    data: JSON.stringify({
                        "sczjcwb": encodeURIComponent(window.co.getValue("SCZJCWB")),
                        "sfzjtg": window.co.getValue("SFZJTG"),
                        "wjjsc": window.co.getValue("WJJSC"),
                        "zjjgjson": window.co.getValue("ZJJGJSON"),
                        "rid": window.co.getValue("RID")
                    }),
                    success: function (data) {
                        console.log("保存成功！");
                    },
                    error: function (error) {
                        console.log("保存失败");
                        console.log(error);

                    },
                });
            }
        } else {
            co.Message.error_middle("质检返回格式有误,未100%就返回成功！")
        }
    }

    function errorCallback(error) {
        shztShow();
        console.log("成功===" + error);
        if (error.indexOf("任务执行失败：") >= 0) {
            let oError = JSON.parse(error.substring(7));
            co.Message.error_middle("质检错误，" + oError.desc)
        } else {
            co.Message.error_middle("质检错误，" + error)
        }
    }
}
/**
 * 修改质检状态
 */
window.shztShow = function () {
    let ele = document.getElementById('F4120177D447417577BD')
    let type = co.getValue("SFZJTG");
    if (type === "2") {
        co.Ctrl.setHide("");
        co.Ctrl.setHide("1614671981000_17081", true);//质检结果包下载按钮
        co.Ctrl.setHide("F5B7217AE5FFF97B3521", true);//质检结果展示按钮
        co.Ctrl.setHide("F074119582AE7743B3A3", true);//质检结果定位
        co.Ctrl.setHide("F8B2319582ADBC9CB411", true);
        ele.innerHTML = '<div style="font-size:25px;color:#00DB00"> <strong>质检通过 </strong></div>'
    } else if (type === "1") {
        co.Ctrl.setHide("1614671981000_17081");
        co.Ctrl.setHide("F5B7217AE5FFF97B3521");
        co.Ctrl.setHide("F074119582AE7743B3A3");
        co.Ctrl.setHide("F8B2319582ADBC9CB411");
        ele.innerHTML = '<div style="font-size:25px;color:#F00"> <strong>质检不通过 </strong></div>'
    } else {
        co.Ctrl.setHide("1614671981000_17081", true);
        co.Ctrl.setHide("F5B7217AE5FFF97B3521", true);
        co.Ctrl.setHide("F074119582AE7743B3A3", true);
        co.Ctrl.setHide("F8B2319582ADBC9CB411", true);
        ele.innerHTML = '<div style="font-size:25px;color:#000000"> <strong>未质检 </strong></div>'
    }
}

window.shztShow();

window.watermarkFile = function (IsSubmit) {
    let macroPath = co.getValue('WJJSC');
    // let macroPath = "任意值";
    if (!macroPath || macroPath.includes("undefined")) {
        window.Vue.prototype.$modal.alert({
            title: '提示',
            content: '请上传zip压缩文件',
            similar: true,
            closable: false,
            footerHide: false,
            onOk: () => {
                // this.$modal.remove()
                window.Vue.prototype.$modal.remove()
            },
        })
        return;
    }
    let JID = co.params.jid;
    let taskId = "";
    let oCurTask = co.params.taskInfo;
    taskId = oCurTask["id"];
    if (!taskId) {
        co.Message.error_middle('获取当前环节失败！')
    }
    let WJM = macroPath.split(".")[0];
    console.log(macroPath);
    let filePath = macroPath.split("|")[1];
    /** =======================动态生成章的数字部分 =======================start **/
        // let iSIGNINFO = "0001";
        // let data = co.Sql.execSql("获取最大的成果盖章编号", {"sigininfo": $.Y + "-" + $.M + "-" + $.D + " " + $.Y + $.M + $.D});
        // if (data && data['sql1'] && data['sql1'].length > 0 && data['sql1'][0]["SIGNINFO"] != null) {
        //     let maxSIGNINFO = data['sql1'][0]["SIGNINFO"];
        //     let iMaxSIGNINFO = Number(maxSIGNINFO.replace($.Y + "-" + $.M + "-" + $.D + " " + $.Y + $.M + $.D, ""));
        //     if ((iMaxSIGNINFO + 1) < 10) {
        //         iSIGNINFO = "000" + (iMaxSIGNINFO + 1).toString();
        //     } else if (iMaxSIGNINFO + 1 < 100) {
        //         iSIGNINFO = "00" + (iMaxSIGNINFO + 1).toString();
        //     } else if (iMaxSIGNINFO + 1 < 1000) {
        //         iSIGNINFO = "0" + (iMaxSIGNINFO + 1).toString();
        //     } else {
        //         iSIGNINFO = (iMaxSIGNINFO + 1).toString();
        //     }
        // }
        // let sCurTime = co.DateUtil.dateNowShort().replace(":", "");
        // let sFinalSIGNINFO = sCurTimeO + iSIGNINF;
    let sFinalSIGNINFO = co.DateUtil.dateNowLong().replaceAll(":", "");
    co.Sql.execSql("保存最新的盖章编号", {"sigininfo": sFinalSIGNINFO, "rid": co.getValue('RID')});
    /**  =======================动态生成章的数字部分 =======================end **/
    let sContent = "海口市联合测绘成果入库专用章;dwg盖章;";//项目上的，产品展示没做处理
    //写死的签章参数，后续不使用这种方式
    let runParam = {
        //"urlZip": "sample string 1",//待签章Zip的url路径
        //"dwgPattern": "sample string 2",//dwg 搜索条件，默认为：*.dwg
        //"pdfPattern": "sample string 3",//pdf、word 搜索条件，默认为：*.pdf
        "dwgParam": {
            //   "keyType": 1,
            //   "postion": 2,
            //   "scale": 3.1,
            //   "signKey": "sample string 4",
            "signInfo": sFinalSIGNINFO
        },//【1】Dwg签章的相关参数
        // "dwg2jpgParam": {
        //   "type": 1,
        //   "dwgs": [
        //     "sample string 1",
        //     "sample string 2"
        //   ],
        //   "layerName": "sample string 2",
        //   "buffer": {
        //     "l": 1.1,
        //     "b": 2.1,
        //     "r": 3.1,
        //     "t": 4.1
        //   }
        // },//【2】Dwg转图片的相关参数
        "watermarkParam": {
            //"content": sFinalSIGNINFO,// 水印内容,必填
            "content": sContent,// 水印内容,必填
            "angle": -45,// 可为空，旋转角，默认值为：-45
            "fontName": "宋体",// 可为空，字体，默认值为：宋体，支持win字体
            "fontSize": 15,// 可为空，文字大小，默认值为：25
            "transparency": 0.8, // 可为空，透明度，默认值为：0.8
            "col": 3,
            "row": 3,
            "color": "sample string 8"
        },//【3】水印相关参数
        // "imageParam": {
        //   "items": [
        //     {
        //       "page": 1,
        //       "reverse": 2,
        //       "x": 3.1,
        //       "y": 4.1,
        //       "offsetX": 5.1,
        //       "offsetY": 6.1,
        //       "xyType": 7,
        //       "url": "sample string 8",
        //       "qrcode": "sample string 9",
        //       "width": 10.1,
        //       "height": 11.1
        //     },
        //     {
        //       "page": 1,
        //       "reverse": 2,
        //       "x": 3.1,
        //       "y": 4.1,
        //       "offsetX": 5.1,
        //       "offsetY": 6.1,
        //       "xyType": 7,
        //       "url": "sample string 8",
        //       "qrcode": "sample string 9",
        //       "width": 10.1,
        //       "height": 11.1
        //     }
        //   ]
        // },//【4】插入图片相关参数
        "signOParam": {
            "items": [
                //{
                // "page": 1,
                // "x": 0.5,
                // "y": 0.9,
                //"xyType": 3
                // },//
                {
                    "page": -1,
                    "x": 0.5,
                    "y": 0.9,
                    "xyType": 3
                }
            ],
            //"signType":"1",//2每一页都是真章 1第一页是真章（可验），其他也是图片  0都是图片
            "signKey": "SignPng1",
            "signInfo": sFinalSIGNINFO
            //   "fontName": "sample string 3",
            //   "fontSize": 4.1,
            //   "centerX": 5.1,
            //   "centerY": 6.1,
            //   "watermark": "sample string 7"
        },//【5】公章相关参数
        // "signCParam": {
        //   "item": {
        //     "signKey": "sample string 1",
        //     "signInfo": "sample string 2",
        //     "fontName": "sample string 3",
        //     "fontSize": 4.1,
        //     "centerX": 5.1,
        //     "centerY": 6.1,
        //     "watermark": "sample string 7"
        //   }
        // }//【6】骑缝章相关参数
    };

    let runParamArr = co.Sql.execSql("根据测量事项获取盖章json配置", {"clsx": co.getValue("SSCG")});
    var notToPdfRegex = "";
    if (runParamArr && runParamArr.sql1 && runParamArr.sql1.length > 0) {
        let sGZSYJSONCS = runParamArr.sql1[0]["GZSYJSONCS"];
        notToPdfRegex = runParamArr.sql1[0]["BXYZPDFWJ"];
        if (sGZSYJSONCS) {
            try {
                let oRumParam = JSON.parse(sGZSYJSONCS);
                if (oRumParam) {
                    runParam = oRumParam;
                    if(runParam.signOParam){
                        runParam.signOParam.signInfo = sFinalSIGNINFO;
                    }
                    if(runParam.dwgParam){
                        runParam.dwgParam.signInfo = sFinalSIGNINFO;
                    }
                }
            } catch (error) {

            }
        }
    }
    let selectparam = {
        "dir": "/data/watermark/", // 文件暂存路径，与Nginx配置alias 保持一致
        "fileName": WJM + "(已盖章).zip",// 压缩包名称
        "macroPath": filePath,
        "watermark": JSON.stringify(runParam),// pdf水印等配置,
        "rid": co.getValue('RID'),
        "jid": co.getValue('JID'),
        "taskId": taskId,
        "notToPdfRegex" : notToPdfRegex,
        "clsx": co.getValue('SSCG'),

        "needPic": true,//是否需要将图片转pdf后盖章

        // "onlyCgbg":"1",//给啥字符串都行，有字符串代表只要报告文件，只会针对含有"报告"字样的文件进行盖章
        /**
         * 当onlyCgbg未空是，onlyFileMark生效
         * 可以针对文件名含有特殊字符串字样的文件进行盖章，如果同时需要"报告"和其他文件，则onlyCgbg不传或留空，"onlyFileMark":["报告","xxxxx"],
         */
        // "onlyFileMark":["报告","宗地图","房产"],

        // "watermark": JSON.stringify(watermark),// pdf水印等配置,
        // "gz": JSON.stringify(gzobject),// pdf盖章等配置
        // "dwggz": JSON.stringify(dwggzobject)// dwg盖章等配置
    };
    co.Toolbox.showMask();
    setTimeout(() => {
        $.ajax({
            //url: "http://192.168.92.1:9090/sinfoweb-hdy/cghj/public/watermarkFile",
            url: "/sinfoweb/cghj/public/watermarkFile",
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            data: JSON.stringify(selectparam),
            dataType: "text",
            success: function (data) {
                co.Toolbox.hideMask();
                //  调用查询接口
                let taskId = data;
                queryQuality(
                    taskId,
                    successCallback,
                    errorCallback
                );
                // window.Vue.prototype.$modal.remove(()=>{
                //     //  调用查询接口
                //     let taskId = data;
                //     queryQuality(
                //         taskId,
                //         successCallback,
                //         errorCallback
                //     );
                // });
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                co.Toolbox.hideMask();
                window.Vue.prototype.$msg.warning('水印生成失败');
                console.log("失败" + JSON.stringify(data));
            }
        });

        // 生成uuid
        function uuid() {
            let s = [];
            let hexDigits = "0123456789abcdef";
            for (let i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
            s[8] = s[13] = s[18] = s[23] = "-";
            let uuid = s.join("");
            return uuid;
        }


        function queryQuality(
            taskId,
            successCallback,
            errorCallback
        ) {
            let axiosConfig = {
                //url: "http://192.168.92.1:9090/sinfoweb-hdy/cghj/public/watermarkTaskProgress?taskId=" + taskId,
                url: "/sinfoweb/cghj/public/watermarkTaskProgress?taskId=" + taskId,
                contentType: 'application/json; charset=utf-8',
                type: "GET",
                async: false
            };
            // window.Vue.prototype
            // window.Sgui
            window.parent.$sinfoUtil.modelProgress(
                window.Sgui,
                axiosConfig,
                successCallback,
                errorCallback,
                2000,
                "签章进度"
            );
        }

        function successCallback(data) {
            setTimeout(() => {
                co.Toolbox.showMask();
                setTimeout(() => {
                    // 如果进度100了，则质检完成
                    if (data.pos.toString().includes("100")) {
                        let zipDownUrl = data.data;
                        let oPaseParam = {
                            "zipDownUrl": zipDownUrl,
                            "dir": "/data/watermark/", // 文件暂存路径，与Nginx配置alias 保持一致
                            "fileName": WJM.indexOf("(已盖章)") >= 0 ? (WJM + ".zip") : (WJM + "(已盖章).zip"),// 压缩包名称
                            "rid": co.getValue('RID'),
                            "jid": co.getValue('JID'),
                            "taskId": taskId,
                            "clsx": co.getValue('SSCG'),

                            // "onlyCgbg":"1",//给啥字符串都行，有字符串代表只要报告文件，只会针对含有"报告"字样的文件进行盖章
                            /**
                             * 当onlyCgbg未空是，onlyFileMark生效
                             * 可以针对文件名含有特殊字符串字样的文件进行盖章，如果同时需要"报告"和其他文件，则onlyCgbg不传或留空，"onlyFileMark":["报告","xxxxx"],
                             * macroPath2必须配置，不配置则不会生效，配置需要签章成果包的宏路径即可
                             */
                            // "onlyFileMark":["报告","宗地图","房产"],
                            // "macroPath2":filePath,
                        };
                        $.ajax({
                            //url: "http://192.168.92.1:9090/sinfoweb-hdy/cghj/public/parseWatermarkFile",
                            url: "/sinfoweb/cghj/public/parseWatermarkFile",
                            contentType: 'application/json; charset=utf-8',
                            type: "POST",
                            data: JSON.stringify(oPaseParam),
                            dataType: "json",
                            success: function (aData) {
                                co.Toolbox.hideMask();
                                // window.Vue.prototype.$modal.remove(()=>{
                                co.setValue('QZHCGWJ', aData[0]);//盖章压缩包
                                co.setValue('CGUNZIP', "");//更新报告文件
                                co.setValue('CGUNZIP', aData[1]);//更新解压后的盖章文件
                                if (aData[2]) {
                                    co.setValue('CGBGSC', aData[2]);//更新报告文件
                                }
                                //盖章成果
                                window.sinfo_uploadSingleFileWithProgress("F55FA1838C898A085A82", "QZHCGWJ", "");
                                window.Vue.prototype.$modal.remove();// 移除遮罩
                                window.Vue.prototype.$msg.info('签章完毕');
                                if (IsSubmit) {
                                    setTimeout(() => {
                                        co.Dialog.confirm("签章完毕，是否提交？", "提交确认", () => {
                                            window.beforeShSubmitLastDo();
                                            // co.Flow.readySubmitComplete();
                                        })
                                    }, 500);
                                }
                                // });
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                co.Toolbox.hideMask();
                                window.Vue.prototype.$msg.warning('签章出错');
                                console.log("失败" + JSON.stringify(data));
                            }
                        });
                    } else {
                        co.Message.error_middle('盖章未完成就返回成功了！')
                    }
                }, 0);
            }, 100);
        }

        function errorCallback(error) {
            co.Message.error_middle("签章出错")
        }
    }, 200);
}

/**
 * 继续提交
 */
window.continueSubmit = function () {
    let sQZHCGWJ = co.getValue('QZHCGWJ');
    let shbmqzpzqy = co.getValue("SHBMQZPZQY", "PROJ_DZQZ", "1", "1", true);
    if(shbmqzpzqy=="1"){//新签章
        if (sQZHCGWJ != "" && sQZHCGWJ != null && co.getDomainValue("SHBMSFQZ", true) == "1") {
            co.Dialog.confirm("是否提交？", "提交确认", () => {
                window.beforeShSubmitLastDo();
            })
        } else {
            //盖章
            window.signZipFile("审核部门", true);
        }
    }else{
        if (sQZHCGWJ != "" && sQZHCGWJ != null) {
            co.Dialog.confirm("是否提交？", "提交确认", () => {
                window.beforeShSubmitLastDo();
            })
        } else {
            //盖章
            window.watermarkFile(true);
        }
    }
}
/**
 * 成果审核提交前最后干的事情（因为有签章，提交前、签章后的时机不好把控，提取一个方法出来）
 */
window.beforeShSubmitLastDo = function () {
    //①最普通的成果审核签章后立马提交
    co.Flow.readySubmitComplete();
    //②推送工改（多表）：云南省多测合一需求
    // window.pushGg(true);
}
/**
 * 推送工改（多表）：云南省多测合一需求
 * @param needSubmit
 */
window.pushGg = function (needSubmit) {
    let sftsgg = co.getDomainValue("SFTSGG", true);//是否已经推送工改
    if (sftsgg === "1") {//已经推送过
        if (needSubmit) {
            co.Flow.readySubmitComplete();
        }else{
            co.Message.info_middle("已经推送！");
        }
    } else {//未推送
        co.Message.coverAlert("正在将项目推送工改……", "提示", false, false);
        let xmRid = co.getValue("RID", "PROJ_LHCHYWDJB", "YWBH", co.getDomainValue("YWBH"), true);
        co.Http.request({
            url:"/sinfoweb/dataExchange/PushDataToExchangeMultiForm",
            data: {
                "rid": xmRid,
                "tableName": "PROJ_LHCHYWDJB"
            },
            success: (ret) => {
                let retObj = JSON.parse(ret);
                if (retObj.code !== 0) {
                    co.Message.error_middle("工改推送失败：" + retObj.desc);
                } else {
                    co.Http.request({
                        url: "/sinfoweb/dataExchange/PushDataToExchangeMultiForm",
                        data: {
                            "rid": co.params.rid,
                            "tableName": "PROJ_CGHJB"
                        },
                        success: (ret) => {
                            co.Message.coverAlert_close();
                            let retObj = JSON.parse(ret);
                            if (retObj.code !== 0) {
                                co.Message.error_middle("工改推送失败：" + retObj.desc);
                            } else {
                                co.Message.success_middle("推送成功！");
                                if (needSubmit) {
                                    co.Flow.readySubmitComplete();
                                }
                            }
                        },
                        error: (e) => {
                            co.Message.coverAlert_close();
                            co.Message.error_middle("成果工改推送失败！");
                        }
                    })
                }
            },
            error: (e) => {
                co.Message.coverAlert_close();
                co.Message.error_middle("项目工改推送失败！");
            }
        })
    }
}

/**
 * 入库
 * @param IsSubmit
 */
window.beginRK = function (IsSubmit) {
    let selectId = ''

    function startRK(successCallback, errorCallback, modelProgress) {
        const type = co.getValue('SFZJTG')
        if (type === '1') {
            co.Message.error_middle('判断您尚未质检成功，请尝试质检成功后再行入库')
            return
        }
        // let sRid = co.getValue('RID');
        // axios({
        //     method: "get",
        //     url: "/sinfoweb/cghj/public/unzipAndUploadCGB",
        //     params: { "cghjRid": sRid }
        // }).then((res) => {
        //     console.log('文件信息获取成果')
        //     console.log(res)
        //     co.setValue('CGUNZIP', res);
        const rid = co.getValue('RID');// 成果类型
        const cglx = co.getValue('SSCG');// 成果类型
        const ywbh = co.getValue('YWBH');
        const xzq = co.getValue('XZQ');
        const gcxxdd = co.getValue('GCXXDD');
        const ggzh = co.getValue('GCBH');
        const xmmc = co.getValue('GCMC');
        const jsxz = co.getValue('JSXZ');
        const jsdw = co.getValue('WTDW');
        const hjsj = co.getValue('SSTJSJ');
        const chdw = co.getValue('CHJG');
        let chlxArr = co.Sql.execSql("通过测量事项获取大类配置", {"clsx": cglx});
        let chlx = chlxArr.sql1[0].DL;
        let fileHong = co.getValue('CGUNZIP');
        // //获取成果入库方案---所有入库文件都用一个方案
        // let module = "";
        // let rkfaArr = co.Sql.execSql("获取成果入库方案配置", { "CLSX": cglx });
        // if(rkfaArr && rkfaArr.sql1 && rkfaArr.sql1.length>0){
        //     let info = rkfaArr.sql1[0];
        //     module = info["RKFA"];
        // }
        // if(!module){
        //     co.Message.error_middle('未配置入库方案')
        //     return
        // }
        let config = [];
        let rkfaArr = co.Sql.execSql("获取通用入库文件和方案配置", {"clsx": cglx});
        if (rkfaArr && rkfaArr.sql1 && rkfaArr.sql1.length > 0) {
            config = rkfaArr.sql1;
        }
        if (config.length === 0) {
            co.Message.error_middle('未配置入库方案')
            return
        }
        co.Toolbox.showMask();
        $.ajax({
            // url: "/sinfoweb/cghj/public/WebGisCreateProject",
            // //url: "/sinfoweb-hdy/cghj/public/WebGisCreateProject",
            url: "/sinfoweb/cghj/public/WebGisDataImport",
            //url: "/sinfoweb-hdy/cghj/public/WebGisDataImport",
            type: "POST",
            async: true,
            contentType: 'application/json',
            dataType: "JSON",
            data: JSON.stringify({
                rid: rid,
                // module: module,
                config: config,
                chlx: chlx,
                cglx: cglx,
                ywbh: ywbh,
                xzq: xzq,
                gcxxdd: gcxxdd,
                ggzh: ggzh,
                xmmc: xmmc,
                jsxz: jsxz,
                jsdw: jsdw,
                hjsj: hjsj,
                chdw: chdw,
                filepath: fileHong
            }),
            success: function (data) {
                co.Toolbox.hideMask();
                if (data !== "" && undefined !== data) {
                    selectId = data
                    //  调用查询接口
                    queryQuality(
                        selectId,
                        successCallback,
                        errorCallback,
                        modelProgress
                    );
                } else {
                    co.Message.error_middle(data.desc)
                }
            },
            error: function (error) {
                co.Toolbox.hideMask();
                co.Message.error_middle('接口错误')
                console.log('接口错误')
                console.log(error)
            },
        });
        // }).catch((err) => {
        //     co.Message.error_middle('解压成果包失败！')
        //     return
        // })
    }

    function modelProgress(
        vue,
        axiosConfig,
        successCallback,
        errorCallback,
        timeOut = 500
    ) {
        vue.$modal.alert({
            closable: false,
            render: (h) => {
                h = vue.$createElement
                return h({
                    template: `
              <div>
                <sg-progress :percent="percent" :animate="true" :stroke-width="20" text-inside text-color="#FFF" style="margin-bottom:10px;"/>
                <p>{{ message }}</p>
              </div>
              `,
                    data() {
                        return {
                            percentData: null,
                            percent: 0,
                            state: false,
                            message: ""
                        };
                    },
                    mounted() {
                        this.getPercent();
                    },
                    methods: {
                        async getPercent() {
                            axios({...axiosConfig})
                                .then((data) => {
                                    if (data.code != 0 && data.code) {
                                        throw data.desc;
                                    }
                                    this.percentData = data;
                                    this.percent = this.percentData.pos;
                                    this.state = this.percentData.data;
                                    this.message = this.percentData.message;
                                    if (this.state) {
                                        vue.$modal.remove();
                                        setTimeout(() => {
                                            successCallback(this.percentData);
                                        }, 1000)
                                    } else {
                                        setTimeout(this.getPercent, timeOut);
                                    }

                                })
                                .catch((error) => {
                                    vue.$modal.remove();
                                    errorCallback(error);
                                });
                        }
                    }
                });
            },
            footerHide: true,
            similar: true,
            width: "500px",
            height: "90px"
        });
    }


    function queryQuality(
        taskId,
        successCallback,
        errorCallback,
        modelProgress
    ) {
        let axiosConfig = {
            url: "/sinfoweb/cghj/public/QueryInWebGIS?taskId=" + taskId,
            // url: "/sinfoweb-hdy/cghj/public/QueryInWebGIS?taskId=" + taskId,
            type: "get",
            async: false,
        };
        modelProgress(
            window.Sgui,
            axiosConfig,
            successCallback,
            errorCallback,
            2000
        );
    }

    function successCallback(data) {
        co.setValue("SFRK", 1);
        // window.$.F.setCtrlDisable("1614663967000_59605", true);
        co.Sql.execSql("更新汇交数据的入库状态", {"rid": co.getValue("RID")});
        console.log("成功" + data);
        if (IsSubmit) {
            window.continueSubmit();
        } else {
            Vue.prototype.$msg.success('入库成功');
        }
    }

    function errorCallback(error) {
        console.log("成功===" + error);
        co.Message.error_middle("入库错误，" + error)
    }

    startRK(successCallback, errorCallback, modelProgress);
}


/**
 * 下载更改保存名
 * @type {downloadFile}
 */
window.downloadFile = function ({path, filename}) {
    const anchor = document.createElement('a');
    anchor.href = path;
    anchor.download = filename;
    anchor.target = '_blank'
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
}

//质检错误包下载
window.downloadZjcwb = function () {
    let sSCZJCWB = co.getValue("SCZJCWB");
    if (sSCZJCWB.indexOf("http") >= 0) {
        let sWJJSC = co.getValue("WJJSC");
        let aWJJSC = sWJJSC.split("|");
        let sNewTitle = aWJJSC[0].substring(0, aWJJSC[0].indexOf(".zip")) + "错误包.zip";
        window.downloadFile({
            path: sSCZJCWB,
            filename: sNewTitle
        })
    } else {
        let fileUrl = co.File.getSInfoWebDownLoadUrl({"sInfoUrl": sSCZJCWB});
        window.open(fileUrl);
    }
}
window.unzipAndUploadCGB = function () {
    function unzipSuccessCallBack(data) {
        co.setValue("CGUNZIP", data.dir, "", "", true).then(() => {
            //更新成果汇交提交记录表数据
            window.recordCghjLogData(co.params.rid, false, true);
        });
        let specifyFile = data.specifyFile;
        let aReportFile = [];
        if (specifyFile && specifyFile.length > 0) {
            for (let i = 0; i < specifyFile.length; i++) {
                let reportFileInfo = specifyFile[i];
                let aFile = reportFileInfo["file"];
                if (aFile && aFile.length > 0) {
                    for (let j = 0; j < aFile.length; j++) {
                        aReportFile.push(aFile[j]);
                    }
                }
            }
        }
        co.setDomainValue("CGBGSC", aReportFile.join("::"), true);
        //成果报告上传控件二次赋值
        window.sinfo_uploadSingleFileWithProgress("F4C0B1838C85FDD641E8", "CGBGSC", ".pdf");

        /**
         * 兼容没有入库文件提取的项目，需要加两个全局的配置，【是否启用成果入库】【成果是否必须包含入库数据】；
         * 1.如果【是否启用成果入库】配置了是，那么就在成果上传环节进行入库文件提取；
         *     ①如果当前测量事项没有配置提取入库文件的规则，则在成果上传环节提示【未读取到入库文件配置，请联系系统管理员】；
         *     ②如果没有提取到文件，【成果是否必须包含入库数据】配置【是】，则弹窗提示【当前成果包未提取到任何入库文件，请检查成果包是否含有入库数据且成果目录符合规范，请上传正确的成果包文件】，系统限制不允许继续提交；
         *     ③如果没有提取到文件，【成果是否必须包含入库数据】配置【否】，则弹窗提示【当前成果包未提取到任何入库文件，是否继续提交】，选择是继续提交，不进行限制；
         *     ④如果提取的文件多了，不符合我们之前约定的规则，则弹窗提示【当前成果包提取入库文件失败，请检查成果包是否符合规范】。是否限制继续下一步，取决于【成果是否必须包含入库数据】的配置。
         *     ⑤如果没有提取到文件或者提取多了文件，但是依旧继续提交，则系统自动跳过入库环节，不生成入库任务。
         * 2.如果【是否启用成果入库】配置了否，则在成果上传环节不提取，不加任何限制，并且自动跳过【数据入库】环节；
         * **/
        //==============解压完成之后进行入库文件的提取start
        co.setDomainValue("RKXZTJTS", "", true);
        if (co.getValue("SFQYCGRK", "PROJ_CLSXPZ", "CLSX", co.getDomainValue("SSCG"), true) === "1") {
            window.getImortDbFiles();
        }
        //==============解压完成之后进行入库文件的提取end
    }

    function unzipFailCallBack(data) {
        let file = co.getDomainValue("WJJSC");
        if (file) {
            co.Http.request({
                url: "/sinfoweb/file/deleteDir",
                data: {
                    "dir": file.split("|")[1]
                },
                success: (ret) => {
                },
                error: (ret) => {
                }
            })
        }
        co.setValueSync("WJJSC", "", "", "", true);
        window.sinfo_uploadSingleFileWithProgress("FF0EB1838C79B44B9F65", "WJJSC", ".zip", true, true, true, window.doAfterUploadedWjjsc);
        co.Message.error_middle(data.desc);
    }
    try{
        co.Progress.baseProgressFake("正在解压成果包", 10000, "解压中……", null, null);
        //持续进度条，无进度比率，接口请求完则关闭
        //co.Progress.baseProgressLoop("正在解压成果包", "解压中……", null, null);
        setTimeout(() => {
            //查询报告提取配置
            let clsx = co.getValue("SSCG");
            let reportTqConfigArr = co.Sql.execSql("获取测量事项报告提取配置", {"clsx": clsx});
            let specifyFileList = [];
            if (reportTqConfigArr && reportTqConfigArr.sql1 && reportTqConfigArr.sql1.length > 0) {
                let info = reportTqConfigArr.sql1[0];
                if (info["CGBGMC"]) {
                    specifyFileList = [
                        {
                            "fileName": info["CGBGMC"],
                            "dir": info["CGBGLJ"] ? info["CGBGLJ"] : "",
                            "skipFirstDir": true
                        }
                    ];
                }
            }
            let oPostData = {
                "zipFile": co.getValue("WJJSC"),
                // "extensionsList": [
                //     "mdb",
                //     "dwg"
                // ],
                // "extensionsNeedNew": true,
                "specifyFileList": specifyFileList,
                "specifyFileNeedNew": true,
                "pId": co.params.jid
            }
            unzipFile(oPostData, unzipSuccessCallBack,unzipFailCallBack);
        }, 0);
    }catch (e){
        console.log(e);
        co.Message.error_middle("解压失败");
        co.Progress.baseProgressClose();
    }

}
window.getImortDbFiles = function () {
    try {
        //由于新功能，先包着trycatch
        co.Http.request({
            url: "/sinfoweb/cghj/getImortDbFiles",
            data: {
                "rid": co.params.rid,
                "gisRkSubFromId": co.subFormMap.IMPORT_GIS.formId,
                "gisRkSubFromControlId": co.subFormMap.IMPORT_GIS.controlId,
                "hxRkSubFromId": co.subFormMap.IMPORT_HX.formId,
                "hxRkSubFromControlId": co.subFormMap.IMPORT_HX.controlId
            },
            success: (ret) => {
                setTimeout(() => {
                    co.setValueMultiSync({
                        "NEEDGISRK": co.getDomainValue("NEEDGISRK", true),
                        "NEEDHXRK": co.getDomainValue("NEEDHXRK", true)
                    }, "", "", true);
                    let retObj = JSON.parse(ret)
                    if (retObj.code === 0) {
                        let dataSplit = retObj.data.split("|");
                        let dataType = dataSplit[0];
                        let alertMessage = dataSplit[1];
                        if (dataType === "info") {
                            co.Message.info_middle(alertMessage);
                        } else if (dataType === "error") {
                            co.Message.error_middle(alertMessage);
                            co.setDomainValue("RKXZTJTS", alertMessage, true);
                        } else if (dataType === "confirm") {
                            co.Dialog.confirm(alertMessage, "提示", () => {

                            }, () => {
                                co.setDomainValue("RKXZTJTS", dataSplit[2], true);
                            })
                        } else if (dataType === "success") {
                            co.Message.success_middle(alertMessage);
                        }
                        co.Subform.refresh(co.subFormMap.IMPORT_GIS.controlId);
                        co.Subform.refresh(co.subFormMap.IMPORT_HX.controlId);
                    } else {
                        co.Message.error_middle(retObj.desc);
                    }
                }, 500)
            },
            error: (ret) => {
                co.Message.error_middle("提取数据入库接口调用失败，请联系管理员！");
                console.log("提取入库文件失败：")
                console.log(ret);
            }
        })
    }catch (e){
        console.log("提取入库文件失败：")
        console.log(e);
    }
}
/**
 * 解压zip文件
 * @param oPostData
 * {
 *     "zipFile": "20210364BCDF-CHY房产实测绘.zip|%%jobfiles%/202204/202204080008/7885050a-1227-469c-aaeb-824aa9623a0f/PROJ_CGHJB_WJJSC/c7ccc27d-abb6-414a-8d97-03e0469539d7.zip",//zip字段值
 *     "extensionsList": [
 *         "mdb",
 *         "dwg"
 *     ],//文件格式字符串数组，提取对应的文件
 *     "extensionsNeedNew": true,//文件格式提取的文件是否使用新文件（默认否：使用和解压后文件控件中相同文件）
 *     "specifyFileList": [
 *         {
 *             "fileName": "*实测*成果报*.pdf",
 *             "dir": "/",
 *             "skipFirstDir": true//是否跳过首文件夹
 *         }
 *     ],//指定文件名文件，可模糊查询
 *     "specifyFileNeedNew": true
 * }
 */
window.unzipFile = function (oPostData, successCallBack, failCallBack) {
    console.log(JSON.stringify(oPostData));
    co.Http.request({
        url: "/sinfoweb/file/unzipFile",
        data: oPostData,
        timeout: 1800000,
        success: (ret) => {
            co.Progress.baseProgressClose();
            let d = JSON.parse(ret);
            if (d.code === 0) {
                if (successCallBack) {
                    successCallBack(d.data);
                }
            } else {
                if (failCallBack) {
                    failCallBack(d);
                } else {
                    co.Message.error_middle("解压失败");
                }
            }
        },
        error: (ret) => {
            co.Message.error_middle("解压失败");
        }
    })
}

/**
 * 展示成果下载记录
 */
window.showDownLoadRecords = function () {
    //判断是否有对应的自定义控件ID
    let id = "F44BF17DFA8C672B9D9F";
    if (!document.getElementById(id)) {
        return;
    }
    const {baseTable} = window.top.IBaseExpressLib
    baseTable({
        vue: Sgui,//注册sgModal、sgTable的vue实例
        width: '100%',
        loadingText: '下载记录加载中',//遮罩层的提示文本
        containerType: '2',//容器类型，默认'1' '1'：弹窗 '2'：插入到目标dom
        selector: $("#" + id)[0],//容器类型为 2 时的dom目标
        isPage: true,//是否分页，默认否
        onRenderReady: (tableVue) => {
            window.downLoadRecordTableVue = tableVue;
            // 模拟其他地方的按钮触发刷新表格（保留原分页参数）
            // setTimeout(() => {
            //     tableVue.getTable()
            // }, 5000)
            // 模拟其他地方的按钮触发重载表格（分页参数回到第一页）
            // setTimeout(() => {
            //     tableVue.reloadTable()
            // }, 10000)
        },
        tableResCallback: (params) => {
            let page = params.page;
            let size = params.size;
            return new Promise(resolve => {
                let sCGUNZIP = co.getValue('CGUNZIP')
                let dirRid = "";
                if (sCGUNZIP) {
                    let aCGUNZIP = sCGUNZIP.split("|");
                    dirRid = aCGUNZIP[1];
                }
                $.ajax({
                    url: "/sinfoweb/cghj/public/getCgDownLoadRecord",
                    // url: "/sinfoweb-hdy/cghj/public/getCgDownLoadRecord",
                    type: "POST",
                    async: true,
                    contentType: 'application/json',
                    dataType: "JSON",
                    data: JSON.stringify({
                        "rid": co.getValue('RID'),
                        "dirRid": dirRid,
                        "page": page,
                        "size": size
                    }),
                    success: function (data) {
                        data.columns[0].width = "70px";//序号
                        data.columns[1].width = "180px";//下载人
                        data.columns[2].width = "170px";//下载时间
                        data.columns[4].width = "180px";//类型
                        resolve(data)
                    },
                    error: function (error) {
                        console.log("成果下载记录查询失败")
                        console.log(error)
                    },
                });
            })
        }
    })
}

//送审成果字段下拉赋值（也就是测量事项下拉赋值）
window.getClsxDropDownList = function () {
    let clsxArr = co.Sql.execSql("成果汇交获取可委托测量事项", {
        "ywbh": co.getValue("YWBH"),
        "clsx": co.getValue("SSCG") ? co.getValue("SSCG") : ""
    })
    let aReturn = [];
    if (clsxArr && clsxArr.sql1 && clsxArr.sql1.length > 0) {
        aReturn = clsxArr.sql1;
    }
    return aReturn;
}

/**
 * 记录当前成果汇交的变更记录
 * @param addTjjl 是否新增记录
 * @param updateTjjl 是否更新记录
 * @param recordData 自定义需保存的字段， Map<String,String>对象。
 */
window.recordCghjLogData = function (rid, addTjjl, updateTjjl, recordData) {
    let data = {
        "rid": rid,
        "addTjjl": addTjjl,
        "updateTjjl": updateTjjl
    };
    if (recordData) {
        data["recordData"] = recordData;
    }
    co.Http.request({
        url: "/sinfoweb/cghj/recordCghjSubmitData",
        timeout: 1800000,
        data: data,
        success: (ret) => {
        },
        error: (ret) => {
        }
    })
}
/**
 * 审核环节计算临时评分(有子表控件ID使用子表控件ID和RID,没有就使用jid)
 * @param tableName
 * @param saveColKey
 */
window.calculateLspf = function (tableName, saveColKey, subFormControlId) {
    //为当前成果汇交临时分数赋值
    let pfSumArr = [];
    if (!subFormControlId) {
        pfSumArr = co.getList("KF", tableName, "JID", co.params.jid, true);
    } else {
        pfSumArr = co.getList("KF", tableName, "SYS_PARENTRID", co.params.rid + "::" + subFormControlId, true);
    }
    let pfSum = 100;
    for (let i = 0; i < pfSumArr.length; i++) {
        pfSum = pfSum - Number(pfSumArr[i]["KF"]);
    }
    co.setDomainValue(saveColKey, pfSum.toString(), true);
}

/**
 * 退回成果上传
 * @param saveColArr 退回时保存数据
 * @param saveAfterReturnObj 退回之后保存数据，主要是退回如果失败，不赋值
 * @param dhyy 退回原因
 */
window.returnCgsc = function (saveColArr, saveAfterReturnObj, dhyy,newStatus) {
    window.returnBy = saveAfterReturnObj.THF;
    co.Message.coverAlert("正在退回...", "提示");
    let sjlx = co.getValue("SJLX", "PROJ_LHCHYWDJB", "YWBH", co.getValue("YWBH"), true);
    let mDefinitionKey = "e79rkisi6m67"//成果上传
    let CHCG = "上传中"
    let CLZT = "被退回"
    let sfdqr = false
    let ywxtConfigArr = co.Sql.execSql("查询业务系统配置的回退环节", {});
    if (sjlx != "测绘单位创建" && sjlx != "窗口创建" && ywxtConfigArr && ywxtConfigArr.sql1 && ywxtConfigArr.sql1.length > 0) {
        let info = ywxtConfigArr.sql1[0]
        let hthj = info["HTHJ"]
        if(hthj && hthj != "0"){
            mDefinitionKey = hthj
            CHCG = "待甲方确认"
            CLZT = "待确认"
            sfdqr = true
        }
    }
    let oPostData = {
        "dhyy": dhyy,
        "jid": co.params.jid,
        "rid": co.params.rid,
        "tableName": co.params.table,
        "mDefinitionKey": mDefinitionKey
    }
    let saveColObj = {};
    if (saveColArr.length > 0) {
        for (let i = 0; i < saveColArr.length; i++) {
            let keyCol = saveColArr[i];
            saveColObj[keyCol] = co.getDomainValue(keyCol);
        }
        oPostData["oJson"] = saveColObj;
    }
    //调用退回接口
    co.Http.request({
        url: "/sinfoweb/flow/returnTask",
        data: oPostData,
        responseType: "text",
        success: (ret) => {
            co.Message.coverAlert_close();
            let curSpIndex = Number(co.getDomainValue("SPINDEX"));
            let newSpIndex = (curSpIndex + 1).toString();
            saveAfterReturnObj["SPINDEX"] = newSpIndex;
            /**修改当前表数据**/
            co.setValueMultiSync(saveAfterReturnObj, "", "", true)
            /**修改开展情况数据**/
            co.setValueMultiSync({
                "CHCG": CHCG,
                "CLZT": CLZT,
                "WCSJ": ""
            }, "RID", co.getDomainValue("KZQKBRID"), true, "proj_ywdj_clkzqk")
            if(sfdqr){
                co.setValueSync("QRZT", "待确认", "RID", co.getDomainValue("RID"), true, "PROJ_CGHJB");
            }
            /**修改项目表数据**/
            co.setValueSync("NEWSTATUS", newStatus, "YWBH", co.getDomainValue("YWBH"), true, "PROJ_LHCHYWDJB");
            /**添加项目预警记录**/
                //将成果汇交和项目标记为预警
            let xmrId = co.getValue("RID", "PROJ_LHCHYWDJB", "YWBH", co.getValue("YWBH"), true);
            let addFormData = [
                {
                    "PROJ_XMYC.XMRID": xmrId,
                    "PROJ_XMYC.YJLX": "成果质量预警",
                    "PROJ_XMYC.YJLYRID": co.params.rid,
                    "PROJ_XMYC.YJSJ": co.DateUtil.dateNowLong(),
                    "PROJ_XMYC.YJZT": "1"
                }
            ]
            co.Subform.creates("8ca67be3-4ef9-47b9-bd46-081f759850e2", "PROJ_XMYC", "", "", addFormData);
            //发送短信，目前支持S010，成果审核的短信发送，技术审查未加，需要加的话要在标准版的代码往后延
            window.sendMsgToChdwByReturn();


            co.Message.success_middle("退回成功");
            /** 延迟500毫秒关闭页面，让提交记录的异步接口调用到先 **/
            setTimeout(() => {
                co.PageTab.closeCurrTab();
            }, 500);
            //生成新的成果汇交提交记录
            window.recordCghjLogData(co.params.rid, true, false);
            /** 延迟500毫秒关闭页面，让提交记录的异步接口调用到先 **/
        },
        error: (ret) => {
            co.Message.coverAlert_close();
            co.Message.error_middle("退回失败");
        }
    })
}
/**
 * 退回测绘单位短信发送
 * 发送短信，目前支持S010，成果审核的短信发送，技术审查未加，需要加的话要在标准版的代码往后延
 */
window.sendMsgToChdwByReturn = function () {
    //发送短信，目前支持S010，成果审核的短信发送，技术审查未加，需要加的话要在标准版的代码往后延
    try {
        //定义短信发送方法
        //#import g_SmsSend
        switch (window.returnBy) {
            case "业务审核":
                break;
            default:
                return;
        }
        //获取测绘单位电话
        let chdwInfo = co.getValue("YDDH,JID", "VIEW_PROJ_CHDWJBXX_ALL", "USERID", co.getDomainValue("CHDWUSERID"), true);
        if (chdwInfo) {
            let yddh = chdwInfo["YDDH"];
            let phoneNumArr = [];
            if(yddh){
                phoneNumArr.push(yddh);
            }
            //如果配置了需要给测绘单位的每个人原发送短信，则需要查询人员列表，如果有LXDH字段且有值，则发送短信
            let config = co.getValue("SENDDWRY", "PROJ_MSG_CONFIG", "1", "1", true);
            if (config && config === "1") {
                let ryList = co.getList("LXDH", "PROJ_CYRYXX", "JID", chdwInfo["JID"], true);
                if (ryList.length > 0) {
                    for (let i = 0; i < ryList.length - 1; i++) {
                        if (ryList[i]["LXDH"] && phoneNumArr.indexOf(ryList[i]["LXDH"]) === -1) {
                            phoneNumArr.push(ryList[i]["LXDH"]);
                        }
                    }
                }
            }
            let code = "S010";
            let templateParams = [
                co.getDomainValue("YWBH"),
                co.getDomainValue("GCMC"),
                co.User.getFirstDept(co.User.userId())
            ];
            if (phoneNumArr.length > 0) {
                for (let i = 0; i < phoneNumArr.length; i++) {
                    g_SmsSend(phoneNumArr[i], "", code, templateParams);
                }
            }
        }
    } catch (e) {

    }
}
/**
 * 旧数据开展情况RID为空的数据获取值
 */
window.getKzqkRidForNull = function () {
    if (!co.getDomainValue("KZQKBRID")) {//为空才需要获取
        let kzqkRidArr = co.Sql.execSql("获取开展情况RID", {
            "clsx": co.getDomainValue("SSCG"),
            "ywbh": co.getDomainValue("YWBH"),
            "hjindex": co.getDomainValue("hjindex")
        });
        if (kzqkRidArr && kzqkRidArr.sql1 && kzqkRidArr.sql1.length > 0) {
            let curRid = kzqkRidArr.sql1[0]["RID"];
            co.setDomainValue("KZQKBRID", curRid, true);
        }
    }
}
/**
 * 标记为已解决
 */
window.setHandled = function (subformMap){
    let selectData = co.Subform.getAllSelected(subformMap.controlId);
    if (selectData.length === 0) {
        co.Message.error_middle("请选择标记为解决的数据");
        return;
    }
    try {
        let needDoRid = [];
        for (let i = 0; i < selectData.length; i++) {
            let info = selectData[i];
            let hy = info[subformMap.tableName + ".HY"];
            if (!hy) {
                co.Message.error_middle("没有回应情况的无法标记为已解决");
                return;
            }
            needDoRid.push(info[subformMap.tableName + ".RID"]);
        }
        co.Dialog.confirm("是否确定标记为已解决？", "提示", () => {
            co.Toolbox.showMask();
            let doneIndex = 0;
            for (let i = 0; i < needDoRid.length; i++) {
                co.setValue("FCYJ", "已解决", "RID", needDoRid[i], true, subformMap.tableName).then(() => {
                    doneIndex++;
                    if (selectData.length === doneIndex) {
                        co.Subform.refresh(subformMap.controlId);
                        co.Message.success_middle("操作成功");
                        co.Toolbox.hideMask();
                    }
                });
            }
        })
    } catch (e) {
        console.log(e);
        co.Message.error_middle("操作失败");
        co.Subform.refresh(subformMap.controlId);
    }
}
/**
 * 抽查相关判断
 */
window.spotCheckJudgment = function (){
    //判断是否成果抽查跳转过来的
    const SearchQuery = new URLSearchParams(window.location.search) // 浏览器query参数
    let isCgcc = false;//是否成果抽查，默认否
    if (SearchQuery.get('formDataStr')) {//如果是成果抽查页面跳转过来的，会有标志
        let formData = JSON.parse(SearchQuery.get('formDataStr'));
        if (formData["isCgcc"] === 1) {
            isCgcc = true;
        }
    }
    if (isCgcc) {
        //成果抽查跳转过来的
        //保存是否隐藏
        let bHideSaveBtn = true;
        //接办按钮是否隐藏
        let bHideClaimBtn = true;
        //完成检查按钮是否隐藏
        let bHideCheckComplete = true;
        //成果抽查模块是否可编辑
        let bCanEditCgcc = false;
        //成果抽查的抽查报告是否可编辑
        let bCanEditReport = false;
        let canClaimUserIds = co.getDomainValue("CGCCKJBR");//成果抽查可接办人
        let handlerUserId = co.getDomainValue("CGCCBLR");//已接办办理人
        let isCheckEnd = co.getDomainValue("CGCCSFJS");//接否检查结束
        if (!handlerUserId && isCheckEnd !== "1") {//未接办
            if (canClaimUserIds.indexOf(co.User.userId()) >= 0) {//可接办
                //①显示抽查接办按钮
                bHideClaimBtn = false;
            } else {//不可接办

            }
        } else if (isCheckEnd === "1") {//已结束
            bHideClaimBtn = true;
        } else {//已接办
            //质量评分赋值
            if (!co.getDomainValue("CGCCZLPF")) {
                co.setDomainValue("CGCCZLPF", "100", true);
            }
            if (handlerUserId === co.User.userId()) {//办理人
                //①显示完成保存按钮
                bHideSaveBtn = false;
                //②显示完成检查按钮
                bHideCheckComplete = false;
                //③整个抽查模块可编辑
                bCanEditCgcc = true;
                //④可编辑抽查报告
                bCanEditReport = true;
                //⑤质检人赋值
                if(!co.getDomainValue("CGCCR")){
                    co.setValueMulti({
                        "CGCCR": co.User.getRealName(),
                        "CGCCRQ": co.DateUtil.dateNowShort()
                    }, "", "", true);
                }
            } else {//非办理人

            }
        }
        //是否隐藏保存按钮
        //由于平台将generateForm-btn改成了generate-form-btn，统一在co底层类中改，方便后续再次发生变化
        // if (bHideSaveBtn) {
        //     $($('.generateForm-btn button')[0]).hide()
        // } else {
        //     $($('.generateForm-btn button')[0]).show()
        // }
        co.Form.setSaveBtnHide(bHideSaveBtn);
        //是否隐藏接办按钮
        if (bHideClaimBtn) {
            setTimeout(() => {
                co.Ctrl.setHide(window.specialControlId.checkClaim, true);
            }, 500)
        } else {
            co.Ctrl.setHide(window.specialControlId.checkClaim, false);
        }
        //是否隐藏抽查结束按钮
        if (bHideCheckComplete) {
            setTimeout(()=>{
                co.Ctrl.setHide(window.specialControlId.checkComplete, true);
            },500)
        } else {
            co.Ctrl.setHide(window.specialControlId.checkComplete, false);
        }
        //是否可编辑成果抽查模块
        if (bCanEditCgcc) {
            co.Ctrl.setDisable(window.specialControlId.checkTable, false);
        } else {
            co.Ctrl.setDisable(window.specialControlId.checkTable, true);
        }
        //成果抽查抽查报告是否可编辑
        if (bCanEditReport) {
            window.sinfo_uploadSingleFileWithProgress("FF644184177EFB7392D5", "CGCCBG", "");
        } else {
            window.sinfo_uploadSingleFileWithProgress("FF644184177EFB7392D5", "CGCCBG", "", false, false);
        }

        //已读用户ID赋值
        let readedUserIds = co.getDomainValue("CGCCYDYHID");//抽查已读用户ID
        let readedUserIdsArr = [];
        if (readedUserIds) {
            readedUserIdsArr = readedUserIds.split(",");
        }
        if (readedUserIdsArr.indexOf(co.User.userId()) == -1) {
            readedUserIdsArr.push(co.User.userId());
            co.setDomainValue("CGCCYDYHID", readedUserIdsArr.join(","), true);
        }
        setTimeout(()=>{
            co.Ctrl.setHide("581d1a0a-eb68-46f3-b96c-1ad62b0dbb9c", true);
        },500)
    } else {//不是成果抽查跳转过来的
        //隐藏成果抽查模块
        window.hideDivAndHideNavigationBar(window.specialControlId.checkTable, window.specialControlId.checkTableTitleId);
        //隐藏抽查接办按钮
        co.Ctrl.setHide(window.specialControlId.checkClaim, true);
        //隐藏抽查结束按钮
        co.Ctrl.setHide(window.specialControlId.checkComplete, true);
    }
}
/**
 * 成果上传环节相关的显隐和设值
 */
window.dealForm_uploadfileStep = function (){
    /**
     * 成果上传：e79rkisi6m67
     * 成果确认：e2yykpjszacn
     * 技术审查：e3v4l8jvdbjs
     * 成果审核：et5klrmjihq
     * 空间入库：e16vkq7eijw7
     * 成果共享：e10ukisi6nbe
     * **/
    if (co.params.taskInfo) {
        //成果上传环节==================================================================================================
        let cgscAndBgscEdit = false;//成果上传和报告上传的是否可编辑，默认否
        if (co.params.taskInfo.taskDefinitionKey === "e79rkisi6m67") {
            if (co.params.taskInfo.assignee === co.User.userId()) {//当前办理人
                //①送审提交时间为空要赋值
                if (!co.getValue("SSTJSJ")) {
                    setTimeout(() => {//异步的原因是不异步日期有时候会抽搐。。。
                        co.setDomainValue("SSTJSJ", co.DateUtil.dateNowShort(), true);
                    }, 0);
                }
                //②测绘机构为空查询当前测绘单位的信息
                if (co.getValue("CHJG") === "" || co.getValue("CHJG") === null) {
                    let data = co.Sql.execSql("根据用户ID获取单位信息", {"userid": co.User.userId()}, null);
                    if (data && data["sql1"] && data["sql1"].length > 0) {
                        let obj = data['sql1'][0];
                        co.setDomainValue("CHJG", obj["DWMC"]);
                        co.setDomainValue("CHDWUSERID", co.User.userId());
                    }
                }
                //③打回是否查看的标志置为1
                if (co.getValue("DHSFCK") === "0") {
                    co.setDomainValue("DHSFCK", "1", true);
                }
                //④悬浮展示被建设单位退回的原因
                showReturnReason();
                //⑤根据行政区和测量事项等给各个环节的办理人赋值
                window.setHanlerByXzqConfig();
            } else {//非当前办理人
                //①成果文件和报告文件上传控件样式修改，同时不可编辑
            }
        }
    }
}
/**
 * 建设单位确认相关显隐和设值
 */
window.dealForm_jsdwConfirm = function () {
    let hideCgxzjl = true;//隐藏成果下载记录
    /**
     * 成果上传：e79rkisi6m67
     * 成果确认：e2yykpjszacn
     * 技术审查：e3v4l8jvdbjs
     * 成果审核：et5klrmjihq
     * 空间入库：e16vkq7eijw7
     * 成果共享：e10ukisi6nbe
     * **/
    if (co.params.taskInfo) {
        //成果上传环节==================================================================================================
        if (co.params.taskInfo.taskDefinitionKey === "e79rkisi6m67") {
            //隐藏成果确认模块
            window.hideDivAndHideNavigationBar("F681818381ECCC56F879", "F22B518381ED45F92D4B");
        }
        //成果共享环节==================================================================================================
        if (co.params.taskInfo.taskDefinitionKey === "e10ukisi6nbe") {
            hideCgxzjl = false;
        }

        if (!co.params.taskInfo.taskDefinitionKey) {//已归档
            hideCgxzjl = false;
        }
    }
    if(hideCgxzjl){
        //隐藏成果下载记录模块
        window.hideDivAndHideNavigationBar("F3ED71838307CC901717","F540F1838308A9F103E6");
    }
}


/**
 * 技术评审和业务相关的显隐和设值
 */
window.dealForm_approve = function (){
    //退回按钮的隐藏判断
    let isHideReturnBtn = true;//默认隐藏
    //技术审查、业务审核评分按钮显示隐藏判断
    //规则：如果是技术审查的处理人，只显示临时评分，其余只显示评分
    //规则：如果是非技术审查的处理人，只显示评分，其余只显示临时评分
    co.Ctrl.setHide("JSSCLSZJPF", true);//技术审查临时评分字段隐藏
    co.Ctrl.setHide("LSZLPF", true);//业务审核临时评分字段隐藏

    //如果是跳过技术审查环节的，那么技术审查模块全流程隐藏
    let passJssc = co.getValue("PASSJSSC", "PROJ_YWXT_CONFIG", "1", "1", true);
    if (!passJssc) {
        passJssc = "1";
    }
    //是否隐藏技术审查模块
    let hideJssc = false;
    if (passJssc === "1") {
        hideJssc = true;
    }
    //是否隐藏业务审核模块
    let hideYwsh = false;
    /**
     * 成果上传：e79rkisi6m67
     * 成果确认：e2yykpjszacn
     * 技术审查：e3v4l8jvdbjs
     * 成果审核：et5klrmjihq
     * 空间入库：e16vkq7eijw7
     * 成果共享：e10ukisi6nbe
     * **/
    if (co.params.taskInfo) {
        //成果上传环节==================================================================================================
        if (co.params.taskInfo.taskDefinitionKey === "e79rkisi6m67") {
            //隐藏技术审查模块
            hideJssc = true;
            //隐藏业务审核模块
            hideYwsh = true;
            if (co.params.taskInfo.assignee === co.User.userId()) {//当前办理人
                //①如果是退回的数据，根据退回方来决定显示的模块
                let thf = co.getDomainValue("THF");
                if(thf){//有退回，不能修改测量事项
                    co.Ctrl.setDisable(co.params.table + ".SSCG",true);
                }
                if (thf === "技术审查") { //⑧技术审查退回的时候显示退回的记录需要隐藏子表的所有按钮
                    hideJssc = false;
                    //显示技术审查的时候会显示问题记录，需要隐藏相关按钮
                    document.querySelector('#FE6AE18381F5B97F2027 .selfAdapting-top').style.display = 'none'
                    co.PageTab.scrollToElement(co.params.table + ".JSSCSHYJ", false);
                } else if (thf === "业务审核") {//⑨技术审查退回的时候显示退回的记录需要隐藏子表的所有按钮
                    hideJssc = false;
                    //显示技术审查的时候会显示问题记录，需要隐藏相关按钮
                    document.querySelector('#FE6AE18381F5B97F2027 .selfAdapting-top').style.display = 'none'
                    hideYwsh = false;
                    //显示业务审查的时候会显示问题记录，需要隐藏相关按钮
                    document.querySelector('#FE30318381FAEF91D51B .selfAdapting-top').style.display = 'none'
                    co.PageTab.scrollToElement(co.params.table + ".SHYJ", false);
                }
                let ywxtConfigArr = co.Sql.execSql("查询业务系统配置的回退环节", {});
                let sjlx = co.getValue("SJLX", "PROJ_LHCHYWDJB", "YWBH", co.getValue("YWBH"), true);
                if (sjlx != "测绘单位创建" && sjlx != "窗口创建" && ywxtConfigArr && ywxtConfigArr.sql1 && ywxtConfigArr.sql1.length > 0) {
                    let info = ywxtConfigArr.sql1[0]
                    let hthj = info["HTHJ"]
                    if(hthj && hthj != "0" && thf === "甲方确认"){
                        hideJssc = false;
                        //显示技术审查的时候会显示问题记录，需要隐藏相关按钮
                        document.querySelector('#FE6AE18381F5B97F2027 .selfAdapting-top').style.display = 'none'
                        hideYwsh = false;
                        //显示业务审查的时候会显示问题记录，需要隐藏相关按钮
                        document.querySelector('#FE30318381FAEF91D51B .selfAdapting-top').style.display = 'none'
                    }
                }
            } else {//非当前办理人
            }
        }
        //成果确认环节==================================================================================================
        if (co.params.taskInfo.taskDefinitionKey === "e2yykpjszacn") {
            //隐藏技术审查模块
            hideJssc = true;
            //隐藏业务审核模块
            hideYwsh = true;
        }
        //技术审查环节==================================================================================================
        if (co.params.taskInfo.taskDefinitionKey === "e3v4l8jvdbjs") {
            //隐藏业务审核模块
            hideYwsh = true;
            if (co.params.taskInfo.assignee === co.User.userId()) {//当前办理人
                //①技术审查的临时评分显示，正式评分隐藏
                co.Ctrl.setHide("JSSCLSZJPF", false);
                co.Ctrl.setHide("JSSCZJPF", true);
                //②技术审查的临时评分如果没值，填入默认值100
                if (!co.getDomainValue("JSSCLSZJPF")) {
                    co.setDomainValue("JSSCLSZJPF", "100", true);
                }
                //③质检人赋值
                co.setValueMulti({
                    "JSSCZJR": co.User.getRealName(),
                    "JSSCZJRID": co.User.userId(),
                    // "JSSCZJRQ": co.DateUtil.dateNowShort()
                    "JSSCZJRQ": co.DateUtil.dateNowLong()
                }, "", "", true);
                //④显示退回按钮
                isHideReturnBtn = false;//显示退回按钮
            } else {//非当前办理人
            }
        }

        //成果审核环节==================================================================================================
        if (co.params.taskInfo.taskDefinitionKey === "et5klrmjihq") {
            if (co.params.taskInfo.assignee === co.User.userId()) {//当前办理人
                //①业务审核的临时评分显示，正式评分隐藏
                co.Ctrl.setHide("LSZLPF", false);
                co.Ctrl.setHide("ZLPF", true);
                //②技术审查的临时评分如果没值，填入默认值100
                if (!co.getDomainValue("LSZLPF")) {
                    co.setDomainValue("LSZLPF", "100", true);
                }
                //③审核人赋值
                co.setValueMulti({
                    "SHR": co.User.getRealName(),
                    "SHRID": co.User.userId(),
                    // "SHSJ": co.DateUtil.dateNowShort()
                    "SHSJ": co.DateUtil.dateNowLong()
                }, "", "", true);
                //④显示退回按钮
                isHideReturnBtn = false;//显示退回按钮
            }
        }
        //空间入库环节==================================================================================================
        if (co.params.taskInfo.taskDefinitionKey === "e16vkq7eijw7") {
            if (co.params.taskInfo.assignee === co.User.userId()) {//当前办理人
            }
        }
    }
    //这种只设置一次显隐的方式才会不有BUG，如果重复的设置隐藏和显示，平台不会帮你自动的隐藏相关的导航栏
    if(hideJssc){//隐藏技术审查模块
        window.hideDivAndHideNavigationBar("FE6AE18381F5B97F2027", "F57C718381F65597C112");
    }

    //并联审批，显示不一样的业务审核页面===========start
    let hideBlsp = true;//隐藏并联审批
    if ($.F.getFieldValue("PROJ_CGHJB.YWSHSFBLSP") == "1" && !hideYwsh) {
        hideYwsh = true;
        hideBlsp = false;
    }
    //并联审批，显示不一样的业务审核页面===========end

    if (hideYwsh) {
        window.hideDivAndHideNavigationBar("FE30318381FAEF91D51B", "F950C18381FBDCFFFB84");
    }
    //并联审批，显示不一样的业务审核页面===========start
    if (hideBlsp) {
        window.hideDivAndHideNavigationBar("FD0FF18C67A4DABF9BCA", "F3FB118C67A4F827BA8F");
    }else{
        //这个id是盖章成果的自定义控件id
        window.sinfo_uploadSingleFileWithProgress("F1B9B18C7043961F82A0", "QZHCGWJ", "", false, false);
    }
    //并联审批，显示不一样的业务审核页面===========start
    if (isHideReturnBtn) {//退回按钮隐藏
        co.Ctrl.setHide("581d1a0a-eb68-46f3-b96c-1ad62b0dbb9c", true);
    }
}

/**
 * 入库相关的操作
 */
window.dealForm_import = function (){
    //是否隐藏【数据入库-GIS数据模块】模块 默认隐藏
    let hideGisImport = true;
    //是否隐藏【数据入库-红线数据模块】模块 默认隐藏
    let hideHxImport = true;
    /**
     * 成果上传：e79rkisi6m67
     * 成果确认：e2yykpjszacn
     * 技术审查：e3v4l8jvdbjs
     * 成果审核：et5klrmjihq
     * 空间入库：e16vkq7eijw7
     * 成果共享：e10ukisi6nbe
     * **/
    if (co.params.taskInfo) {
        //成果上传环节==================================================================================================
        if (co.params.taskInfo.taskDefinitionKey === "e79rkisi6m67") {
            if (co.params.taskInfo.assignee === co.User.userId()) {//当前办理人
            } else {//非当前办理人
            }
        }
        //空间入库环节==================================================================================================
        if (co.params.taskInfo.taskDefinitionKey === "e16vkq7eijw7") {
            if (co.getDomainValue("NEEDGISRK") === "1") {
                //显示数据入库-GIS数据模块
                hideGisImport = false;
            }
            if( co.getDomainValue("NEEDHXRK") === "1"){
                //显示数据入库-红线数据模块
                hideHxImport = false;
            }
        }
        //成果共享环节==================================================================================================
        if (co.params.taskInfo.taskDefinitionKey === "e10ukisi6nbe") {
            //如果有提取到入库文件，则显示入库模块
            if (co.getDomainValue("NEEDGISRK") === "1") {
                //显示数据入库-GIS数据模块
                hideGisImport = false;
            }
            if( co.getDomainValue("NEEDHXRK") === "1"){
                //显示数据入库-红线数据模块
                hideHxImport = false;
            }
        }
        if (!co.params.taskInfo.taskDefinitionKey) {//已归档
            //如果有提取到入库文件，则显示入库模块
            if (co.getDomainValue("NEEDGISRK") === "1") {
                //显示数据入库-GIS数据模块
                hideGisImport = false;
            }
            if( co.getDomainValue("NEEDHXRK") === "1") {
                //显示数据入库-红线数据模块
                hideHxImport = false;
            }
        }
    }
    //这种只设置一次显隐的方式才会不有BUG，如果重复的设置隐藏和显示，平台不会帮你自动的隐藏相关的导航栏
    if (hideGisImport) {//隐藏数据入库-GIS数据模块
        window.hideDivAndHideNavigationBar(co.subFormMap.IMPORT_GIS.divControlId, co.subFormMap.IMPORT_GIS.titleControlId);
    }
    if (hideHxImport) {//隐藏数据入库-红线数据模块
        window.hideDivAndHideNavigationBar(co.subFormMap.IMPORT_HX.divControlId, co.subFormMap.IMPORT_HX.titleControlId);
    }
}
/**
 * 处理流程按钮灰色的问题
 */
window.dealWithFlowBtnCantEdit = function () {
    let removeDisabled = false;
    //办理人
    if (co.User.userId() === co.params.taskInfo.assignee && co.params.taskInfo.assignee !== null) {
        removeDisabled = true;
    }
    //未接办的可接办人
    if ($.inArray(co.User.userId(), co.params.taskInfo.candidates) > -1 && co.params.taskInfo.assignee === null) {
        removeDisabled = true;
    }
    if (removeDisabled) {
        $(".generate-btn-list .sg-btn-disabled").removeAttr("disabled");
    }
    //流转情况特殊处理
    if ($("button[name='getdraw']")) {
        $("button[name='getdraw']").removeAttr("disabled");
    }
}
window.changeBtnStyle = function () {
    //将接办按钮改为蓝色底色
    $("[name='claim']")[0].style.color = 'rgb(255, 255, 255)';
    $("[name='claim']")[0].style.background = 'rgb(59, 134, 224)';
    co.Dom.domIsLoaded(() => {
        let bPass = false;
        if ($("[name='claim']")[0].style.background !== 'rgb(59, 134, 224)') {
            bPass = true;
        }
        return bPass;
    }, null, () => {
        $("[name='claim']")[0].style.background = 'rgb(59, 134, 224)';
    })
    $("[name='claim']")[0].style["border-color"] = 'rgb(59, 134, 224)';
}

/**
 *
 * @param type 类型：测绘单位、审核部门
 * @param submitAfterSuccess  是否成功后提交
 */
window.signZipFile = function (type, submitAfterSuccess) {
    function queryQuality(
        taskId,
        successCallback,
        errorCallback
    ) {
        let axiosConfig = {
            url: "/sinfoweb/cghj/public/watermarkTaskProgress?taskId=" + taskId,
            contentType: 'application/json; charset=utf-8',
            type: "GET",
            async: false
        };
        // window.Vue.prototype
        // window.Sgui
        window.parent.$sinfoUtil.modelProgress(
            window.Sgui,
            axiosConfig,
            successCallback,
            errorCallback,
            2000,
            "签章进度"
        );
    }

    function successCallback(data) {
        setTimeout(() => {
            co.Toolbox.showMask();
            setTimeout(() => {
                // 如果进度100了，则质检完成
                if (data.pos.toString().includes("100")) {
                    let zipDownUrl = data.data;
                    let oPaseParam = {
                        "zipDownUrl": zipDownUrl,
                        "dir": "/data/watermark/", // 文件暂存路径，与Nginx配置alias 保持一致
                        "fileName": zipFileName.indexOf("(已盖章)") >= 0 ? zipFileName : (zipFileName.substr(0, zipFileName.indexOf(".")) + "(已盖章).zip"),// 压缩包名称
                        "rid": co.getValue('RID'),
                        "jid": co.getValue('JID'),
                        "taskId": co.params.taskId,
                        "clsx": co.getValue('SSCG')
                    };
                    $.ajax({
                        //url: "http://192.168.92.1:9090/sinfoweb-hdy/cghj/public/parseWatermarkFile",
                        url: "/sinfoweb/cghj/public/parseWatermarkFile",
                        contentType: 'application/json; charset=utf-8',
                        type: "POST",
                        async: false,
                        data: JSON.stringify(oPaseParam),
                        dataType: "json",
                        success: function (aData) {
                            co.Toolbox.hideMask();
                            // window.Vue.prototype.$modal.remove(()=>{
                            co.setValue('QZHCGWJ', aData[0]);//盖章压缩包
                            co.setValue('CGUNZIP', "");//更新报告文件
                            co.setValue('CGUNZIP', aData[1]);//更新解压后的盖章文件
                            if (aData[2]) {
                                co.setValue('CGBGSC', aData[2]);//更新报告文件
                            }
                            window.sinfo_uploadSingleFileWithProgress("F4C0B1838C85FDD641E8", "CGBGSC", ".pdf");
                            switch (type){//不同的签章提交后执行的不同
                                case "测绘单位"://签测绘单位的章
                                    co.setValue("CHDWSFQZ","1","","",true);
                                    break;
                                case "审核部门"://根据配置决定签什么章
                                    co.setValue("SHBMSFQZ","1","","",true);
                                    break;
                            }
                            //盖章成果
                            window.sinfo_uploadSingleFileWithProgress("F55FA1838C898A085A82", "QZHCGWJ", "");
                            window.Vue.prototype.$modal.remove();// 移除遮罩
                            window.Vue.prototype.$msg.info('签章完毕');
                            if (submitAfterSuccess) {
                                setTimeout(() => {
                                    co.Dialog.confirm("签章完毕，是否提交？", "提交确认", () => {
                                        switch (type){//不同的签章提交后执行的不同
                                            case "测绘单位":
                                                //直接提交
                                                co.Flow.readySubmitComplete();
                                                break;
                                            case "审核部门":
                                                //做审核部门提交后事件，项目没有也可以直接提交
                                                window.beforeShSubmitLastDo();//提交
                                                break;
                                        }
                                    })
                                }, 500);
                            }
                            // });
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            co.Toolbox.hideMask();
                            window.Vue.prototype.$msg.warning('签章出错');
                            console.log("失败" + JSON.stringify(data));
                        }
                    });
                } else {
                    co.Message.error_middle('盖章未完成就返回成功了！')
                }
            }, 0);
        }, 100);
    }

    function errorCallback(error) {
        co.Message.error_middle("签章出错")
    }
    let userId = "";
    let zipFileStr = "";
    switch (type){//不同的签章提交后执行的不同
        case "测绘单位"://签测绘单位的章
            userId = co.getDomainValue("CHDWUSERID");
            zipFileStr = co.getDomainValue("WJJSC");
            break;
        case "审核部门"://根据配置决定签什么章
            //签过章的要拿签章后的文件
            zipFileStr = co.getDomainValue("QZHCGWJ") ? co.getDomainValue("QZHCGWJ") : co.getDomainValue("WJJSC");
            break;
    }
    let zipFileStrSplit = zipFileStr.split("|");
    let zipFileName = zipFileStrSplit[0];
    co.Http.request({
        // url: "/sinfoweb/dzqz/signZipFile",
        url: "/sinfoweb/cghj/signZipFile",
        data: {
            userId: userId,
            zipFileStr: zipFileStr,
            type: type,
            clsx: co.getDomainValue("SSCG"),
            xzq: co.getDomainValue("XZQCODE"),
            // bgFileSr: co.getDomainValue("CGBGSC")
            rid: co.params.rid
        },
        success: (ret) => {
            ret = JSON.parse(ret);
            if (ret.code != 0) {
                co.Message.info_middle(ret.desc);
            } else {
                let taskId = ret.data;
                queryQuality(
                    taskId,
                    successCallback,
                    errorCallback
                );
            }
        },
        error: (ret) => {
            co.Message.error_middle("签章出错")
        }
    })
}


/**
 * 修改涉密检测状态
 */
window.smztShow = function (message) {
    let ele = document.getElementById('F16CF1970A6809B2EC7E')
    let type = co.getValue("SMJCSFTG");
    if (type === "1") {
        co.Ctrl.setHide("F64251970FB18ED7D04A", true);
        ele.innerHTML = '<div style="font-size:25px;color:#00DB00"> <strong>涉密检测通过 </strong></div>'
    } else if (type === "0") {
        co.Ctrl.setHide("F64251970FB18ED7D04A", false);
        ele.innerHTML = '<div style="font-size:25px;color:#F00"> <strong>涉密检测不通过 </strong></div>'
    } else {
        co.Ctrl.setHide("F64251970FB18ED7D04A", true);
        ele.innerHTML = '<div style="font-size:25px;color:#000000"> <strong>未检测 </strong></div>'
    }
}

window.smztShow();

/**
 * 涉密检测
 **/
window.startSmCheck = function(){
    var marcoPath = co.getValue("WJJSC").split("|")[1]
    $.ajax({
        url: "/infosvrinsidedocking/orc/public/ocrByMarcoPath?marcoPath="+encodeURI(marcoPath),
        type: "GET",
        async: false,
        success: function (result) {
            console.log(result.TaskId)
            let taskId = result.TaskId;
            co.Toolbox.showMask();
            setTimeout(() => {
                co.Toolbox.hideMask();
                setTimeout(() => {
                    queryQuality(taskId);
                }, 0)
            }, 1000)
        },
        error: function (dataErr) {

        }
    });

    function queryQuality(taskId) {
        co.Progress.baseProgressTrue("进度", "进度", (ret) => {
            let state = "";
            let text = "";
            let percent = 0;

            $.ajax({
                url: "/infosvrinsidedocking/task/public/query?taskId=" + taskId,
                type: "POST",
                async: false,
                success: function (ret) {
                    if (ret.code != 0) {
                        state = "fail";
                        text = ret.message;
                    } else if (ret.data.pos != 100) {
                        text = ret.data.message;
                        percent = ret.data.pos;
                        state = "ongoing";
                    } else {
                        text = ret.data.data;
                        percent = 100;
                        state = "done";
                    }
                },
                error: function (ret) {
                    state = "fail";
                    text = "操作失败，请联系管理员！";
                }
            });
            var progressInfo = {
                text: text, //进度条展示文本
                percent: percent,   //进度进度百分比
                state: state //状态
            }
            return progressInfo;
        }, "", 1000, (d) => {
            if (d.state == "done") {
                var oData = JSON.parse(d.text);
                if(oData.length>0){
                    co.setDomainValue("SMJCSFTG", "0", true);
                    co.Message.error_middle("涉密检测不通过")
                    window.addSmFailRecord(d.text)
                    co.Subform.refresh("F64251970FB18ED7D04A")
                }else{
                    co.setDomainValue("SMJCSFTG", "1", true);
                    co.Message.success_middle("涉密检测通过")
                }
            } else {
                co.setValue("SMJCSFTG", "0");
                co.Message.error_middle("涉密检测不通过")
                window.addSmFailRecord("")
                co.Subform.refresh("F64251970FB18ED7D04A")
            }
            window.smztShow()
        })
    }
}
window.addSmFailRecord = function (resultStr) {
    var currTime = co.DateUtil.dateNowLong()
    if(resultStr && resultStr != ''){
        let oData = JSON.parse(resultStr);
        for(let i = 0; i < oData.length; i++){
            var info = oData[i]
            var data = {
                "RID": $.uuid(),
                "SYS_PARENTRID": co.getValue("RID") + "::F64251970FB18ED7D04A",
                "BTGNR": info.contain,
                "FILE": info.fileName + "|" + info.filePath,
                "CREATETIME": currTime
            }
            co.Sql.execSql("新增涉密检测失败记录", data);
        }
    }else{
        var data = {
            "RID": $.uuid(),
            "SYS_PARENTRID": co.getValue("RID") + "::F64251970FB18ED7D04A",
            "BTGNR": "操作失败",
            "FILE": co.getValue("WJJSC"),
            "CREATETIME": currTime
        }
        co.Sql.execSql("新增涉密检测失败记录", data);
    }
}
/**
 * 导出审计问题记录Excel
 * @param type 类型：ywsh-业务审核，jssc-技术审核（可选，不传则从co.params.ty获取）
 * @author dongYang.huang
 * @date 2026/3/16
 */
window.exportExcel = function (typeParam) {
    try {
        // 开启遮罩层
        co.Toolbox.showMask();

        // 获取类型参数（必填）
        if (!typeParam) {
            co.Message.error_middle("类型参数不能为空，可选值：ywsh(业务审核)、jssc(技术审核)");
            co.Toolbox.hideMask();
            return;
        }
        if (typeParam !== 'ywsh' && typeParam !== 'jssc') {
            co.Message.error_middle("类型参数无效，可选值：ywsh(业务审核)、jssc(技术审核)");
            co.Toolbox.hideMask();
            return;
        }

        // 获取RID参数
        var rid = co.params.rid;
        if (!rid) {
            co.Message.error_middle("父级RID不能为空");
            co.Toolbox.hideMask();
            return;
        }

        // 构建导出URL
        var url = "/sinfoweb/auditProblemRecord/exportExcel?type=" + encodeURIComponent(typeParam) + "&rid=" + encodeURIComponent(rid);

        // 发送AJAX请求检查数据
        var xhr = new XMLHttpRequest();
        xhr.open('HEAD', url, true);

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                co.Toolbox.hideMask();

                if (xhr.status === 200) {
                    // 创建隐藏的iframe进行下载
                    var iframe = document.createElement('iframe');
                    iframe.style.display = 'none';
                    iframe.src = url;
                    document.body.appendChild(iframe);

                    // 延迟移除iframe
                    setTimeout(function() {
                        document.body.removeChild(iframe);
                    }, 2000);

                    co.Message.success_middle("导出成功，请查看下载文件");
                } else if (xhr.status === 400) {
                    co.Message.error_middle("参数错误，请检查类型和父级RID");
                } else {
                    co.Message.error_middle("导出失败，状态码：" + xhr.status);
                }
            }
        };

        xhr.onerror = function() {
            co.Toolbox.hideMask();
            co.Message.error_middle("网络请求失败");
        };

        xhr.send();

    } catch (error) {
        co.Toolbox.hideMask();
        co.Message.error_middle("导出失败：" + error.message);
        console.error("导出失败：", error);
    }
}

/**
 * 导入审计问题记录Excel
 * @param type 类型：ywsh-业务审核，jssc-技术审核（可选，不传则从co.params.ty获取）
 * @author dongYang.huang
 * @date 2026/3/16
 */
window.importExcel = function (typeParam) {
    try {
        // 获取类型参数（必填）
        if (!typeParam) {
            co.Message.error_middle("类型参数不能为空，可选值：ywsh(业务审核)、jssc(技术审核)");
            return;
        }
        if (typeParam !== 'ywsh' && typeParam !== 'jssc') {
            co.Message.error_middle("类型参数无效，可选值：ywsh(业务审核)、jssc(技术审核)");
            return;
        }
        // 获取RID参数
        var rid = co.params.rid;
        if (!rid) {
            co.Message.error_middle("父级RID不能为空");
            return;
        }

        // 创建文件输入元素
        var fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.xlsx,.xls';
        fileInput.style.display = 'none';

        fileInput.onchange = function(event) {
            var file = event.target.files[0];
            if (!file) {
                return;
            }

            // 验证文件类型
            var fileName = file.name.toLowerCase();
            if (!fileName.endsWith('.xlsx') && !fileName.endsWith('.xls')) {
                co.Message.error_middle("请选择Excel文件（.xlsx或.xls格式）");
                return;
            }

            // 验证文件大小（限制为10MB）
            if (file.size > 10 * 1024 * 1024) {
                co.Message.error_middle("文件大小不能超过10MB");
                return;
            }

            // 开启遮罩层
            co.Toolbox.showMask();

            // 创建FormData
            var formData = new FormData();
            formData.append('type', typeParam);
            formData.append('rid', rid);
            formData.append('file', file);

            // 发送AJAX请求
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/sinfoweb/auditProblemRecord/importExcel', true);

            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    co.Toolbox.hideMask();

                    if (xhr.status === 200) {
                        try {
                            var response = JSON.parse(xhr.responseText);
                            if (response.code === 0) {
                                co.Message.success_middle(response.desc || "导入成功");
                                // 可以在这里添加刷新页面或重新加载数据的逻辑
                                if (typeParam == 'ywsh') {
                                    co.Subform.refresh("F8575183EF01D5721AF8");
                                    co.setDomainValue("ZLPF", co.getDomainValue("ZLPF", true));
                                    co.setDomainValue("LSZLPF", co.getDomainValue("LSZLPF", true));
                                }else if (typeParam == 'jssc'){
                                    co.Subform.refresh("FFA1F183D5B0DBF31AD2");
                                    co.setDomainValue("JSSCZJPF", co.getDomainValue("JSSCZJPF", true));
                                    co.setDomainValue("JSSCLSZJPF", co.getDomainValue("JSSCLSZJPF", true));
                                }
                            } else {
                                co.Message.error_middle(response.desc || "导入失败");
                            }
                        } catch (e) {
                            co.Message.error_middle("响应数据解析失败");
                        }
                    } else {
                        co.Message.error_middle("请求失败，状态码：" + xhr.status);
                    }
                }
            };

            xhr.onerror = function() {
                co.Toolbox.hideMask();
                co.Message.error_middle("网络请求失败");
            };

            xhr.send(formData);
        };

        // 触发文件选择
        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);

    } catch (error) {
        co.Toolbox.hideMask();
        co.Message.error_middle("导入失败：" + error.message);
        console.error("导入失败：", error);
    }
}

/**
 * 下载审计问题记录导入模板
 * @param type 类型：ywsh-业务审核，jssc-技术审核（可选，不传则从co.params.ty获取）
 * @author dongYang.huang
 * @date 2026/3/16
 */
window.downloadTemplate = function (typeParam) {
    try {
        // 开启遮罩层
        co.Toolbox.showMask();

        // 获取类型参数（必填），可从参数传入或co.params.ty获取
        if (!typeParam) {
            co.Message.error_middle("类型参数不能为空，可选值：ywsh(业务审核)、jssc(技术审核)");
            co.Toolbox.hideMask();
            return;
        }
        if (typeParam !== 'ywsh' && typeParam !== 'jssc') {
            co.Message.error_middle("类型参数无效，可选值：ywsh(业务审核)、jssc(技术审核)");
            co.Toolbox.hideMask();
            return;
        }

        // 构建下载URL
        var url = "/sinfoweb/auditProblemRecord/downloadTemplate?type=" + encodeURIComponent(typeParam);

        // 创建隐藏的iframe进行下载
        var iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = url;
        document.body.appendChild(iframe);

        // 延迟移除iframe
        setTimeout(function() {
            document.body.removeChild(iframe);
            co.Toolbox.hideMask();
            co.Message.success_middle("模板下载成功");
        }, 2000);

    } catch (error) {
        co.Toolbox.hideMask();
        co.Message.error_middle("下载模板失败：" + error.message);
        console.error("下载模板失败：", error);
    }
}
/**
 * 加载前需要执行的方法
 */
window.doBeforeLoading = function () {
    /**
     * 抽查的相关判断
     */
    window.spotCheckJudgment();

    //初始样式修改
    window.initialStyleModification();

    //记录已读用户ID
    recordReadedUserIds();

    //加载成果下载记录
    // window.showDownLoadRecords();

    //为可能没值的开展情况RID赋值
    window.getKzqkRidForNull();

    //成果上传环节相关显隐和设值
    window.dealForm_uploadfileStep();

    //成果确认以及成果下载记录相关显隐和设值
    window.dealForm_jsdwConfirm();

    //技术审查和业务审核相关显隐和设值
    window.dealForm_approve();

    //入库相关的模块显隐
    window.dealForm_import();

    //处理流程按钮灰色的问题
    window.dealWithFlowBtnCantEdit();
}

window.doBeforeLoading();

//不知道哪个项目的需求
// //非管理员帐户隐藏历史成果汇交表的链接，有需要可放出。
// function hideHistoryRecordLink(){
//     let eleKey = 'FC401183010CAB990C19';
//     let ele = document.getElementById(eleKey)
//     if(ele){
//         if(co.User.userId()!="00000001-0000-0000-0010-000000000001"){
//             co.Ctrl.setHide(eleKey,true);
//         }
//     }
// }
// hideHistoryRecordLink();