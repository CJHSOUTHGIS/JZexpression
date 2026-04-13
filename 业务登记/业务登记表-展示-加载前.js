if (!window.co) {
    let subFormMap = {
        "CLSX": {
            title: "测量事项子表",
            formId: "2ffe680e-df25-4c79-9320-cbcfb1561c6c",
            formUrl: "/formdesigner-web/generateForm.html?formId=2ffe680e-df25-4c79-9320-cbcfb1561c6c&type=5",
            table: "FA2B71756262ADF0EEA9",
            tableName: "PROJ_LHCHYWDJB_CLSX"
        },
        "SJCL": {
            title: "收件材料子表",
            formId: "9b116164-9bbc-47d8-96dc-85a20737849d",
            formUrl: "/formdesigner-web/generateForm.html?formId=9b116164-9bbc-47d8-96dc-85a20737849d&type=5",
            table: "FB8B1176ADE6F3A9153D",
            tableName: "PROJ_YWDJB_SQRTGCL"
        },
        "CGHJ": {
            title: "测量开展情况",
            formId: "0e81bc28-da77-44c4-9f60-af4973b1cda6",
            formUrl: "/formdesigner-web/generateForm.html?formId=0e81bc28-da77-44c4-9f60-af4973b1cda6&type=5",
            table: "FE7BF176ADED8EE4F598",
            tableName: "PROJ_YWDJ_CLKZQK"
        },
        "MYDPJ": {
            divControlId: "F57651850590A593CF4C", //项目满意度评价的自定义控件ID
            tableId: "FFDD1185137075098B72" //项目满意度评价模块的表单ID
        }
    }
    //#import CommonObject
    let co = new CommonObject("PROJ_LHCHYWDJB", subFormMap);
    window.co = co;
}
//#import FormStyleDetailUtil
window.styleDeal = new FormStyleDetailUtil();

/**
 */
function getClsxDic() {
    window.clsxDic = {};
    let clsxArr = co.Sql.execSql("所有测量事项下拉", null);
    if (clsxArr && clsxArr.sql1 && clsxArr.sql1.length > 0) {
        for (let i = clsxArr.sql1.length - 1; i >= 0; i--) {
            let info = clsxArr.sql1[i];
            let clsx = info["id"];
            let clsxCn = info["label"];
            window.clsxDic[clsx] = clsxCn;
        }
    }
}

getClsxDic();

window.canReturnJsdw = true;
/**
 * 获取项目的满意度评价
 * @returns {string}
 */
window.getXmMydpj = function () {
    let mydpjArr = co.Sql.execSql("查询项目的满意度评价", {
        "ywbh": co.getDomainValue("YWBH")
    });
    if (mydpjArr && mydpjArr.sql1 && mydpjArr.sql1.length > 0) {
        return Number(mydpjArr.sql1[0]["PJ"]);
    }
    return "";
}
/**
 * 展示总体评价的满意度评价详情
 */
window.showXmMydpjDetail = function () {
    let isZtpj = false;
    let sfztpj = co.getValue("SFZTPJ", "PROJ_JDCX", "1", "1", true);
    if (sfztpj === "1") {
        isZtpj = true;
    }
    let hideMydpjDiv = true;
    if (isZtpj) {
        let ztpjArr = co.Sql.execSql("监督管理-信用监管-满意度评价列表（总体评价）-评价详情", {
            "YWBH": co.getDomainValue("YWBH")
        });
        if (ztpjArr && ztpjArr.sql1 && ztpjArr.sql1.length > 0) {
            let hasPj = false;
            for (let i = 0; i < ztpjArr.sql1.length; i++) {
                if (ztpjArr.sql1[i]["key"] !== "FWPY") { //不止有服务评语 则是有评价
                    hasPj = true;
                }
            }
            if (hasPj) {
                hideMydpjDiv = false;
                window.styleDeal.sInfo_ShowRateDetail({
                    // modalParams: {
                    //     modalType: 'alert',
                    //     modalTitle: '评价详情',
                    //     confirmCallback: (a) => { console.log(a) },
                    //     cancelCallback: (a) => { console.log(a) },
                    //     width: '40%',
                    //     okText: '关闭'
                    // },
                    vue: Sgui,
                    selector: document.getElementById(co.subFormMap.MYDPJ.divControlId),
                    controlId: co.subFormMap.MYDPJ.divControlId,
                    rateDetail: ztpjArr.sql1
                })
            }
        }
    }
    if (hideMydpjDiv) {
        co.Ctrl.setHide(co.subFormMap.MYDPJ.tableId, true);
    }
}
/**
 * 检查是否可以退回建设单位
 * @returns {boolean}
 */
window.checkCanReturnJsdw = function () {
    let bReturn = true;
    let htbaFlowArr = co.Sql.execSql("查看当前流程合同流程状态", {
        "rid": co.params.rid
    });
    if (htbaFlowArr && htbaFlowArr.sql1 && htbaFlowArr.sql1.length > 0) {
        let htbaFlow = htbaFlowArr.sql1[0];
        let htbaCurFlowKey = htbaFlow["TASK_DEF_KEY_"];
        if (!htbaCurFlowKey || htbaCurFlowKey == 'e4y0kpderjtp') {
            bReturn = false;
        }
    }
    window.canReturnJsdw = bReturn;
}
window.checkCanReturnJsdw();
/**
 * 退回建设单位
 */
window.returnJsdw = function () {
    window.checkCanReturnJsdw();
    if (!window.canReturnJsdw) {
        co.Message.error_middle("合同备案已经提交，无法退回建设单位！");
        return;
    }
    co.Dialog.confirm("退回建设单位后现有成果汇交数据将会被清空，是否确认退回建设单位", "提示", () => {
        window.Vue.prototype.$modal.alert({
            title: '提示',
            content: '正在退回',
            similar: true,
            closable: false,
            footerHide: true, // true隐藏确认，取消
            onOk: () => {
                // this.$modal.remove()
                // this.Vue.prototype.$modal.remove()
            },
        });
        $.ajax({
            //url: "http://172.16.50.154:8802/sinfoweb-lxq-lz/onlineServiceProject/public/returnMainProcess",
            url: "/sinfoweb/onlineServiceProject/public/returnMainProcess",
            contentType: 'application/json; charset=utf-8',
            type: 'post',
            async: true,
            data: JSON.stringify({
                "rid": co.getValue('RID'),
                "userId": co.User.userId()
            }),
            dataType: "text",
            success: function (data) {
                window.Vue.prototype.$msg.success('退回成功');
                window.Vue.prototype.$modal.remove(); // 移除遮罩
                let currTabModule = window.top.currModule(); // 当前标签页标识
                window.top.closeTab(currTabModule); //以标签页标识 关闭对应标签
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                window.Vue.prototype.$modal.remove(); // 移除遮罩
                window.Vue.prototype.$msg.error('退回失败!')
            }
        });
    }, () => {
        Vue.prototype.$modal.remove();
    })
}


/**
 * 头部样式替换
 */
window.replaceHead = function () {
    //头部d
    let oCurTaskInfo = co.params.taskInfo;
    let taskDefinitionKey = oCurTaskInfo.taskDefinitionKey;
    let assignee = oCurTaskInfo.assignee;
    let endTime = oCurTaskInfo.endTime;
    let stateLabel = "";
    let stateColor = "";
    let btnList = [];
    let chdwUserIds = co.getValue("CHDWUSERIDS");
    if (taskDefinitionKey == "exqkj7ypwdt" && !assignee) { //待接办
        stateLabel = "待接办";
        stateColor = "#e8a72a";
        if (chdwUserIds.indexOf(co.User.userId()) >= 0) {
            btnList.push({
                label: "接单",
                onClick: () => {
                    $('button[name=claim]')[0].click();
                },
            })
            //退回建设单位按钮改为可以在接单前退回
            // if (window.canReturnJsdw) {
            btnList.push({
                label: "退回委托",
                bgStyle: "dark",
                onClick: () => {
                    window.returnJsdw();
                },
            })
            // }
        }
    } else if (taskDefinitionKey == "exqkj7ypwdt" && assignee && !endTime) {
        stateLabel = "进行中";
        stateColor = "#6fa10f";
        if (chdwUserIds.indexOf(co.User.userId()) >= 0) {
            //退回建设单位按钮改为可以在接单前退回
            // if (window.canReturnJsdw) {
            //     btnList.push({
            //         label: "退回委托",
            //         onClick: () => {
            //             window.returnJsdw();
            //         },
            //     })
            // }
            // btnList.push({
            //     label: "补充材料",
            //     bgStyle: "dark",
            //     onClick: () => {
            //         window.TZJSDWBCL();
            //     },
            // })
            // btnList.push({
            //     label: "办事指南",
            //     bgStyle: "dark",
            //     onClick: () => {
            //         $('button[name=guidance]')[0].click();
            //     },
            // })
            //当没配置自动归档的时候，显示自动归档按钮
            let autoCommitZlc = co.getValue("AUTOCOMMITZLC", "PROJ_YWXT_CONFIG", "1", "1", true);
            if (!autoCommitZlc || autoCommitZlc !== "1") {
                btnList.push({
                    label: "归档",
                    // bgStyle: "dark",
                    onClick: () => {
                        window.autoCommit();
                    },
                })
            }
            //当没配置自动归档的时候，显示自动归档按钮
        }
    } else if (!taskDefinitionKey || (taskDefinitionKey == "exqkj7ypwdt" && assignee && endTime)) {
        stateLabel = "已完成";
        stateColor = "#4572a1";
    }
    // 颜色参考 绿色_#6fa10f 黄色_#e9a82a 红色_#ff4d4f 灰色_#bec8c8
    //加多了个参数，头部添加上满意度评价星级的显示，调用window.getXmMydpj获取当前项目可能存在的项目评价数据 2022-12-14 09:26:56 黄东洋
    window.styleDeal.sInfo_projectNavBox(document.getElementById("F2DBB17FE454210BA7F4"), stateLabel, stateColor, co.getValue("GCMC"), btnList, window.getXmMydpj());
}
/**
 * 删除项目
 */
window.deleteProject = function () {
    co.Dialog.confirm("此操作无法回退，确认删除项目？", "确认", () => {
        let sjlx = co.getDomainValue("SJLX");
        let confirmMsg = "请再次确认，此操作无法回退，确认删除项目？";
        if (sjlx != "测绘单位创建") {
            confirmMsg = "非自主委托项目，删除会回退给建设单位，请再次确认，此操作无法回退，确认删除项目？";
        }
        co.Dialog.confirm(confirmMsg, "确认", () => {
            co.Toolbox.showMask();
            co.Http.request({
                url: "/sinfoweb/YCProject/returnMainProcess",
                data: {
                    "rid": co.params.rid
                },
                success: function (ret) {
                    co.Toolbox.hideMask();
                    ret = JSON.parse(ret);
                    if(ret.code==0){
                        co.Message.success_middle("删除成功");
                        co.PageTab.closeCurrTab();
                    }else{
                        co.Message.error_middle("操作失败，请联系管理员");
                    }
                },
                error: function (ret) {
                    co.Toolbox.hideMask();
                    co.Message.error_middle("操作失败，请联系管理员");
                }
            })
        })
    })
}

/**
 * 自动归档
 */
window.autoCommit = function () {
    $('button[name=submit]')[0].click();
}

/**
 * 获取sInfoWeb下载地址
 * @param fileName
 * @param macroPath
 */
window.getSInfoWebDownLoadUrl = function (fileName, macroPath, sInfoUrl) {
    //改为使用co定义的方法，减少工作量，不直接改使用此方法的地方，后续的所有使用都可以直接使用co的方法
    return co.File.getSInfoWebDownLoadUrl({
        "fileName": fileName,
        "macroPath": macroPath,
        "sInfoUrl": sInfoUrl
    });
}

/**
 * 替换文件下载控件展示样式
 * @param str
 */
window.replaceFileCtrl = function (str, ctrlId, needPadding) {
    if (str) {
        let aStr = str.split("|");
        let fileName = aStr[0];
        let macroPath = aStr[1];
        window.styleDeal.sInfo_renderDownloadBtn(
            ctrlId,
            fileName,
            window.getSInfoWebDownLoadUrl(fileName, macroPath),
            fileName,
            needPadding
        );
    }
}

/**
 * 显示隐藏资料申请列表
 */
window.showHideSqList = function () {
    let dataArr = co.Sql.execSql("查询当前案件的资料申请数据", {
        "ywbh": co.getValue("ywbh")
    });
    if (dataArr && dataArr.sql1 && dataArr.sql1.length > 0) {
        co.Ctrl.setHide("F15C41802BFC67DB03DC", false);
    } else {
        co.Ctrl.setHide("F15C41802BFC67DB03DC", true);
    }
}

/**
 * 给标签页添加点击事件
 * @param selectorId
 * @param onClick
 */
window.setTabClick = function (selectorId, onClick) {
    $('#' + selectorId + ' .sg-tab-tab').on('click', e => {
        onClick(e.target.textContent, e)
    })
}
/**
 * 标签页点击事件
 */
setTabClick('FACA9180072A8F11FB8F', (tabTxt, event) => {
    console.log(tabTxt, event);
    co.setValue("CURCLICKDL", tabTxt.trim()).then(() => {
        co.Subform.refresh(co.subFormMap.CGHJ.table);
        setTimeout(() => {
            let maxHeight = document.getElementsByClassName('grid-widget-col sg-col-9')[0].scrollHeight - 70;
            document.getElementById("FA37E18021AD8B31B3CD").style.maxHeight =
                maxHeight.toString() + 'px';
            co.Dom.domIsLoaded(() => {
                let bPass = false;
                if ((document.getElementsByClassName('grid-widget-col sg-col-9')[0].scrollHeight - 70) !== maxHeight) {
                    bPass = true;
                }
                return bPass;
            }, null, () => {
                document.getElementById("FA37E18021AD8B31B3CD").style.maxHeight =
                    (document.getElementsByClassName('grid-widget-col sg-col-9')[0].scrollHeight - 70).toString() + 'px';
            }, null)
        }, 500)
    });
})
/**
 * 隐藏没有数据的开展情况
 */
window.hideNoDataKzqkTab = function (bClick) {
    let allDlArr = co.Sql.execSql("查询所有大类", null);
    let clickIndex = 0;
    let hasFirstIndex = false;
    for (let i = 0; i < allDlArr.sql1.length; i++) {
        let kzqkDataArr = co.Sql.execSql("获取项目的开展情况数据", {
            "dl": allDlArr.sql1[i]["SHOWVALUE"],
            "jid": co.params.jid
        })
        if (kzqkDataArr && kzqkDataArr.sql1 && kzqkDataArr.sql1.length > 0) { //有数据，显示标签
            window.styleDeal.hideTabControlId("FACA9180072A8F11FB8F", i, false);
            if (!hasFirstIndex) {
                hasFirstIndex = true;
                clickIndex = i;
            }
        } else { //没有数据，隐藏标签
            window.styleDeal.hideTabControlId("FACA9180072A8F11FB8F", i, true);
        }
    }
    if (bClick)
        $(document.getElementById("FACA9180072A8F11FB8F").querySelectorAll(".sg-tab-tab.is-top-bottom")[clickIndex]).click()
}
/**
 * 展示范围线模板的下载功能
 */
window.showImportFwxFileTempleteDownLoad = function () {
    window.styleDeal.sinfo_singleLineText({
        vue: Sgui,
        selector: document.getElementById('F5F521852D529B1DE754'), // 平台表单的预留格子的dom
        customParams: {
            controlId: 'F5F521852D529B1DE754',
            firstLabel: '点击下载：',
            firstLabelStyle: {
                "font-size": "14px",
                "font-family": "Microsoft YaHei",
                "font-weight": "bold",
                "color": "#404040"
            }, // 文案特殊样式
            secondLabel: '项目范围线下载模板',
            secondLabelStyle: {
                "font-size": "14px",
                "font-family": "Microsoft YaHei",
                "font-weight": "400",
                "color": "#999999"
            }, // 文案特殊样式
            secondLabelType: 'a', // 特殊文本信息类型,可缺省，默认普通文本  a代表有点击事件回调
            clickCallback: () => {
                let sData = co.getValue("WJSC", "PROJ_FILE_CONFIG", "WJM", "范围线模板", true);
                if (sData) {
                    let aTemp = sData.split("|");
                    let macroPath = aTemp[1];
                    let fileName = aTemp[0];
                    window.open(window.getSInfoWebDownLoadUrl(fileName, macroPath));
                } else {
                    window.Vue.prototype.$msg.info('未配置模板')
                }
            }
        }
    });
}
/**
 *根据不同的合同上传状态显示隐藏不同的按钮
 */
window.dealWithHtscBtn = function () {
    if (co.getValue("HTSCZT") == "0") {
        co.Ctrl.setHide("FBD07179DCACE08EAE35", true); //查看详情
    } else {
        co.Ctrl.setHide("F81F4179DCAC8E6E9462", true); //合同上传
        co.Ctrl.setHide("FBD07179DCACE08EAE35", false); //查看详情
        co.Ctrl.setDisable("FBD07179DCACE08EAE35", false); //查看详情
    }
}
window.curDhlMaxHeight = 0;
/**
 * 流程树的展示（添加了高度调整）
 */
window.showFlowTree = function () {
    setTimeout(() => {
        //F039117FE4A0034BC686 是栅格布局的控件ID
        // let maxHeight = document.getElementsByClassName('grid-widget-col sg-col-9')[0].scrollHeight - 70;
        window.styleDeal.sInfo_Timeline({
            // maxHeight: maxHeight.toString() + 'px',
            maxHeight: '1000px',
            controlId: "FA37E18021AD8B31B3CD",
            getUrl: "/sinfoweb/lhchywdjb/getFlowTree",
            getParams: {
                "rid": co.params.rid
            }
        })
        // co.Dom.domIsLoaded(() => {
        //     let bPass = false;
        //     if ((document.getElementsByClassName('grid-widget-col sg-col-9')[0].scrollHeight - 70) !== maxHeight) {
        //         bPass = true;
        //     }
        //     return bPass;
        // }, null, () => {
        //     document.getElementById("FA37E18021AD8B31B3CD").style.maxHeight =
        //         (document.getElementsByClassName('grid-widget-col sg-col-9')[0].scrollHeight - 70).toString() + 'px';
        // },null)
    }, 5000)
}

/**
 * 前端样式处理
 */
// BJCL办件材料树方法
window.fileTreeBJCL = function () {
    window.styleDeal.sInfo_fileTreeWithParams({
        controlId: "F0A8718021ADA609834A",
        getUrl: "/sinfoweb/lhchywdjb/getFileMl",
        getParams: {
            "rid": co.params.rid,
            "type": "BJCL"
        },
        fileDownloadBtn: true,
        emptyText: "暂无成果资料",
        isShowTopRightBtn: true, // 是否显示右上角按钮
        topRightBtnText: "补充材料", // 右上角按钮文案
        isShowDeleteFileBtn: true, // 是否显示删除文件按钮
        topRightBtnFun: () => {
            window.TZJSDWBCL();
        }, // 右上角按钮方法
        deleteCallback: () => {
            window.fileTreeBJCL()
            console.log('删除成功BJCL')
        }
    })
}

window.dealWithFontStyle = function () {
    //头部样式替换
    window.replaceHead();
    //流程树加载
    window.showFlowTree();
    //文件树加载 旧版，所有文件放一个标签
    // window.styleDeal.sInfo_fileTree("F0A8718021ADA609834A", "/sinfoweb/lhchywdjb/getFileMl", {"rid": co.params.rid});
    //新版，材料和成果分开
    //办件材料：F0A8718021ADA609834A
    window.fileTreeBJCL();
    // window.styleDeal.sInfo_fileTree("F0A8718021ADA609834A", "/sinfoweb/lhchywdjb/getFileMl", {
    //     "rid": co.params.rid,
    //     "type": "BJCL"
    // }, null, true, "暂无办件材料");
    //测绘成果：F9FA01873B1E4A273972
    window.styleDeal.sInfo_fileTree("F9FA01873B1E4A273972", "/sinfoweb/lhchywdjb/getFileMl", {
        "rid": co.params.rid,
        "type": "CHCG"
    }, null, true, "暂无成果资料");

    //隐藏平台自带的按钮列
    if ($(".generate-btn-list") && $(".generate-btn-list").length > 0) {
        $($(".generate-btn-list")[0]).hide();
    }


    //修改基本信息表格样式
    window.styleDeal.sInfo_customShowFormStyle('F2DEA18006C5BE91D76C');

    //修改基本信息的项目地点字段
    co.setValue("XMDD", co.getValue("XZQ") + co.getValue("GCXXDD"));


    //修改合同备案表格样式
    window.styleDeal.sInfo_customShowFormStyle('F844018006D8DF695001');

    //修改范围线上传表格样式
    window.styleDeal.sInfo_customShowFormStyle('FB61818020E49E80178E');

    //替换合同的文件下载
    window.replaceFileCtrl(co.getValue("HTSC"), "FB19618006EECFE01B31");
    //替换范围线的文件下载
    window.replaceFileCtrl(co.getValue("FWXTQFILE"), "FEB7C18020E7654A0DE1", true);

    //根据不同的合同上传状态显示隐藏不同的按钮
    window.dealWithHtscBtn();

    //资料申请调用列表展示隐藏
    window.showHideSqList();

    //地图展示大小
    window.sfmap.options = {
        mapWidth: '1300px',
        mapHeight: '650px'
    }

    //测量事项子表列头居中
    window.styleDeal.setSubFormTitleCenter([0], [2])

    window.hideNoDataKzqkTab(true);

    //展示满意度评价总体评价的时候的评价详情
    window.showXmMydpjDetail();

    //展示范围线模板的下载功能
    window.showImportFwxFileTempleteDownLoad();
}
window.dealWithFontStyle();


/**
 * 立刻上传-创建成果汇交
 * sType 烟台添加规划验线 .sType=1 代表规划验线. 不传 则是默认的成果汇交.传别的也可以自定义扩展.
 * @param sCLSX
 * @param sDL
 * @param sCLDW
 * @param sParentRid
 * @param sType
 * @param sHjIndex
 * @constructor
 */
window.CreateCGHJ = function (d) {
    if (!window.checkChdwStatus()) {
        return false;
    }
    let params = d.params;
    let clsx = params.row["PROJ_YWDJ_CLKZQK.CLSX"];
    let hjIndex = params.row["PROJ_YWDJ_CLKZQK.HJINDEX"];
    let cghjDataArr = window.getDbCghjDataArr(clsx, hjIndex);
    if (!cghjDataArr) {
        return;
    }
    if (cghjDataArr.length > 0) {
        window.OpenCGHJ(d);
        return;
    }
    co.Toolbox.showMask();
    setTimeout(() => {
        let bPass = true;
        // if ($.F.getFieldValue('PROJ_LHCHYWDJB.HTSCZT') != '3') {
        let htxzcgsc = co.getValue("HTXZCGSC", "PROJ_YWXT_CONFIG", "1", "1", true);
        if (!htxzcgsc) {
            htxzcgsc = "不限制";
        }
        if (htxzcgsc == "不限制") {
            bPass = true;
        } else {
            let htbaFlowStatus = co.Sql.execSql("获取当前项目合同备案流程状态", {
                "rid": co.params.rid
            });
            if (htbaFlowStatus && htbaFlowStatus.sql1 && htbaFlowStatus.sql1.length > 0) {
                let curFlowKey = htbaFlowStatus.sql1[0]["TASK_DEF_KEY_"];
                if (htxzcgsc == "合同录入提交后可上传") {
                    if (curFlowKey == "e255kpdeqyks") { //在合同录入环节
                        co.Message.error_middle("合同备案未提交!");
                        bPass = false;
                    }
                } else if (htxzcgsc == " 合同备案归档后可上传") {
                    if (curFlowKey) { //合同未归档
                        co.Message.error_middle("合同备案未归档!");
                        bPass = false;
                    }
                }
            } else {
                co.Message.error_middle("找不到合同备案相关流程!");
                bPass = false;
            }
        }
        // let htsczt = co.getDomainValue("HTSCZT",)
        // let aDataSql = co.Sql.execSql("根据RID获取当前案件的合同信息", {"rid": $.F.getFieldValue("PROJ_LHCHYWDJB.RID")});
        // if (aDataSql && aDataSql.sql1 && aDataSql.sql1.length > 0) {
        //     let info = aDataSql.sql1[0];
        //     $.F.setFieldValue("PROJ_LHCHYWDJB.HTSCZT", info["HTSCZT"]);
        //     $.F.setFieldValue("PROJ_LHCHYWDJB.HTSC", info["HTSC"]);
        //     if ($.F.getFieldValue('PROJ_LHCHYWDJB.HTSCZT') != '3') {
        //         co.Message.error_topRight("合同未上传，请先上传合同！！");
        //         Vue.prototype.$loading.hide();
        //         bPass = false;
        //     }
        // } else {
        //     bPass = false;
        //     co.Message.error_topRight("合同未上传，请先上传合同！！");
        //     Vue.prototype.$loading.hide();
        // }
        // }
        if (bPass) {
            if (params.row["PROJ_YWDJ_CLKZQK.CLZT"] == "已暂停") {
                co.Message.error_topRight("已暂停,无法上传！", "");
                co.Toolbox.hideMask();
            } else {
                let sCLSX = params.row["PROJ_YWDJ_CLKZQK.CLSX"];
                let sModuleName = co.getValue("MODULENAME");
                let sType = "";
                if (sModuleName == "PlanningOnLine") {
                    sType = "1";
                }
                let sHjIndex = params.row["PROJ_YWDJ_CLKZQK.HJINDEX"];
                let sCLDW = params.row["PROJ_YWDJ_CLKZQK.CLDW"];
                let sDL = params.row["PROJ_YWDJ_CLKZQK.DL"];
                let sSYS_PARENTRID = params.row["PROJ_YWDJ_CLKZQK.SYS_PARENTRID"].toString();
                let sParentRid = sSYS_PARENTRID.substring(0, sSYS_PARENTRID.indexOf("::"));
                let curKzqkRid = params.row["PROJ_YWDJ_CLKZQK.RID"]
                setTimeout(() => {
                    window.CreateCGHJ_(sCLSX, sDL, sCLDW, sParentRid, sType, sHjIndex, curKzqkRid);
                }, 0);
            }
        }
    }, 100);
}
window.CreateCGHJ_ = function (sCLSX, sDL, sCLDW, sParentRid, sType, sHjIndex, curKzqkRid) {
    let sGCMC = co.getValue('GCMC');
    let sYWBH = co.getValue('YWBH');
    let sGCXXDD = co.getValue('GCXXDD');
    let sXZQ = co.getValue('XZQ');
    let sGCBH = co.getValue('GCBH');
    let sJSXZ = co.getValue('JSXZ');
    let sJSDW = co.getValue('JSDW');
    //自动填充汇交单位
    // let aPost = $.O.getAllPost($.O.getUserId());
    // let sCHJG = ""
    // if (aPost.length > 0) {
    //     for (let i = 0; i < aPost.length; i++) {
    //         let oPost = aPost[i];
    //         let oPostDep = $.O.getAllDept(oPost.rid);
    //         if (oPostDep && oPostDep.organName == "测绘服务机构") {
    //             sCHJG = oPost.organName;
    //         }
    //     }
    let selectparam = new Object();
    let cghjb_pre = "";
    switch (sType) {
        case "1":
            selectparam.businessDefCode = "GHYXCGHJ"
            cghjb_pre = "GHYX";
            break;
        default:
            selectparam.businessDefCode = "CHCGHJ";
    }


    const $sinfoUtil = window.parent.$sinfoUtil;
    $.ajax({
        url: "/flowengine/system/createProcessByBusinessDefCode",
        type: "POST",
        async: false,
        data: selectparam,
        success: function (data) {
            if (data.msg !== undefined) {
                Vue.prototype.$loading.hide();
                window.Vue.prototype.$msg.error('创建错误')
            } else {
                let sWhere = "%" + sParentRid + "%";
                //获取父表单的测绘事项
                let data1 = co.Sql.execSql("根据业务受理附表单的RID获取测绘事项", {
                    "parentrid": sWhere
                }, null);
                let obj = data1['sql1'];
                let count = obj.length
                let selectparam1 = new Array();
                for (let i = 0; i <= count - 1; i++) {
                    let info = obj[i];
                    let map = {};
                    if (info.XZ === "1") {
                        //给子表赋值
                        map["PROJ_CGHJCESXZBD.CLSX"] = info.CLSX;
                        map["PROJ_CGHJCESXZBD.CHDW"] = info.CHDW;
                        map["PROJ_CGHJCESXZBD.LXDH"] = info.LXDH;
                        map["PROJ_CGHJCESXZBD.JID"] = data.jid; //jid和父表单的一致
                        map["PROJ_CGHJCESXZBD.RID"] = "";
                        map["PROJ_CGHJCESXZBD.XH"] = info.XH;
                        selectparam1.push(map);
                    }
                }
                //成果汇交表的数据
                let initDataJson = new Object();

                switch (sType) {
                    case "1":
                        initDataJson = {
                            "taskId": data.taskId,
                            "jid": data.jid,
                            "PROJ_GHYXCGHJB.YWBH": sYWBH,
                            "PROJ_GHYXCGHJB.GCXXDD": sGCXXDD,
                            "PROJ_GHYXCGHJB.XZQ": sXZQ,
                            "PROJ_GHYXCGHJB.GCBH": sGCBH,
                            "PROJ_GHYXCGHJB.GCMC": sGCMC,
                            "PROJ_GHYXCGHJB.JSXZ": sJSXZ,
                            "PROJ_GHYXCGHJB.WTDW": sJSDW,
                            "PROJ_GHYXCGHJB.SSCG": sCLSX,
                            "PROJ_GHYXCGHJB.CHJG": sCLDW,
                            "PROJ_GHYXCGHJB.TDLY": co.getValue("TDLY"),
                            "PROJ_GHYXCGHJB.SFZLCSC": "1",
                            "PROJ_GHYXCGHJB.DL": sDL
                        }
                        break;
                    default:
                        initDataJson = {
                            "taskId": data.taskId,
                            "jid": data.jid,
                            "PROJ_CGHJB.YWBH": sYWBH,
                            "PROJ_CGHJB.GCXXDD": sGCXXDD,
                            "PROJ_CGHJB.XZQ": sXZQ,
                            "PROJ_CGHJB.XZQCODE": co.getValue("XZQCODE"),
                            "PROJ_CGHJB.GCBH": sGCBH,
                            "PROJ_CGHJB.GCMC": sGCMC,
                            "PROJ_CGHJB.JSXZ": sJSXZ,
                            "PROJ_CGHJB.WTDW": sJSDW,
                            "PROJ_CGHJB.SSCG": sCLSX,
                            "PROJ_CGHJB.CHJG": sCLDW,
                            "PROJ_CGHJB.TDLY": co.getValue("TDLY"),
                            "PROJ_CGHJB.SFZLCSC": "1",
                            "PROJ_CGHJB.SPINDEX": "1",
                            "PROJ_CGHJB.DL": sDL,
                            "PROJ_CGHJB.CHDWUSERID": co.User.userId(),
                            "PROJ_CGHJB.KZQKBRID": curKzqkRid
                        }
                        //多次汇交添加汇交HjIndex字段
                        if (sHjIndex) {
                            initDataJson["PROJ_CGHJB.HJINDEX"] = sHjIndex;
                        }
                }

                let oXGCLKZQKSJ = {
                    "chcg": "上传中",
                    "ywbh": sYWBH,
                    "clsx": sCLSX
                }

                $.ajax({
                    url: "/flowengine/system/saveTaskData",
                    type: "POST",
                    async: false,
                    data: initDataJson,
                    success: function (dataSave) {
                        let sSqlName = "修改测量开展情况数据_测绘成果";
                        //多次汇交需要根据业务编号+汇交次数来进行更新数据
                        if (sHjIndex) {
                            oXGCLKZQKSJ["hjindex"] = sHjIndex;
                            sSqlName = "修改测量开展情况数据_测绘成果_多次汇交";
                        }
                        $.execsql(null, sSqlName, oXGCLKZQKSJ);

                        setTimeout(() => {
                            // window.RefreshCHKZQK();
                            $.F.refreshSubForm(co.subFormMap.CGHJ.table); //刷新开展情况
                        }, 2000)
                        let oRid = "";
                        //子表单linkCode
                        //委托事项
                        let sSubFormLinkCode_wtsx = "";
                        //成果展示
                        let sSubFormLinkCode_cgzs = "";

                        switch (sType) {
                            case "1":
                                oRid = co.Sql.execSql("根据JID获取成果汇交RID_规划验线", {
                                    "jid": data.jid
                                }, null);
                                sSubFormLinkCode_wtsx = "F3B3117B539209B4CB0E";
                                sSubFormLinkCode_cgzs = "FE2E917B5C2FE7465CBC";
                                break;
                            default:
                                oRid = co.Sql.execSql("根据JID获取成果汇交RID", {
                                    "jid": data.jid
                                }, null);
                                sSubFormLinkCode_wtsx = "F692E176CBFC6F2FA18D";
                                sSubFormLinkCode_cgzs = "F73DC1766F699B7D9800";
                        }

                        let sNewRid = oRid['sql1'][0]["RID"];
                        //生成新的成果汇交提交记录
                        window.recordCghjLogData(sNewRid, true, false);
                        $.ajax({
                            url: "/formengine/sub/saveSubFormData?jid=" + data.jid + "&parentRid=" + sNewRid + "::" + sSubFormLinkCode_wtsx + "&formId=44544f94-62f1-445a-9793-337375824a5a&controlRid=",
                            contentType: 'application/json; charset=utf-8',
                            type: 'post',
                            async: false,
                            data: JSON.stringify(selectparam1),
                            success: function (CLSXData) {
                                /**
                                 * 54593 未开始的测量事项状态改为【待开始】
                                 * ①委托单位模式：网上委托的案件
                                 *     未接办：待接办
                                 *     接办后：待开始
                                 *     新增测量事项：待开始
                                 *     创建成果汇交：测量中===========这
                                 * ②窗口模式：网上预审创建的案件、窗口提交过来的案件
                                 *     到达后：待接办
                                 *     接办后：待开始
                                 *     新增测量事项：待开始
                                 *     创建成果汇交：测量中===========这
                                 */
                                co.setValueSync("CLZT", "测量中", "RID", curKzqkRid, true, co.subFormMap.CGHJ.tableName)

                                let dataHJQD = co.Sql.execSql("根据测绘事项获取汇交清单", {
                                    "clsx": sCLSX
                                }, null);
                                let objHJQD = dataHJQD['sql1'];
                                let count = objHJQD.length
                                let selectparamHJQD = new Array();
                                for (let i = 0; i <= count - 1; i++) {
                                    let info = objHJQD[i];
                                    let map = {};
                                    //给子表赋值
                                    map["PROJ_CGHJCHCGSCZBD.XH"] = info.XH;
                                    map["PROJ_CGHJCHCGSCZBD.CGMC"] = info.CGMC;
                                    map["PROJ_CGHJCHCGSCZBD.BXSC"] = info.BXSC;
                                    map["PROJ_CGHJCHCGSCZBD.CHDWZJGX"] = info.CHDWZJGX;
                                    map["PROJ_CGHJCHCGSCZBD.TSGJSDW"] = info.TSGJSDW;
                                    // map["PROJ_CGHJCHCGSCZBD.JID"] = data.jid;//jid和父表单的一致
                                    map["PROJ_CGHJCHCGSCZBD.RID"] = "";
                                    selectparamHJQD.push(map);
                                }
                                $.ajax({
                                    url: "/formengine/sub/saveSubFormData?jid=" + data.jid + "&parentRid=" + sNewRid + "::" + sSubFormLinkCode_cgzs + "&formId=0375d809-c66c-4214-9d0f-7cc77f2f1879&controlRid=",
                                    contentType: 'application/json; charset=utf-8',
                                    type: 'post',
                                    async: false,
                                    data: JSON.stringify(selectparamHJQD),
                                    success: function (HJQDdata) {
                                        Vue.prototype.$loading.hide();
                                        // 刷新树
                                        window.showFlowTree();
                                        $sinfoUtil.form.BtnFuncs.openForm({
                                            "title": "正在打开...",
                                            "jid": data.jid,
                                            "processInstanceId": data.processInstanceId,
                                            "taskId": data.taskId,
                                            "ownerModuleId": ""
                                        })
                                    },
                                    error: function (d) {
                                        Vue.prototype.$loading.hide();
                                        window.Vue.prototype.$msg.error('创建错误')
                                    }
                                });
                            },
                            error: function (d) {
                                Vue.prototype.$loading.hide();
                                window.Vue.prototype.$msg.error('创建错误')
                            }
                        });
                    },
                    error: function (d) {
                        Vue.prototype.$loading.hide();
                        window.Vue.prototype.$msg.error('创建错误')
                    }
                });
            }
        },
        error: function (d) {
            Vue.prototype.$loading.hide();
            window.Vue.prototype.$msg.error('创建错误')
        }
    });
}

/**
 * 打开已有的成果汇交
 * @param sCLSX
 * @param sType
 * @param sHJINDEX
 * @constructor
 */
window.OpenCGHJ = function (d) {
    let params = d.params;
    let clsx = params.row["PROJ_YWDJ_CLKZQK.CLSX"];
    let hjIndex = params.row["PROJ_YWDJ_CLKZQK.HJINDEX"];
    let cghjDataArr = window.getDbCghjDataArr(clsx, hjIndex);
    if (!cghjDataArr) {
        return;
    }
    if (cghjDataArr.length > 0) {
        const $sinfoUtil = window.parent.$sinfoUtil;
        let oData = cghjDataArr[0];
        let sPROCESSINSTANCEID = oData.PROCESSINSTANCEID;
        let sTASKID = oData.TASKID;
        let sJID = oData.JID;
        $sinfoUtil.form.BtnFuncs.openForm({
            "title": "正在打开...",
            "jid": sJID,
            "processInstanceId": sPROCESSINSTANCEID,
            "taskId": sTASKID,
            "ownerModuleId": ""
        })
    } else {
        window.CreateCGHJ(d);
    }
};
/**
 * 获取成果汇交数据
 * @param clsx
 * @param hjIndex
 * @returns {*}
 */
window.getDbCghjDataArr = function (clsx, hjIndex) {
    let sModuleName = co.getValue("MODULENAME");
    let sType = "";
    if (sModuleName == "PlanningOnLine") {
        sType = "1";
    }
    let ywbh = co.getValue('YWBH');
    let oSql = "";
    switch (sType) {
        case "1":
            oSql = co.Sql.execSql("查询规划验线成果汇交的打开流程数据", {
                "ywbh": ywbh,
                "clsx": clsx
            }, null);
            break;
        default:
            //多次汇交查询方式不一样
            if (hjIndex) {
                oSql = co.Sql.execSql("查询成果汇交的打开流程数据_多次汇交", {
                    "ywbh": ywbh,
                    "clsx": clsx,
                    "hjindex": hjIndex
                }, null);
            } else {
                oSql = co.Sql.execSql("查询成果汇交的打开流程数据", {
                    "ywbh": ywbh,
                    "clsx": clsx
                }, null);
            }
    }
    if (!oSql) {
        co.Message.error_middle("数据查询失败");
        return;
    }
    let cghjDataArr = oSql['sql1'];
    return cghjDataArr;
}
/**
 * 再次汇交
 * @param params
 */
window.reCreateCGHJ = function (d) {
    let params = d.params;
    co.Dialog.confirm("是否确认再次汇交该测量事项？", "提交确认", () => {
        co.Toolbox.showMask();
        setTimeout(() => {
            let sHjIndex = window.createNewClsxAndKzqk(params.row);
            if (sHjIndex) {
                let sType = "";
                let sModuleName = co.getValue(".MODULENAME");
                if (sModuleName === "PlanningOnLine") {
                    sType = "1";
                }
                let sCLSX = params.row["PROJ_YWDJ_CLKZQK.CLSX"];
                let sCLDW = params.row["PROJ_YWDJ_CLKZQK.CLDW"];
                let sDL = params.row["PROJ_YWDJ_CLKZQK.DL"];
                let sSYS_PARENTRID = params.row["PROJ_YWDJ_CLKZQK.SYS_PARENTRID"].toString();
                let sParentRid = sSYS_PARENTRID.substring(0, sSYS_PARENTRID.indexOf("::"));
                window.CreateCGHJ_(sCLSX, sDL, sCLDW, sParentRid, sType, sHjIndex);
            }
        });
    }, 0)
}

/**
 * 多次汇交的情况下，创建新的测量开展情况
 * @param row
 * @returns {string}
 */
window.createNewClsxAndKzqk = function (row) {
    let aCurKzqk = co.Subform.getCurrPageData(co.subFormMap.CGHJ.table);
    let iIndex = 1;
    for (let i = 0; i < aCurKzqk.length; i++) {
        if (aCurKzqk[i]["PROJ_YWDJ_CLKZQK.CLSX"] == row["PROJ_YWDJ_CLKZQK.CLSX"]) {
            iIndex++;
        }
    }
    let oAddNewData = {
        "PROJ_YWDJ_CLKZQK.XH": aCurKzqk.length + 1,
        "PROJ_YWDJ_CLKZQK.XHB": aCurKzqk.length + 1 > 9 ? aCurKzqk.length + 1 : "0" + (aCurKzqk.length + 1).toString(),
        "PROJ_YWDJ_CLKZQK.CLDW": row["PROJ_YWDJ_CLKZQK.CLDW"],
        "PROJ_YWDJ_CLKZQK.CLSX": row["PROJ_YWDJ_CLKZQK.CLSX"],
        "PROJ_YWDJ_CLKZQK.CLZT": "测量中",
        "PROJ_YWDJ_CLKZQK.ZTJL": "无暂停记录",
        "PROJ_YWDJ_CLKZQK.DYZT": "未调用",
        "PROJ_YWDJ_CLKZQK.JCSJ": "未预约",
        "PROJ_YWDJ_CLKZQK.CHCG": "未上传",
        "PROJ_YWDJ_CLKZQK.JBZT": "已接办",
        "PROJ_YWDJ_CLKZQK.JID": row["PROJ_YWDJ_CLKZQK.JID"],
        "PROJ_YWDJ_CLKZQK.DL": row["PROJ_YWDJ_CLKZQK.DL"],
        "PROJ_YWDJ_CLKZQK.HJINDEX": iIndex
    }
    let aAddNewData = [];
    aAddNewData.push(oAddNewData);
    let sReturn = "";
    let httpUrl = "/formengine/sub/saveSubFormData?jid=" + co.getValue("JID") + "&parentRid=" + co.getValue("RID") + "::FE7BF176ADED8EE4F598&formId=0e81bc28-da77-44c4-9f60-af4973b1cda6&controlRid=";
    co.Http.requestByDirectory(httpUrl, aAddNewData, false, "POST", () => {
        co.Subform.refresh(co.subFormMap.CGHJ.table);
        co.Toolbox.hideMask();
        sReturn = iIndex.toString();
    }, true)
    return sReturn;
}

/**
 * 上传范围线文件
 */
window.uploadFwxFile = function () {
    if (co.getValue("FWXTQFILE")) {
        co.setValue("RANGEDATA", "", "", "", true).then(() => {
            co.setValue("FWXTQFILE", "", "", "", true).then(() => {
                uploadFwxFile_();
            })
        });
    } else {
        uploadFwxFile_();
    }
}
let uploadFwxFile_ = function () {
    co.File.uploadSingleFile("FWXTQFILE", (str) => {
        co.Progress.baseProgressFake("提示", 10000, "正在提取坐标", null, null);
        let getFileUrl = co.Config.getGlobalValue("DownLoadUrlForWebGis");
        let aStr = str.split("|");
        let sFileUrl = getFileUrl + "/file/public/downFileByPath?macroPath=" + encodeURIComponent(aStr[1]) + "&fileName=" + encodeURIComponent(aStr[0]);
        let oPostData = {
            "path": sFileUrl
        };
        co.Http.requestByDirectory("/sinfoweb/lhchywdjb/public/WebGisParseFWX", oPostData, false, "POST", (dataStr) => {
            co.Progress.baseProgressClose();
            let oData = JSON.parse(dataStr);
            let aReturn = [];
            if (oData["coordinates"]) {
                var aCoordinates = oData["coordinates"];
                if (aCoordinates.length > 0) {
                    for (var j = 0; j < aCoordinates.length; j++) {
                        var graphArr = []
                        var oCoordinates = aCoordinates[j];
                        for (var i = 0; i < oCoordinates.length; i++) {
                            var oCoordinate = oCoordinates[i];
                            var aTemp = [];
                            aTemp.push(oCoordinate[0]);
                            aTemp.push(oCoordinate[1]);
                            graphArr.push(aTemp.join(","));
                        }
                        aReturn.push(graphArr.join(";"));
                    }
                }
            }
            if (aReturn.length > 0) {
                co.setDomainValue("RANGEDATA", aReturn.join("|"), true);
                co.setDomainValue("FWXTQFILE", co.getValue("FWXTQFILE"), true);
                //替换范围线的文件下载
                window.replaceFileCtrl(co.getValue("FWXTQFILE"), "FEB7C18020E7654A0DE1");
            } else {
                co.Message.error_topRight("提取范围线失败", "提示");
            }
        });
    }, () => {
        co.Progress.baseProgressClose();
        co.Message.error_topRight("文件上传失败", "提示");
    }, false, ".dwg");
}
/**
 * 创建资料申请流程
 */
window.createZlsqFlow = function () {
    let formData = {
        "XMRID": co.params.rid
    };
    co.Flow.createOpenNotSave("CHCGLYSQ", formData);
}

/**
 * 记录当前成果汇交的变更记录
 * @param addTjjl 是否新增记录
 * @param updateTjjl 是否更新记录
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
        data: data,
        responseType: co.constant.CONTENTTYPE.JSON,
        success: (ret) => {
        },
        error: (ret) => {
        }
    })
}

/**
 * 通知建设单位补材料
 * @constructor
 */
window.TZJSDWBCL = function () {
    co.Form.open("a83924d6-2145-4a20-bf24-ddd9d00e12da", "", co.getValue("GCMC") + "材料补充", 6, {
        "xmRid": co.params.rid
    });
}

/**
 * 检测当前测绘单位的状态，如果不允许操作会有提示框
 * @returns {boolean}
 */
window.checkChdwStatus = function () {
    let chdwInfoAlert = false;
    co.Http.request({
        url: "/sinfoweb/chdw/getCurChdwStatus",
        data: {},
        async: false,
        success: (ret) => {
            ret = JSON.parse(ret);
            if (ret.code === 0 && ret.data.show) {
                chdwInfoAlert = true;
                let modalDetail = ret.data.info;
                window.styleDeal.sInfo_ShowMappingUnitStatusDetail({
                    modalParams: {
                        modalType: 'alert',
                        modalTitle: '提示',
                        width: '40%'
                    },
                    clickFun: () => {
                        co.PageTab.openMouleTab(co.PageTab.getModuleId("ChdwMaintain"))
                    },
                    vue: Sgui,
                    controlId: '',
                    modalDetail: modalDetail
                })
            }
        },
        error: (ret) => {
        }
    })
    if (chdwInfoAlert) {
        return false;
    }
    return true;
}
/**
 * 已读用户ID赋值
 */
window.setYdyhId = function () {
    //已读用户赋值
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
/**
 * 加载前运行
 */
window.doBeforeLoading = function () {
    let curTaskInfo = co.params.taskInfo;
    if (curTaskInfo.taskDefinitionKey === "e38dkj7ypnax") {
        //浏览单位记录 非测量作业环节将值置空
        co.setDomainValue("YLLDW", "", true);
    } else if (curTaskInfo.taskDefinitionKey === "exqkj7ypwdt") {
        //浏览单位记录 测量作业环节将浏览账号userId填入
        let aLldw = [];
        let lldw = co.getValue("YLLDW");
        if (lldw) {
            aLldw = lldw.split(",");
        }
        if (aLldw.indexOf(co.User.userId()) === -1) {
            aLldw.push(co.User.userId());
            let newLldw = aLldw.join(",");
            co.setDomainValue("YLLDW", newLldw, true);
        }
    }
    //已读用户ID赋值
    window.setYdyhId();
}
window.doBeforeLoading();


/**
 * 打个标志，加载前执行结束，请保持这个代码在代码的最底部（为了避免加载前没执行完就执行了加载后）
 */
window.dobeforeLoadEnd = true;