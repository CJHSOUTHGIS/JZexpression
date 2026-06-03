function checkBeforeSubmit() {
    
    //添加受理项目的测绘成果 由于保存前的方法在直接点击提交不会调用，所以在这里也加上
    co.setValueSync("chcg", "上传中", "RID", co.getDomainValue("KZQKBRID"), true, "PROJ_YWDJ_CLKZQK");
    //判断报告是否上传
    if (!co.getDomainValue("CGBGSC")) {
        co.PageTab.scrollToElement("F4C0B1838C85FDD641E8", false);
        co.Message.error_middle("【成果报告上传】未上传!");
        return false;
    }
    //判断技术审查的问题记录是否有回应情况为空的情况
    let jsscWtjlDataArr = co.getList("FCYJ,HY,CWDJ", co.subFormMap.JSSC.tableName, "JID", co.params.jid, true);
    for (let i = 0; i < jsscWtjlDataArr.length; i++) {
        if (jsscWtjlDataArr[i]["CWDJ"] !== "4" && jsscWtjlDataArr[i]["FCYJ"] == "未解决" && !jsscWtjlDataArr[i]["HY"]) {
            {
                co.PageTab.scrollToElement(co.subFormMap.JSSC.controlId, false);
                co.Message.error_middle("【回应情况】不能为空!");
                return false;
            }
        }
    }
    //判断业务审核的问题记录是否有回应情况为空的情况
    let wtjlObj = co.subFormMap.YWSH;
    if ($.F.getFieldValue("PROJ_CGHJB.YWSHSFBLSP") == "1") {//并联审批
        wtjlObj = co.subFormMap.BLSPWTJL;
    }
    let ywshWtjlDataArr = co.Subform.getCurrPageData(wtjlObj.controlId);
    // co.getList("FCYJ,HY,CWDJ", co.subFormMap.YWSH.tableName, "JID", co.params.jid, true);
    for (let i = 0; i < ywshWtjlDataArr.length; i++) {
        if (ywshWtjlDataArr[i][wtjlObj.tableName + ".CWDJ"] !== "4"
            && ywshWtjlDataArr[i][wtjlObj.tableName + ".FCYJ"] == "未解决"
            && !ywshWtjlDataArr[i][wtjlObj.tableName + ".HY"]) {
            {
                co.PageTab.scrollToElement(co.subFormMap.YWSH.controlId, false);
                co.Message.error_middle("【回应情况】不能为空!");
                return false;
            }
        }
    }

    //============需要入库的限制提示start======================//
    let fwxsfrk = co.getValue("FWXSFRK", "PROJ_LHCHYWDJB", "YWBH", co.getDomainValue("YWBH"), true);
    if (fwxsfrk != "1") {
        co.Message.error_middle("项目范围线未入库，请先入空间库。");
        return false;
    }
    let rkxztjts = co.getDomainValue("RKXZTJTS",true);
    if(rkxztjts){
        co.Message.error_middle(rkxztjts);
        return false;
    }
    //============需要入库的限制提示end======================//

    return true;
}

if (checkBeforeSubmit()) {
    //============提交不自动质检======================//
    // Vue.prototype.$modal.confirm({
    //     title: '提交确认',
    //     content: '是否提交',
    //     closable: true,
    //     similar: true,
    //     width: 360,
    //     height: 160,
    //     onOk: () => {
    //         readySubmitComplete();
    //     },
    //     onCancel: () => {
    //     },
    //     onHidden: () => {
    //     }
    // })
    //============提交不自动质检======================//


    //============提交自动质检======================//
    if (co.getDomainValue("SFZJTG") != "2") {
        let sZJJKMC = "iData";
        let dataCHSXArr = co.Sql.execSql("根据测量事项获取质检接口名称", {"clsx": co.getDomainValue("SSCG")});
        if (dataCHSXArr && dataCHSXArr.sql1 && dataCHSXArr.sql1.length > 0) {
            if (dataCHSXArr.sql1[0]["ZJJKMC"] == "SMEpro") {
                sZJJKMC = "SMEpro";
            }
        }
        if (sZJJKMC == "iData") {
            window.startAutoCheck(true);//idata质检
        } else if (sZJJKMC == "SMEpro") {
            window.startAutoCheckSme(true);//SME质检
        }
    } else {
        //2023-10-28 12:37:40
        //============判断是否需要测绘单位签章======================//
        let chdwqzpzqy = co.getValue("CHDWQZPZQY", "PROJ_DZQZ", "1", "1", true);
        if (chdwqzpzqy == "1" && co.getDomainValue("CHDWSFQZ", true) != "1") {//需要签章
            window.signZipFile("测绘单位", true);
        }else{//不需要签章
            co.Dialog.confirm("质检通过，是否汇交？", "提交确认", () => {
                co.Flow.readySubmitComplete();
            })
        }
        //============判断是否需要测绘单位签章======================//
    }
    //============提交自动质检======================//
}