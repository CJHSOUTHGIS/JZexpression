/**
 * 业务类型的公用方法
 */
function CommonPorjectObject() {
    window.sxzqCodeMap = new Object();
    window.xzqCodeMap = new Object();
    window.xjXzqList = [];//省市一体的时候的县级数组
    /**
     * 市行政区选择后的执行方法
     */
    function doAfterSelectSxzq() {
        let sxzqCode = co.getValue("SXZQCODE");
        let qZoneTree = [];
        for (let i = 0; i < window.xjXzqList.length; i++) {
            let curCode = window.xjXzqList[i]["id"];
            let curName = window.xjXzqList[i]["label"];
            if (curCode.indexOf(sxzqCode) == 0) {
                qZoneTree.push(window.xjXzqList[i]);
                window.xzqCodeMap[curCode] = curName;
            }
        }
        co.setValue("XZQCODE", qZoneTree);
    }

    this.doAfterSelectSxzq = doAfterSelectSxzq;
    /**
     * 给行政区下拉赋值
     * 如果是市县一体，只赋值区级行政区字段【XZQCODE】
     * 如果是省市一体，赋值行政区字段【XZQCODE】和市行政区【SXZQCODE】
     */
    this.setXzqCodeDropList = function () {
        let sxzqCode = co.getValue("SXZQCODE");
        let xzqCode = co.getDomainValue("XZQCODE", true);
        let topZone = co.getValue("TOPZONE", "PROJ_ENVIRONMENTCONFIG", "1", "1", true);
        if (topZone) {//未配置最高行政区无法使用此表达式
            //topZone.length=2：省市一体，topZone.length=4,：市县一体
            let dropListSetKey = "";
            if (topZone.length == 2) {
                dropListSetKey = "SXZQCODE";
            } else if (topZone.length == 4) {
                dropListSetKey = "XZQCODE";
            } else {
                return;
            }
            let userZoneList = window.top.$sinfoRegionTree.highestZoneCodeList;//上方可选择权限数据
            let allZoneList = window.top.$sinfoRegionTree.zoneList;//所有行政区数据
            if (allZoneList && userZoneList) {
                let aZoneTree = [];
                let aZoneTreeId = [];
                for (let i = 0; i < allZoneList.length; i++) {
                    let curCode = allZoneList[i]["code"];
                    let curName = allZoneList[i]["showValue"];
                    if (aZoneTreeId.indexOf(curCode) >= 0) {
                        continue;
                    }
                    //市县一体
                    if (topZone.length == 4) {
                        if (curCode.length == 6) {//市县一体，下拉取区
                            for (let j = 0; j < userZoneList.length; j++) {
                                if (curCode.indexOf(userZoneList[j]) == 0) {//由用户权限开头
                                    aZoneTree.push({
                                        "label": curName,
                                        "text": curName,
                                        "id": curCode,
                                        "value": curCode
                                    })
                                    aZoneTreeId.push(curCode);
                                    window.xzqCodeMap[curCode] = curName;
                                    break
                                }
                            }
                        }
                    } else if (topZone.length == 2) {
                        if (curCode.length == 4 || curCode.length == 6) {//省市一体，下拉取市和区
                            for (let j = 0; j < userZoneList.length; j++) {
                                if (curCode.indexOf(userZoneList[j]) == 0 || userZoneList[j].indexOf(curCode) == 0) {//由用户权限开头
                                    if (curCode.length == 4) {//市下拉
                                        aZoneTree.push({
                                            "label": curName,
                                            "text": curName,
                                            "id": curCode,
                                            "value": curCode
                                        })
                                        aZoneTreeId.push(curCode);
                                        window.sxzqCodeMap[curCode] = curName;
                                        break
                                    } else if (curCode.length == 6) {//临时存储有权限的区，作为选择了市之后的过滤
                                        window.xjXzqList.push({
                                            "label": curName,
                                            "text": curName,
                                            "id": curCode,
                                            "value": curCode
                                        })
                                        aZoneTreeId.push(curCode);
                                        break
                                    }
                                }
                            }
                        }
                    }

                }
                co.setValue(dropListSetKey, aZoneTree);
                if (topZone.length == 4) {//市县一体
                    co.setValue("XZQCODE", xzqCode);
                } else if (topZone.length == 2) {//省市一体
                    co.setValue("SXZQCODE", sxzqCode);
                    if (xzqCode) {
                        doAfterSelectSxzq();
                        setTimeout(() => {
                            co.setValue("XZQCODE", xzqCode);
                        }, 0)
                    }
                }
            }
        }
    }

    /**
     * 根据行政区决定流程办理人
     *   通过行政区取值
     *   ①如果行政区可以找到一模一样的配置，则使用其审核人配置
     *   ②如果行政区找不到一模一样的配置，则向上查找，比如【440116】则继续找【4401】以此类推
     *   ③如果行政区找不到一模一样的配置，则找没有行政区的配置（就是行政区字段为空的配置）
     *   ④如果没有行政区的配置也没有找到，则不动态获取办理人，直接使用流程配置的办理人
     */
    this.setHanlerByXzqConfig = function (configCol, judgeXzq) {
        let sReturn = "";
        let allXzqConfig = co.getList(configCol + ",XZQ", "PROJ_XZQHANDLERS_CONFIG", "1", "1", true);
        if (allXzqConfig.length > 0) {
            if (judgeXzq) {
                let judgeXzqSplit = judgeXzq.split(",");
                judgeXzq = judgeXzqSplit[judgeXzqSplit.length - 1];
                //①如果行政区可以找到一模一样的配置，则使用其审核人配置
                for (let i = 0; i < allXzqConfig.length; i++) {
                    if (!allXzqConfig[i]["XZQ"]) {
                        continue;
                    }
                    let curXzqSplit = allXzqConfig[i]["XZQ"].split(",");
                    let curXzq = curXzqSplit[curXzqSplit.length - 1];
                    if (curXzq == judgeXzq) {
                        sReturn = allXzqConfig[i][configCol];
                        break;
                    }
                }
                //②如果行政区找不到一模一样的配置，则向上查找，比如【440116】则继续找【4401】以此类推
                if (!sReturn) {
                    while (judgeXzq.length > 2) {
                        judgeXzq = judgeXzq.substr(0, judgeXzq.length - 2);
                        for (let i = 0; i < allXzqConfig.length; i++) {
                            if (!allXzqConfig[i]["XZQ"]) {
                                continue;
                            }
                            let curXzqSplit = allXzqConfig[i]["XZQ"].split(",");
                            let curXzq = curXzqSplit[curXzqSplit.length - 1];
                            if (curXzq == judgeXzq) {
                                sReturn = allXzqConfig[i][configCol];
                                break;
                            }
                        }
                        if (sReturn) {
                            break;
                        }
                    }
                }
            }
            //③如果行政区找不到一模一样的配置，则找没有行政区的配置（就是行政区字段为空的配置）
            if (!sReturn) {
                for (let i = 0; i < allXzqConfig.length; i++) {
                    if (!allXzqConfig[i]["XZQ"]) {
                        sReturn = allXzqConfig[i][configCol];
                        break;
                    }
                }
            }
        }
        return sReturn;
    }
    /**
     * 在行政区配置的基础上继续深入的找每个测量事项和环节配置的办理人，如果没找到对应的测量事项，则使用测量事项字段为空的配置
     */
    this.setHanlerByXzqClsxFlowStep = function (xzqConfigRid,curClsx){
        let hjHandlerObj = {};
        let handelerConfig = co.getList("HJ,CLSX,BLR,RID", "PROJ_XZQ_FLOWHANDLER", "SYS_PARENTRID", xzqConfigRid + "::F7DF5183BAD626D945B1", true);
        if (handelerConfig && handelerConfig.length > 0) {
            let hjObj = {};
            //根据各个环节的配置先分类
            for (let i = 0; i < handelerConfig.length; i++) {
                let hj = handelerConfig[i]["HJ"];
                if (hjObj[hj]) {
                    hjObj[hj].push(handelerConfig[i]);
                } else {
                    hjObj[hj] = [handelerConfig[i]];
                }
            }
            for (let hj in hjObj) {
                let configArr = hjObj[hj];
                let emptyClsxBlr = "";//测量事项为空的配置办理人
                let finalBlr = "";
                //每个环节先判断测量事项是否有满足条件的
                for (let i = 0; i < configArr.length; i++) {
                    let clsx = configArr[i]["CLSX"];
                    let blr = configArr[i]["BLR"];
                    let rid = configArr[i]["RID"];
                    let clsxSplit = [];
                    if (clsx) {
                        clsxSplit = clsx.split(",");
                    } else if (!emptyClsxBlr) {
                        emptyClsxBlr = blr;
                        continue;
                    }
                    if (clsxSplit.indexOf(curClsx) >= 0) {
                        //判断是否是业务审核，如果是业务审核需要判断是否有并联审批的办理人配置，如果有不需要配置办理人。将是否并联审批标志【YWSHSFBLSP】标记为1
                        let muBlr = co.getList("BLR", "PROJ_XZQMUHANDLERS_CONFIG", "SYS_PARENTRID",
                            rid + "::FE3F718C65EC3E28AE4C", true);
                        if (muBlr.length > 0) {
                            emptyClsxBlr = "";
                            co.setDomainValue("YWSHSFBLSP", "1", true);
                            break;
                        }
                        finalBlr = blr;
                        break
                    }
                }
                if (!finalBlr) {
                    finalBlr = emptyClsxBlr; //没有满足条件的测量事项配置则取空的配置
                }
                if (finalBlr) {//如果找到配置的人则保存
                    hjHandlerObj[hj] = finalBlr;
                }
            }
        }
        return hjHandlerObj;
    }
}
