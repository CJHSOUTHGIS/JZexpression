"use strict"

/**
 * @version 1.0.7
 * 二次开发工具类入口
 * @class
 * @param {String=} domainTableName   主域(主表单)表名  <br> 多个主表：new多个来用即可。 <br> 无主表时(列表型表单)，可置空，此时取主表值相关方法均失效
 * @param  {Map<nickName, subFormInfo>} subFormMap 子表单对应对象
 * @example
 * let subFormInfoMap = {
 *     "businessType": {
 *         "link": "FA2B71756262ADF0EEA9",
 *         "table": "PROJ_LHCHYWDJB_CLSX",
 *         "formId": "2ffe680e-df25-4c79-9320-cbcfb1561c6c",
 *         "sys_parentId": ""
 *     },
 *     "material": {
 *         "link": "FB8B1176ADE6F3A9153D",
 *         "table": "PROJ_YWDJB_SQRTGCL",
 *         "formId": "9b116164-9bbc-47d8-96dc-85a20737849d",
 *         "sys_parentId": ""
 *     }
 * }
 *
 * #import CommonObject
 * //单主表时: 可以省略参数
 * window.co = new CommonObject();
 *
 * //多主表时(不常用): 可用domainTable区分
 * // domainTable = "PROJ_TABLE1","PROJ_TABLE2"
 * window.co1 = new CommonObject("PROJ_TABLE1", subFormMap)
 * window.co2 = new CommonObject("PROJ_TABLE2", subFormMap)
 *
 * //subFormMap传入时，会自动添加sysparentid等子表的相关属性，
 *   方便平时写代码时寻找子表相关信息，推荐使用。
 *
 */
function CommonObject(domainTableName, subFormMap) {
    let axios = window.axios || window.top.axios
    window.Sgui = window.Sgui || document.querySelector('#generateForm').__vue__
    console.time("CommonObjectTakeTimes");
    let mainObj = this;

    /**
     * 版本号
     * @type {string}
     */
    this.version = "1.0.7";

    let publickey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCBJGfGO7OKrHmrpjQv0VLJV/Lj9p/2p/SWoD+uI5ZFLA+ojYZs3SrIJgQbLLDmIeI6eadDh3ggNRjPs7X/TcHTza8bSXg/jtPSdJO5sEfOmQR2yxliIcrH7urBKh5SUeEH7JINHPO+LctM5rqZ/vdIxwa8vzF5W1b6ObMz6IgrQQIDAQAB";
    if (window.top.JSEncrypt) {
        let encrypt = new window.top.JSEncrypt();
        encrypt.setPublicKey(publickey);
        this.encryptFtn = function (text) {
            return encrypt.encrypt(text);
        }
    }

    //回到顶部页面的按钮
    function setBacktopBtn(targetDom = document.body, bottom = 20) {
        // 创建dom
        let tag = document.createElement('div')
        tag.setAttribute('id', 'sinfo_backtopBtn')
        document.body.appendChild(tag)
        // 替换dom为 SgBacktop 组件
        window.top.IBaseExpressLib.renderCustomVue({
            vue: Sgui,
            vueComponent: {
                template: `
        <div :style="containerStyle">
          <sg-button v-show="showBtn" type="primary" circle outline icon="iconsortasc1" @click="handleToTop"></sg-button>
        </div>
      `,
                data() {
                    return {
                        containerStyle: {
                            position: 'fixed',
                            bottom: bottom + 'px',
                            right: '30px',
                            zIndex: 99
                        },
                        showBtn: false
                    }
                },
                mounted() {
                    targetDom.addEventListener('scroll', () => {
                        if (targetDom.scrollTop > 20) {
                            this.showBtn = true
                        } else {
                            this.showBtn = false
                        }
                    })
                },
                methods: {
                    handleToTop() {
                        targetDom.scrollTop = 0
                    }
                }
            },
            selector: document.getElementById('sinfo_backtopBtn')
        })
    }

    //回到顶部页面的按钮
    setBacktopBtn(document.querySelector('.scrollbarBox'))

    //常用方法属性
    {
        this.iBaseVersion = fdVersion;

        /**
         * 子表单对应对象
         */
        this.subFormMap = subFormMap;

        //
        // /**
        //  * 外部配置ID映射表
        //  */
        // this.configMap = configMap;
        //
        // /**
        //  * 字典映射对象
        //  */
        // this.dictMap = dictMap;
        //
        // /**
        //  * 其他属性
        //  */
        // this.otherParam = otherParam;
        //
        // /**
        //  *
        //  * 外部自定义 sqlMap { "表名":"全局sql的ID中的中文名"}
        //  */
        // this.sqlMap = sqlMap;


        /**
         * 固定常量名,常用的常量定义在这里 避免直接敲字母
         * @type {Map<String,Object>}
         */
        this.constant = {
            "RID": "RID",
            "JID": "JID",
            "SYS_PARENTID": "SYS_PARENTRID",
            "CONTENTTYPE": {
                "XFORM": "application/x-www-form-urlencoded",
                "JSON": "application/json",
                "MULTIFORM": "multipart/form-data"
            },
            "responseType": {
                "JSON": "json",
                "TEXT": "text",
                "BLOB": "blob"
            },
            "businessBtn": {
                "save": "save",
                "submit": "submit",
                "print": "print",
                "returned": "returned",
                "withdraw": "withdraw",
                "turn": "turn",
                "backsend": "backsend",
                "applySuspend": "applySuspend",
                "claim": "claim",
                "getdraw": "getdraw",
                "guidance": "guidance",
                "remind": "remind",
                "unclaim": "unclaim",
                "reject": "reject",
                "finish": "finish",
                "refund": "refund",
                "suspend": "suspend",
                "relieveSuspend": "relieveSuspend",
                "busrules": "busrules"
            }
        }


        /**
         * 主表 FormId
         * @type {string}
         * @deprecated
         * @example
         * 过时，请使用co.params.formId
         */
        this.domainFormId = $.F && $.F.getFormData() && $.F.getFormData().rid || "";

        //若没有指定表名，尝试获取第一个主表名
        let tableName = $.F.getFormData() && $.F.getFormData().boPrimayKey && $.F.getFormData().boPrimayKey.split(".")[0] || "";
        if (!domainTableName && tableName) {
            domainTableName = tableName;
        }
        if (!domainTableName) {
            domainTableName = JSON.parse($.F.getFormData().boRelateId)[0].aliasName;
        }

        /**
         * 主表表单名,为了多主表的情况，建议传入。
         * @type {string}
         * @deprecated
         * @example
         * 过时，请使用co.params.table
         */
        this.domainTableName = domainTableName ? domainTableName.toUpperCase() : "";


        /**
         * 当前主表（主表单）Jid
         * @type {string}
         * @deprecated
         * @example
         * 过时，请使用co.params.jid
         */
        this.domainJid = $.F.getBusinessno();


        /**
         * 更新定义的主表表单值
         * @param {shortFieldName} fieldName 字段名
         * @param {String} fieldValue 字段值
         * @param {Boolean=} [updateDbDirectory = false ]updateDbDirectory 是否直接写入数据库
         * @example
         * co.setDomainValue("ywbh","123")
         * co.setDomainValue("ywbh","123",true)
         */
        this.setDomainValue = function (fieldName, fieldValue, updateDbDirectory) {
            if (updateDbDirectory) {
                this.setValue(fieldName, fieldValue)
                this.setValue(fieldName, fieldValue, mainObj.constant.RID, mainObj.domainRid, updateDbDirectory)
            } else {
                this.setValue(fieldName, fieldValue)
            }
        }
        /**
         * 更新表单值(通用)
         * 注：字典用此方法时，设置的是保存在库中的那个值
         * @param {shortFieldName} updateField 更新值所在字段
         * @param {String} updateValue 更新值
         * @param {shortFieldName=} conditionName 条件值所在字段 默认RID
         * @param {String=} conditionValue 条件值  默认当前案件的RID
         * @param {Boolean=} updateDbDirectory 是否直接写入数据库 默认 false 需要后台接口支持 sinfoweb/co/update
         * @param {String=} tableName 更新的表 默认当前主域表
         * @param {String=} dsName 数据源 默认原数据源
         * @param {Boolean=} [silence=false] 静默查询，表单内不存在此字段时，不进行警告，直接返回空
         * @example
         * 更新主表值 等同于setDomainValue
         * co.setValue("ywbh","123")
         * 更新 proj_cghjb 表中rid=456的记录的值ywbh值为123
         * = update proj_cghjb set ywbh='123' where rid='456'
         * co.setValue("ywbh","123","rid","456",true,"proj_cghjb")
         */
        this.setValue = function (updateField, updateValue, conditionName, conditionValue, updateDbDirectory, tableName, dsName, silence) {
            return new Promise((resolve, reject) => {
                if (!conditionName) {
                    conditionName = mainObj.constant.RID;
                }
                if (!conditionValue) {
                    conditionValue = mainObj.params.rid;
                }
                if (conditionName === conditionValue) {
                    mainObj.Message.error_topRight("条件设置错误，禁止形如A=A类的条件");
                    return;
                }
                let fullFieldNameUpperCase = mainObj.domainTableName + "." + updateField.toUpperCase();
                let fullFieldNameOri = mainObj.domainTableName + "." + updateField;
                let fullFieldNameLowerCase = mainObj.domainTableName + "." + updateField.toLowerCase();

                //未指定表，默认为当前主域表
                if (!tableName || tableName.toUpperCase() === mainObj.params.table.toUpperCase()) {
                    tableName = mainObj.domainTableName;
                    if (document.getElementById(fullFieldNameUpperCase)) {
                        $.F.setFieldValue(fullFieldNameUpperCase, updateValue);
                    } else if (document.getElementById(fullFieldNameOri)) {
                        $.F.setFieldValue(fullFieldNameOri, updateValue);
                    } else if (document.getElementById(fullFieldNameLowerCase)) {
                        $.F.setFieldValue(fullFieldNameLowerCase, updateValue);
                    } else if (silence) {
                        console.log("表单中未能找到：" + sField + "字段！");
                    } else {
                        $.F.setFieldValue(fullFieldNameUpperCase, updateValue);
                    }
                }
                if (updateDbDirectory) {
                    {
                        let updateParam = {
                            "dsName": dsName,
                            "param": {
                                "tableName": tableName,
                                "updateField": updateField,
                                "updateValue": updateValue,
                                "condName": conditionName,
                                "condValue": conditionValue
                            }
                        }
                        let updatePromise = mainObj.Http.requestByBackend("/sinfoweb/co/update", updateParam, "hint", "PUT")
                        updatePromise.then(function (data) {
                            if ("998" === data.code) {
                                let desc = "字段更新异常！" + JSON.stringify(data)
                                console.log(desc);
                                reject(desc);
                            } else {
                                let desc = "字段更新成功！" + JSON.stringify(data)
                                console.log(desc);
                                resolve(desc);
                            }
                        });
                    }
                } else {
                    resolve("字段更新成功");
                }
            })
        }
        /**
         * 更新表单值(同步)
         * 注：字典用此方法时，设置的是保存在库中的那个值
         * @param {shortFieldName} updateField 更新值所在字段
         * @param {String} updateValue 更新值
         * @param {shortFieldName=} conditionName 条件值所在字段 默认RID
         * @param {String=} conditionValue 条件值  默认当前案件的RID
         * @param {Boolean=} updateDbDirectory 是否直接写入数据库 默认 false 需要后台接口支持 sinfoweb/co/update
         * @param {String=} tableName 更新的表 默认当前主域表
         * @param {String=} dsName 数据源 默认原数据源
         * @param {Boolean=} [silence=false] 静默查询，表单内不存在此字段时，不进行警告，直接返回空
         * @example
         * 更新主表值 等同于setDomainValue
         * co.setValue("ywbh","123")
         * 更新 proj_cghjb 表中rid=456的记录的值ywbh值为123
         * = update proj_cghjb set ywbh='123' where rid='456'
         * co.setValue("ywbh","123","rid","456",true,"proj_cghjb")
         */
        this.setValueSync = function (updateField, updateValue, conditionName, conditionValue, updateDbDirectory, tableName, dsName, silence) {
            if (!conditionName) {
                conditionName = mainObj.constant.RID;
            }
            if (!conditionValue) {
                conditionValue = mainObj.params.rid;
            }
            if (conditionName === conditionValue) {
                mainObj.Message.error_topRight("条件设置错误，禁止形如A=A类的条件");
                return;
            }
            let fullFieldNameUpperCase = mainObj.domainTableName + "." + updateField.toUpperCase();
            let fullFieldNameOri = mainObj.domainTableName + "." + updateField;
            let fullFieldNameLowerCase = mainObj.domainTableName + "." + updateField.toLowerCase();

            //未指定表，默认为当前主域表
            if (!tableName || tableName.toUpperCase() === mainObj.params.table.toUpperCase()) {
                tableName = mainObj.domainTableName;
                if (document.getElementById(fullFieldNameUpperCase)) {
                    $.F.setFieldValue(fullFieldNameUpperCase, updateValue);
                } else if (document.getElementById(fullFieldNameOri)) {
                    $.F.setFieldValue(fullFieldNameOri, updateValue);
                } else if (document.getElementById(fullFieldNameLowerCase)) {
                    $.F.setFieldValue(fullFieldNameLowerCase, updateValue);
                } else if (silence) {
                    console.log("表单中未能找到：" + sField + "字段！");
                } else {
                    $.F.setFieldValue(fullFieldNameUpperCase, updateValue);
                }
            }
            if (updateDbDirectory) {
                {
                    let updateParam = {
                        "dsName": dsName,
                        "param": {
                            "tableName": tableName,
                            "updateField": updateField,
                            "updateValue": updateValue,
                            "condName": conditionName,
                            "condValue": conditionValue
                        }
                    }
                    mainObj.Http.request({
                        url: "/sinfoweb/co/update",
                        data: updateParam,
                        method: "PUT",
                        async: false,
                        success: (ret) => {
                            if ("998" === ret.code) {
                                let desc = "字段更新异常！" + JSON.stringify(ret)
                                console.log(desc);
                            } else {
                                let desc = "字段更新成功！" + JSON.stringify(ret)
                                console.log(desc);
                            }
                        },
                        error: (ret) => {
                        }
                    })
                }
            }
        }


        /**
         * 更新表单值(多值)(通用)
         * @param {Object<shortFieldName,String>} updateItems 更新字段及值
         * @param {shortFieldName=} conditionName 条件值所在字段 默认RID
         * @param {String=} conditionValue 条件值  默认当前案件的RID
         * @param {Boolean=} updateDbDirectory 是否直接写入数据库 默认 false 需要后台接口支持 sinfoweb/co/update
         * @param {String=} tableName 更新的表 默认当前主域表
         * @param {String=} dsName 数据源 默认原数据源
         * @param {Boolean=} [silence=false] 静默查询，表单内不存在此字段时，不进行警告，直接返回空
         * @example
         * //仅更新当前表单
         * co.setValueMulti({"xmdd":"123","xmdd2":"335"})
         * //后台指定表单更新
         * co.setValueMulti(
         * {"xmdd":"123","xmdd2":"335"},
         * co.constant.RID,
         * co.params.rid,
         * true,
         * co.params.table
         * )
         */
        this.setValueMulti = function (updateItems, conditionName, conditionValue, updateDbDirectory, tableName, dsName, silence) {
            return new Promise((resolve, reject) => {
                if (!conditionName) {
                    conditionName = mainObj.constant.RID;
                }
                if (!conditionValue) {
                    conditionValue = mainObj.params.rid;
                }
                if (conditionName === conditionValue) {
                    mainObj.Message.error_topRight("条件设置错误，禁止形如A=A类的条件");
                    return;
                }
                for (let updateItem in updateItems) {
                    const updateField = updateItem;
                    const updateValue = updateItems[updateField];
                    let fullFieldNameUpperCase = mainObj.domainTableName + "." + updateField.toUpperCase();
                    let fullFieldNameOri = mainObj.domainTableName + "." + updateField;
                    let fullFieldNameLowerCase = mainObj.domainTableName + "." + updateField.toLowerCase();
                    //未指定表，或者为默认为当前主域表,直接更新表单字段值
                    if (!tableName || tableName.toUpperCase() === mainObj.params.table.toUpperCase()) {
                        tableName = mainObj.params.table;
                        if (document.getElementById(fullFieldNameUpperCase)) {
                            $.F.setFieldValue(fullFieldNameUpperCase, updateValue);
                        } else if (document.getElementById(fullFieldNameOri)) {
                            $.F.setFieldValue(fullFieldNameOri, updateValue);
                        } else if (document.getElementById(fullFieldNameLowerCase)) {
                            $.F.setFieldValue(fullFieldNameLowerCase, updateValue);
                        } else if (silence) {
                            console.log("表单中未能找到：" + sField + "字段！");
                        } else {
                            $.F.setFieldValue(fullFieldNameUpperCase, updateValue);
                        }
                    }
                }
                //直接写库的话
                if (updateDbDirectory) {
                    {
                        let updateParam = {
                            "dsName": dsName,
                            "param": {
                                "tableName": tableName,
                                "updateItems": updateItems,
                                "condName": conditionName,
                                "condValue": conditionValue,
                                "multiValue": "true"
                            }
                        }
                        let updatePromise = mainObj.Http.requestByBackend("/sinfoweb/co/update", updateParam, "hint", "PUT")
                        updatePromise.then(function (data) {
                            if ("998" === data.code) {
                                let desc = "字段更新异常！" + JSON.stringify(data)
                                console.log(desc);
                                reject(desc);
                            } else {
                                let desc = "字段更新成功！" + JSON.stringify(data)
                                console.log(desc);
                                resolve(desc);
                            }
                        });
                    }
                } else {
                    resolve("字段更新成功");
                }
            })
        }
        /**
         * 更新表单值(多值)(同步)
         * @param {Object<shortFieldName,String>} updateItems 更新字段及值
         * @param {shortFieldName=} conditionName 条件值所在字段 默认RID
         * @param {String=} conditionValue 条件值  默认当前案件的RID
         * @param {Boolean=} updateDbDirectory 是否直接写入数据库 默认 false 需要后台接口支持 sinfoweb/co/update
         * @param {String=} tableName 更新的表 默认当前主域表
         * @param {String=} dsName 数据源 默认原数据源
         * @param {Boolean=} [silence=false] 静默查询，表单内不存在此字段时，不进行警告，直接返回空
         * @example
         * //仅更新当前表单
         * co.setValueMulti({"xmdd":"123","xmdd2":"335"})
         * //后台指定表单更新
         * co.setValueMulti(
         * {"xmdd":"123","xmdd2":"335"},
         * co.constant.RID,
         * co.params.rid,
         * true,
         * co.params.table
         * )
         */
        this.setValueMultiSync = function (updateItems, conditionName, conditionValue, updateDbDirectory, tableName, dsName, silence) {
            if (!conditionName) {
                conditionName = mainObj.constant.RID;
            }
            if (!conditionValue) {
                conditionValue = mainObj.params.rid;
            }
            if (conditionName === conditionValue) {
                mainObj.Message.error_topRight("条件设置错误，禁止形如A=A类的条件");
                return;
            }
            for (let updateItem in updateItems) {
                const updateField = updateItem;
                const updateValue = updateItems[updateField];
                let fullFieldNameUpperCase = mainObj.domainTableName + "." + updateField.toUpperCase();
                let fullFieldNameOri = mainObj.domainTableName + "." + updateField;
                let fullFieldNameLowerCase = mainObj.domainTableName + "." + updateField.toLowerCase();
                //未指定表，或者为默认为当前主域表,直接更新表单字段值
                if (!tableName || tableName.toUpperCase() === mainObj.params.table.toUpperCase()) {
                    tableName = mainObj.params.table;
                    if (document.getElementById(fullFieldNameUpperCase)) {
                        $.F.setFieldValue(fullFieldNameUpperCase, updateValue);
                    } else if (document.getElementById(fullFieldNameOri)) {
                        $.F.setFieldValue(fullFieldNameOri, updateValue);
                    } else if (document.getElementById(fullFieldNameLowerCase)) {
                        $.F.setFieldValue(fullFieldNameLowerCase, updateValue);
                    } else if (silence) {
                        console.log("表单中未能找到：" + sField + "字段！");
                    } else {
                        $.F.setFieldValue(fullFieldNameUpperCase, updateValue);
                    }
                }
            }
            //直接写库的话
            if (updateDbDirectory) {
                {
                    let updateParam = {
                        "dsName": dsName,
                        "param": {
                            "tableName": tableName,
                            "updateItems": updateItems,
                            "condName": conditionName,
                            "condValue": conditionValue,
                            "multiValue": "true"
                        }
                    }

                    mainObj.Http.request({
                        url: "/sinfoweb/co/update",
                        data: updateParam,
                        method: "PUT",
                        async: false,
                        success: (ret) => {
                            if ("998" === ret.code) {
                                let desc = "字段更新异常！" + JSON.stringify(ret)
                                console.log(desc);
                            } else {
                                let desc = "字段更新成功！" + JSON.stringify(ret)
                                console.log(desc);
                            }
                        },
                        error: (ret) => {
                        }
                    })
                }
            }
        }

        /**
         * 注意 行内编辑模式专用
         * 更新子表单(指定行)，注意实际是未保存的,需要子表单保存按钮
         * 3.3.1以上版本支持
         * @param {String} oSubFormLinkId 子表单唯一ID
         * @param {longFieldName} subformKey   子表单key XXX.YYYY
         * @param {String} subformValue 子表单值
         * @param {Number} rowIndex 注 0行起始
         * @example
         * co.setRowEditValue("FA2B71756262ADF0EEA9","PROJ_SYSBQD.SBMC","123",0);
         */
        this.setRowEditValue = function (oSubFormLinkId, subformKey, subformValue, rowIndex) {
            mainObj.Subform.setRowEditValue(oSubFormLinkId, subformKey, subformValue, rowIndex)
        }
        /**
         * 注意 行内编辑模式专用
         * 获取子表单(指定行)的值
         * 3.3.1以上版本支持
         * @param {String} oSubFormLinkId 子表单唯一ID
         * @param {longFieldName} subformKey   子表单key XXX.YYYY
         * @param {Number} rowIndex 注 0行起始
         * @example
         * co.getRowEditValue(co.subFormMap.rwfpSubForm.link, co.subFormMap.rwfpSubForm.table + ".CLSX");
         */
        this.getRowEditValue = function (oSubFormLinkId, subformKey, rowIndex) {
            return mainObj.Subform.getRowEditValue(oSubFormLinkId, subformKey, rowIndex)
        }


        /**
         * 查询表单值(通用) 注意 默认仅返回第一条记录对应值
         * @param {shortFieldName} sField 查询的字段 若从db查询时可以多个字段,用,隔开,此时返回一个对象。
         * @param {String=} sRdbTable 数据表名 默认当前主域
         * @param {shortFieldName=} condName  查询条件字段 默认为字段RID
         * @param {String=} condValue 查询条件值 默认主域RID
         * @param {boolean=} queryDirectoryFromDb 是否从db直接查询 true=是
         * @param {boolean=} fuzzy 开启模糊查询，从db查询时才生效
         * @param {String=} dsName 数据源
         * @param {Boolean=} [silence=false] 静默查询，表单内不存在此字段时，不进行警告，直接返回空
         * @returns {Object}
         * @example
         * 获取主表值 等同于getDomainValue
         * co.getValue("ywbh")
         * 获取 proj_cghjb 表中rid=456的记录的ywbh字段值
         * = select ywbh from  proj_cghjb where rid='456'
         * co.getValue("ywbh","proj_cghjb","rid","456",true)
         * 开启模糊查询
         * = select ywbh from  proj_cghjb where rid like '%456%'
         * co.getValue("ywbh","proj_cghjb","rid","456",true,true)
         */
        this.getValue = function (sField, sRdbTable, condName, condValue, queryDirectoryFromDb, fuzzy, dsName, silence) {
            let dataList = mainObj.getList(sField, sRdbTable, condName, condValue, queryDirectoryFromDb, fuzzy, dsName, silence);
            //多字段获取时返回对象
            if (dataList.length > 0) {
                if (sField.indexOf(",") > -1) {
                    return dataList[0];
                } else {
                    return dataList[0][sField];
                }
            } else {
                return "";
            }
        }


        /**
         * 查询表单值(通用) 注意 返回的是List<Object>
         * @param {shortFieldName} sField 查询的字段 若从db查询时可以多个字段,用,隔开,此时返回一个对象。
         * @param {String=} sRdbTable 数据表名 默认当前主域
         * @param {shortFieldName=} condName  查询条件字段 默认为字段RID
         * @param {String=} condValue 查询条件值 默认主域RID
         * @param {boolean=} queryDirectoryFromDb 是否从db直接查询 true=是
         * @param {boolean=} fuzzy 开启模糊查询，从db查询时才生效
         * @param {String=} dsName 数据源
         * @param {Boolean=} [silence=false] 静默查询，表单内不存在此字段时，不进行警告，直接返回空
         * @returns {Object}
         * @example
         * 获取主表值  注意返回值格式为：List<Object<String,String>>
         * co.getValue("ywbh")
         * 获取 getList 表中rid=456的记录的ywbh字段值
         * = select ywbh from  proj_cghjb where rid='456'
         * co.getList("ywbh","proj_cghjb","rid","456",true)
         * 开启模糊查询
         * = select ywbh from  proj_cghjb where rid like '%456%'
         * co.getList("ywbh","proj_cghjb","rid","456",true,true)
         */
        this.getList = function (sField, sRdbTable, condName, condValue, queryDirectoryFromDb, fuzzy, dsName, silence) {
            let fullFieldNameUpperCase = mainObj.domainTableName + "." + sField.toUpperCase();
            let fullFieldNameOri = mainObj.domainTableName + "." + sField;
            let fullFieldNameLowerCase = mainObj.domainTableName + "." + sField.toLowerCase();
            if (!dsName) {
                dsName = "";
            }
            if (!sRdbTable) {
                if (!queryDirectoryFromDb) {
                    let sResult = "";
                    if (document.getElementById(fullFieldNameUpperCase)) {
                        sResult = $.F.getFieldValue(fullFieldNameUpperCase);
                    } else if (document.getElementById(fullFieldNameOri)) {
                        sResult = $.F.getFieldValue(fullFieldNameOri);
                    } else if (document.getElementById(fullFieldNameLowerCase)) {
                        sResult = $.F.getFieldValue(fullFieldNameLowerCase);
                    } else if (silence) {
                        console.log("表单中未能找到：" + sField + "字段！");
                        sResult = "";
                    } else {
                        //默认找大写
                        sResult = $.F.getFieldValue(fullFieldNameUpperCase);
                    }
                    let oResult = {};
                    oResult[sField] = sResult;
                    return [oResult];
                } else {
                    sRdbTable = this.domainTableName;
                }
            }
            if (queryDirectoryFromDb) {
                let queryParam = {
                    "tableName": sRdbTable,
                    "fields": sField,
                    "condName": condName,
                    "fuzzy": fuzzy ? "true" : "false",
                    "condValue": condValue
                }
                let url = "/sinfoweb/co/query?param=" + encodeURI(JSON.stringify(queryParam)) + "&dsName=" + dsName
                let result = mainObj.Http.requestByBackend(url, {}, "", "GET", "", "", "", "", "", true)
                if (result && result.code === 0 && result.data && result.data.code === 0) {
                    let oriResult = JSON.parse(result.data.data);
                    if (oriResult.data.length > 0) {
                        return oriResult.data;
                    } else {
                        //silence参数暂不影响直接后台查询。
                        console.log("未查询到值");
                        return [];
                    }
                }
            }
        }


        /**
         * 前端直接请求(get)demo 开发参考demo 原方法为getValue
         * @param {String} sField
         * @param sRdbTable
         * @param condName
         * @param condValue
         * @param fuzzy
         * @param dsName
         * @param queryDirectoryFromDb
         * @returns {string|*}
         */
        function demo_getValueDirectory(sField, sRdbTable, condName, condValue, fuzzy, dsName, queryDirectoryFromDb) {
            if (!dsName) {
                dsName = "";
            }
            if (!sRdbTable) {
                if (!queryDirectoryFromDb) {
                    return $.F.getFieldValue(mainObj.domainTableName + "." + sField.toUpperCase());
                } else {
                    sRdbTable = mainObj.domainTableName;
                }
            }
            if (queryDirectoryFromDb) {
                let queryParam = {
                    "tableName": sRdbTable,
                    "fields": sField,
                    "condName": condName,
                    "fuzzy": fuzzy,
                    "condValue": condValue
                }
                let url = "/sinfoweb/co/query?param=" + encodeURI(JSON.stringify(queryParam)) + "&dsName=" + dsName
                let result = mainObj.Http.requestByDirectory(url, {}, "hint", "GET", "", "", "", "", "", true)
                if (result && result.code === 0 && result.data && result.data.code === 0) {
                    let oriResult = JSON.parse(result.data.data);
                    if (oriResult.data.length > 0) {
                        return oriResult.data[0][sField];
                    } else {
                        return "";
                    }
                }
            }
        }

        /**
         * 前端直接请求(post)demo  开发参考demo 原方法为setValue
         * @param {String} updateField
         * @param {String} updateValue
         * @param {String} conditionName
         * @param {String} conditionValue
         * @param {Boolean} updateDbDirectory
         * @param {String} tableName
         * @param {String} dsName
         */
        function demo_setValueDirectory(updateField, updateValue, conditionName, conditionValue, updateDbDirectory, tableName, dsName) {
            //未指定表，默认为当前主域表
            if (!tableName) {
                tableName = mainObj.domainTableName;
                $.F.setFieldValue(tableName + "." + updateField.toUpperCase(), updateValue);
            }
            if (updateDbDirectory) {
                {
                    let updateParam = {
                        "dsName": dsName,
                        "param": {
                            "tableName": tableName,
                            "updateField": updateField,
                            "updateValue": updateValue,
                            "condName": conditionName,
                            "condValue": conditionValue
                        }
                    }
                    let updatePromise = mainObj.Http.requestByDirectory("/sinfoweb/co/update", updateParam, "hint", "PUT")
                    updatePromise.then(function (data) {
                        if ("998" === data.code) {
                            console.log("字段更新异常！" + JSON.stringify(data))
                        } else {
                            console.log("字段更新成功！" + JSON.stringify(data));
                        }
                    });
                }
            }
        }


        /**
         * 当前主域（主表单）Rid
         * @type {string}
         * @deprecated
         * @example
         * 过时，请使用co.params.rid
         */
        this.domainRid = $.F.getFormData() && $.F.getFormData().values && $.F.getFormData().values[domainTableName + ".RID"] ? $.F.getFormData().values[domainTableName + ".RID"] : "";


        /**
         *  组装子表信息  运行时才可用
         */
        {
            /**
             *  内部方法，自动装填子表信息(子表持有的可用菜单栏控件Id)
             */
            function linkSubFormBtn() {
                let opts = document.getElementsByClassName("opt");
                for (let opt of opts) {
                    linkSubFormIdByBtn(opt);
                }
            }

            function linkSubFormIdByBtn(opt) {
                let count = opt.childElementCount
                let subBtn = {};
                for (let c = 0; c < count; c++) {
                    subBtn[opt.children[c].innerText] = opt.children[c].id;
                }
                let subFormId = "";
                for (let i = 0; i < 100; i++) {
                    opt = opt.parentNode;
                    if (opt && opt.id) {
                        subFormId = opt.id;
                        break;
                    }
                }
                if (subFormId) {
                    for (let x in subFormMap) {
                        if (subFormMap[x] && subFormMap[x].linkId === subFormId) {
                            subFormMap[x][subBtn] = subBtn;
                        }
                    }
                }
            }

            //自动装填子表信息(子表持有的可用菜单栏控件Id)
            linkSubFormBtn();

            /**
             *  内部方法，自动装填子表信息(父id信息)
             */
            function linkSubForm_SysParentId() {
                for (let x in subFormMap) {
                    if (mainObj.domainRid && subFormMap[x].link) {
                        subFormMap[x]["sys_parentId"] = mainObj.domainRid + "::" + subFormMap[x].link;
                    }
                }
            }

            //组装父关联Id
            linkSubForm_SysParentId()

        }

        /**
         * 当前任务Id
         * @type {String}
         * @deprecated
         * @example
         * 过时，请使用co.params.taskId
         */
        this.domainTaskId = $.W.getCurrentTaskId();

        /**
         * 当前业务所经历的所有环节信息
         * @type {Object}
         * @deprecated
         * @example
         * 过时，请使用 co.params.taskInfoFull
         */
        // this.domainWholeTaskInfo = mainObj.domainJid ? $.W.getTask() : [];
        //兼容3.5.1以上的版本
        this.domainWholeTaskInfo = fdVersion.indexOf("3.5.") >= 0 ? [] : (mainObj.domainJid ? $.W.getTask() : []);
        /**
         * 当前任务信息
         * @type {taskInfo}
         * @deprecated
         * @example
         * 过时，请使用co.params.taskInfo
         */
        // this.domainTaskInfo = (this.domainTaskId && this.domainWholeTaskInfo && this.domainWholeTaskInfo.find(p => p.id === this.domainTaskId)) || {};
        // this.domainTaskInfo = $.W.getTask() || {};
        //兼容3.5.1以上的版本
        this.domainTaskInfo = fdVersion.indexOf("3.5.") >= 0 ? ($.W.getTask() || {}) : ((this.domainTaskId && this.domainWholeTaskInfo && this.domainWholeTaskInfo.find(p => p.id === this.domainTaskId)) || {});

        if(this.domainTaskInfo && !this.domainTaskInfo.taskDefinitionKey && this.domainTaskInfo.linkDefinitionKey){
            this.domainTaskInfo.taskDefinitionKey = this.domainTaskInfo.linkDefinitionKey;
        }

        /**
         * 查询表单值(主表)
         * @param {shortFieldName} sField 查询的字段 若从db查询时可以多个字段,用,隔开
         * @param {Boolean=} queryDirectoryFromDb 是否从db直接查询 true=是
         * @param {Boolean=} [silence=false] 静默查询，表单内不存在此字段时，不进行警告，直接返回空
         * @returns {String}
         * @example
         * co.getDomainValue("ywbh")
         * co.getDomainValue("ywbh",true)
         */
        this.getDomainValue = function (sField, queryDirectoryFromDb, silence) {
            if (!queryDirectoryFromDb) {
                return this.getValue(sField, "", "", "", false, false, "", silence);
            } else {
                return this.getValue(sField, this.domainTableName, this.constant.RID, this.domainRid, true, false, false);
            }
        }

        /**
         * commonObject的属性
         * @type {coParams}
         * @example
         * co.params.rid
         */
        this.params = {
            "formId": mainObj.domainFormId,
            "jid": mainObj.domainJid,
            "rid": mainObj.domainRid,
            "sysParentId": mainObj.getDomainValue("sys_parentId", false, true),
            "table": mainObj.domainTableName,
            "taskId": mainObj.domainTaskId,
            "token": $.getToken ? $.getToken() ? JSON.parse($.getToken()).access_token : "" : "",
            "taskInfo": mainObj.domainTaskInfo,
            "taskInfoFull": mainObj.domainWholeTaskInfo
        }

        /**
         * 获取字典字段展示文本
         * @param {shortFieldName} dictFieldName 字典字段名
         * @returns {String}
         * @example
         * co.getDicText("sex")
         */
        this.getDicText = function (dictFieldName) {
            return $.F.getFieldDicText(mainObj.domainTableName + "." + dictFieldName.toUpperCase());
        }

        /**
         * 获取行政区域中文
         * @param {shortFieldName} fieldName 字典字段名
         * @param {boolean=}isAll 是否返回所有数据（本身，包括上级的数组）默认false
         * @example
         * co.getAzoneText("XZQ")
         */
        this.getAzoneText = function (fieldName, isAll) {
            let curValue = mainObj.getValue(fieldName);
            if (curValue) {
                let allAzone = $.X(curValue);
                if (isAll) {
                    return allAzone;
                } else {
                    if (allAzone.length > 0) {
                        let curAzone = allAzone[allAzone.length - 1];
                        if (curAzone.F.indexOf("代码-") === -1) {
                            curValue = curAzone.F;
                        }
                    }
                }
            }
            return curValue;
        }
    }

    //内部对象
    {
        this.Flow = new Flow();
        this.Form = new Form();
        this.Subform = new Subform();
        this.File = new File();
        this.DataDisplay = new DataDisplay();
        this.Sql = new Sql();
        this.Random = new Random();
        this.Config = new Config();
        this.Sign = new Sign();
        this.Ftp = new Ftp();
        this.Http = new Http();
        this.Message = new Message();
        this.User = new User();
        this.Dict = new Dict();
        this.Ctrl = new Ctrl();
        this.PageTab = new PageTab();
        this.Msg = new Msg();
        this.Progress = new Progress();
        this.Local = new Local();
        this.Dialog = new Dialog();
        this.DateUtil = new DateUtil();
        this.Dom = new Dom();
        this.Regex = new Regex();
        this.Toolbox = new Toolbox();
        this.Azone = new Azone();
    }

    /**
     * @class
     * @classdesc  业务流相关操作
     */
    function Flow() {

        /**
         * 当前任务Id
         * @type {String}
         * @example
         * co.Flow.currTaskId()
         */
        this.currTaskId = mainObj.domainTaskId;

        /**
         * 当前环节任务信息
         * @type {taskInfo}
         * @example
         * co.Flow.currTaskInfo()
         */
        this.currTaskInfo = mainObj.domainTaskInfo;


        /**
         * 截止至当前，经历过的所有环节任务的信息
         * @type {Array<taskInfo>}
         * @example
         * co.Flow.allTaskInfoAsOfCurrTask();
         */
        this.allTaskInfoAsOfCurrTask = this.currTaskId ? mainObj.params.taskInfoFull : [];

        /**
         * 创建业务流
         * @param {String} businessDefCode 业务代码
         * @param {Map<longFieldName,fieldValue>} formData 创建业务时JSON值 如：PROJ_HTBAZB.SFXXJS let formData={"PROJ_HTBAZB.SFXXJS": "测试值"};
         * @param {sucCallback} successCallback 成果回调
         * @param {errCallback} failCallback 失败回调
         * @example
         *  let defCode = "CHCGHJ";
         *  let formData = {
         *                 "PROJ_CGHJB.GCMC": co.getValue("GCMC"),
         *                 "PROJ_CGHJB.GCBH": co.getValue("GCBH"),
         *                 "PROJ_CGHJB.XZQ": co.getValue("XZQ")
         *             };
         *  co.Flow.create(defCode, formData, createCghjSuccess, createCghjFail);
         */
        this.create = function (businessDefCode, formData, successCallback, failCallback) {
            try {
                $.F.createForm({
                    businessDefCode: businessDefCode,
                    successCb: createCallBack,
                    formData: formData,
                });

                function createCallBack(data) {
                    formData["taskId"] = data.taskId;
                    formData["jid"] = data.jid;
                    $.ajax({
                        url: "/flowengine/system/saveTaskData",
                        type: "POST",
                        async: false,
                        data: formData,
                        success: function (dataSave) {
                            if (successCallback)
                                successCallback(data);
                        },
                        error: function (dataErr) {
                            if (failCallback)
                                failCallback(dataErr);

                        }
                    });
                }
            } catch (e) {
                if (failCallback)
                    failCallback(e);
            }
        }
        /**
         * 创建新的流程并打开（不保存生成数据）
         * @param {String} businessDefCode 业务代码
         * @param {Map<shortFieldName,fieldValue>} formData  注意 这部分不需要主表单前缀的样子，请参考示例
         * @param {String} title 标题
         * @example
         *      let formData = {
         *         "TDZSZT": "1"
         *          };
         *      co.Flow.createOpenNotSave("LZXMLX", formData);
         */
        this.createOpenNotSave = function (businessDefCode, formData, title) {
            let pageUrl = '/formdesigner-web/generateForm.html?businessDefCode=' + businessDefCode;
            if (formData) {
                pageUrl += '&formDataStr=' + JSON.stringify(formData)
            }
            window.parent.addTab({
                pageUrl: pageUrl,
                name: title ? title : '业务标题',
                moduleId: Date.now()
            })
        }

        /**
         * 打开指定业务流
         * 未传入tableName时 默认传入了Jid,否则传入了rid
         * @param {String} ridOrJid 传入rid时，需要配合table名 jid则不用
         * @param {String=} tableName 传入rid时，需要配合table名 jid则不用
         * @example
         * 1)需要rid+table名
         * let rid = "123";
         * let table = "proj_cghjb"
         * co.Flow.open(rid,table);
         *
         * 2)仅需jid
         * let jid = "123";
         * co.Flow.open(jid);
         */
        this.open = function (ridOrJid, tableName) {
            let jid = "";
            if (tableName) {
                jid = mainObj.getValue("jid", tableName, "rid", ridOrJid, true);
            } else {
                jid = ridOrJid;
            }
            if (!jid) {
                mainObj.Message.warning_topRight("未找到业务流数据，无法打开");
                return;
            }
            let oFlowInfo = mainObj.Sql.execSql("通过JID查询当前最新任务状态", {"jid": jid});
            if (oFlowInfo) {
                let data = oFlowInfo.sql1[0];
                let taskId = data.TASKID ? data.TASKID : data.taskid;
                if (fdVersion.indexOf("3.5.") >= 0) {
                    //3.5.1 版本已归档不能直接用taskId=null打开，不然会导致按钮无法使用，改为使用最后一个环节的taskId打开
                    if (!data.TASKID) {
                        let oHiFlowInfoArr = mainObj.Sql.execSql("通过JID查询当前流程流转历史", {"jid": jid});
                        if (oHiFlowInfoArr && oHiFlowInfoArr.sql1 && oHiFlowInfoArr.sql1.length > 0) {
                            taskId = oHiFlowInfoArr.sql1[0]["TASKID"];
                        }
                    }
                }
                $.F.openForm({
                    "title": "正在打开...",
                    "jid": data.JID ? data.JID : data.jid,
                    "processInstanceId": data.PROCESSINSTANCEID ? data.PROCESSINSTANCEID : data.processinstanceid,
                    "taskId": taskId
                })
            }
        }


        /**
         * 提交准备完成
         * 用于特定环节'准备提交'时的最后确认代码
         * @example
         * if(pass){
         *     co.Flow.readySubmitComplete()
         * }
         */
        this.readySubmitComplete = function () {
            readySubmitComplete();
        }

        /**
         * 将案件转为"紧急"案件 待办列表中记录将会展示指定颜色
         *  @param {Array<String>} jidList jid 列表
         *  @param {String=} state 默认紧急 可传入空，清除此状态
         * @example
         * if(pass){
         *     co.Flow.readySubmitComplete()
         * }
         */
        this.makeUrgent = function (jidList, state) {
            if (state === "" || state) {

            } else {
                state = "紧急";
            }
            let jidList_ = [];
            if (jidList.length > 0) {
                for (let m = 0; m < jidList.length; m++) {
                    jidList_.push({"JOB_BASE.JID": jidList[m]});
                }
            }

            let data = {
                "conditionJson":
                    JSON.stringify(jidList_),
                "updateDataJson":
                    JSON.stringify({"processinstanceentity.processinstancestate": state})
            }
            //转加急逻辑
            let formData = new FormData();
            for (let key in data) {
                formData.set(key, data[key]);
            }
            mainObj.Http.request({
                url: "/flowengine/form/updateDataBaseByCondition",
                data: formData,
                responseType: co.constant.responseType.TEXT,
                contentType: co.constant.CONTENTTYPE.XFORM,
                success: (res) => {
                    co.Message.success_middle("成功！");
                    //
                }
            })
        }


        /**
         * 本案件环节回滚/打回到特定环节（环节名或者环节id，有一个即可）
         * 设计是用于已归档的案件回滚
         * @param {String=} sRollBackToStepTile 环节名
         * @param {String=} sRollBackToStepCode 环节Id 与环节名二选其一即可
         * @param {sucCallback} fSuccessCallback 成功回调
         * @param {errCallback} fFailCallback 失败回调
         * @example
         * 1)按环节名打回
         *     co.Flow.rollback(
         *         "成果上传",
         *         "",
         *         sucCallback,
         *         errCallback
         *     )
         * 2)按环节id打回
         *     co.Flow.rollback(
         *         "",
         *         "e6rtklkkg8fy",
         *         sucCallback,
         *         errCallback
         *     )
         */
        this.rollback = function (sRollBackToStepTile, sRollBackToStepCode, fSuccessCallback, fFailCallback) {
            let aTask = mainObj.params.taskInfoFull;
            for (let oTask of aTask) {
                if (oTask.linkDefinitionName === sRollBackToStepTile || oTask.taskDefinitionKey === sRollBackToStepCode) {
                    $.ajax({
                        url: "/flowengine/restore/restoreByLinkKey?processInstanceId=" + oTask.processInstanceId + "&linkKey=" + oTask.taskDefinitionKey + "",
                        contentType: 'application/json',
                        charset: 'utf-8',
                        type: 'get',
                        async: false,
                        success: function (data) {
                            console.log("退回到环节操作完毕," + "返回：" + data);
                            if (fSuccessCallback) {
                                fSuccessCallback(data);
                            }
                        },
                        error: function (data) {
                            console.log("退回到环节操作失败," + "返回：" + data);
                            if (fFailCallback) {
                                fFailCallback(data);
                            }
                        }
                    })
                    break;
                }
            }
        }


        /** 查询流程是否已归档
         * @param {String=} jidOrRid jid 或者rid 不传默认当前文档业务流
         * @param {String=} table 当传入的是rid时， 需要传入table
         * @return {boolean} 已归档返回true
         * @example
         * 当前文档是否是归档状态
         * let isArchived =  co.Flow.isArchived()
         * 其他文档是否是归档状态(已知jid)
         * let isArchived =  co.Flow.isArchived(jid)
         * 其他文档是否是归档状态(已知rid+table)
         * let isArchived =  co.Flow.isArchived(rid,table)
         */
        this.isArchived = function (jidOrRid, table) {
            let jid = jidOrRid;
            if (!jid) {
                //默认本文档
                jid = mainObj.domainJid;
            } else if (jid && table) {
                //都有参数则是rid+table的组合
                jid = mainObj.getValue("jid", table, "rid", jid, true)
            }
            if (!jid) {
                //非流程，默认归档
                return true;
            }

            /**
             * datastate。
             * 取值：-2临时数据（随流程自动创建的用户还未保存过），
             * -1无效业务（草稿数据）即不需要查询统计的业务，
             * 0数据未批准，
             * 1数据生效，
             * 9数据已归档，
             * 10退件，
             * 11删除
             */
            return 9 === mainObj.getValue("datastate", "job_base", "jid", jid, true);
        }
    }

    /**
     * @class
     * @classdesc  表单相关操作
     */
    function Form() {


        /**
         * 判断当前表单是否是新建的表单
         * @returns {boolean}
         * @example
         * let bNewForm = co.Form.isNewForm();
         */
        this.isNewForm = function () {
            let rid = mainObj.getDomainValue("rid", true);
            if (rid) {
                return false;
            } else {
                return true;
            }
        }

        /**
         * 创建表单（非子表单）
         * 以后台的形式新增表单,默认保存，一般用于后台、被动场景使用
         * @param {String} formId 表单id
         * @param {Map<longFieldName,fieldValue>} formData 表单键值对 {"PROJ_HTBAZB.SFXXJS": "测试值"};
         * @param {sucCallback=} successCallback 成功回调
         * @param {boolean=} bOpenAfterCreate 创建完毕后是否直接跳转 注意 会覆盖回调方法
         * @param {errCallback} failCallback 失败回调 暂未生效
         * @example
         *     let initFormData = {
         *         "PROJ_CGHJB.ABC":"ABC",
         *         "PROJ_CGHJB.DEF":"DEF"
         *     }
         *     co.Form.create(PROJ_CGHJB.formId, initFormData, "", true);
         */
        this.create = function (formId, formData, successCallback, bOpenAfterCreate, failCallback) {
            if (bOpenAfterCreate) {
                successCallback = toForm;
            }
            $.F.createForm({"formId": formId, "successCb": successCallback, "formData": formData})


            //创建后，进行打开表单
            function toForm(data) {
                let values = data.values;
                for (let x in values) {
                    if (x.indexOf(".RID") > -1) {
                        $.F.openForm({"formId": formId, "rid": values[x], "title": "新建_标题名称", "type": 6})
                    }
                }
            }
        }

        /**
         * 以新增tab的形式新增表单,默认不会进行保存，一般用于前台、主动按钮使用
         * @param {String} formId 表单Id
         * @param {Object<longFieldName,String>}formData 初始化数据
         * @param {Object<String,String>} params 含formId,parentRid 不明用途 或许是创建子表单用吗？
         * @param {String} title 标题
         * @param {Number}[type=6] 不明参数
         * @param {Boolean} saveAfterCloseCurrTab 是否保存后关闭该tab
         */
        this.createByTabWithoutSaving = function (formId, formData, title, params, type, saveAfterCloseCurrTab) {
            if (!type) {
                type = 6;
            }
            $.F.openForm({
                formId: formId,
                params: params,
                type: type,
                formDataStr: formData,
                title: title,
                saveAfterCloseCurrTab: saveAfterCloseCurrTab === true
            })
        }

        /**
         * 以新增tab的形式新增表单,默认不会进行保存，一般用于前台、主动按钮使用
         * @param {String} formId 表单Id
         * @param {Object<longFieldName,String>} formData 初始化数据
         * @param {String} title 标题
         * @param {Boolean} closeAfterSaved 保存后关闭页面 (暂无效参数)
         * @param {Object<String,String>} params 含formId,parentRid 不明用途 或许是创建子表单用吗？
         * @param {Number}[type=6] 不明参数 默认6
         * @param {String} [width="75%"] 宽度
         */
        this.createByPopUpWithoutSaving = function (formId, formData, title, closeAfterSaved, params, type, width) {
            let url = "/formdesigner-web/generateForm.html?"
            if (!formId) {
                console.log("formId为空无法创建");
                return;
            }
            url += "formId=" + formId
            if (params) {
                let paramsStr = JSON.stringify(params)
                url += "&params=" + paramsStr
            }
            if (formData) {
                let formDataStr = JSON.stringify(formData)
                url += "&formDataStr=" + formDataStr
            }
            $.showdialog({
                url: url,
                title: title,
                submitFun: function () {
                    // 确定、保存表单后关闭弹窗
                    if (closeAfterSaved) {
                        //TODO 了解该参数怎么生效
                    }
                    return document.querySelector('#ifrm7811q').contentWindow.$saveNoProcessFormData()

                },
                width: width ? width : "75%"
            })
        }


        /**
         * 打开表单(默认tab)
         * @param {String} formId 表单id
         * @param {String} rid 表单rid
         * @param {String} title 表单标题
         * @param {Number} type 打开类型 6是有按钮，5是没按钮
         * @param {Object} urlParams 打开的时候地址传参，JSON对象,
         * urlParams在表单的取值方法：
         * const SearchQuery = new URLSearchParams(window.location.search) // 浏览器query参数
         * JSON.parse(SearchQuery.get('sInfoUrlParams'))
         * @example
         * co.Form.open(
         "61243edb-770c-4029-a077-4c1982bf0666",
         rid,
         "建设用地地籍调查"
         )
         */
        this.open = function (formId, rid, title, type, urlParams, saveAfterCloseCurrTab) {
            if(saveAfterCloseCurrTab == undefined){
                saveAfterCloseCurrTab = true;
            }
            if (!type) {
                type = 6;
            }
            if (urlParams) {//有传参，采用新的方式，可能会有BUG
                window.parent.addTab({
                    pageUrl: '/formdesigner-web/generateForm.html?formId=' + formId + '&type=' + type + '&params={"formId":"' + formId + '","parentRid":""}&title=' + title + '&rid=' + rid + '&sInfoUrlParams=' + JSON.stringify(urlParams) + '&saveAfterCloseCurrTab=' + (saveAfterCloseCurrTab ? 'true' : 'false'),
                    name: title,//暂时无效，有需要可以研究下
                    moduleId: ""
                })
            } else {//没传参，使用旧的打开方式，BUG少一些
                $.F.openForm({
                    "formId": formId,
                    "rid": rid,
                    "title": title,
                    "type": type,
                    "saveAfterCloseCurrTab": saveAfterCloseCurrTab
                })
            }
        }

        /**
         * 打开表单(弹出)
         * @param {String} formId 表单id
         * @param {String} rid 表单rid
         * @param {String} title 表单标题
         * @param {String=} [width=75%] 宽度
         * @example
         * co.Form.openByDialog(
         "61243edb-770c-4029-a077-4c1982bf0666",
         rid,
         "建设用地地籍调查"
         )
         */
        this.openByDialog = function (formId, rid, title, width) {
            $.showdialog({
                url: '/formdesigner-web/generateForm.html?formId=' + formId + '&RID=' + rid,
                title: title,
                width: width ? width : "75%",
                submitFun: function () {
                    // 保存表单后关闭弹窗
                    return document.querySelector('#ifrm7811q').contentWindow.$saveNoProcessFormData()
                }
            })
        }

        /**
         * 打开业务流的表单
         * @deprecated
         * @param jid
         * @param processInstanceId
         * @param taskId
         * @example
         * 方法已过时，请使用
         * co.Flow.open()方法
         */
        this.openWithFlow = function (jid, processInstanceId, taskId) {
            mainObj.Flow.open(jid, processInstanceId, taskId);
        }

        /**
         * 设置当前表单为只读状态,不允许编辑。
         *  @param {String} formId 表单id   [限制]卡片编辑模式的子表  设置主表时，参数为空
         *  @param {Number=} index 从0开始  [限制]卡片编辑模式的子表
         *  @example
         *  1)设置主表不可编辑
         *  co.Form.setFormReadonly()
         *  2)设置子表不可编辑(卡片模式限定)
         *  //未测试 不清楚index从0还是1开始。
         *  //卡片模式太多bug不建议使用。
         *  co.Form.setFormReadonly(subFormId,index);
         */
        this.setFormReadonly = function (formId, index) {
            if (!formId && !index) {
                $.F.readonlyForm();
            } else {
                $.F.readonlyForm(formId, index);
            }
        }


        /**
         * 通过配置，自动组装从当前表发起时，从本表获取的数据，
         * 仅系统字段jid,rid及当前表字段，其他暂不支持
         * 后期可拓展
         * @param {formDataMappingConfig} config
         * @example
         * {
         * 	"isFlow": false,
         * 	"BusinessDefCode": "HTBANEW",
         * 	"formId": "3c26fbbd-9460-41bf-9a2e-bef2efa25e06",
         * 	"tableName": "PROJ_HTBA",
         * 	"dataMapping": {
         * 		"WTDW": "wtdw",
         * 		"WTDWLXR": "wtdwlxr",
         * 		"WTDWLXRDH": "WTDWLXRDH",
         * 		"JID": "SYS_JID"
         * 	}
         * }
         */
        this.initFormDataByConfig = function (config) {
            let tableName = config.tableName;
            let initFormDataParam = {}
            for (let x in config.dataMapping) {
                let toField = tableName + "." + x;
                let currField = config.dataMapping[x].toLowerCase();
                if (toField.toLowerCase().indexOf("sys_") === 0) {
                    toField = toField.substring(4);
                }
                if (currField.indexOf("sys_") === 0) {
                    let sysStr = currField.replace("sys_", "");
                    let currValue = "";
                    switch (sysStr) {
                        case "rid":
                            currValue = mainObj.domainRid;
                            break;
                        case "jid":
                            currValue = mainObj.domainJid;
                            break;
                        default:
                    }
                    initFormDataParam[toField] = currValue;
                } else if (currField.indexOf("func_") === 0) {
                    let funcStr = currField.replace("func_", "");
                    let func = window[funcStr];
                    if (typeof func === "function") {
                        initFormDataParam[toField] = func();
                    } else {
                        initFormDataParam[toField] = "";
                    }
                } else {
                    initFormDataParam[toField] = mainObj.getValue(currField);
                }
            }
            return initFormDataParam;
        }

        /**
         * 保存表单(业务流将静默保存，无提示)
         * @example
         * co.Form.save();
         */
        this.save = function () {
            if (mainObj.params.taskId) {
                $.W.save();
            } else {
                //平台的样式类名发生了变化，改名了！generateForm-btn改成了generate-form-btn，所以需要兼容两种样式
                if ($('.generateForm-btn button').length > 0 && $('.generateForm-btn button')[0]) {
                    $('.generateForm-btn button')[0].click()
                }else if($('.generate-form-btn button').length>0 && $('.generate-form-btn button')[0]){
                    $('.generate-form-btn button')[0].click()
                }
            }
        }
        /**
         * 隐藏表单的保存按钮
         * @param isHide 是否隐藏
         */
        this.setSaveBtnHide = function (isHide) {
            //平台的样式类名发生了变化，改名了！generateForm-btn改成了generate-form-btn，所以需要兼容两种样式
            mainObj.Dom.domIsLoaded(()=>{
                if($('.generateForm-btn button')[0]||$('.generate-form-btn button')[0]){
                    return true;
                }else{
                    return false;
                }
            }, isHide, (isHide)=>{
                if($('.generateForm-btn button')[0]){
                    if(isHide){
                        $($('.generateForm-btn button')[0]).hide();
                    }else{
                        $($('.generateForm-btn button')[0]).show();
                    }
                }else{
                    if(isHide){
                        $($('.generate-form-btn button')[0]).hide();
                    }else{
                        $($('.generate-form-btn button')[0]).show();
                    }
                }
            }, isHide)
        }
    }


    /**
     * @class
     * @classdesc  子表单 相关操作方法
     */
    function Subform() {


        /**
         * 注意 行内编辑模式专用
         * 更新子表单(指定行)，注意实际是未保存的,需要子表单保存按钮
         * 3.3.1以上版本支持
         * @param {String} oSubFormLinkId 子表单唯一ID
         * @param {longFieldName} subformKey   子表单key XXX.YYYY
         * @param {String} subformValue 子表单值
         * @param {Number} rowIndex 注 0行起始
         * @example
         * co.setRowEditValue("FA2B71756262ADF0EEA9","PROJ_SYSBQD.SBMC","123",0);
         */
        this.setRowEditValue = function (oSubFormLinkId, subformKey, subformValue, rowIndex) {
            if (rowIndex != null) {
                $.F.setRowEditValue(oSubFormLinkId, subformKey, subformValue, rowIndex + 1)
            } else {
                $.F.setRowEditValue(oSubFormLinkId, subformKey, subformValue)
            }
        }

        /**
         * 注意 行内编辑模式专用
         * 获取子表单(指定行)的值
         * 3.3.1以上版本支持
         * @param {String} oSubFormLinkId 子表单唯一ID
         * @param {longFieldName} subformKey   子表单key XXX.YYYY
         * @param {Number} rowIndex 注 0行起始
         * @example
         * co.getRowEditValue(co.subFormMap.rwfpSubForm.link, co.subFormMap.rwfpSubForm.table + ".CLSX");
         */
        this.getRowEditValue = function (oSubFormLinkId, subformKey, rowIndex) {
            if (rowIndex != null) {
                return $.F.getRowEditValue(oSubFormLinkId, subformKey, rowIndex + 1)
            } else {
                return $.F.getRowEditValue(oSubFormLinkId, subformKey)
            }
        }

        /**
         * 修改/保存子表数据
         * @param {String}subFormLinkId
         * @param data 保存数据
         * @example
         * 可以是数组：修改具体数据====[{ "XXX.RID": 修改数据的子表RID, "XXX.修改字段": 字段值}]
         * 可以是对象：整个子表修改===={ data: data, autoSave: true }
         *                         data：子表的数据对象【$.F.getCurPageData('子表控件唯一ID')】
         *                         autoSave：是否保存到数据库
         */
        this.setValue = function (subFormLinkId, data) {
            $.F.setFieldValue(subFormLinkId, data)
        }

        /**
         * 添加子表数据行
         * 注意 行数据中包含rid且子表中有对应rid的条目时，不添加而是直接更新。
         * @param {String}subFormLinkId 表连接Id
         * @param {String}tableName 子表名
         * @param {Array<Map<shortFieldName,fieldValue>>}dataMapList 子表行数据Map集合
         * @param {boolean}saveDirectory 是否直接保存到库中 false=不保存，true=保存
         * @example
         * //临时数据不写库
         * co.Subform.addRows("FA56F180593B25AD6CDC","PROJ_XXXX",[{"GCMC":"测试","YWBH":"业务编号"}],false)
         * //添加后 写入数据库
         * co.Subform.addRows("FA56F180593B25AD6CDC","PROJ_XXXX",[{"GCMC":"测试","YWBH":"业务编号"}],true)
         */
        this.addRows = function (subFormLinkId, tableName, dataMapList, saveDirectory) {
            if (!saveDirectory) {
                saveDirectory = false;
            } else {
                saveDirectory = true;
            }
            let dataMapListNew = [];
            for (let i = 0; i < dataMapList.length; i++) {
                const dataMap = dataMapList[i];
                let dataMapNew = {};
                for (let x in dataMap) {
                    if (x.toUpperCase().startsWith(tableName)) {
                        dataMapNew[x] = dataMap[x];
                    } else {
                        dataMapNew[tableName + "." + x] = dataMap[x];
                    }
                }
                dataMapListNew.push(dataMapNew);
            }
            $.F.setFieldValue(subFormLinkId, {
                data: dataMapListNew,
                autoSave: saveDirectory
            })
        }


        /**
         * 刷新子表单
         * @param {String} sSubFormLinkId 子表单关联id
         * @example
         * co.Subform.refresh(co.subformMap.businessSubform.link)
         */
        this.refresh = function (sSubFormLinkId) {
            if (sSubFormLinkId) {
                $.F.refreshSubForm(sSubFormLinkId);
            }
        }

        /**
         * 创建表单(子表单)(单条)
         * @param {String} formId 表单id
         * @param {String} subTableName 子表单名  如 PROJ_SUBTABLE
         * @param {String} parentRid  父表RID
         * @param {String} subformLinkCode 子表单标识id
         * @param {Map<longFieldName,fieldValue>} formData 子表单键值对
         * @param {sucCallback=} successCallback 成功回调
         * @param {Boolean=} bOpenAfterCreate 创建完毕后是否直接打开
         * @param {errCallback=} failCallback 失败回调
         * @example
         * co.Subform.create(
         *      co.subformMap.businessSubform.formId,
         *      co.subformMap.businessSubform.table,
         *      co.domainRid,
         *      co.subformMap.businessSubform.link,
         *      {
         *        "PROJ_CLKZQK.INDEX":1,
         *        "PROJ_CLKZQK.NAME":"TEST"
         *      },
         *      sucCallback,
         *      false,
         *      failCallback
         * )
         */
        this.create = function (formId, subTableName, parentRid, subformLinkCode, formData, successCallback, bOpenAfterCreate, failCallback) {

            formData[subTableName + ".SYS_PARENTRID"] = parentRid + "::" + subformLinkCode;
            if (!successCallback) {
                successCallback = refreshSubForm_;
            }
            mainObj.Form.create(formId, formData, successCallback, bOpenAfterCreate, failCallback);

            function refreshSubForm_(data, data2) {
                $.F.refreshSubForm(subformLinkCode);
            }
        }


        /**
         * 创建表单(子表单)（复数条目）
         * @param {String} subformId 表单id
         * @param {String} subTableName 子表单域  如 PROJ_SUBTABLE
         * @param {String} parentRid 父表RID
         * @param {String} subformLinkCode 子表单标识id
         * @param {Map<Array<Map<longFieldName,fieldValue>>>} subFormDataList  子表单键值对(列表) 见代码注释oFjListItem对象
         * @param {sucCallback=} successCallback 成功回调
         * @param {Boolean=} bOpenAfterCreate 创建完毕后是否直接打开
         * @param {errCallback=} failCallback 失败回调
         * @example
         *  let oFjListItem = []
         *   for (let i = 0; i < oFjList.sql1.length; i++) {
         *                       let oFjSetting = oFjList.sql1[i];
         *                       let map = {};
         *                       map["PROJ_YWDJB_SQRTGCL.ZLMC"] = oFjSetting.ZLMC;
         *                       map["PROJ_YWDJB_SQRTGCL.XH"] = oFjSetting.XH;
         *                       oFjListItem.push(map);
         *  }
         *
         * co.Subform.creates(
         *      co.subformMap.businessSubform.formId,
         *      co.subformMap.businessSubform.table,
         *      co.domainRid,
         *      co.subformMap.businessSubform.link,
         *      oFjListItem,
         *      sucCallback,
         *      false,
         *      failCallback
         * )
         */
        this.creates = function (subformId, subTableName, parentRid, subformLinkCode, subFormDataList, successCallback, bOpenAfterCreate, failCallback) {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: "/formengine/sub/saveSubFormData?parentRid=" + parentRid + "::" + subformLinkCode + "&formId=" + subformId + "&controlRid=",
                    contentType: 'application/json; charset=utf-8',
                    type: 'post',
                    async: false,
                    data: JSON.stringify(subFormDataList),
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        Vue.prototype.$loading.hide();
                        mainObj.Message.warning_topRight("保存失败！")
                        reject("error: 保存失败！")
                    },
                    success: function (d1) {
                        if (successCallback) {
                            resolve(successCallback(d1));
                        } else {
                            resolve("success: 保存成功！")
                        }
                        mainObj.Subform.refresh(subformLinkCode);
                    }
                });
            })
        }

        /**
         * 查询子表单内数据(注意，临时数据查不到)
         * @param {String} sSubFormLinkId
         * @param {Object<longFieldName,fieldValue>=}oCond 不为空时带入条件 否则查询整个子表单 eg:  查找子表中SXY.ZLMC等于66的数据 {'SXY.ZLMC': '66'}
         * @returns {Array} 返回的是子表单对象列表
         * @example
         * ①所有记录
         * let subList =  co.Subform.get(co.subformMap.businessSubform.link)
         * ②筛选符合指定条件的记录
         * let subList =  co.Subform.get(co.subformMap.businessSubform.link,
         * {
         *  'PROJ_BUSINESS.ZLMC': '66'
         * })
         *
         */
        this.get = function (sSubFormLinkId, oCond) {
            if (oCond) {
                return $.F.findSubForm(sSubFormLinkId, oCond);
            } else {
                return $.F.findSubForm(sSubFormLinkId);
            }
        }

        /**
         * 查询子表单内数据(当前显示页，包含未保存的数据)
         * @param {String} sSubFormLinkId
         * @returns {Array} 返回的是子表单对象列表
         * @example
         * let currList =  co.Subform.getCurrPageData(co.subformMap.businessSubform.link)
         */
        this.getCurrPageData = function (sSubFormLinkId) {
            return $.F.getCurPageData(sSubFormLinkId);
        }

        /**
         * 查询子表单内数据(包含已保存及未保存)
         * @param {String} sSubFormLinkId
         * @param {String} tableName 子表table名
         * @returns {Array} 返回的是子表单对象列表
         * @example
         * let currList =  co.Subform.getCurrPageData(co.subformMap.businessSubform.link)
         */
        this.getAllData = function (sSubFormLinkId, tableName) {
            let allArr = mainObj.Subform.get(sSubFormLinkId);
            let ridArr = [];
            ridArr.forEach(p => ridArr.push(p[tableName + "::" + "RID"]))
            allArr.push.apply(allArr, $.F.getCurPageData(sSubFormLinkId).filter(p => {
                return !ridArr.includes(p[tableName + "::" + "RID"])
            }))
            return allArr;
        }


        /**
         * 保存当前所有子表单数据(包已有及临时)
         */
        this.saveAll = function (sSubFormLinkId, tableName) {
            this.addRows(sSubFormLinkId, tableName, this.getAllData(sSubFormLinkId, tableName), true);
        }

        /**
         * 保存当前页子表单数据
         */
        this.saveCurrPage = function (sSubFormLinkId, tableName) {
            this.addRows(sSubFormLinkId, tableName, this.getCurrPageData(sSubFormLinkId), true);
        }


        /**
         * 获取子表单一条被勾选对象,仅一条
         * @param {String}sSubFormLinkId
         * @returns {Object}
         * @example
         * let subObj = co.Subform.getOneSelected(co.subformMap.businessSubform.link)
         */
        this.getOneSelected = function (sSubFormLinkId) {
            let dateArr = $.F.getSelectedSubForm(sSubFormLinkId);
            if (!dateArr || dateArr.length === 0 || dateArr.length > 1) {
                mainObj.Message.warning_topRight("请先勾选一条数据再继续")
                return {};
            } else {
                return dateArr[0];
            }
        }


        /**
         * 获取子表单被勾选对象
         * @param {String} sSubFormLinkId
         * @returns {Array}
         * @example
         * let subList = co.Subform.getAllSelected(co.subformMap.businessSubform.link)
         */
        this.getAllSelected = function (sSubFormLinkId) {
            let dataArr = $.F.getSelectedSubForm(sSubFormLinkId);
            if (!dataArr) {
                mainObj.Message.warning_topRight("请先勾选一条数据再继续")
                return [];
            } else {
                return dataArr;
            }
        }


        /**
         * 子表单是否仅勾选了单条记录
         * @param {String} sSubFormLinkId 子表单id
         * @returns {Boolean}
         * @example
         * let isChecked = co.Subform.bOneSelected(co.subformMap.businessSubform.link)
         */
        this.bOneSelected = function (sSubFormLinkId) {
            let dateArr = $.F.getSelectedSubForm(sSubFormLinkId);
            return !(!dateArr || dateArr.length === 0 || dateArr.length > 1);
        }
        /**
         * 获取子表单列表中有没有数据的情况 有数据返回true
         * @param sSubFormLinkId
         * @returns {boolean}
         * @example
         * let subIsNotEmpty = co.Subform.bHaveRecord(co.subformMap.businessSubform.link)
         */
        this.bHaveRecord = function (sSubFormLinkId) {
            let dateArr = $.F.getCurPageData(sSubFormLinkId)
            return !(!dateArr || dateArr.length === 0);
        }


        /**
         * (后台) 根据条件 删除子表单数据
         * @param {String} tableName 子表单名
         * @param {shortFieldName} conditionName 删除值字段 常用sys_parentid 删除一张表的子表
         * @param {fieldValue} conditionValue 删除值
         * @param {String} subformLinkId 删除数据后，刷新特定子表单
         * @param {String=} dsName 数据源
         * @example
         * co.Subform.delete()
         * let result = co.Subform.delete(processingSub.table, co.constant.SYS_PARENTID, processingSub.sys_parentId, processingSub.link);
         * result.then((data)=>{
         *     //doSth.
         * })
         */
        this.delete = function (tableName, conditionName, conditionValue, subformLinkId, dsName) {
            return new Promise((resolve, reject) => {
                let param = {
                    "dsName": dsName,
                    "param": {
                        "tableName": tableName,
                        "condName": conditionName,
                        "condValue": conditionValue
                    }
                }
                let deletePromise = mainObj.Http.requestByBackend("/sinfoweb/co/delete", param, "hint", "DELETE")
                deletePromise.then(function (data) {
                    if ("998" === data.code) {
                        console.log("数据删除异常！" + JSON.stringify(data));
                        if (subformLinkId) {
                            mainObj.Subform.refresh(subformLinkId);
                        }
                        reject(data);
                    } else {
                        console.log("数据删除成功！" + JSON.stringify(data));
                        if (subformLinkId) {
                            mainObj.Subform.refresh(subformLinkId);
                        }
                        resolve(data);
                    }
                });
            })
        }

        /**
         * 导出子表数据为xls文件（sInfoWeb需要有接口/sinfoweb/file/exportSubformToXls）
         * @param {String} filename 导出文件名
         * @param {String} subformLinkId 子表单关联id
         * @example
         * co.Subform.exportSubformData($.Y + "-" + $.M + "-" + $.D + "已入库成果统计导出.xls","F1F7917FABB922AC67BB")
         */
        this.exportSubformData = function (filename, subformLinkId) {
            mainObj.Toolbox.showMask();
            setTimeout(() => {
                $.ajax({
                    url: "/sinfoweb/file/exportSubformToXls",
                    contentType: 'application/json; charset=utf-8',
                    type: 'post',
                    async: false,
                    data: JSON.stringify({
                        "controlId": $.F.data.controls[subformLinkId].rid,
                        "fileName": filename
                    }),
                    dataType: "text",
                    success: function (d) {
                        d = d.substring(0, d.lastIndexOf("."))
                        var sReturn = window.location.origin + "/sinfoweb" + d;
                        // if (window.location.protocol.indexOf("https") >= 0) {
                        //     sReturn = "https://";
                        // } else {
                        //     sReturn = "http://";
                        // }
                        // if (window.location.port) {
                        //     sReturn += window.location.hostname + ":" + window.location.port + "/sinfoweb" + d;
                        // } else {
                        //     sReturn += window.location.hostname + "/sinfoweb" + d;
                        // }
                        console.log(sReturn)
                        window.open(sReturn);
                        mainObj.Toolbox.hideMask();
                    },
                    error: function (d) {
                        mainObj.Toolbox.hideMask();
                        mainObj.Message.error_middle("操作失败……")
                    }
                });
            }, 0);
        }

    }

    /**
     * @class
     * @classdesc  控件 相关操作方法
     */
    function Ctrl() {

        /**
         * 隐藏/显示控件
         * @param {String} ctrlId 控件ID  传入 YWBH 这样既可 也可以是控件长ID
         * @param {Boolean=} [isHide=false] 否则显示
         * @example
         * ①显示控件
         * co.Ctrl.setHide("FB24717F8B868BC4A6E8")
         * ②隐藏控件
         * co.Ctrl.setHide("FB24717F8B868BC4A6E8",true)
         */
        this.setHide = function (ctrlId, isHide) {
            if (!isHide) {
                isHide = false;
            } else {
                isHide = true
            }
            //旧的document.getElementById无法获取隐藏的控件，改用下面的这种查询方式
            if ($.F.formData.hasOwnProperty(ctrlId) || document.getElementById(ctrlId)) {
                $.F.setCtrlHide(ctrlId, isHide);
            } else if ($.F.formData.hasOwnProperty(mainObj.params.table + "." + ctrlId) || document.getElementById(ctrlId)) {
                $.F.setCtrlHide(mainObj.params.table + "." + ctrlId, isHide)
            }
            //进行兼容控件设置为总是可用时隐藏或显示
            if ($("#" + mainObj.params.table + "\\." + ctrlId)) {
                if (isHide) {
                    $("#" + mainObj.params.table + "\\." + ctrlId).hide();
                } else {
                    $("#" + mainObj.params.table + "\\." + ctrlId).show();
                }
            }
            //进行兼容非表单名前缀的控件为总是可用时隐藏或显示
            if ($("#" + ctrlId)) {
                if (isHide) {
                    $("#" + ctrlId).hide();
                } else {
                    $("#" + ctrlId).show();
                }
            }
        }

        /**
         * 禁用/取消禁用控件(文本框、按钮等)
         * @param {String} ctrlId 控件ID  传入 YWBH 这样既可 也可以是控件长ID
         * @param {Boolean=}isDisable 是否禁用  true=禁用
         * @example
         * ①启用控件
         * co.Ctrl.setDisable("FB24717F8B868BC4A6E8")
         * ②禁用控件
         * co.Ctrl.setDisable("FB24717F8B868BC4A6E8",true)
         */
        this.setDisable = function (ctrlId, isDisable) {
            if (!isDisable) {
                isDisable = false;
            } else {
                isDisable = true
            }
            if (document.getElementById(ctrlId)) {
                $.F.setCtrlDisable(ctrlId, isDisable)
            } else {
                $.F.setCtrlDisable(mainObj.params.table + "." + ctrlId, isDisable)
            }
        }


        /**
         * 控件(文本框常用)底色
         * @param {String} ctrlId 控件ID 传入 YWBH 这样既可
         * @param {String} colour 颜色代码 "#F44444"
         * @example
         * co.Ctrl.setColor("FB24717F8B868BC4A6E8","#F44444")
         */
        this.setColor = function (ctrlId, colour) {
            if (document.getElementById(ctrlId)) {
                $.F.setCtrlColor(ctrlId, colour)
            } else {
                $.F.setCtrlColor(mainObj.params.table + "." + ctrlId, colour)
            }
        }
    }

    /**
     * @class
     * @classdesc  ftp 相关操作方法
     */
    function Ftp() {
        /**
         * 提交ibase的文件到ftp(好像有bug，待更多测试)
         * 注意： 若无必要,请使用平台提供的修改文件控件的默认ftp上传路径功能,避免多次上传附件造成资源浪费)
         * 需配接口 sinfoweb/ftp/public/PostFileToFtp (3.2.4sinfoWeb代码)
         * @param {String} sFileStr  原宏路径 eg: canshu.xml|%%jobfiles%/202109/202109140017/PROJ_BDCQJSC_ZDTCOMPLETE/6da68cae-0ddd-4ecc-aa47-4adefeed8a54.xml
         * @param {String} sFtpConfigId  指定ftp配置id, 在系统配置外部配置中配置, 格式固定为 ip|用户名|密码|端口  eg:"zkFtp"
         * @param {String} ftpDir   ftp内路径 eg:/完整宗地图/ajbh/
         * @param {String} addTimeStampDir  是否添加时间戳 eg:  为 true时  路径为/完整宗地图/ajbh/时间戳/canshu.xml
         *                                           否则  直接/完整宗地图/ajbh/canshu.xml
         * @example
         * 注意： 若无必要,请使用平台提供的修改文件控件的默认ftp上传路径功能,避免多次上传附件造成资源浪费)
         * co.Ftp.sendFileToFtp(co.getValue("FJ"),"otherFtpConfig","/zdt/ajbh/",true)
         */
        this.sendFileToFtp = function (sFileStr, sFtpConfigId, ftpDir, addTimeStampDir) {
            if (addTimeStampDir !== "true") {
                addTimeStampDir = "false";
            }
            $.ajax({
                url: "/sinfoweb/ftp/public/PostFileToFtp",
                type: "POST",
                async: true,
                contentType: 'application/json',
                data: JSON.stringify({
                    "fileStr": sFileStr,
                    "ftpUsing": sFtpConfigId,
                    "ftpDir": ftpDir,
                    "addTimeStampDir": addTimeStampDir
                }),
                success: function (returnData) {
                    console.log(returnData)
                    if (returnData.code === "0") {
                        console.log("发送成功!")
                    } else {
                        $.messager.notice({type: 'error', title: '提示', desc: returnData.desc});
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    $.messager.notice({type: 'warning', title: '提示', desc: '获取失败！'});
                }
            });
        }

    }

    /**
     * @class
     * @classdesc  文件 相关操作方法
     */
    function File() {

        /**
         * 下载文件(单个文件)
         * @param {String} sPath (下载路径，若为宏路径，格式为：文件名|宏路径 )
         * @param {String} sFilename 文件名(宏路径下失效，请从第一个参数提供文件名)
         * @param {Boolean} bIsMicro 是否系统内宏路径
         * @param {String} fileDownloadDomainField 宏路径拼接时的前缀配置Key
         * @param {String} domainFieldIsConfig 上述配置的key是否在另一个key中存放，如果是，则填写。
         * @example
         * co.File.download(
         * "canshu.pdf|%%jobfiles%/202109/202109140017/PROJ_BDCQJSC_ZDTCOMPLETE/6da68cae-0ddd-4ecc-aa47-4adefeed8a54.pdf",
         * "canshu.pdf",
         *  true,
         * "domain",
         *  true
         * )
         */
        this.download = function (sPath, sFilename, bIsMicro, fileDownloadDomainField, domainFieldIsConfig) {
            if (bIsMicro) {
                //默认
                let domainConfigId = "domain";
                if (fileDownloadDomainField) {
                    if (domainFieldIsConfig) {
                        domainConfigId = mainObj.Config.getGlobalValue(fileDownloadDomainField);
                    } else {
                        domainConfigId = fileDownloadDomainField;
                    }
                }
                let aPath = mainObj.File.handleAttachmentUrl(sPath, domainConfigId)
                if (aPath && aPath.length > 0) {
                    sPath = aPath[0]
                } else {
                    return "";
                }
            }
            const {downloadFile} = window.top.IBaseExpressLib
            downloadFile({
                path: sPath.url,
                filename: sFilename
            });
        }
        /**
         * 文件预览(仅特定格式)
         * @param {String} fileName 文件名
         * @param {String} filePath 宏路径
         * @example
         * co.File.preview(
         * "canshu.pdf",
         * "canshu.pdf|%%jobfiles%/202109/202109140017/PROJ_BDCQJSC_ZDTCOMPLETE/6da68cae-0ddd-4ecc-aa47-4adefeed8a54.pdf"
         * )
         */
        this.preview = function (fileName, filePath) {
            $.file({
                operate: 'preview',
                showTree: false,
                fileTree: [
                    {
                        label: fileName,
                        path: filePath
                    }
                ]
            })
        }

        /**
         * 解析宏路径地址成可下载的url,
         * 配置ftp的那种附件暂未测试是否通用。
         * @param {String} fjUrl  宏路径 平台保存的值
         * @param {String} domainConfigId 内网/外网访问URL路径存放的配置项ID
         * @returns {Array}
         * @example
         * co.File.handleAttachmentUrl(
         * "canshu.pdf|%%jobfiles%/202109/202109140017/PROJ_BDCQJSC_ZDTCOMPLETE/6da68cae-0ddd-4ecc-aa47-4adefeed8a54.pdf",
         * "domain"
         * )
         */
        this.handleAttachmentUrl = function (fjUrl, domainConfigId) {
            let domain = "";
            if (domainConfigId) {
                domain = mainObj.Config.getGlobalValue(domainConfigId);
            } else {
                domain = mainObj.Config.getGlobalValue("domain_");
                if (!domain) {
                    domain = mainObj.Config.getGlobalValue("domain");
                }
            }
            if (!fjUrl) {
                return [];
            }
            let fjArr = fjUrl.split("::");
            let fjList = [];
            for (let fj of fjArr) {
                let splitArr = fj.split("|");
                let name = splitArr[0];
                let sPath = splitArr[1];
                let encodeName = null;
                let path = null;
                try {
                    path = encodeURI(sPath);
                    encodeName = encodeURI(name);
                } catch (ex) {
                    console.log(ex)
                }
                let fileUrl = domain + "/onlineServiceProject/public/downFileByPath?macroPath=" + path + "&fileName=" + encodeName;
                let fjMap = {};
                fjMap.name = name;
                fjMap.url = fileUrl;
                fjList.push(fjMap);
            }
            return fjList;
        }


        /**
         * 将字符串组成文件立即下载
         * @param {String} filename 文件名 常用xxx.xml xxx.txt 等等
         * @param {String} content 字符串内容
         * @example
         * co.File.downStringAsFile(
         * "setting.xml",
         * "content"
         * )
         */
        this.downStringAsFile = function (filename, content) {
            let element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
            element.setAttribute('download', filename);
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        }

        /**
         * 获取进度方法(内部使用)
         * @param param
         * @return {*}
         */
        this.getUploadProgress = function (param) {
            return mainObj.Progress.state;
        }


        /**
         * 选择文件并上传到Ibase，返回宏路径
         * 业务流中上传的文件可在fileInfo中以taskId=jid进行查询
         * 普通文档中上传的文件可在fileInfo中以taskId=rid进行查询
         * @param {String=} aimField 目标字段
         * @param {Boolean=} saveToDb 直接保存到数据库
         * @param {String=} macroPath 路径规则
         * @param {String=} fileType 文件类型
         * @param {Number=}fileSizeLimit 文件大小限制(Mb)
         * @param {Boolean=} isPreview 是否生成预览文件
         * @param {String=} srcKey 上级目录
         * @param {Map<String,Object>=} extraFileInfo 其他文件信息
         * @param {sucCallback=}doSthAfterUploadFunc 上传成功事件
         * @param {errCallback=}errCallback 失败事件
         * @example
         * co.File.uploadSingleFile();
         *
         *
         * macroPath 参数说明
         * 一、服务端生成宏路径的规则如下：
         * (1)如果macroPath为空（未指定），则以%%jobfiles%作为默认宏名；
         * (2)如果以%/或%结束，则添加一个"年月"为默认的目录名；
         * (3)如果以/结束（但前一个字符不是%），则添加以srcKey为分类的子目录（如果srcKey为空，则忽略）；
         * (4)如果不以/结束，且未取到文件扩展名，与(3)相同。
         *  以上目录处理完后，添加随机文件名。
         * (5)不满足以上情况时，说明是完整宏路径名，不做额外处理。
         * －－－－－－－－－－－－－－－(mFile控件中的原始
         * macroPath－－－－－－srcKey－－－文件扩展名)－－－－-结果
         * 空－－－－－－－－－－－空－－－－.docx－－－－－－－%%jobfiles%/201908/123-456-34.docx
         * 空－－－－－－－－－－－abcd－－－.docx－－－－－－－%%jobfiles%/201908/abcd/123-456-34.docx
         * %%mmm%－－－－－－－  空－－－－.docx－－－－－－－%%mmm%/201908/123-456-34.docx
         * %%mmm%/ddd/－－－－－空－－－－.docx－－－－－－%%mmm%/ddd/123-456-34.docx
         * %%mmm%/ddd/－－－－－abcd－－－.docx－－－－－－%%mmm%/ddd/abcd/123-456-34.docx
         * %%mmm%/ddd－－－－－abcd－－－.docx－－－－－－%%mmm%/ddd/abcd/123-456-34.docx（即与最后以/结束的处理相同）
         * %%mmm%/ddd/fff.doc－－空－－－－.docx－－－－－－%%mmm%/ddd/fff.doc
         * %%mmm%/ddd/fff.doc－－abdc－－－.docx－－－－－－%%mmm%/ddd/fff.doc（即宏路径是全路径，不自动加其他信息）
         *
         * @fileType 文件类型说明，常用见下面。
         * ".doc,.docx"
         * A valid case-insensitive filename extension, starting with a period (".") character. For example: .jpg, .pdf, or .doc.
         * A valid MIME type string, with no extensions.
         * The string audio/* meaning "any audio file".
         * The string video/* meaning "any video file".
         * The string image/* meaning "any image file".
         */
        this.uploadSingleFile = function (aimField, doSthAfterUploadFunc, errCallback, saveToDb, fileType, fileSizeLimit, macroPath, srcKey, isPreview, extraFileInfo) {
            function evt_upload_progress(evt, fileName) {
                if (evt.lengthComputable) {
                    let progress = Math.round(evt.loaded * 100 / evt.total);
                    mainObj.Progress.state = {
                        text: "文件'" + fileName + "'上传中..",
                        percent: progress,
                        state: 'ongoing'
                    }
                    console.log("上传进度: " + progress);
                }
            }

            function evt_upload_complete(evt, fileName) {
                if (evt.loaded === 0) {
                    console.log("上传失败!");
                    mainObj.Progress.state = {
                        text: "文件'" + fileName + "'上传失败",
                        percent: 100,
                        state: 'fail'
                    }
                    if (errCallback) {
                        errCallback(evt);
                    }
                } else {
                    console.log("上传完成!");
                    let responseText = evt.target.responseText;
                    console.log(responseText);
                    mainObj.Progress.state = {
                        text: "文件'" + fileName + "'上传完成..",
                        percent: 100,
                        state: 'done'
                    }
                    mainObj.Progress.state.fileMicro = fileName + "|" + responseText;
                }
            }

            function evt_upload_failed(evt, fileName) {
                console.log("上传出错");
                mainObj.Progress.state = {
                    text: "文件'" + fileName + "'上传出错..",
                    percent: 100,
                    state: 'fail'
                }
            }

            function evt_upload_cancel(evt, fileName) {
                console.log("上传中止!");
                mainObj.Progress.state = {
                    text: "文件'" + fileName + "'上传中止..",
                    percent: 100,
                    state: 'fail'
                }
            }

            let fileUploadEle = document.createElement('input');
            fileUploadEle.setAttribute('id', 'co_input_Ctrl');
            fileUploadEle.setAttribute('type', 'file');
            fileUploadEle.setAttribute("style", 'display: none;');
            fileUploadEle.setAttribute("class", 'file_button');
            if (fileType) {
                fileUploadEle.setAttribute("accept", fileType);
            }
            fileUploadEle.addEventListener("change", (e) => {
                if (!extraFileInfo) {
                    extraFileInfo = {};
                }
                let file = fileUploadEle.files[0];
                let name = file.name;
                let size = file.size;
                if (fileSizeLimit && size > fileSizeLimit * 1024 * 1024) {
                    mainObj.Message.error_topRight("附件过大,无法上传");
                    fileUploadEle.value = "";
                    return false;
                }
                mainObj.Progress.state = {"fileName": name}
                fileUploadEle.value = "";
                mainObj.Progress.baseProgressTrue("上传文件", "文件'" + name + "'上传中..", mainObj.File.getUploadProgress, {}, 1000, () => {
                    let fileMicro = mainObj.Progress.state.fileMicro;
                    if (aimField) {
                        if (saveToDb) {
                            mainObj.setDomainValue(aimField, fileMicro);
                            mainObj.setValue(aimField, fileMicro, co.constant.RID, co.params.rid, true, co.params.table).then(
                                (ret) => {
                                    if (doSthAfterUploadFunc) {
                                        doSthAfterUploadFunc(fileMicro);
                                    }
                                }
                            )
                        } else {
                            mainObj.setDomainValue(aimField, fileMicro);
                            if (doSthAfterUploadFunc) {
                                doSthAfterUploadFunc(fileMicro);
                            }
                        }
                    } else {
                        if (doSthAfterUploadFunc) {
                            doSthAfterUploadFunc(fileMicro);
                        }
                    }

                });
                let uploadUrl = "/filemgr/comm/uploadFile";
                let formData = new FormData();
                //当前上传的文档类型，业务流为0 普通文档1
                let docType = mainObj.params.taskId ? 0 : 1
                formData.append('mFile', file);
                formData.append("isPreview", isPreview ? true : false)
                formData.append("srcType", docType)
                formData.append("macroPath", macroPath ? macroPath : "")
                formData.append("srcKey", srcKey ? srcKey : "")
                if (docType === 0) {
                    //业务流附上taskId=jid
                    extraFileInfo.taskId = mainObj.params.jid;
                } else {
                    //普通文档附上taskId=rid
                    extraFileInfo.taskId = mainObj.params.rid;
                }
                formData.append("fileInfo", JSON.stringify(extraFileInfo))


                // 手工构造一个请求对象，用这个对象来发送表单数据
                // 设置 progress, load, error, abort 4个事件处理器
                let request = new XMLHttpRequest();
                request.upload.addEventListener("progress", (evt) => {
                    evt_upload_progress(evt, name)
                }, false);
                request.addEventListener("load", (evt) => {
                    evt_upload_complete(evt, name)
                }, false);
                request.addEventListener("error", (evt) => {
                    evt_upload_failed(evt, name)
                }, false);
                request.addEventListener("abort", (evt) => {
                    evt_upload_cancel(evt, name)
                }, false);
                request.open("POST", uploadUrl); // 设置服务URL
                request.send(formData);  // 发送表单数据

            }, false);
            document.body.appendChild(fileUploadEle);
            fileUploadEle.click();
        }

        /**
         * 上传多个文件
         * @param {string} aimField 上传成功后要设置的字段名，可选
         * @param {function} doSthAfterUploadFunc 上传成功后的回调函数，可选，回调参数为文件微路径字符串数组
         * @param {function} errCallback 上传失败的回调函数，可选
         * @param {boolean} saveToDb 是否保存到数据库，默认为false
         * @param {string} fileType 文件类型限制，例如 .pdf, .jpg, .png 等
         * @param {number} fileSizeLimit 文件大小限制，单位MB
         * @param {string} macroPath iBase宏路径
         * @param {string} srcKey 来源标识，用于生成子目录
         * @param {boolean} isPreview 是否生成预览，默认为false
         * @param {object} extraFileInfo 额外的文件信息
         * @example
         * co.File.uploadMultipleFiles("FILE_FIELD", (fileMicroArray) => {
         *     console.log("上传成功的文件微路径:", fileMicroArray);
         * });
         */
        this.uploadMultipleFiles = function (aimField, doSthAfterUploadFunc, errCallback, saveToDb, fileType, fileSizeLimit, macroPath, srcKey, isPreview, extraFileInfo) {
            let fileUploadEle = document.createElement('input');
            fileUploadEle.setAttribute('id', 'co_input_Ctrl_multiple');
            fileUploadEle.setAttribute('type', 'file');
            fileUploadEle.setAttribute('multiple', 'multiple');
            fileUploadEle.setAttribute("style", 'display: none;');
            fileUploadEle.setAttribute("class", 'file_button');
            if (fileType) {
                fileUploadEle.setAttribute("accept", fileType);
            }

            fileUploadEle.addEventListener("change", (e) => {
                let files = fileUploadEle.files;
                if (files.length === 0) {
                    return;
                }

                if (!extraFileInfo) {
                    extraFileInfo = {};
                }

                // 存储所有上传成功的文件微路径
                let allFileMicroPaths = [];
                let totalFiles = files.length;
                let uploadedFiles = 0;
                let uploadFailedFiles = 0;

                // 进度显示
                mainObj.Progress.state = {
                    text: "准备上传 " + totalFiles + " 个文件...",
                    percent: 0,
                    state: 'ongoing'
                };

                // 更新总体进度
                function updateTotalProgress() {
                    let totalProgress = Math.round((uploadedFiles + uploadFailedFiles) * 100 / totalFiles);
                    mainObj.Progress.state = {
                        text: "总进度: " + uploadedFiles + "/" + totalFiles + " 文件已完成",
                        percent: totalProgress,
                        state: uploadFailedFiles > 0 ? 'warning' : 'ongoing'
                    };

                    // 当所有文件都上传完成时
                    if (uploadedFiles + uploadFailedFiles >= totalFiles) {
                        if (uploadFailedFiles > 0) {
                            mainObj.Progress.state = {
                                text: "上传完成，" + uploadedFiles + " 个文件成功，" + uploadFailedFiles + " 个文件失败",
                                percent: 100,
                                state: 'warning'
                            };
                        } else {
                            mainObj.Progress.state = {
                                text: "所有 " + uploadedFiles + " 个文件上传成功",
                                percent: 100,
                                state: 'done'
                            };
                        }

                        // 处理上传完成后的操作
                        if (allFileMicroPaths.length > 0) {
                            let fileMicroString = allFileMicroPaths.join(';');
                            if (aimField) {
                                if (saveToDb) {
                                    mainObj.setDomainValue(aimField, fileMicroString);
                                    mainObj.setValue(aimField, fileMicroString, co.constant.RID, co.params.rid, true, co.params.table).then(
                                        (ret) => {
                                            if (doSthAfterUploadFunc) {
                                                doSthAfterUploadFunc(allFileMicroPaths);
                                            }
                                        }
                                    );
                                } else {
                                    mainObj.setDomainValue(aimField, fileMicroString);
                                    if (doSthAfterUploadFunc) {
                                        doSthAfterUploadFunc(allFileMicroPaths);
                                    }
                                }
                            } else if (doSthAfterUploadFunc) {
                                doSthAfterUploadFunc(allFileMicroPaths);
                            }
                        } else if (errCallback) {
                            errCallback({message: "没有文件上传成功"});
                        }
                    }
                }

                // 遍历所有文件并上传
                Array.from(files).forEach((file, index) => {
                    let name = file.name;
                    let size = file.size;

                    // 检查文件大小
                    if (fileSizeLimit && size > fileSizeLimit * 1024 * 1024) {
                        mainObj.Message.error_topRight("文件 '" + name + "' 过大，无法上传");
                        uploadFailedFiles++;
                        updateTotalProgress();
                        return;
                    }

                    // 构建上传所需的FormData
                    let uploadUrl = "/filemgr/comm/uploadFile";
                    let formData = new FormData();
                    let docType = mainObj.params.taskId ? 0 : 1;
                    let currentExtraFileInfo = JSON.parse(JSON.stringify(extraFileInfo)); // 复制extraFileInfo防止被修改

                    formData.append('mFile', file);
                    formData.append("isPreview", isPreview ? true : false);
                    formData.append("srcType", docType);
                    formData.append("macroPath", macroPath ? macroPath : "");
                    formData.append("srcKey", srcKey ? srcKey : "");

                    if (docType === 0) {
                        currentExtraFileInfo.taskId = mainObj.params.jid;
                    } else {
                        currentExtraFileInfo.taskId = mainObj.params.rid;
                    }
                    formData.append("fileInfo", JSON.stringify(currentExtraFileInfo));

                    // 创建XMLHttpRequest进行上传
                    let request = new XMLHttpRequest();

                    // 上传进度处理
                    request.upload.addEventListener("progress", (evt) => {
                        if (evt.lengthComputable) {
                            let fileProgress = Math.round(evt.loaded * 100 / evt.total);
                            console.log("文件 '" + name + "' 上传进度: " + fileProgress + "%");

                            // 更新当前文件上传状态
                            mainObj.Progress.state = {
                                text: "文件 " + (index + 1) + "/" + totalFiles + " '" + name + "' 上传中: " + fileProgress + "%",
                                percent: (uploadedFiles * 100 + fileProgress) / totalFiles,
                                state: 'ongoing'
                            };
                        }
                    }, false);

                    // 上传完成处理
                    request.addEventListener("load", (evt) => {
                        if (evt.target.status >= 200 && evt.target.status < 300) {
                            try {
                                let responseText = evt.target.responseText;
                                console.log("文件 '" + name + "' 上传完成");

                                // 保存文件微路径
                                let fileMicro = name + "|" + responseText;
                                allFileMicroPaths.push(fileMicro);
                                uploadedFiles++;
                            } catch (e) {
                                console.error("解析响应失败", e);
                                uploadFailedFiles++;
                            }
                        } else {
                            console.error("文件 '" + name + "' 上传失败: HTTP " + evt.target.status);
                            uploadFailedFiles++;
                        }

                        updateTotalProgress();
                    }, false);

                    // 错误处理
                    request.addEventListener("error", (evt) => {
                        console.error("文件 '" + name + "' 上传出错");
                        uploadFailedFiles++;
                        updateTotalProgress();
                    }, false);

                    // 取消处理
                    request.addEventListener("abort", (evt) => {
                        console.log("文件 '" + name + "' 上传中止");
                        uploadFailedFiles++;
                        updateTotalProgress();
                    }, false);

                    // 开始上传
                    request.open("POST", uploadUrl);
                    request.send(formData);
                });

                // 清除input的value，以便下次还能选择相同的文件
                fileUploadEle.value = "";
            }, false);

            document.body.appendChild(fileUploadEle);
            fileUploadEle.click();
        }


        /**
         * 获取sInfoWeb下载地址，自适应当前的请求地址
         * @param {httpRequestParam} param
         * @example
         * co.File.getSInfoWebDownLoadUrl({
         *     "fileName":"文件名",
         *     "macroPath":"iBase宏路径"
         * })
         */
        this.getiBaseDownLoadUrl = function (params) {
            let {
                fileName,
                macroPath
            } = params
            let sReturn = "";
            sReturn += window.location.origin +"/filemgr/comm/downFileByPath?macroPath=" + encodeURIComponent(macroPath) + "&fileName=" + fileName;
            return sReturn;
        }
        /**
         * 获取sInfoWeb下载地址，自适应当前的请求地址
         * @param {httpRequestParam} param
         * @example
         * co.File.getSInfoWebDownLoadUrl({
         *     "fileName":"文件名",
         *     "macroPath":"iBase宏路径"
         * })
         */
        this.getSInfoWebDownLoadUrl = function (params) {
            let {
                fileName,
                macroPath,
                sInfoUrl = "",
            } = params
            let sReturn = "";
            if (sInfoUrl) {
                sReturn += window.location.origin + "/sinfoweb" + sInfoUrl;
            } else {
                // sReturn += window.location.origin +"/filemgr/comm/downFileByPath?macroPath=" + encodeURIComponent(macroPath) + "&fileName=" + fileName;
                sReturn += window.location.origin +"/sinfoweb/file/public/downFileByPath?macroPath=" + encodeURIComponent(macroPath) + "&fileName=" + fileName;
            }
            return sReturn;
        }
    }

    /**
     *
     * @class
     * @classdesc 数据展示 相关操作方法
     */
    function DataDisplay() {


        /**
         * 数据示例
         */
        this.demo_params = {
            //数据源
            "data": {
                "byFunc": {
                    //数据请求方法，分页=true时需要实现分页。
                    "func": demo_dataPrepareFunc,
                    "loadingText": "loadingText"
                },
                "byExists": {
                    //表头格式 children为和并列使用 较少使用。
                    "columns": [{"key": "英文名", "label": "中文名", "children": [{"key": "英文名", "label": "中文名"}]}],
                    //隐藏列
                    "hideColumns": ["key1", "key2"],
                    //数据对象集合
                    "dataList": [{"key1": "value1", "key2": "value2"}],
                    //按列合并相同值的行数据 示例为；合并item列中，所有值相同的行。
                    "spanCols": [{"key": "item"}],
                    //以上为基座默认有的数据对象，其他的自定义的数据对象，都集中放在这里
                    "otherParams": {}
                }

            },

            //弹窗
            "popUp": {
                //弹窗窗口标题。不弹时应该是不生效的。传入空，不占行位。
                "title": "string",
                //宽度 默认70vw 约可以理解为页面70%
                "width": "70vw",
                //默认false  弹窗值=true时  不弹窗，而是嵌入页面dom展示，此时需要提供页面dom的Id
                "notPopUp": true,
                //不弹窗时需提供页面dom的Id 示例
                "elementIdIfNotPopUp": "FD177177F1C89D165CD0",
            },

            //渲染
            "render": {
                //表格标题html
                "tableHeader": {
                    //自定义表标题文本，支持html标签样式 。传入空，不占行位。
                    "subTitle": "",
                    //自定义标题文本，优先级>subTitle。参数为展示的数据源，可根据数据源定制表格标题。
                    "subTitleFunc": demo_subTitleFunc
                },
                "columns": {
                    //方法中默认实现了渲染规则textColor，可后续拓展 目前规则：仅对列文字颜色进行设置：当x列含y值时,该列展示z颜色,含y2时，展示z2色
                    //当传入了自定义列渲染方法 colSettingFunc 时，此参数失效
                    "colDefaultType": 'textColor',
                    //不同渲染规则下可对应定义不同的参数对象 以下为textColor规则下的对象体
                    "colDefaultTypeParam": [{
                        colKey: "x",
                        settings: [{keyWord: "y", color: "z"}, {keyWord: "y2", color: "z2"}]
                    }],
                    //自定义列渲染方法，优先级>colSettings,传入col及tempCol渲染
                    "colSettingFunc": demo_colSettingFunc
                },
                "header": {
                    //一般不隐藏表头
                    "hideHeader": false
                },
                "pagination": {
                    //进行分页
                    "pagination": false,
                    //当分页=true时，生效，可指定分页大小
                    "pageSize": 10,
                    "current": 1
                }
            },
            //获取数据手段，一般就双击，或者选择数据条目之后点确认取回
            "getData": {
                //双击行处理数据 参数包含被双击的当前行数据及行index
                "dbClick": {
                    "onRowDblclickFunc": demo_onRowDblclickFunc
                },
                //勾选行处理数据
                //勾选行时-触发行勾选变更事件
                //确认返回时,返回勾选的行数据
                "checkRows": {
                    //配置勾选行时，将哪个字段作为Key标识存入已选列表中
                    rowKey: "keyName",
                    //'checkbox'|'radio'
                    "type": "checkbox",
                    "onChange": demo_rowSelectionChangeFunc,
                    //确认并返回方法,可判定选择的数据情况进行数据处理，
                    //返回true时，将继续关闭窗口 返回false则阻止窗口关闭
                    "confirmCallbackFunc": demo_confirmCallbackFunc
                }
            },
            //加载完毕事件
            "onload": {
                //弹窗加载完毕后的事件
                "onloadFunc": demo_onloadFunc
            }
        }


        /**
         TODO. 部分代码保存在： 改造CObaseTable接参.txt   basetable需要改造成obj?.fir?.sec?.thr || 5的取值形式，还是想用层级组织
         * @desc 基础展示表
         * @param  {baseTableParams} params 表格参数
         */
        function baseTable(params) {
            const {baseTable} = window.top.IBaseExpressLib;
            let baseTableParams = {
                vue: Sgui,
                modalTitle: params.title,
                width: params.width ? params.width : "70vw",
                loadingText: params.loadingText === "" ? "加载中.." : params.loadingText,
                isHideColumnHeader: params.hideHeader,
                isPage: params.pagination,
                pageConfigs:
                    {
                        size: params.pageSize,
                        //默认打开页(默认第一页)
                        current: params.current ? params.current : 1
                    },
                //表头(tableRes展示的数据源)
                customTableTitleHtml: params.subTitleFunc ? params.subTitleFunc : params.subTitle,
                //数据源(此方法中由参数传入并构建)
                tableResCallback: (param) => {
                    console.log(param)
                    if (params.tableResCallbackFunc) {
                        return params.tableResCallbackFunc(param);
                    } else {
                        return new Promise(resolve => {
                            let totalCount = params.rowList.length;
                            let displayList = [];
                            if (param.page && param.size) {
                                displayList = mainObj.Toolbox.arrSlice(params.rowList, param.size, param.page);
                            }
                            resolve(
                                {
                                    columns: params.columns,
                                    hideColumns: params.hideColumns,
                                    rowList: displayList,
                                    count: totalCount,
                                    spanCols: params.spanCols,
                                    otherParams: params.otherParams
                                })
                        })
                    }

                },
                //列渲染
                customColCallback: col => {
                    let tempCol = {}
                    if (typeof (params.colSettingFunc) === "function") {
                        params.colSettingFunc(col, tempCol)
                    } else {
                        //默认样式
                        if (params.colDefaultType && params.colDefaultTypeParam) {
                            switch (params.colDefaultType) {
                                case "textColor":
                                    let colSetting = params.colDefaultTypeParam.find(q => q.colKey === col.key);
                                    if (colSetting) {
                                        let settings = colSetting.settings;
                                        tempCol.render = (h, {row}) => {
                                            let color = "black";
                                            for (let setting of settings) {
                                                if (row.result.indexOf(setting.keyWord) > -1) {
                                                    color = setting.color;
                                                }
                                            }
                                            return h({
                                                template: `<span style="color:${color}">${row.result}</span>`
                                            })
                                        }
                                    }
                                    break;
                                default:
                                    console.log("未找到传入的样式，请在colSettingFunc中自定义样式或在默认方法中补齐所需样式")
                            }
                        }
                    }
                    return tempCol
                },
                //双击行
                onRowDblclick: (param) => {
                    // params.row params.index
                    if (typeof (params.onRowDblclickFunc) === "function") {
                        params.onRowDblclickFunc(param);
                    } else {
                        console.log("您双击了第" + param.index + "行")
                        console.log(params.row)
                    }
                },

                //行勾选，勾选时处理数据，或者配合点击确认时返回勾选数据。
                //rowKey 勾选时会将rowKey的值，放入rowSelection.selectedRowKeys
                rowKey: params.rowKey ? params.rowKey : "key",
                //行选择配置
                rowSelection: params.rowSelection ? params.rowSelection : null,
                //确认方法中可以带回数据(配合勾选数据) param.selectedRows;
                confirmCallback: (param) => {
                    //方法返回true时候  窗口关闭
                    //返回false 不关闭
                    if (typeof (params.confirmCallbackFunc) === "function") {
                        return params.confirmCallbackFunc(param)
                    } else {
                        let selectedRows = param.selectedRows;
                        if (selectedRows) {
                            console.log("确认时选择了 " + selectedRows.length + " 行带出")
                        }
                        return true;
                    }
                },
                // 返回表格数据的回调
                onRenderReady: (tableVue) => {
                    if (params.onloadFunc) {
                        params.onloadFunc(tableVue);
                    }
                    console.log("展示弹窗加载完毕!");
                }, // 初始化的生命周期钩子，tableVue 为表格vue的实例
            }
            //是否弹窗
            if (params.notPopUp) {
                baseTableParams.containerType = "2";
                baseTableParams.selector = document.getElementById(params.elementIdIfNotPopUp);
                if (!baseTableParams.selector) {
                    mainObj.Message.warning_topRight("未找到指定Dom元素！！");
                    return;
                }
            } else {
                baseTableParams.containerType = "1";
            }
            baseTable(baseTableParams);
        }

        /**
         * 简单展示  无双击、列渲染、勾选、确认返回等
         * 数据已请求好
         * 参数构成见 devManual
         * @param {Array<columnInfo>} columns
         * @param {Array<String>} hideColumns 隐藏列
         * @param {Array<Object<String,String>>} rowList 数据对象
         * @param {Array<keyInfo>} spanCols 需要进行合并的行(按列，如指定某列相同的行进行合并)。[{key:"item"},{key:"xxx"}]
         * @param {Map<String,Object>} otherParams 其他的自定义的数据对象，都集中放在这里
         * @param {String} title (弹窗)标题
         * @param {String=} subTitle (表格)标题
         * @param {Boolean=} pagination 是否分页
         * @param {Number=} pageSize 分页大小 默认10
         * @param {Boolean=} notPopUp 是否不弹窗
         * @param {String=} elementIdIfNotPopUp 假如不弹，传入用于展示表内容的页面domId
         * @param {Number=} [current=1] current 当前页 默认1
         * @param {function(tableVue)=} onloadFunc 加载完事件
         * @param {String=} [width=70vw] 宽度 可为百分比
         * @example
         * let columns = [{"label": "检查项", "key": "item"}, {"label": "检查问题", "key": "name"}, {
         *                         "label": "检查类型",
         *                         "key": "level"
         *                     }, {"label": "检查必要性", "key": "type"}, {"label": "检查结果", "key": "result"}, {
         *                         "label": "检查说明",
         *                         "key": "description"
         *                     }]
         * let hideColumns = [];
         * let rowList = [{
         *                         "result": "通过",
         *                         "item": "必填项检查",
         *                         "level": "必要",
         *                         "name": "【宗地使用权】数据入库标准比对",
         *                         "description": "检查【宗地使用权】数据是否符合入库标准",
         *                         "type": "必填项检查"
         *                     }, {
         *                         "result": "通过",
         *                         "item": "必填项检查",
         *                         "level": "必要",
         *                         "name": "【自然幢】数据入库标准比对",
         *                         "description": "检查【自然幢】数据是否符合入库标准",
         *                         "type": "必填项检查"
         *                     }];
         * let spanCols =  [{"key": "item"}];
         * let otherParams =  {"checkResult": "检查不通过"}
         * let title = "检查结果"
         * let subTitle = otherParams.checkResult;
         * co.DataDisplay.display_dataExists_simple(columns, hideColumns, rowList, spanCols, otherParams, title, subTitle)
         *
         */
        this.display_dataExists_simple = function (columns, hideColumns, rowList, spanCols, otherParams, title, subTitle, pagination, pageSize, notPopUp, elementIdIfNotPopUp, current, onloadFunc, width) {
            baseTable(
                {
                    notPopUp: notPopUp,
                    elementIdIfNotPopUp: elementIdIfNotPopUp,
                    title: title,
                    subTitle: subTitle,
                    columns: columns,
                    hideColumns: hideColumns,
                    rowList: rowList,
                    spanCols: spanCols,
                    otherParams: otherParams,
                    pagination: pagination,
                    pageSize: pageSize,
                    current: current ? current : 1,
                    onloadFunc: onloadFunc,
                    width: width
                }
            )
        }


        /**
         * 简易展示  无双击、列渲染、勾选、确认返回等
         * ②数据需要请求
         * 参数构成见 devManual
         * @param {function():Promise<TableRes>} dataPrepareFunction 列表数据请求，按约定格式 模板见sampleDataPrepareFunction
         * @param {String} title (弹窗)标题
         * @param {String} subTitle (表格)标题
         * @param {Boolean=} pagination 是否分页 默认否
         * @param {Number=} pageSize 分页大小
         * @param {String=} loadingText 加载中提示
         * @param {Boolean=} notPopUp 不弹窗
         * @param {String=} elementIdIfNotPopUp 页面dom的Id(当设置不弹窗时，需传入)
         * @param {Number=} [current=1] current 当前页 默认1
         * @param {function(tableVue)=} onloadFunc 加载完事件
         * @param {String=} [width=70vw] 宽度 可为百分比
         * @example
         * co.DataDisplay.display_dataNeedRequests_simple(
         * demo_dataPrepareFunc,
         * "质检结果",
         * "质检详情"
         * )
         */
        this.display_dataNeedRequests_simple = function (dataPrepareFunction, title, subTitle, loadingText, pagination, pageSize, notPopUp, elementIdIfNotPopUp, current, onloadFunc, width) {
            baseTable(
                {
                    notPopUp: notPopUp,
                    elementIdIfNotPopUp: elementIdIfNotPopUp,
                    title: title,
                    subTitle: subTitle,
                    loadingText: loadingText,
                    tableResCallbackFunc: dataPrepareFunction,
                    pagination: pagination,
                    pageSize: pageSize,
                    current: current ? current : 1,
                    onloadFunc: onloadFunc,
                    width: width
                }
            )
        }

        /**
         * 简易表单-处理子表单  无双击、列渲染、勾选、确认返回、分页等
         * ②数据需要请求
         * 参数构成见 devManual
         * @param {String} sysParentId 子表单控件字段
         * @param {String} sortKey 排序字段
         * @param {Array<keyInfo>} spanCols 需要进行合并的行(按列，如指定某列相同的行进行合并)。[{key:"item"},{key:"xxx"}]
         * @param {Array<columnInfo>} columns 表单头部（正常头部 {label:'头部显示文字',key:'绑定字段',align:'显示样式，如：居中 center'}；需要额外合并加一行，并且合并某一列，{label:'额外行',align:'显示样式，如：居中 center',children: 需合并列的正常头部}。）
         * @param {boolean} showSummary 是否在表尾显示合计行，默认否
         * @param {Array<keyInfo>} sumColumns 需要进行合计的行。[{key:"item"},{key:"xxx"}]
         * @param {int} keepDecimal 保留小数点数
         * @example
         * let sysParentId = "F597818A07BC43BF92DA"
         * let sortKey = "SQL_DXFJDCW.HSQY"
         * let spanCols =  [{"key": "item"}]
         * let columns = [{"label": "检查项", "key": "item"}, {"label": "检查问题", "key": "name"}, {
         *                         "label": "检查类型",
         *                         "key": "level"
         *                     }, {"label": "检查必要性", "key": "type"}, {"label": "检查结果", "key": "result"}, {
         *                         "label": "检查说明",
         *                         "key": "description"
         *                     }]
         * let showSummary = true
         * let sumColumns =  [{"key": "item"}]
         * let keepDecimal =  3
         * co.DataDisplay.display_dataNeedRequests_sysParent(sysParentId,sortKey,spanCols,columns,showSummary,sumColumns,keepDecimal)
         */
        this.display_dataNeedRequests_sysParent = function (sysParentId, sortKey, spanCols, columns,showSummary,sumColumns,keepDecimal) {
            if(!sumColumns) { sumColumns = [];}
            //获取子表单控制的值
            var rowList = $.F.getFieldValue(sysParentId);
            rowList.sort(function (a, b) {
                return a[sortKey] - b[sortKey];
            });
            var json = [{}]
            const { baseTable } = window.top.IBaseExpressLib
            baseTable({
                vue: Sgui,
                containerType: '2',
                selector: document.getElementById(sysParentId),
                width: '100%',
                rowKey: 'key',
                showSummary: showSummary,
                summaryConfigs: {  // 合并行配置
                    sumTxt: '合计',
                    keepDecimal: keepDecimal,
                    sumColumns: sumColumns
                },
                tableResCallback: () => {
                    return new Promise(resolve => {
                        setTimeout(() => {
                            resolve({
                                columns: columns,
                                hideColumns: [],
                                rowList: rowList,
                                count: rowList.length,
                                spanCols: spanCols
                            })
                        }, 2000);
                    })
                }
            })
        }

        /**
         * @description 全参数可配置的方法
         * @param  {baseTableParams} params 表格参数
         * @example
         * co.DataDisplay.dataDisplay_fullSetting({
         *                     title: "测试弹窗标题",
         *                     subTitle: "",
         *                     hideHeader: false,
         *                     rowKey: "name",
         *                     loadingText: "加载中",
         *                     notPopUp: "",
         *                     elementIdIfNotPopUp: "",
         *                     selectionType: 'checkbox',
         *                     pagination: true,
         *                     pageSize: 2,
         *                     current: 1,
         *                     width: "70vw",
         *                     tableResCallbackFunc: demo_dataPrepareFunc,
         *                     confirmCallbackFunc: demo_confirmCallbackFunc,
         *                     rowSelectionChangeFunc: demo_rowSelectionChangeFunc,
         *                     onRowDblclickFunc: demo_onRowDblclickFunc,
         *                     onloadFunc: demo_onloadFunc,
         *                     subTitleFunc: demo_subTitleFunc,
         *                     colSettingFunc: demo_colSettingFunc
         *                 }
         *             )
         */
        this.dataDisplay_fullSetting = function (params) {
            baseTable(
                {
                    ...params,
                })
        }


        /**
         //注意，传入了分页=true得自己做分页
         * 数据请求方法示意(26可用)
         * @returns {Promise<TableRes>}
         */
        function demo_dataPrepareFunc(param) {
            //param含请求的分页信息 param.page param.size
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: "/sinfoweb/gysc/public/landAndBuildAttributeCheck",
                    type: "POST",
                    async: true,
                    contentType: 'application/json',
                    data: JSON.stringify({
                        "ajRid": '41f967be-360c-438d-ad3e-4e5c52c1c235',
                        "isMultiLand": false,
                        "sDomainTableName": "PROJ_BDCQJSC",
                        "gisDataSourceName": "",
                        "qjDataSourceName": "仲恺GIS库",
                        "qjYwDataSourceName": "",
                        "isTempDB": "false",
                        "isPreSurvey": "false",
                        "ljzGids": ""
                    }),
                    success: function (returnData) {
                        if (returnData.code === "0") {
                            resolve(returnData.data);
                        } else {
                            $.messager.notice({type: 'error', title: '提示', desc: returnData.desc});
                            reject();
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        reject();
                        $.messager.notice({type: 'warning', title: '提示', desc: '获取失败！'});
                    }
                });

            })

        }

        /**
         * 表标题处理方法示意
         * @param {TableRes} params
         * @returns {string}
         */
        function demo_subTitleFunc(params) {
            if (params.rowList.length > 0) {
                return `<span>结果集数据集数量>0</span>`;
            } else {
                return `<span>结果集数据集数量=0</span>`;
            }

        }

        /**
         * 行双击方法示意
         * @param params
         */
        function demo_onRowDblclickFunc(params) {
            console.log(params.index)
            console.log(params.row)
            //关闭当前弹窗
            //Sgui.$modal.remove()
        }

        /**
         * 勾选变更事件方法示意
         * @param selectedRowKeys 选择的行的key集合
         * @param selectedRows  选择的行对象集合
         */
        function demo_rowSelectionChangeFunc(selectedRowKeys, selectedRows) {
            console.log(selectedRowKeys);
            console.log(JSON.stringify(selectedRows));
        }

        /**
         *
         * @param params  返回结果集，含已勾选的行数据
         * @returns {boolean} 弹窗可继续关闭  false阻止弹窗关闭
         */
        function demo_confirmCallbackFunc(params) {
            var selectedRows = params.selectedRows;
            if (selectedRows.length === 0) {
                mainObj.Message.error_middle("未选择数据！！")
                return false;
            } else {
                mainObj.Message.warning_topRight("已选择数据！！")
                return true;
            }
        }

        /**
         * 列渲染方法示意
         * @param col
         * @param tempCol
         * @returns {*}
         */
        function demo_colSettingFunc(col, tempCol) {
            if (col.key === 'result') {
                tempCol.render = (h, {row}) => {
                    let color = "green";
                    if (row.result.indexOf("警告") > -1) {
                        color = "DarkOrange";
                    }
                    if (row.result.indexOf("不通过") > -1) {
                        color = "red";
                    }
                    return h({
                        template: `<span style="color:${color}">${row.result}</span>`
                    })
                }
            }
            return tempCol
        }

        /**
         * 弹窗加载完毕示意
         * @param tableVue
         */
        function demo_onloadFunc(tableVue) {
            console.log("加载完毕！！！！！！！！！")
        }

        /**
         * baseTable测试样例(全自定义型)
         */
        this.testBaseTableSample1 = function () {
            mainObj.DataDisplay.dataDisplay_fullSetting({
                    title: "测试弹窗标题",
                    subTitle: "",
                    hideHeader: false,
                    rowKey: "name",
                    loadingText: "加载中",
                    notPopUp: "",
                    elementIdIfNotPopUp: "",
                    pagination: true,
                    pageSize: 2,
                    current: 1,
                    width: "70vw",
                    tableResCallbackFunc: demo_dataPrepareFunc,
                    confirmCallbackFunc: demo_confirmCallbackFunc,
                    onRowDblclickFunc: demo_onRowDblclickFunc,
                    onloadFunc: demo_onloadFunc,
                    subTitleFunc: demo_subTitleFunc,
                    colSettingFunc: demo_colSettingFunc,
                    rowSelection: {
                        selectedRowKeys: [],
                        type: 'checkbox',
                        onChange: demo_rowSelectionChangeFunc
                    }
                }
            );
        }

        /**
         * baseTable测试样例(固定数据、行渲染采用预设方案时)
         */
        this.testBaseTableSample2 = function () {
            mainObj.DataDisplay.dataDisplay_fullSetting({
                    title: "测试弹窗标题",
                    subTitle: "",
                    hideHeader: false,
                    rowKey: "name",
                    loadingText: "加载中",
                    notPopUp: "",
                    elementIdIfNotPopUp: "",
                    pagination: true,
                    pageSize: 2,
                    current: 1,
                    width: "70vw",
                    confirmCallbackFunc: demo_confirmCallbackFunc,
                    onRowDblclickFunc: demo_onRowDblclickFunc,
                    onloadFunc: demo_onloadFunc,
                    subTitleFunc: demo_subTitleFunc,

                    columns: [{"label": "检查项", "key": "item"}, {"label": "检查问题", "key": "name"}, {
                        "label": "检查类型",
                        "key": "level"
                    }, {"label": "检查必要性", "key": "type"}, {"label": "检查结果", "key": "result"}, {
                        "label": "检查说明",
                        "key": "description"
                    }]
                    ,
                    hideColumns: []
                    ,
                    rowList: [{
                        "result": "通过",
                        "item": "必填项检查",
                        "level": "必要",
                        "name": "【宗地使用权】数据入库标准比对",
                        "description": "检查【宗地使用权】数据是否符合入库标准",
                        "type": "必填项检查"
                    }, {
                        "result": "通过",
                        "item": "必填项检查",
                        "level": "必要",
                        "name": "【自然幢】数据入库标准比对",
                        "description": "检查【自然幢】数据是否符合入库标准",
                        "type": "必填项检查"
                    }, {
                        "result": "通过",
                        "item": "图形ID检查",
                        "level": "必要",
                        "name": "宗地与权籍库关联",
                        "description": "检测宗地GID/ZDDM是否与权籍库一致",
                        "type": "约束性检查"
                    }, {
                        "result": "不通过",
                        "item": "图形ID检查",
                        "level": "必要",
                        "name": "自然幢与权籍库关联",
                        "description": "检测自然幢GID/ZRZH是否与权籍库一致",
                        "type": "约束性检查"
                    }]
                    ,
                    spanCols: [{"key": "item"}]
                    ,
                    otherParams: {"checkResult": "检查不通过"}
                    ,
                    colDefaultType: 'textColor'
                    ,
                    colDefaultTypeParam: [{
                        colKey: "result",
                        settings: [{keyWord: "通过", color: "green"}, {keyWord: "警告", color: "DarkOrange"}, {
                            keyWord: "不通过",
                            color: "red"
                        }]
                    }],
                    rowSelection: {
                        selectedRowKeys: [],
                        type: 'radio',
                        onChange: demo_rowSelectionChangeFunc
                    }
                }
            );
        }


        /**
         * 结果通知 (暂只支持一种状态,但可传入多个按键和对应事件)
         * 暂时仅支持最多3个按钮，按业务场景应该足够，不够可以后续扩充参数即可
         * @param {'success'|'info'|'error'} status
         * @param {String} mainText 主显文本
         * @param {String} subText 副文本
         * @param {String} tipsTitle 提示标题
         * @param {String} tipsContent 提示文本
         * @param {String} btnText 按钮1文本
         * @param {''|'success'|'primary'|'info'|'warning'|'error'|'secondary'} btnType   按钮1样式
         * @param {sucCallback} confirmCallback 按钮1事件
         * @param {String} btnText2 按钮2文本
         * @param {''|'success'|'primary'|'info'|'warning'|'error'|'secondary'} btnType2 按钮2样式
         * @param {sucCallback} confirmCallback2 按钮2事件
         * @param {String} btnText3 按钮3文本
         * @param {''|'success'|'primary'|'info'|'warning'|'error'|'secondary'} btnType3 按钮3样式
         * @param {sucCallback} confirmCallback3 按钮3事件
         */
        this.resultDisplay = function (status, mainText, subText, tipsTitle, tipsContent, btnText, btnType, confirmCallback, btnText2, btnType2, confirmCallback2, btnText3, btnType3, confirmCallback3) {
            const {resultModal} = window.top.IBaseExpressLib
            if (!status) {
                status = "success";
            }
            if (!btnType) {
                btnType = "";
            }
            if (!mainText) {
                mainText = "success";
            }
            if (!subText) {
                subText = "success";
            }
            if (!tipsTitle) {
                tipsTitle = "";
            }
            if (!tipsContent) {
                tipsContent = "";
            }
            if (!btnText) {
                btnText = "查看详情";
            }
            let params = {
                vue: Sgui,
                status: status, // error | info | warning
                mainText: mainText,
                subText: subText,
                tipsTitle: tipsTitle,
                tipsContent: tipsContent,
                buttonList: [
                    {
                        btnText: btnText,
                        type: btnType,// 按钮通过设置type为primary、info、success、warning、error、secondary创建不同样式的按钮，不设置为默认样式
                        buttonCallback: () => {
                            console.log('查看详情')
                            // 回调函数返回false则不关闭弹窗
                            if (confirmCallback) {
                                return confirmCallback();
                            } else {
                                return true;
                            }
                        }
                    }
                ]
            };
            if (btnText2) {
                params.buttonList.push(
                    {
                        btnText: btnText2,
                        type: btnType2,// 按钮通过设置type为primary、info、success、warning、error、secondary创建不同样式的按钮，不设置为默认样式
                        buttonCallback: () => {
                            console.log('查看详情2')
                            // 回调函数返回false则不关闭弹窗
                            if (confirmCallback2) {
                                return confirmCallback2();
                            } else {
                                return true;
                            }
                        }
                    }
                )
            }
            if (btnText3) {
                params.buttonList.push(
                    {
                        btnText: btnText3,
                        type: btnType3,// 按钮通过设置type为primary、info、success、warning、error、secondary创建不同样式的按钮，不设置为默认样式
                        buttonCallback: () => {
                            console.log('查看详情3')
                            // 回调函数返回false则不关闭弹窗
                            if (confirmCallback3) {
                                return confirmCallback3();
                            } else {
                                return true;
                            }
                        }
                    }
                )
            }
            resultModal(params)
        }


    }

    /**
     * @class
     * @classdesc SQL操作相关方法
     */
    function Sql() {
        /**
         * 执行指定全局sql
         * 注意 ibase3.3.X版本后才支持其他数据源
         * 若版本不到，请使用 this.execSqlOld 方法
         * @param {String} sKey  sql名
         * @param {Map<String,Object>} oParam  参数Json
         * @param {String=} sDataBase  指定数据源
         * @returns {*}
         * @example
         * co.Sql.execSql("获取测绘单位名",
         * {
         *     "rid":"123"
         * }
         * )
         */
        this.execSql = function (sKey, oParam, sDataBase) {
            if (!sDataBase) {
                sDataBase = null;
            }
            return $.execsql(sDataBase, sKey, oParam, null, null, null, null, null);
        }


        /**
         * 执行指定sql
         * 若版本低于3.3.0 采用此方法。否则使用 execSql 方法
         * @param {String} sqlName sql名
         * @param {String} sqlParam sql 参数
         * @param {String} sOtherDb 其他的db
         * @returns {Object}
         * @deprecated
         * @example
         * //若版本低于3.3.0 采用此方法。否则使用 execSql 方法
         * co.Sql.execSqlOld("获取测绘单位名",
         * {
         *     "rid":"123"
         * }
         * )
         */
        this.execSqlOld = function (sqlName, sqlParam, sOtherDb) {
            if (!sOtherDb) {
                let sValue = $.execsql(null, sqlName, sqlParam, null, null, null, null, null);
                if (sValue.sql1.length > 0) {
                    return sValue.sql1;
                } else {
                    return [];
                }
            } else {
                //其他数据源的支持
                //暂只支持Get请求，仅支持sql1
                let url = "/sinfoweb/co/execsql?sql1=" + sqlName + "&param1=" + encodeURI(JSON.stringify(sqlParam)) + "&dsName=" + sOtherDb
                let aReturn = [];
                $.ajax({
                    url: url,
                    contentType: 'application/json; charset=utf-8',
                    type: 'get',
                    async: false,
                    data: "",
                    error: function (d, XMLHttpRequest, textStatus, errorThrown) {
                        console.log(d);
                    }
                    ,
                    success: function (d) {
                        aReturn = d.sql1;
                    }
                });
                return aReturn;
            }
        }

    }


    /**
     *
     * @class
     * @classdesc 随机数 相关方法
     */
    function Random() {
        /**
         * 获取UUID
         * @param {Number} iCount 个数
         * @param {Boolean} usingMysql （从Mysql获取  需要有 "获取UUID" 全局SQL（仲恺有））  一般不使用 减轻数据库压力(但是格式较为统一)
         * @returns {Object}
         * @example
         * co.Random.UUID();
         * co.Random.UUID(3);
         */
        this.UUID = function (iCount, usingMysql) {

            let aRet = [];
            if (!iCount) {
                iCount = 1;
            }
            for (let i = 0; i < iCount; i++) {
                if (usingMysql) {
                    // 不使用。
                    // let aUUID = mainObj.Sql.execSqlOld("获取UUID", {});
                    // aRet.push(aUUID[0].UUID);
                    aRet.push($.uuid());
                } else {
                    aRet.push($.uuid());
                }
            }
            if (aRet.length > 1) {
                return aRet;
            } else {
                return aRet[0];
            }
        }

        /**
         * 含时间戳形式的随机编号 时间戳13位  所以正常13位以上
         * 可以加自定义头部与尾部
         * @param {String} sPre 前置字符串
         * @param {String} sPend 后置字符串
         * @param {Number} sLength 总长度，不够将在 前置 + 时间戳 + 随机数 + 后置字符串的随机数处添加字符串
         * @param {Boolean=} bCut 超过长度时，是否截断返回
         * @returns {string}
         * @example
         * co.Random.randomNumByDate("你好","世界",30,true);
         * co.Random.randomNumByDate("","",30,true);
         */
        this.randomNumByDate = function (sPre, sPend, sLength, bCut) {
            //1 6399 6693 6683
            if (!sPre) sPre = "";
            if (!sPend) sPend = "";
            if (!sLength) sLength = 13;
            let rdStr = sPre + new Date().getTime() + sPend;
            let lengthLeft = sLength - rdStr
            if (lengthLeft > 0) {
                let num = "";
                for (let i = 0; i < lengthLeft; i++) //随机数
                {
                    num += Math.floor(Math.random() * 10);
                }
                rdStr = sPre + new Date().getTime() + num + sPend;
            }
            if (bCut) {
                return rdStr.substring(0, sLength)
            } else {
                return rdStr;
            }
        }

        /**
         * 随机数字串
         * 可自定义固定的头部与尾部
         * @param {Number} sLength 总长度
         * @param {String=} sPre 前置字符串
         * @param {String=} sPend 后置字符串
         * @param {Boolean=} bCut 超过长度是否截断返回
         * @returns {string}
         * @example
         * co.Random.randomNumStr(30,"你好","世界",true);
         * co.Random.randomNumStr(30);
         */
        this.randomNumStr = function (sLength, sPre, sPend, bCut) {
            if (!sPre) sPre = "";
            if (!sPend) sPend = "";
            if (!sLength) sLength = 13;
            let rdStr = "";
            let lengthLeft = sLength - sPre.length - sPend.length
            if (lengthLeft > 0) {
                let num = "";
                for (let i = 0; i < lengthLeft; i++) //随机数
                {
                    num += Math.floor(Math.random() * 10);
                }
                rdStr = sPre + num + sPend;
            }
            if (bCut) {
                return rdStr.substring(0, sLength)
            } else {
                return rdStr;
            }
        }


    }

    /**
     * @class
     * @classdesc http 相关方法
     */
    function Http() {


        /**
         * 通用请求方法(新)
         * @param {httpRequestParam} param
         * @returns {{}}
         * @example
         * let data = {
    param: {
        "tableName": "PROJ_XMWJCGSC",
        "fields": "xmnf",
        "condName": "RID",
        "fuzzy": false,
        "condValue": "a53460b0-c305-4440-8c07-c19c5bb6f649"
    },
    dsName: ""
    }

         //前端请求 GET
         co.Http.request({
    url: "/sinfoweb/co/query",
    data: data,
    method: "GET"
})
         //前端请求 POST
         co.Http.request({
    url: "/sinfoweb/co/query",
    data: data
})
         //后端请求 GET
         co.Http.request({
    url: "/sinfoweb/co/query",
    backgroundRequest: true,
    data: data,
    method: "GET"
})

         //后端请求 POST
         co.Http.request({
    url: "/sinfoweb/co/query",
    backgroundRequest: true,
    data: data,
    method: "GET"
})
         //调整 contentType 默认JSON.
         //调整 responseType 默认JSON
         co.Http.request({
    url: "/sinfoweb/co/query",
    backgroundRequest: true,
    contentType:contentType:co.constant.CONTENTTYPE.XFORM,
    responseType:'blob',
    data: data,
    method: "GET"
})

         //其他参数见注释
         */
        this.request = function (param) {
            let {
                baseUrl = "",
                url = "",
                method = "post",
                async = true,
                backgroundRequest = false,
                contentType = mainObj.constant.CONTENTTYPE.JSON,
                responseType = "json",
                data = {},
                success = (ret) => {
                },
                error = (ret) => {
                    console.error({ret})
                },
                timeout = 100,
                headers = {
                    "Content-Type": contentType
                },
                ...other
            } = param

            const headerJson = {
                "Content-Type": mainObj.constant.CONTENTTYPE.JSON
            }


            //get请求时，把oJson的拼接到url后面(后台需要做此处理)
            let joinChar = "&";
            let bgRequestUrl = url;
            if (bgRequestUrl.indexOf("?") === -1) {
                joinChar = "?";
            }
            if (method.toUpperCase() === "GET") {
                for (let x in data) {
                    bgRequestUrl += joinChar + x + "=" + ((data[x] === "") ? "" : encodeURI((typeof data[x]) === "object" ? JSON.stringify(data[x]) : data[x]));
                    if (joinChar === "?") {
                        joinChar = "&";
                    }
                }
            }

            //后台处理(记录)参数
            let baseBackGroundParam = {
                "operateRid": mainObj.domainRid,
                "operateTime": mainObj.DateUtil.now(),
                "operateUser": mainObj.User.userName(),
                "operateUserId": mainObj.User.userId(),
                "fullUrl": bgRequestUrl,
                "method": method,
                "json": data,
                "timeout": timeout
            }


            let axiosParam = {}
            //请求参数
            //后台请求 适用于跨域、标准化JSON输入输出，勿用于文件流。
            if (backgroundRequest) {
                //后台请求接口，适用于跨域、标准化JSON输入输出，勿用于文件流。
                axiosParam = {
                    method: "post",
                    url: "/sinfoweb/co/expressionHttpRequest",
                    headers: headers,
                    async: async,
                    data: baseBackGroundParam,
                }

                if (baseUrl) {
                    axiosParam.data.fullUrl = baseUrl + axiosParam.data.fullUrl;
                }

            } else {
                //直接请求
                axiosParam = {
                    url: url,
                    headers: headers,
                    responseType: responseType,
                    method: method,
                    async: async,
                    timeout: timeout * 1000
                }
                if (axiosParam.method.toUpperCase() === "GET") {
                    axiosParam.params = data;
                    axiosParam.data = data;
                } else {
                    // if (contentType === mainObj.constant.CONTENTTYPE.XFORM) {
                    //     let formData = new FormData();
                    //     for (let x in data) {
                    //         formData.append(x, data[x])
                    //     }
                    //     axiosParam.data = formData;
                    // } else {
                    axiosParam.data = data;
                    // }
                }
                //自定义请求头
                if (headers) {
                    axiosParam.headers = headers;
                }

                // `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
                //  便于使用相对url。　
                if (baseUrl) {
                    axiosParam.baseURL = baseUrl;
                }

            }

            //返回值(同步)
            let resultSync = {};
            //后台请求
            if (backgroundRequest) {
                //同步时，用ajax处理
                if (!async) {
                    try {
                        resultSync = mainObj.Http.requestByBackend(
                            baseBackGroundParam.fullUrl, baseBackGroundParam, false, method, (res) => {
                                success(res)
                            }, (res) => {
                                error(res)
                            }, "", "", "", true, timeout);

                    } catch (e) {
                        error(e)
                        if (async === false) {
                            resultSync = e;
                        }
                    }
                    return resultSync;
                } else {
                    //异步请求
                    axios(axiosParam).then(result => {
                            //继续执行
                            if (result.code === 0) {
                                success(result.data);
                            } else {
                                throw "后台接口请求异常：" + result.desc;
                            }
                        }
                    ).catch(errResult => {
                        //异常
                        error(errResult)
                    })
                }
            } else {
                //异步请求
                //同步时，用ajax处理
                if (!async) {
                    try {
                        // 使用jQuery的$.ajax进行真正的同步请求
                        let syncResult = null;
                        $.ajax({
                            url: axiosParam.url,
                            headers: axiosParam.headers,
                            type: method.toUpperCase(),
                            async: false, // 关键：确保同步
                            timeout: timeout * 1000,
                            contentType: contentType,
                            data: method.toUpperCase() === 'GET' ? null : (typeof axiosParam.data === 'string' ? axiosParam.data : JSON.stringify(axiosParam.data)),
                            success: function(result) {
                                syncResult = result;
                                // 记录日志
                                baseBackGroundParam.send = baseBackGroundParam.json;
                                delete baseBackGroundParam.json;
                                baseBackGroundParam.url = baseBackGroundParam.fullUrl;
                                delete baseBackGroundParam.fullUrl;
                                if (responseType === "json") {
                                    baseBackGroundParam.result = JSON.stringify(result);
                                } else if (responseType === "text") {
                                    baseBackGroundParam.result = result;
                                } else {
                                    baseBackGroundParam.result = "非json/text 结果，未存档。";
                                }
                                baseBackGroundParam.spend = (new Date(mainObj.DateUtil.now())).getTime() - (new Date(baseBackGroundParam.operateTime)).getTime();

                                // 同步写日志
                                let logResult = null;
                                $.ajax({
                                    url: '/sinfoweb/co/expressionApiUsedLog',
                                    type: 'post',
                                    async: false,
                                    contentType: mainObj.constant.CONTENTTYPE.JSON,
                                    data: JSON.stringify(baseBackGroundParam),
                                    success: function(logData) {
                                        logResult = logData;
                                    },
                                    error: function(err) {
                                        console.error("日志写入异常", err);
                                    }
                                });

                                // 调用成功回调并设置返回结果
                                success(result);
                                resultSync = result;
                            },
                            error: function(err) {
                                error(err);
                                resultSync = err;
                            }
                        });

                        return resultSync;
                    } catch (e) {
                        error(e);
                        return e;
                    }
                } else {
                    let axiosPromise = axios(axiosParam);

                    // 使用新的变量存储axios请求的promise对象，以避免修改原有逻辑
                    axiosPromise.then(result => {
                            //记录日志
                            baseBackGroundParam.send = baseBackGroundParam.json;
                            delete baseBackGroundParam.json;
                            baseBackGroundParam.url = baseBackGroundParam.fullUrl;
                            delete baseBackGroundParam.fullUrl;
                            if (responseType === "json") {
                                baseBackGroundParam.result = JSON.stringify(result);
                            } else if (responseType === "text") {
                                baseBackGroundParam.result = result;
                            } else {
                                baseBackGroundParam.result = "非json/text 结果，未存档。";
                            }
                            baseBackGroundParam.spend = (new Date(mainObj.DateUtil.now())).getTime() - (new Date(baseBackGroundParam.operateTime)).getTime();
                            let axiosLogParam = {
                                url: '/sinfoweb/co/expressionApiUsedLog',
                                method: 'post',
                                contentType: contentType,
                                async: async,
                                headers: headerJson,
                                data: JSON.stringify(baseBackGroundParam)
                            }
                            return axios(axiosLogParam);
                        }
                    ).then((resultLog) => {
                        //resultLog===true 是为了兼容旧的API
                        if (resultLog === true || (resultLog.hasOwnProperty("code") && resultLog.code === 0)) {
                            //继续执行
                            success(baseBackGroundParam.result);
                            if (async === false) {
                                resultSync = baseBackGroundParam.result;
                            }
                        } else {
                            throw "日志写入异常：" + resultLog.desc;
                        }

                    }).catch(errResult => {
                        //异常
                        error(errResult)
                        if (async === false) {
                            resultSync = errResult;
                        }
                    })
                }
            }
        }


        /**
         * 通用后台处理Http请求 便于记录
         * 请求路径优先级: 全路径 > 配置存放的短路径 + API > 直接传入的短路径 + API
         * @param {String} fullUrl 完整请求路径URL
         * @param {Map<String,Object>} oJson 提交的参数
         * @param {String=} headUrlCfg  配置存放的短路径(头部) 这边仅传入配置项的ID
         * @param {String=} headUrl 直接传入的短路径(头部)
         * @param {Boolean=} cover 开启遮罩层
         * @param {'POST'|'GET'|'PUT'|'DELETE'} [sMethod="POST"]  请求方法 不填默认Post
         * @param {sucCallback=} [fSuccess=commonCallback]  成功回调
         * @param {errCallback=} fError 报错回调
         * @param {String=} api  配合短的头路径拼接成完整url
         * @param {Boolean=} sync 同步调用，返回值 默认异步，返回promise
         * @param {Number=} timeout 超时时间  okhttp默认10s 这里传入秒
         * @returns {*}
         * @deprecated
         * @example
         * 过时，请使用co.Http.request方法
         * let oParam = JSON.parse(JSON.stringify(oParamOri));
         * oParam.urlPdf = sOriFileUrl.url;
         * let signUrl = mainObj.Http.requestByBackend(signApiUrl, oParam);
         * signUrl.then(function (data) {
         *      //doSth.
         * }
         * )
         */
        this.requestByBackend = function (fullUrl, oJson, cover, sMethod, fSuccess, fError, headUrl, headUrlCfg, api, sync, timeout) {
            let async = true;
            if (sync) {
                async = false;
            }
            if (!sMethod) {
                //默认post
                sMethod = "POST";
            }
            let ffather = this;
            let def = $.Deferred();
            //做一些异步操作//开个遮罩层
            if (cover) {
                Vue.prototype.$loading.show({backgroundColor: 'rgba(255,255,255,0.2)'})
            }
            let sKey = {
                "operateRid": mainObj.domainRid,
                "operateTime": $.nowStr(),
                "operateUser": $.O.getUserName(),
                "operateUserId": $.O.getUserId(),
                "fullUrl": fullUrl,
                "headUrl": headUrl,
                "headUrlCfg": headUrlCfg,
                "method": sMethod,
                "api": api,
                "json": oJson,
                "timeout": timeout ? timeout : 60
            }
            let result = "";
            $.ajax({
                url: "/sinfoweb/co/expressionHttpRequest",
                contentType: 'application/json; charset=utf-8',
                type: 'post',
                async: async,
                data: JSON.stringify(sKey),
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    if (cover) {
                        Vue.prototype.$loading.hide();
                    }
                    if (fError) {
                        fError(XMLHttpRequest, textStatus, errorThrown, def)
                    } else {
                        mainObj.Message.warning_topRight("方法执行失败!！")
                        if (async) {
                            console.log("直接请求结束")
                        } else {
                            result = "";
                        }
                    }
                }
                ,
                success: function (d) {
                    if (cover) {
                        Vue.prototype.$loading.hide();
                    }
                    if (fSuccess) {
                        fSuccess(d, def);
                    } else {
                        if (async) {
                            ffather.commonCallback(d, def);
                            console.log(d);
                        } else {
                            result = d;
                        }
                    }
                }
            });
            if (sync) {
                return result;
            } else {
                return def.promise();
            }
        }


        /**
         * 内部方法 通用接口回调
         * @param {*} data 返回的对象
         * @param {*} def promise
         * @deprecated
         */
        this.commonCallback = function (data, def) {
            Vue.prototype.$loading.hide();
            if ((typeof data) == 'string') {
                def.resolve(JSON.parse(data));
            } else {
                if (data.hasOwnProperty("data") && (typeof data.data) == 'string') {
                    let ret = "";
                    try {
                        ret = JSON.parse(data.data)
                    } catch (e) {
                        ret = data
                    }
                    def.resolve(ret);
                } else {
                    def.resolve(data);
                }
            }
        }


        /**
         * 通用前端处理Http请求 便于记录
         * @param {String} url 完整请求路径URL
         * @param {Object<String,Object>} oJson 提交的参数
         * @param {Boolean=} cover 遮罩层
         * @param {String=} [method="POST"]   请求方法 'POST'|'GET'|'PUT'|'DELETE' 不填默认Post
         * @param {sucCallback=} fCallback  回调
         * @param {Boolean=} sync 同步调用，返回值 默认异步，返回promise
         * @param {String=} contentType  contentType
         * @param {Number=} timeout 超时时间  okhttp默认10s 这里传入秒
         * @returns {*} 当同步时，返回后端返回的值 异步时 返回promise
         * @deprecated
         * @example
         * 过时，请使用co.Http.request方法
         * let oParam = JSON.parse(JSON.stringify(oParamOri));
         * oParam.urlPdf = sOriFileUrl.url;
         * let signUrl = mainObj.Http.requestByDirectory(signApiUrl, oParam);
         * signUrl.then(function (data) {
         *      //doSth.
         * }
         * )
         */
        this.requestByDirectory = function (url, oJson, cover, method, fCallback, sync, contentType, timeout, responseType) {

            if (!contentType) {
                contentType = 'application/json; charset=utf-8'
            }
            let async = true;
            if (sync) {
                async = false;
            }
            if (!method) {
                //默认post
                method = "POST";
            }
            //get请求时，把oJson的拼接到url后面
            let joinChar = "&"
            if (url.indexOf("?") === -1) {
                joinChar = "?";
            }
            if (method.toUpperCase() === "GET") {
                for (let x in oJson) {
                    url += joinChar + x + "=" + ((oJson[x] === "") ? "" : encodeURI((typeof oJson[x]) === "object" ? JSON.stringify(oJson[x]) : oJson[x]));
                    if (joinChar === "?") {
                        joinChar = "&";
                    }
                }
                //get请求时， ajax会把data中的数据进行自动转义，但是对json的支持又不完整。所以直接清空，拼接到url中处理
                oJson = "";
            }

            let ffather = this;
            let def = $.Deferred();
            //做一些异步操作//开个遮罩层
            if (cover) {
                Vue.prototype.$loading.show({backgroundColor: 'rgba(255,255,255,0.2)'})
            }
            let sKey = {
                "operateRid": mainObj.domainRid,
                "operateTime": $.nowStr(),
                "operateUser": $.O.getUserName(),
                "operateUserId": $.O.getUserId(),
                "url": url,
                "send": oJson,
                "timeout": timeout ? timeout : 10
            }
            let ajaxParam = {
                url: url,
                contentType: contentType,
                type: method,
                async: async,
                data: oJson ? (contentType == mainObj.constant.CONTENTTYPE.XFORM ? oJson : JSON.stringify(oJson)) : ""
            }
            if (!responseType) {
                responseType = "json";
            }else{
                ajaxParam.dataType = responseType
            }
            if (responseType !== "json" && responseType !== "text") {
                ajaxParam.dataType = responseType
            }
            let result = "";
            $.ajax(ajaxParam).then(
                function (res) {
                    if (responseType.toUpperCase() === "JSON") {
                        sKey.result = JSON.stringify(res);
                    } else if (responseType.toUpperCase() === "TEXT") {
                        sKey.result = res;
                    } else {
                        sKey.result = "非json/text 结果，未存档。";
                    }
                    sKey.spend = (new Date($.nowStr())).getTime() - (new Date(sKey.operateTime)).getTime();
                    return $.ajax({
                            url: '/sinfoweb/co/expressionApiUsedLog',
                            type: 'POST',
                            contentType: mainObj.constant.CONTENTTYPE.JSON,
                            async: async,
                            data: JSON.stringify(sKey)
                        }
                    )
                }
            )
                .then(
                    function (res1) {
                        console.log('记录完毕：' + res1);
                        Vue.prototype.$loading.hide();
                        if (fCallback) {
                            fCallback(sKey.result, def);
                        } else {
                            if (async) {
                                ffather.commonCallback(sKey.result, def);
                                console.log(sKey.result);
                            } else {
                                result = sKey.result;
                            }
                        }
                    }
                )
            if (sync) {
                return result;
            } else {
                return def.promise();
            }

        }
    }

    /**
     * @class
     * @classdesc 配置 相关方法
     * @example
     * co.Config.getGlobalValue("domain");
     */
    function Config() {
        /**
         * 获取配置(系统外部服务配置)
         * @param sKey 配置Key
         * @returns {string|*}
         */
        this.getGlobalValue = function (sKey) {
            let sValue = $.execsql(null, "获取外部服务配置项", {"skey": sKey}, null, null, null, null, null);
            if (sValue.sql1.length > 0) {
                return sValue.sql1[0].SVALUE;
            } else {
                return "";
            }
        }


        //SET
    }


    /**
     * @class
     * @classdesc 通用签章方法
     */
    function Sign() {
        /**
         * 单个盖章方法 pdf
         * 请使用signPdf方法
         * @param {Object} oParamOri 盖章参数
         * @param {String} signApiUrl  盖章接口
         * @param {String} uploadApiUrl 文件上传接口 (签章后的文件通过此接口从签章服务器下载到ibase)
         * @param {Object<String,String>} sOriFileUrl 盖章文件网络路径 (用于盖章接口访问并下载)
         * @returns {*}
         */
        let signSingleFile = function (oParamOri, signApiUrl, uploadApiUrl, sOriFileUrl) {
            let def = $.Deferred();
            if (!sOriFileUrl) {
                def.resolve("ERROR:无需签章");
            } else {
                let oParam = JSON.parse(JSON.stringify(oParamOri));
                oParam.urlPdf = sOriFileUrl.url;
                let signUrl = mainObj.Http.requestByBackend(signApiUrl, oParam);
                signUrl.then(function (data) {
                    if (!(data.code === 0)) {
                        def.resolve("ERROR: 签名发生了错误:" + data.desc);
                    } else {
                        let oParam2 = {
                            "filePath": data.data
                        }
                        let uploadToIbase = mainObj.Http.requestByBackend(uploadApiUrl, oParam2);
                        uploadToIbase.then(function (data2) {
                            if (data2.newFilePath) {
                                //保留原来的文件名+_已签
                                let sDotIndex = sOriFileUrl.name.lastIndexOf(".");
                                let sOriNameFirst = sOriFileUrl.name.substring(0, sDotIndex)
                                let sOriNameLast = sOriFileUrl.name.substring(sDotIndex)
                                let sActUrl = data2.newFilePath.split("|")[1]
                                def.resolve(sOriNameFirst + "_已签" + sOriNameLast + "|" + sActUrl);
                            } else {
                                def.resolve("ERROR:签名后上传ibase发生了错误:" + data2.desc);
                            }
                        });
                    }
                });
            }
            return def.promise();
        }

        /**
         * 签章(PDF)(注意 非水印)
         * 支持多文件
         * @param {shortFieldName} sPdfField 需签章的pdf所在字段
         * @param {shortFieldName} extraPdfField 额外的签章附件所在字段
         * @param {shortFieldName} sPdfSignedField 签章完毕的pdf存放字段
         * @param {shortFieldName} sPdfSignedNameField 签章完毕后, 此字段存放签章人名字(当前处理人)
         * @param {shortFieldName} sPdfSignedDateField 签章完毕后, 此字段存放签章日期(当前日期)
         * @param {String} signSettingCfg 签章数量/位置等配置存放的外部配置ID
         * @param {String} signApiUrlCfg  签章接口路径配置ID (头部接口)
         * @param {String} signApiUrlDetailCfg 签章子接口API配置ID (接口)
         * @example
         * co.Sign.signPdf("CGBG","CGBGNEW");
         */
        this.signPdf = function (sPdfField, sPdfSignedField, sPdfSignedNameField, sPdfSignedDateField, signSettingCfg, signApiUrlCfg, signApiUrlDetailCfg, extraPdfField) {
            let sPdfStr = mainObj.getValue(sPdfField);
            if (!sPdfStr) {
                warningAlert("未找到附件, 请上传待签章文件后再试!");
                return;
            }

            if (!signSettingCfg) {
                signSettingCfg = "signSetting"
            }

            if (!signApiUrlCfg) {
                signApiUrlCfg = "signApiUrl"
            }

            let signApiUrl = mainObj.Config.getGlobalValue(signApiUrlCfg);
            if (!signApiUrl) {
                //没配置. 默认用公司测试环境部署的
                signApiUrl = "http://172.16.50.135:17951"
            }

            if (!signApiUrlDetailCfg) {
                signApiUrlDetailCfg = "/api/eSign/SignPdfAsOfficial"
            }

            signApiUrl = signApiUrl + signApiUrlDetailCfg
            let signSetting = mainObj.Config.getGlobalValue(signSettingCfg);
            if (!signSetting) {
                signSetting = JSON.stringify(
                    [{
                        "page": 0,
                        "x": 400,
                        "y": 50,
                        "xyType": 5
                    }]
                )
            }
            let oSignSetting = JSON.parse(signSetting);

            let uploadApiUrl = mainObj.Config.getGlobalValue("domain_") + "/file/public/downFileByHttpUrl"

            let oParamOri = {
                "urlPdf": "",
                "param": {
                    "items": oSignSetting,
                    "signKey": "SignPNG1",
                    "signInfo": ""
                }
            }

            let processingQue = [];
            let aUrl = mainObj.File.handleAttachmentUrl(sPdfStr);
            if (extraPdfField) {
                let sPdfStr2 = mainObj.getValue(extraPdfField);
                if (!sPdfStr) {
                    let aUrl2 = mainObj.File.handleAttachmentUrl(sPdfStr2);
                    aUrl.push.apply(aUrl, aUrl2)
                }

            }
            let aNewMacroList = [];
            for (let url of aUrl) {
                processingQue.push(signSingleFile(oParamOri, signApiUrl, uploadApiUrl, url).done(function (data) {
                    aNewMacroList.push(data);
                }))
            }

            $.when.apply($, processingQue).then(function () {
                //完結后 将文件赋值到已签名对象中
                if (aNewMacroList.length > 0) {
                    let sNewMacroPath = aNewMacroList.join("::");
                    if (sNewMacroPath.indexOf("ERROR") > -1) {
                        errorAlert("签章发生了错误,请稍候再试");
                    } else {
                        mainObj.setDomainValue(sPdfSignedField, sNewMacroPath)
                        if (sPdfSignedNameField) {
                            mainObj.setDomainValue(sPdfSignedNameField, $.O.getUserName())
                        }
                        if (sPdfSignedDateField) {
                            mainObj.setDomainValue(sPdfSignedDateField, mainObj.Date.dateNowShort())
                        }
                    }
                }
            });
        }

    }


    /**
     * @class
     * @classdesc 日期相关方法
     */
    function DateUtil() {


        /**
         * 获取当天短日期格式(定制是否补0)
         * @param {Boolean=}fullYear true 则为 四位 , 否则后2位
         * @param {Boolean=}fullMonth true 则为 2位, 不足高位补0  否则不补0
         * @param {Boolean=}fullDay  true 则为2位, 不足高位补0,否则不补0
         * @param {String=} [splitChar="-"]splitChar  默认 "-" 分开
         * @returns {string}
         * @example
         * co.DateUtil.dateNowShortByParam(false,false,false,"-")
         * '21-1-3'
         * co.DateUtil.dateNowShortByParam(true,true,true,"-")
         * '2021-01-25'
         * co.DateUtil.dateNowShortByParam(false,true,true,"-")
         * '21-01-25'
         */
        this.dateNowShortByParam = function (fullYear, fullMonth, fullDay, splitChar) {
            let year = fullYear === true ? $.Y : $.y;
            let month = fullMonth === true ? $.M : $.m;
            let day = fullDay === true ? $.D : $.d;
            if (!splitChar) {
                splitChar = "-";
            }
            return year + splitChar + month + splitChar + day;

        }

        /**
         * 拓展原生Date对象方法
         * @param {String} format 需要的日期格式
         * @return {*}
         * @example
         * 1.当前时间
         * let dateNow = new Date().format("yyyy-MM-dd hh:mm:ss")
         * 2.时间戳转常用时间
         * let d = new Date(timestamp)
         * let dateNow = d.format("yyyy-MM-dd hh:mm:ss")
         * let dateNow = d.format("yyyy-MM-dd")
         */
        Date.prototype.format = function (format) {
            let o = {
                "M+": this.getMonth() + 1, // month
                "d+": this.getDate(), // day
                "h+": this.getHours(), // hour
                "m+": this.getMinutes(), // minute
                "s+": this.getSeconds(), // second
                "q+": Math.floor((this.getMonth() + 3) / 3), // quarter
                "S": this.getMilliseconds()
                // millisecond
            }
            if (/(y+)/.test(format)) {
                format = format.replace(RegExp.$1, (this.getFullYear() + "")
                    .substr(4 - RegExp.$1.length));
            }
            for (let k in o) {
                if (new RegExp("(" + k + ")").test(format)) {
                    format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
                        : ("00" + o[k]).substring(("" + o[k]).length));
                }
            }
            return format;
        }


        /**
         * 获取当天短日期格式
         * @example
         * co.DateUtil.dateNowShort()
         * '2021-01-25'
         */
        this.dateNowShort = function () {
            return $.Y + '-' + $.M + '-' + $.D;
        }

        /**
         * 获取当前长日期{yyyy-MM-dd hh:mm:ss}
         * @example
         * co.DateUtil.now()
         * '2021-01-25 22:22:22'
         */
        this.now = function () {
            return new Date().format("yyyy-MM-dd hh:mm:ss");
        }


        /**
         * 获取当前长日期{yyyy-MM-dd hh:mm:ss}
         * @example
         * co.DateUtil.dateNowLong()
         * '2021-01-25 22:22:22'
         */
        this.dateNowLong = function () {
            return this.now();
        }


        /**
         * 时间戳转日期
         * @param {String} timeStamp 时间戳
         * @param {String=} [format='yyyy-MM-dd'] format 日期格式 默认 yyyy-MM-dd
         * @example
         * co.DateUtil.timeStamp2DateStr(1483200000000)
         * co.DateUtil.timeStamp2DateStr(1483200000000,'yyyy-MM-dd hh:mm:ss')
         */
        this.timeStamp2DateStr = function (timeStamp, format) {
            if (!timeStamp) {
                return "";
            }
            const date = new Date(timeStamp + 8 * 3600 * 1000);
            if (format) {
                return date.format(format);
            } else {
                return date.format('yyyy-MM-dd');
            }
        }

        /**
         * 日期转时间戳
         * @param {String} dateString 日期字符串
         * @example
         * co.DateUtil.dateStr2timeStamp('2022-3-30')
         */
        this.dateStr2timeStamp = function (dateString) {
            if (!dateString.trim()) {
                return "";
            }
            const date = new Date(dateString);
            return date.getTime();
        }
        /**
         * 计算时间间隔
         * @param startStr 开始时间（为空则为当前时间），字符串格式 2024-03-20
         * @param endStr  结束时间（为空则为当前时间），字符串格式 2024-03-20
         * @param type 天、时、分、秒（为空默认天）
         */
        this.calculateTime = function (startStr, endStr, type) {
            let start = new Date();
            if (start) {
                start = new Date(startStr);
            }
            let end = new Date();
            if (endStr) {
                end = new Date(endStr);
            }
            if (!type) {
                type = "天";//默认天
            }
            let timeDiff = Math.abs(end - start);
            let returnStr = "";
            switch (type) {
                case "天":
                    returnStr = Math.floor(timeDiff / (1000 * 3600 * 24));
                    break;
                case "时":
                    returnStr = Math.floor((timeDiff % (1000 * 3600 * 24)) / (1000 * 3600));
                    break;
                case "分":
                    returnStr = Math.floor((timeDiff % (1000 * 3600)) / (1000 * 60))
                    break;
                case "秒":
                    returnStr = Math.floor((timeDiff % (1000 * 60)) / 1000);
                    break;
            }
            return returnStr;
        }
    }
    /**
     * @class
     * @classdesc 字典相关方法
     */
    function Dict() {

        /**
         * 获取字典字段的CODE（保存的值）
         * @param {String} dictFieldName 字典字段名
         * @example
         * co.getDicValue("SEX")
         * "1"
         */
        this.getDicValue = function (dictFieldName) {
            return mainObj.getDomainValue(dictFieldName);
        }

        /**
         * TODO 平台文档有误，此方法未实现
         * 填写字典项(文本)
         * @param {String} dictFieldName 字典字段名
         * @param {String} dicDisplayText 字典展示值
         */
        this.setDicText = function (dictFieldName, dicDisplayText) {
            $.F.setFieldDicText(mainObj.domainTableName + "." + dictFieldName.toUpperCase(), dicDisplayText);
            console.log("TODO:方法未实现");
        }
        /**
         * TODO 未实现
         * 填写字典项Code
         * @param {String} dictFieldName 字典字段名
         * @param {String} dicCode 字典CODE
         */
        this.setCode = function (dictFieldName, dicCode) {
            //TODO
            console.log("TODO:方法未实现");
        }

        /**
         * 设置下拉列表
         * @param {shortFieldName} fieldName 下拉控件
         * @param {Array<dropdownItem>}dropdownItems
         */
        this.setDropdownList = function (fieldName, dropdownItems) {
            SGUI_setFieldValue(mainObj.params.table + "." + fieldName, dropdownItems);
        }

        /**
         * 获取整个字典列表项
         * @param {String} dictTitleOrDicCode 字典中文名或字典分类代码ID
         * @returns {Array}
         * @example
         * co.Dict.getWhole("业务类型")
         * co.Dict.getWhole("YWLX")
         */
        this.getWhole = function (dictTitleOrDicCode) {
            let wholeDict = $.C(dictTitleOrDicCode, "");
            if (wholeDict) {
                return wholeDict;
            } else {
                return [];
            }
        }

        /**
         * 获取指定字典中含有指定CODE的对象
         * @param {String} dictTitleOrDicCode 字典中文名或字典分类代码ID
         * @param {String} content 指定CODE
         * @returns {Object}
         * @example
         * co.Dict.getDicCodeLike("业务类型","JGYS")
         *
         */
        this.getDicCodeLike = function (dictTitleOrDicCode, content) {
            let wholeDict = $.C(dictTitleOrDicCode, "");
            let aRet = [];
            if (wholeDict) {
                return wholeDict.filter(p => p.code.indexOf(content) > -1);
            } else {
                return [];
            }
        }

        /**
         * 获取指定字典中含有指定展示文本的对象
         * @param {String} dictTitleOrDicCode 字典中文名或字典分类代码ID
         * @param {String} content 指定文本
         * @returns {Array}
         * @example
         * co.Dict.getDicDisplayTextLike("业务类型","竣工验收")
         */
        this.getDicDisplayTextLike = function (dictTitleOrDicCode, content) {
            let wholeDict = $.C(dictTitleOrDicCode, "");
            let aRet = [];
            if (wholeDict) {
                return wholeDict.filter(p => p.showValue.indexOf(content) > -1);
            } else {
                return [];
            }
        }

        /**
         * 字典-指定内部代码值查对应的显示文本
         * @param {String} dictTitleOrDicCode 字典中文名或字典分类代码ID (查该字典)
         * @param {String} dictCode 字典代码值
         * @example
         * co.Dict.findDictText("业务类型","JGYS")
         * "竣工验收"
         */
        this.findDictText = function (dictTitleOrDicCode, dictCode) {
            let dictItem = $.C(dictTitleOrDicCode, dictCode);
            if (dictItem.length > 0) {
                return dictItem[0].showValue;
            } else {
                console.log("字典-未查询到结果");
                return "";
            }
        }

        /**
         * 字典-通过显示文本查询内部代码值
         * @param {String} dictTitleOrDicCode 字典中文名或字典分类代码ID (查该字典)
         * @param {String} displayText 显示文本
         * @example
         * co.Dict.findDictText("业务类型","竣工验收")
         * "JGYS"
         */
        this.findDictCode = function (dictTitleOrDicCode, displayText) {
            let dictItem = $.C(dictTitleOrDicCode, displayText);
            if (dictItem) {
                return dictItem[0].code;
            } else {
                console.log("字典-未查询到结果");
                return ""
            }
        }


    }

    /**
     * 组织用户
     * @class
     */
    function User() {

        /**
         * 当前用户名
         * @returns {String}
         * @example
         * co.User.userName();
         */
        this.userName = function () {
            return $.O.getUserName();
        }
        /**
         * 当前人员名
         * @returns {String}
         * @example
         * co.User.userName();
         */
        this.realName = function () {
            return $.O.getOrganInfo($.O.getUserId()).organName;
        }


        /**
         * 当前用户名ID
         * @returns {String}
         * @example
         * co.User.userId();
         */
        this.userId = function () {
            return $.O.getUserId();
        }

        /**
         * 判断是否属于指定角色
         * @param {String} roleName 角色信息  注意 不是角色代码
         * @param {String=} userId 用户ID
         * @returns {Boolean}
         * @example
         * co.User.isRole("分配员");
         * co.User.isRole("分配员",userId);
         */
        this.isRole = function (roleName, userId) {
            if (!userId) {
                userId = this.userId();
            }
            return $.O.isRole(userId, roleName)
        }

        /**L
         * 用户所有岗位(所有信息)
         * @param {String} userId 用户ID
         * @returns {Array}
         * @example
         * co.User.getAllPost();
         */
        this.getAllPost = function (userId) {
            return $.O.getAllPost(userId)
        }

        /**
         * 用户首要岗位
         * @param {String=} userId 用户ID 不填默认当前用户
         * @returns {string}
         * @example
         * co.User.getFirstPost();
         * co.User.getFirstPost(userId);
         */
        this.getFirstPost = function (userId) {
            if (!userId) {
                userId = mainObj.User.userId();
            }
            let oPostInfo = $.O.getFirstPost(userId);
            if (oPostInfo) {
                return oPostInfo.organName;
            } else {
                console.log("未找到用户首要岗位信息");
                return "";
            }
        }

        /**
         * 用户首要岗位所在部门
         * @returns {string}
         * @param {String=} userId 用户ID 不填默认当前用户
         * @returns {string}
         * @example
         * co.User.getFirstDept();
         * co.User.getFirstDept(userId);
         */
        this.getFirstDept = function (userId) {
            if (!userId) {
                userId = mainObj.User.userId();
            }
            let oPostInfo = $.O.getFirstPost(userId);
            if (oPostInfo) {
                return oPostInfo.deptName;
            } else {
                console.log("未找到用户首要岗位信息");
                return "";
            }
        }


        /**
         * 用户首要岗位同岗位下其他人员
         * @param {String=} userId 用户ID 不填默认当前用户
         * @returns {Object}
         * @example
         * co.User.getFirstPostOtherUsers();
         * co.User.getFirstPostOtherUsers(userId);
         */
        this.getFirstPostOtherUsers = function (userId) {
            let oPostInfo = $.O.getFirstPost(userId);
            if (oPostInfo) {
                return oPostInfo.children;
            } else {
                console.log("未找到用户首要岗位信息");
                return "";
            }
        }

        /**
         * 获取用户真实名
         * @param {String=} userId userId 不填默认当前用户
         * @returns {String}
         */
        this.getRealName = function (userId) {
            if (!userId) {
                userId = $.O.getUserId();
            }
            return $.O.getOrganInfo(userId).organName;
        }
        /**
         * 获取组织架构下的所有用户
         * @param {String=} oId 组织架构ID
         * @returns {Object}
         */
        this.getAllUser = function (oId) {
            return $.O.getAllUser(oId);
        }
        /**
         * 获取部门或者岗位的所有用户
         * @param name
         */
        this.getDeptOrPostAllUserInfo = function (name) {
            function getAllUser(childrenParent) {
                for (let i = 0; i < childrenParent.length; i++) {
                    let organType = childrenParent[i].organType;
                    if (organType !== 10) {
                        getAllUser(childrenParent[i].children);
                    } else {
                        userIdList.push(childrenParent[i]);
                    }
                }
            }

            let userIdList = [];
            let postInfo = $.O.getOrganInfoByName(name);
            if (!postInfo) {
                return userIdList;
            }
            getAllUser(postInfo.children);
            return userIdList;
        }
    }

    /**
     * @class
     * @classdesc 信息提示 相关方法
     */
    function Message() {

        /**
         * 警告提示信息(右上角)
         * @param {String} sMsg 警告信息
         * @param {String} title 标题 默认'警告'
         * @example
         * co.Message.warning_topRight("阿祖，收手吧！","外面都是警察")
         */
        this.warning_topRight = function (sMsg, title) {
            if (!title) {
                title = "警告";
            }
            $.messager.notice({
                type: 'warning',
                title: title,
                desc: sMsg
            })
        }
        /**
         * 错误提示信息(右上角)
         * @param {String} sMsg 错误信息
         * @param {String} title  标题文本 默认'错误'
         * @example
         * co.Message.error_topRight("阿祖，收手吧！","外面都是警察")
         */
        this.error_topRight = function (sMsg, title) {
            if (!title) {
                title = "错误";
            }
            $.messager.notice({
                type: 'error',
                title: title,
                desc: sMsg
            })
        }
        /**
         * 成功提示信息，绿色 (中上)
         * @param {String} sMsg 信息
         * @param {String} needClose 是否需要主动关闭，默认不传为否，不需要主动关闭
         * @example
         * co.Message.success_middle("阿祖，收手吧！")
         */
        this.success_middle = function (sMsg, needClose) {
            if (!sMsg) {
                sMsg = "成功";
            }
            if (needClose) {
                window.Vue.prototype.$msg.success({
                    content: sMsg,
                    duration: 0,
                    closable: true,
                    id: 'my-demo-id',
                    onClose: () => {
                        // this.$notice.info({
                        //   title: '消息已关闭'
                        // })
                    }
                })
            } else {
                window.Vue.prototype.$msg.success(sMsg);
            }
        }
        /**
         * 警告提示信息，橙色 (中上)
         * @param {String} sMsg 信息
         * @param {String} needClose 是否需要主动关闭，默认不传为否，不需要主动关闭
         * @example
         * co.Message.warning_middle("阿祖，收手吧！")
         */
        this.warning_middle = function (sMsg, needClose) {
            if (!sMsg) {
                sMsg = "警告";
            }
            if (needClose) {
                window.Vue.prototype.$msg.warning({
                    content: sMsg,
                    duration: 0,
                    closable: true,
                    id: 'my-demo-id',
                    onClose: () => {
                        // this.$notice.info({
                        //   title: '消息已关闭'
                        // })
                    }
                })
            } else {
                window.Vue.prototype.$msg.warning(sMsg);
            }
        }

        /**
         * 错误提示信息，红色  (中上)
         * @param {String} sMsg 信息
         * @param {boolean} needClose 是否需要主动关闭，默认不传为否，不需要主动关闭
         * @example
         * co.Message.error_middle("阿祖，收手吧！")
         */
        this.error_middle = function (sMsg, needClose) {
            if (!sMsg) {
                sMsg = "错误";
            }
            if (needClose) {
                window.Vue.prototype.$msg.error({
                    content: sMsg,
                    duration: 0,
                    closable: true,
                    id: 'my-demo-id',
                    onClose: () => {
                        // this.$notice.info({
                        //   title: '消息已关闭'
                        // })
                    }
                })
            } else {
                window.Vue.prototype.$msg.error(sMsg);
            }
        }

        /**
         * 提示，蓝色 (中上)
         * @param {String} sMsg 信息
         * @param {String} needClose 是否需要主动关闭，默认不传为否，不需要主动关闭
         * @example
         * co.Message.info_middle("阿祖，收手吧！")
         */
        this.info_middle = function (sMsg, needClose) {
            if (!sMsg) {
                sMsg = "提示";
            }
            if (needClose) {
                window.Vue.prototype.$msg.info({
                    content: sMsg,
                    duration: 0,
                    closable: true,
                    id: 'my-demo-id',
                    onClose: () => {
                        // this.$notice.info({
                        //   title: '消息已关闭'
                        // })
                    }
                })
            } else {
                window.Vue.prototype.$msg.info(sMsg);
            }
        }

        /**
         * 全局遮罩弹窗提示(持久型)
         * @param {String} sContent 提示信息
         * @param {String} sTitle  弹窗标题
         * @param {Boolean} bCloseable 是否展示右上角X按钮
         * @param {Boolean} bShowOkBtn  是否有确认按钮
         * @example
         * co.Message.coverAlert("阿祖，收手吧！","外面都是警察！",true,true)
         */
        this.coverAlert = function (sContent, sTitle, bCloseable, bShowOkBtn) {
            if (!bCloseable) {
                bCloseable = false;
            }
            let bFooterHide = true;
            if (bShowOkBtn) {
                bFooterHide = false;
            }
            Vue.prototype.$loading.show({backgroundColor: 'rgba(255,255,255,0.2)'});
            setTimeout(() => {
                //执行操作
                Vue.prototype.$loading.hide();
            }, 100);
            window.Vue.prototype.$modal.alert({
                title: sTitle,
                content: sContent,
                similar: true,
                closable: bCloseable,
                footerHide: bFooterHide,
                onOk: () => {
                    this.Vue.prototype.$modal.remove(() => {
                        if (callBack) {
                            callBack();
                        }
                    })
                    // this.Vue.prototype.$modal.remove();
                },
            })
        }

        /**
         * 关闭全局遮罩弹窗提示
         * @example
         * co.Message.coverAlert_close()
         */
        this.coverAlert_close = function (callBack) {
            Vue.prototype.$modal.remove(() => {
                if (callBack) {
                    callBack();
                }
            })
        }
        /**
         * 站内消息发送
         * @example
         * co.Message.sendClientMessage ({
         *     "content":"我是测试消息",
         *     "receiverIds":"41cc5063-1d17-4c1b-8c5e-c07c4e4077b7"
         * })
         */
        this.sendClientMessage = function (params) {
            let {
                content = "",
                receiverIds = "",//多个用英文逗号隔开
                senderId = $.O.getUserId(),
                msign = "000",//根据字典【XXLX】决定
                title = ""
            } = {...params || {}}
            if (!receiverIds || !content) {
                console.log("参数有误")
                return;
            }
            let receivers = [];
            let receiverIdArr = receiverIds.split(",")
            for (let i = 0; i < receiverIdArr.length; i++) {
                let receiverId = receiverIdArr[i];
                let receiverName = mainObj.User.getRealName(receiverId);
                let map = {};
                map["receiverId"] = receiverId;
                map["receiverName"] = receiverName;
                receivers.push(map);
            }
            let senderName = mainObj.User.getRealName(senderId);

            if (!title) {
                title = senderName + "给您提交了通知";
            }

            let data = {};
            data["content"] = content;//消息内容
            data["msign"] = msign;//消息类型
            data["pushBatched"] = "0";//是否批量推送应用消息 1 为批量 ，0为不批量推送
            data["sendTime"] = new Date().format("yyyy-MM-ddThh:mm:ss+0800");//消息发送时间
            data["senderId"] = senderId;//发送者Id
            data["senderName"] = senderName;//发送者名
            data["showCard"] = 0;//卡片方式展示,0或空: 不是卡片消息,1: 是卡片消息
            data["title"] = title;//消息标题
            data["type"] = 1;//消息类型（0广播发送的消息，1发送的消息，11发送的消息已删除，2接收的消息，12接收的消息已读，3广播的消息，13广播的消息已读）
            data["receivers"] = receivers;//接收者列表（不持久），如果是广播消息，此属性为空
            function sendMsg(data) {
                $.ajax({
                    type: 'POST',
                    contentType: 'application/json;charset=UTF-8',
                    async: false,
                    url: '/message/client/send?msgTransceiver=message', // 示例：要发送到哪个服务，这个指的是发送到126
                    data: JSON.stringify(data),
                    success: null,
                    error: null
                });
            }
            sendMsg(data);
        }
    }

    /**
     * @class
     * @classdesc 对话框 相关方法
     */
    function Dialog() {
        /**
         * 确认提示框
         * @param {String} sMsg 消息
         * @param {String} [title="确认"]  标题文本
         * @param {function} fOkFunc 确认-回调
         * @param {function=} fCancelFunc 取消-回调
         * @param {Boolean=} [closable=true] 可取消
         * @param {Boolean=} [similar=true]  默认true 不明意义
         * @param {Number=} [width=360]   宽度
         * @param {Number=} [height=160]  高度
         * @example
         * co.Dialog.confirm(
         * "阿祖，收手吧！",
         * "确认",
         * okFunction
         * )
         */
        this.confirm = function (sMsg, title, fOkFunc, fCancelFunc, closable, similar, width, height) {
            if (!title) {
                title = "确认";
            }
            if (closable != false) {
                closable = true;
            }
            if (!similar) {
                similar = true;
            }
            if (!width) {
                width = 360;
            }
            if (!height) {
                height = 160;
            }

            Vue.prototype.$modal.confirm({
                title: title,
                content: sMsg,
                closable: closable,
                similar: similar,
                width: width,
                height: height,
                onOk: () => {
                    Vue.prototype.$modal.remove(() => {
                        if (fOkFunc) {
                            fOkFunc();
                        }
                    })
                },
                onCancel: () => {
                    Vue.prototype.$modal.remove(() => {
                        if (fCancelFunc) {
                            fCancelFunc();
                        }
                    })
                },
                onHidden: () => {
                    Vue.prototype.$modal.remove();
                }
            })
        }


        /**
         * 输入框的弹窗确认窗口
         * @param {String} modalTitle 窗口标题  默认"输入中.."
         * @param {String} inputLabel 输入框左侧提示文本
         * @param {String} [inputType = 'text'|'password'|'textarea']  输入框类型 文本，密码，多行文本，
         * @param {String} confirmBtnText 确定按钮的显示文本
         * @param {sucCallback} callBackFunc 回调函数，返回值为false时 将会阻止窗口关闭 否则继续关闭
         * @param {String} inputHint 输入框内提示文本
         * @param {String} textareaValue 输入框初始值
         * @example
         * co.Dialog.confirmWithText(
         * okFunction,
         * "输入中..",
         * "请输入:",
         * "text",
         * "请输入10位工规证号",
         * "确认"
         * )
         */
        this.confirmWithText = function (callBackFunc, modalTitle, inputLabel, inputType, inputHint, confirmBtnText, textareaValue) {
            if (!modalTitle) {
                modalTitle = "输入中..."
            }
            if (!inputLabel) {
                inputLabel = "请输入:"
            }
            if (!inputHint) {
                inputHint = "请输入内容"
            }
            if (!inputType) {
                inputType = "text"
            }
            if (!confirmBtnText) {
                confirmBtnText = "确定"
            }
            const {inputFormModal} = window.top.IBaseExpressLib
            inputFormModal({
                    vue: Sgui,
                    inputLabel: inputLabel,
                    inputType: inputType,// textarea
                    confirmBtnText: confirmBtnText,
                    inputPlaceholder: inputHint,
                    modalTitle: modalTitle,
                    textareaValue: textareaValue,
                    confirmCallback: (val) => {
                        console.log(val)
                        // 回调函数返回false则不关闭弹窗
                        if (callBackFunc) {
                            return callBackFunc(val);
                        } else {
                            return true;
                        }
                    }
                }
            )
        }

        //formList 中传入的form的写法demo
        let demo_form = [
            {
                key: 'name', // 字段key
                label: '名称', // 字段提示文本
                type: 'input', // 控件类型，目前支持 input、select、radio
                isHidden: false // 当前控件是否显示
            },
            {
                key: 'age',
                label: '年龄',
                type: 'input',
            },
            {
                key: 'selectType',
                label: '下拉选择',
                type: 'select',
                selectList: [
                    {
                        value: 'value0',
                        label: '选项0'
                    }
                ], // select控件使用，下拉列表数据
                onChange: ({value, formRef}) => {
                    console.log(value, formRef)
                    // 联动修改其他控件值
                    formRef.setFormValue('name', '我被同步修改了')
                    // 联动修改其他控件的校验规则
                    formRef.rules.age[0].required = value === 'value0' // 选中'选项0'时候 age字段必填
                    // 延迟到下个生命周期
                    formRef.$nextTick(function () {
                        // 重新校验被修改规则的字段
                        formRef.$refs.form.validateField('age')
                    })
                } // 控件值变化时的钩子
            },
            {
                key: 'radioType',
                label: '单选项',
                type: 'radio',
                radioList: [
                    {
                        value: 'value0',
                        label: '选项0'
                    },
                    {
                        value: 'value1',
                        label: '选项1'
                    }
                ], // radio控件使用，选项数据
            }
        ];

        let demo_formDefaultValue = {
            //key : value
            name: 'CJY',
            selectType: '',
            radioType: 'value1'
        }

        let demo_formRules = {
            name: [
                {
                    required: true,  // 字段是否必填
                    message: '请输入名称',  // 不填时候的提示语
                    trigger: 'blur',   // 校验触发的时机
                }
            ], // 设置字段的必填校验
            age: [
                {
                    required: true,  // 字段是否必填
                    message: '请输入年龄',  // 不填时候的提示语
                    trigger: 'blur',   // 校验触发的时机
                },
                {
                    pattern: /^[0-9]*$/, // 自定义校验正则表达式
                    message: '年龄仅可输入数字',  // 校验不通过时提示语
                    trigger: 'blur' // 校验触发的时机
                }
            ], // 设置字段的正则校验
            radioType: [
                {
                    required: true,
                    message: 'radioType 请选择',
                    trigger: 'change'
                },
                {
                    validator: (rule, value, callback) => {
                        value == "value0" ? callback(new Error('单选项不能为 选项0')) : callback();
                    }
                }
            ] // 设置字段的自定义validator校验
        };


        /**
         * TODO 待完善,异步加载还没有加上
         * 定制多控件,支持穿插文本框，下拉框、单选框的的联动定制、数据校验、异步加载等
         * @param {String} title 窗口标题
         * @param {Array<Map<String,String>>} formList 控件列表
         * @param {Map<String,String>} formDefaultValue 控件默认值，k-v对象
         * @param {sucCallback} confirmCallBackFunc 确认回调
         * @param {Object<String,Array<Object<String,String>>>} formRules 规则
         * @param {String} confirmBtnText 提交按钮文本
         * @param {Boolean} hideCloseBtn 是否隐藏右上角的x
         * @example
         * 暂时莫得
         */
        this.confirmMultiElements = function (title, formList, formDefaultValue, confirmCallBackFunc, formRules, confirmBtnText, hideCloseBtn, width) {
            if(!width){
                width = ""
            }
            let closable = true;
            if (hideCloseBtn) {
                closable = false;
            }
            // 设置 formList 属性，代表激活多控件模式，inputLabel、inputType 属性无效
            const {inputFormModal} = window.top.IBaseExpressLib
            inputFormModal({
                vue: Sgui,
                width: width, // 宽度
                modalTitle: title, // 弹窗标题
                closable: closable, // 是否可以关闭弹窗，默认是
                formList: formList, // 表单控件
                formDefaultValue: formDefaultValue, // 表单初始值
                formRules: formRules, // 表单校验规则配置
                onFormMounted: ({formRef}) => {
                    // // 启动遮罩
                    // formRef.setLoading(true)
                    // $.ajax({
                    //     url: '/zzzz',
                    //     success:(data) => {
                    //         let formList = [...formRef.formList || []]
                    //         formList = formList.map(item => {
                    //             // 根据key找到目标字段，更新数据
                    //             if (item.key === 'selectType') {
                    //                 item.selectList =data
                    //             }
                    //             formRef.setLoading(false)
                    //     })
                    //     }
                    // })
                }, // 表单初始化钩子，可用于处理初始异步数据
                confirmBtnText: confirmBtnText, // 确认按钮文案
                confirmCallback: (val, formItems, ref) => {
                    console.log(val, formItems, ref)
                    // 回调函数返回false则不关闭弹窗
                    //有设置校验规则时的 return 参考写法，因为校验是异步的，所以需要promise
                    return new Promise((resolve) => {
                        ref.$refs.form.validate((valid) => {
                            if (!valid) {
                                ref.$msg.error('请填写完整表单');
                                resolve(false)
                            } else {
                                let result = confirmCallBackFunc(val, formItems, ref);
                                if (!result) {
                                    resolve(false)
                                } else {
                                    resolve(true)
                                }
                            }
                        })
                    })
                } // 点击确定时的回调函数
            })
        }
        /**
         * 确认框DIY
         * @param params
         * @example
         *
         * confirmDiy({
         *   vue: Sgui,
         *   status: 'success', // 状态 【 error 未通过， success 进行中/通过， info 信息, warning 警告 】
         *   modalTitle: '',
         *   mainText: '指派后，批次生效，将无法修改抽查条件',
         *   subText: '如需修改抽查条件，请在指派前修改',
         *   buttonList: [{
         *     btnText: '提交抽查批次并指派',
         *     btnType: 'primary', // primary 主按钮、info或缺省 基本按钮、success 成功按钮、warning 警告按钮、error 错误按钮、secondary 次按钮 、text 链接按钮
         *     outline: false,// 按钮是否只要边框，即没有背景色
         *     size: 'small',// large、small、mini 、default 按钮大小
         *     btnCallBack: () => {
         *       console.log('查看详情')
         *       // 回调函数返回false则不关闭弹窗
         *       return false
         *     }
         *   }, {
         *     btnText: '暂不指派',
         *     btnType: '', // primary 主按钮、info或缺省 基本按钮、success 成功按钮、warning 警告按钮、error 错误按钮、secondary 次按钮 、text 链接按钮
         *     outline: false,// 按钮是否只要边框，即没有背景色
         *     size: 'small',// large、small、mini 、default 按钮大小
         *     btnCallBack: () => {
         *       console.log('查看详情')
         *     }
         *   }]
         * });
         */
        this.confirmDiy = function (params) {
            const {
                vue,
                status,
                mainText = '',
                subText = '',
                modalTitle = '',
                buttonList = [],
                closable = true
            } = {...params || {}}
            vue.$modal.alert({
                render: (h) => {
                    h = vue.$createElement
                    return h({
                        template: `
        <div>
          <div class="content" style="display: flex; padding: 20px 0;">
            <div style="padding: 0 10px;">
            <sg-icon v-if="iconObj" :type="iconObj.iconType" :color="iconObj.iconColor" size="20" style="line-height: 1; display: inline-block; margin-bottom: 20px;"/>
            </div>
            <div>
              <h3 style="color: #404040;">{{ mainText }}</h3>
              <p style="color: #999999;">{{ subText }}</p>
            </div>
          </div>
          <div class="btn-group" style="margin-top: 20px;text-align: right;">
            <sg-button v-for="(btn, index) in buttonList" :key="index" :type="btn.btnType" :size="btn.size" @click="handleClick(btn)" style="margin-right: 10px;">{{ btn.btnText }}</sg-button>
          </div>
        </div>
          `,
                        data() {
                            return {
                                iconMap: {
                                    'error': {
                                        iconType: 'iconshanchuquxiao1',
                                        iconColor: '#f5222d'
                                    },
                                    'success': {
                                        iconType: 'iconwancheng',
                                        iconColor: '#52c41a'
                                    },
                                    'info': {
                                        iconType: 'iconwarningfill1',
                                        iconColor: '#1890ff'
                                    },
                                    'warning': {
                                        iconType: 'iconjinggao1',
                                        iconColor: '#faad14'
                                    },
                                    'default': {
                                        iconType: 'iconinfofill',
                                        iconColor: ''
                                    }
                                },
                                mainText,
                                subText,
                                buttonList
                            };
                        },
                        computed: {
                            iconObj() {
                                return status ? (this.iconMap[status] || this.iconMap['default']) : null
                            }
                        },
                        async mounted() {
                        },
                        methods: {
                            closeModal() {
                                this.$modal.remove()
                            },
                            handleClick(btn) {
                                const res = btn.btnCallBack()
                                // 回调函数返回FALSE时不关闭弹窗
                                if (res === false) return
                                this.closeModal()
                            }
                        }
                    });
                },
                title: modalTitle,
                closable,
                similar: true,
                width: '450px',
                footerHide: true
            });
        }


        /**
         * 通用弹窗列表选择方法
         * @param {Object} options 配置选项
         * @param {String} options.title 弹窗标题
         * @param {Array} options.data 列表数据源，当使用本地数据时提供
         * @param {String} options.url 远程数据请求地址，当需要从服务器获取数据时提供
         * @param {Object} options.sql SQL查询参数，包含sql语句和参数
         * @param {Array} options.columns 表格列配置
         * @param {Boolean} options.canCheck 是否允许多选，默认为false(单选)
         * @param {Function} options.callback 选择完成后的回调函数，参数为选中的行数据
         * @param {Array} options.searchOption 搜索选项配置
         * @param {String} options.size 弹窗大小，可以是具体尺寸或预设值
         * @param {Boolean} options.footerHide 是否隐藏底部按钮，默认false
         * @returns {void}
         * @example
         * // 从远程数据源选择
         * showPopupSelector({
         *     title: "选择项目",
         *     url: "/exprengine/expression/execsql",
         *     sql: {
         *         sql1: "查询SQL名称",
         *         param1: { 参数对象 }
         *     },
         *     columns: [
         *         { "name": "字段名", "label": "显示名称", "type": "label" },
         *         // 更多列...
         *     ],
         *     callback: function(row) {
         *         // 处理选择结果
         *         console.log("选择的数据:", row);
         *         // 设置表单值等操作
         *     }
         * });
         *
         * // 使用本地数据源
         * showPopupSelector({
         *     title: "选择选项",
         *     data: [
         *         { id: 1, name: "选项一" },
         *         { id: 2, name: "选项二" }
         *     ],
         *     columns: [
         *         { "name": "name", "label": "名称", "type": "label" }
         *     ],
         *     callback: function(row) {
         *         console.log("选择的数据:", row);
         *     }
         * });
         */
        this.showPopupSelector = function (options) {
            // 默认选项
            const defaultOptions = {
                title: "请选择",
                canCheck: false,
                footerHide: false,
                size: "width:720px;height:500px",
                btnTitles: ["确定", "取消"]
            };

            // 合并选项
            const mergedOptions = Object.assign({}, defaultOptions, options);

            // 使用本地数据源或远程数据源
            let tableOptions = {
                title: mergedOptions.title,
                footerHide: mergedOptions.footerHide,
                canCheck: mergedOptions.canCheck,
                isMax: mergedOptions.size,
                btnTitles: mergedOptions.btnTitles,
                columns: mergedOptions.columns || [],

                // 处理结果回调
                submitFun: function (rows) {
                    if (rows.length === 0) {
                        vue.$SgNotice.warning({
                            title: "请先选择"
                        });
                        return false;
                    } else {
                        if (typeof mergedOptions.callback === 'function') {
                            mergedOptions.callback(mergedOptions.canCheck ? rows : rows[0]);
                        }
                        return true; // 返回true关闭弹窗
                    }
                },

                // 双击行事件
                dbClick: function (row) {
                    if (typeof mergedOptions.callback === 'function') {
                        mergedOptions.callback(row);
                    }
                    return true; // 返回true关闭弹窗
                }
            };

            // 处理搜索选项
            if (mergedOptions.searchOption && mergedOptions.searchOption.length > 0) {
                tableOptions.searchOption = mergedOptions.searchOption;
            }

            // 处理数据源
            if (mergedOptions.data && Array.isArray(mergedOptions.data)) {
                // 本地数据源
                tableOptions.data = mergedOptions.data;
            } else if (mergedOptions.url) {
                // 远程数据源
                tableOptions.url = mergedOptions.url;

                // 如果提供了SQL查询
                if (mergedOptions.sql) {
                    tableOptions.sql = mergedOptions.sql;
                }
            }

            // 显示选择表格
            showSelectTable(tableOptions);
        }
        /**
         * 本地数据专用选择器弹窗
         * @param {Object} options 配置选项
         * @param {String} options.title 弹窗标题
         * @param {Array} options.data 本地数据源
         * @param {Array} options.columns 表格列配置，格式为[{name:"字段名",label:"显示名称",type:"label"}]
         * @param {Boolean} options.canCheck 是否允许多选，默认为false(单选)
         * @param {Function} options.callback 选择完成后的回调函数，参数为选中的行数据
         * @param {String} options.size 弹窗大小，可以是具体尺寸或预设值
         * @param {Boolean} options.footerHide 是否隐藏底部按钮，默认false
         * @param {Array} options.btnTitles 底部按钮文本，默认["确定", "取消"]
         * @param {Number} options.pageSize 每页显示条数，默认10
         * @param {Array} options.searchableFields 可搜索的字段列表，不传时默认所有字段可搜索
         * @param {Boolean} options.showRowNumber 是否显示序号列，默认true
         * @returns {void}
         * @example
         * // 使用本地数据源
         * this.showLocalSelector({
         *     title: "选择图层",
         *     data: [
         *         { name: "adfln", alias: "图层1", style: "样式1" },
         *         { name: "adfpt", alias: "图层2", style: "样式2" }
         *     ],
         *     columns: [
         *         { "name": "name", "label": "图层名称", "type": "label" },
         *         { "name": "alias", "label": "图层别名", "type": "label" },
         *         { "name": "style", "label": "图层样式", "type": "label" }
         *     ],
         *     searchableFields: ["name", "alias"], // 指定只能搜索这两个字段
         *     callback: function(row) {
         *         console.log("选择的数据:", row);
         *     }
         * });
         */
        this.showLocalSelector = function (options) {
            if (!options || !options.data || !Array.isArray(options.data)) {
                console.error('缺少必要数据参数：data');
                return;
            }

            // 默认选项
            const defaultOptions = {
                title: "请选择",
                canCheck: false,
                footerHide: false,
                size: {width: '720px', height: '500px'},
                btnTitles: ["确定", "取消"],
                pageSize: 10,
                showRowNumber: true
            };

            // 合并选项
            const mergedOptions = Object.assign({}, defaultOptions, options);
            const columns = mergedOptions.columns || [];
            if (!columns.length) {
                console.error('请提供列配置');
                return;
            }

            // 当前页码、每页条数和搜索条件
            let currentPage = 1;
            let pageSize = mergedOptions.pageSize;
            let searchText = '';
            let searchField = 'all'; // 默认搜索所有字段
            let originalData = [...mergedOptions.data];
            let filteredData = [...originalData];
            let selectedRowKeys = [];
            let selectedRows = [];

            // 可搜索的字段（如果未指定，则使用所有字段）
            const searchableFields = mergedOptions.searchableFields || columns.map(col => col.name);

            // 创建弹窗DOM
            const modal = document.createElement('div');
            modal.className = 'local-selector-modal';
            modal.style.cssText = `
position: fixed;
top: 0;
left: 0;
right: 0;
bottom: 0;
background-color: rgba(0, 0, 0, 0.5);
display: flex;
align-items: center;
justify-content: center;
z-index: 9999;
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
`;

            // 创建弹窗内容
            const modalContent = document.createElement('div');
            modalContent.className = 'local-selector-content';
            modalContent.style.cssText = `
background-color: #fff;
border-radius: 4px;
overflow: hidden;
box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
width: ${mergedOptions.size.width || '720px'};
height: ${mergedOptions.size.height || '500px'};
display: flex;
flex-direction: column;
`;

            // 创建弹窗头部
            const modalHeader = document.createElement('div');
            modalHeader.className = 'local-selector-header';
            modalHeader.style.cssText = `
display: flex;
align-items: center;
justify-content: space-between;
padding: 15px 20px;
border-bottom: 1px solid #e8e8e8;
`;

            // 创建标题
            const title = document.createElement('div');
            title.className = 'local-selector-title';
            title.textContent = mergedOptions.title;
            title.style.cssText = `
font-size: 16px;
font-weight: 600;
color: #333;
`;

            // 创建关闭按钮
            const closeBtn = document.createElement('span');
            closeBtn.className = 'local-selector-close';
            closeBtn.innerHTML = '&#10005;';
            closeBtn.style.cssText = `
cursor: pointer;
font-size: 18px;
color: #999;
`;
            closeBtn.onclick = () => {
                document.body.removeChild(modal);
            };

            modalHeader.appendChild(title);
            modalHeader.appendChild(closeBtn);

            // 创建搜索区域
            const searchArea = document.createElement('div');
            searchArea.className = 'local-selector-search';
            searchArea.style.cssText = `
display: flex;
align-items: center;
padding: 10px 20px;
border-bottom: 1px solid #f0f0f0;
`;

            // 创建类型选择下拉框
            const typeSelect = document.createElement('select');
            typeSelect.className = 'local-selector-type-select';
            typeSelect.style.cssText = `
min-width: 120px;
margin-right: 10px;
border: 1px solid #e8e8e8;
border-radius: 4px;
padding: 5px 10px;
outline: none;
cursor: pointer;
`;

            // 添加"全部"选项
            const allOption = document.createElement('option');
            allOption.value = 'all';
            allOption.textContent = '全部';
            typeSelect.appendChild(allOption);

            // 添加可搜索字段选项
            searchableFields.forEach(field => {
                const column = columns.find(col => col.name === field);
                if (column) {
                    const option = document.createElement('option');
                    option.value = field;
                    option.textContent = column.label || field;
                    typeSelect.appendChild(option);
                }
            });

            typeSelect.onchange = function() {
                searchField = this.value;
                // 如果搜索文本存在，立即执行搜索
                if (searchText) {
                    performSearch();
                }
            };

            // 创建搜索输入框
            const searchInput = document.createElement('input');
            searchInput.className = 'local-selector-search-input';
            searchInput.type = 'text';
            searchInput.placeholder = '搜索...';
            searchInput.style.cssText = `
flex: 1;
border: 1px solid #e8e8e8;
border-radius: 4px;
padding: 5px 10px;
margin-right: 10px;
outline: none;
`;
            searchInput.onkeyup = function (e) {
                if (e.key === 'Enter') {
                    performSearch();
                }
            };

            // 创建搜索按钮
            const searchBtn = document.createElement('button');
            searchBtn.className = 'local-selector-search-btn';
            searchBtn.innerHTML = '&#128269;';
            searchBtn.style.cssText = `
background-color: #f0f0f0;
border: 1px solid #e8e8e8;
border-radius: 4px;
padding: 5px 10px;
cursor: pointer;
color: #333;
`;
            searchBtn.onclick = performSearch;

            // 创建刷新按钮
            const refreshBtn = document.createElement('button');
            refreshBtn.className = 'local-selector-refresh-btn';
            refreshBtn.textContent = '刷新';
            refreshBtn.style.cssText = `
background-color: #f0f0f0;
border: 1px solid #e8e8e8;
border-radius: 4px;
padding: 5px 10px;
margin-left: 10px;
cursor: pointer;
color: #333;
`;
            refreshBtn.onclick = resetSearch;

            // 创建全部选中按钮（仅在可多选时显示）
            const selectAllBtn = document.createElement('button');
            selectAllBtn.className = 'local-selector-select-all-btn';
            selectAllBtn.textContent = '全选/取消全选';
            selectAllBtn.style.cssText = `
background-color: #f0f0f0;
border: 1px solid #e8e8e8;
border-radius: 4px;
padding: 5px 10px;
margin-left: 10px;
cursor: pointer;
color: #333;
display: ${mergedOptions.canCheck ? 'block' : 'none'};
`;
            selectAllBtn.onclick = function() {
                // 检查是否所有数据都已选中
                const isAllSelected = originalData.length > 0 && selectedRows.length === originalData.length;

                if (isAllSelected) {
                    // 已全选，取消所有选择
                    selectedRows = [];
                    selectedRowKeys = [];
                } else {
                    // 未全选，选中所有数据
                    selectedRows = [...originalData];
                    selectedRowKeys = originalData.map((_, index) => index);
                }

                renderTable(currentPage);
            };

            searchArea.appendChild(typeSelect);
            searchArea.appendChild(searchInput);
            searchArea.appendChild(searchBtn);
            searchArea.appendChild(refreshBtn);
            searchArea.appendChild(selectAllBtn);

            // 创建表格区域
            const tableArea = document.createElement('div');
            tableArea.className = 'local-selector-table';
            tableArea.style.cssText = `
flex: 1;
overflow-y: auto;
border-bottom: 1px solid #e8e8e8;
`;

            // 创建表格
            const table = document.createElement('table');
            table.className = 'local-selector-table-inner';
            table.style.cssText = `
width: 100%;
border-collapse: collapse;
`;

            // 创建表头
            const thead = document.createElement('thead');
            thead.style.cssText = `
background-color: #f9f9f9;
position: sticky;
top: 0;
`;
            const headerRow = document.createElement('tr');

            // 复选框列 - 确保复选框始终在最前面
            if (mergedOptions.canCheck) {
                const checkboxHeader = document.createElement('th');
                checkboxHeader.style.cssText = `
    padding: 12px 8px;
    text-align: center;
    border-bottom: 1px solid #e8e8e8;
    width: 40px;
`;
                const checkboxAll = document.createElement('input');
                checkboxAll.type = 'checkbox';
                checkboxAll.onclick = function () {
                    const checkboxes = tableArea.querySelectorAll('input[type="checkbox"]');
                    checkboxes.forEach(cb => {
                        cb.checked = checkboxAll.checked;
                    });

                    if (checkboxAll.checked) {
                        // 选中当前页所有行
                        const currentPageData = getCurrentPageData();
                        // 生成当前页数据的索引
                        const currentPageIndexes = currentPageData.map((_, idx) => currentPage * pageSize - pageSize + idx);

                        // 过滤掉已经选中的数据
                        const newRows = currentPageData.filter((row, idx) => !selectedRowKeys.includes(currentPageIndexes[idx]));
                        const newIndexes = currentPageIndexes.filter(idx => !selectedRowKeys.includes(idx));

                        // 添加到选中列表
                        selectedRows = [...selectedRows, ...newRows];
                        selectedRowKeys = [...selectedRowKeys, ...newIndexes];
                    } else {
                        // 取消选中当前页所有行
                        const currentPageIndexes = getCurrentPageData().map((_, idx) => currentPage * pageSize - pageSize + idx);

                        // 从选中列表中移除当前页数据
                        selectedRows = selectedRows.filter((_, idx) => {
                            const rowKey = selectedRowKeys[idx];
                            return !currentPageIndexes.includes(rowKey);
                        });
                        selectedRowKeys = selectedRowKeys.filter(key => !currentPageIndexes.includes(key));
                    }

                    renderTable(currentPage);
                };
                checkboxHeader.appendChild(checkboxAll);
                headerRow.appendChild(checkboxHeader);
            }

            // 添加序号列表头
            if (mergedOptions.showRowNumber) {
                const seqHeader = document.createElement('th');
                seqHeader.textContent = '序号';
                seqHeader.style.cssText = `
    padding: 12px 8px;
    text-align: center;
    border-bottom: 1px solid #e8e8e8;
    width: 60px;
    font-weight: 600;
`;
                headerRow.appendChild(seqHeader);
            }

            // 添加表头列
            columns.forEach(column => {
                const th = document.createElement('th');
                th.textContent = column.label || column.name;
                th.style.cssText = `
    padding: 12px 8px;
    text-align: left;
    border-bottom: 1px solid #e8e8e8;
    font-weight: 600;
`;
                if (column.width) {
                    th.style.width = column.width;
                }
                headerRow.appendChild(th);
            });

            thead.appendChild(headerRow);
            table.appendChild(thead);

            // 创建表格主体
            const tbody = document.createElement('tbody');
            table.appendChild(tbody);
            tableArea.appendChild(table);

            // 创建分页区域
            const paginationArea = document.createElement('div');
            paginationArea.className = 'local-selector-pagination';
            paginationArea.style.cssText = `
display: flex;
align-items: center;
justify-content: space-between;
padding: 10px 20px;
`;

            // 创建分页导航
            const paginationNav = document.createElement('div');
            paginationNav.className = 'local-selector-pagination-nav';
            paginationNav.style.cssText = `
display: flex;
align-items: center;
`;

            // 创建页码信息
            const pageInfo = document.createElement('div');
            pageInfo.className = 'local-selector-page-info';
            pageInfo.style.cssText = `
margin-left: 15px;
`;

            // 创建每页显示条数选择器
            const pageSizeSelector = document.createElement('div');
            pageSizeSelector.className = 'local-selector-page-size';
            pageSizeSelector.style.cssText = `
display: flex;
align-items: center;
margin-right: 15px;
`;

            const pageSizeOptions = document.createElement('select');
            pageSizeOptions.style.cssText = `
margin: 0 5px;
padding: 3px;
border: 1px solid #e8e8e8;
border-radius: 4px;
`;
            [10, 20, 30, 50].forEach(size => {
                const option = document.createElement('option');
                option.value = size;
                option.textContent = size;
                option.selected = size === pageSize;
                pageSizeOptions.appendChild(option);
            });
            pageSizeOptions.onchange = function () {
                const newPageSize = parseInt(this.value);
                if (newPageSize !== pageSize) {
                    const newPageCount = Math.max(1, Math.ceil(filteredData.length / newPageSize));
                    const newPage = Math.min(currentPage, newPageCount);

                    pageSize = newPageSize;
                    mergedOptions.pageSize = newPageSize;
                    renderTable(newPage);
                }
            };

            pageSizeSelector.appendChild(document.createTextNode('每页'));
            pageSizeSelector.appendChild(pageSizeOptions);
            pageSizeSelector.appendChild(document.createTextNode('条/页'));

            paginationArea.appendChild(paginationNav);
            paginationArea.appendChild(pageInfo);
            paginationArea.appendChild(pageSizeSelector);

            // 创建底部按钮区域
            const footerArea = document.createElement('div');
            footerArea.className = 'local-selector-footer';
            footerArea.style.cssText = `
display: ${mergedOptions.footerHide ? 'none' : 'flex'};
align-items: center;
justify-content: flex-end;
padding: 15px 20px;
border-top: 1px solid #e8e8e8;
`;

            // 创建取消按钮
            const cancelBtn = document.createElement('button');
            cancelBtn.className = 'local-selector-cancel-btn';
            cancelBtn.textContent = mergedOptions.btnTitles[1] || '取消';
            cancelBtn.style.cssText = `
background-color: #fff;
border: 1px solid #dcdfe6;
border-radius: 4px;
padding: 8px 15px;
margin-left: 10px;
cursor: pointer;
color: #606266;
`;
            cancelBtn.onclick = () => {
                document.body.removeChild(modal);
            };

            // 创建确定按钮
            const confirmBtn = document.createElement('button');
            confirmBtn.className = 'local-selector-confirm-btn';
            confirmBtn.textContent = mergedOptions.btnTitles[0] || '确定';
            confirmBtn.style.cssText = `
background-color: #409eff;
border: 1px solid #409eff;
border-radius: 4px;
padding: 8px 15px;
margin-left: 10px;
cursor: pointer;
color: #fff;
`;
            confirmBtn.onclick = () => {
                if (selectedRows.length === 0) {
                    alert('请先选择');
                    return;
                }

                if (typeof mergedOptions.callback === 'function') {
                    mergedOptions.callback(mergedOptions.canCheck ? selectedRows : selectedRows[0]);
                }

                document.body.removeChild(modal);
            };

            footerArea.appendChild(cancelBtn);
            footerArea.appendChild(confirmBtn);

            // 组装弹窗
            modalContent.appendChild(modalHeader);
            modalContent.appendChild(searchArea);
            modalContent.appendChild(tableArea);
            modalContent.appendChild(paginationArea);
            modalContent.appendChild(footerArea);
            modal.appendChild(modalContent);

            // 显示弹窗
            document.body.appendChild(modal);

            // 渲染表格数据
            function renderTable(page = 1) {
                currentPage = page;

                // 清空表格主体
                tbody.innerHTML = '';

                // 获取当前页数据
                const currentPageData = getCurrentPageData();

                // 更新表头复选框状态
                if (mergedOptions.canCheck) {
                    const headerCheckbox = thead.querySelector('input[type="checkbox"]');
                    if (headerCheckbox) {
                        // 计算当前页选中状态
                        const currentPageIndexes = currentPageData.map((_, idx) => (currentPage - 1) * pageSize + idx);
                        const selectedCount = currentPageIndexes.filter(idx => selectedRowKeys.includes(idx)).length;

                        if (selectedCount === 0) {
                            // 当前页没有选中项
                            headerCheckbox.checked = false;
                            headerCheckbox.indeterminate = false;
                        } else if (selectedCount === currentPageData.length) {
                            // 当前页全部选中
                            headerCheckbox.checked = true;
                            headerCheckbox.indeterminate = false;
                        } else {
                            // 当前页部分选中
                            headerCheckbox.checked = false;
                            headerCheckbox.indeterminate = true;
                        }
                    }
                }

                // 渲染行
                currentPageData.forEach((rowData, rowIndex) => {
                    const row = document.createElement('tr');
                    row.style.cssText = `
        cursor: pointer;
        transition: background-color 0.2s;
    `;
                    row.onmouseover = function () {
                        this.style.backgroundColor = '#f5f7fa';
                    };
                    row.onmouseout = function () {
                        this.style.backgroundColor = '';
                    };

                    const dataIndex = (currentPage - 1) * pageSize + rowIndex;
                    const isSelected = selectedRowKeys.includes(dataIndex);

                    if (isSelected) {
                        row.style.backgroundColor = '#ecf5ff';
                    }

                    // 点击行事件
                    row.onclick = function () {
                        if (mergedOptions.canCheck) {
                            // 多选模式，点击行切换选中状态
                            const checkbox = this.querySelector('input[type="checkbox"]');
                            if (checkbox) {
                                checkbox.checked = !checkbox.checked;
                                if (checkbox.checked) {
                                    selectRow(dataIndex, rowData);
                                } else {
                                    deselectRow(dataIndex);
                                }
                            }
                        } else {
                            // 单选模式，点击行直接选中
                            selectRow(dataIndex, rowData);
                        }
                    };

                    // 双击行事件
                    row.ondblclick = function () {
                        // 双击行直接选中并确认
                        selectRow(dataIndex, rowData);

                        if (typeof mergedOptions.callback === 'function') {
                            mergedOptions.callback(rowData);
                        }

                        document.body.removeChild(modal);
                    };

                    // 添加复选框列 - 始终在最前面
                    if (mergedOptions.canCheck) {
                        const checkboxCell = document.createElement('td');
                        checkboxCell.style.cssText = `
            padding: 12px 8px;
            text-align: center;
            border-bottom: 1px solid #e8e8e8;
        `;

                        const checkbox = document.createElement('input');
                        checkbox.type = 'checkbox';
                        checkbox.checked = isSelected;
                        checkbox.onclick = function (e) {
                            e.stopPropagation(); // 阻止事件冒泡

                            if (checkbox.checked) {
                                // 添加到选中列表
                                selectRow(dataIndex, rowData);
                            } else {
                                // 从选中列表移除
                                deselectRow(dataIndex);
                            }
                        };

                        checkboxCell.appendChild(checkbox);
                        row.appendChild(checkboxCell);
                    }

                    // 添加序号列
                    if (mergedOptions.showRowNumber) {
                        const seqCell = document.createElement('td');
                        seqCell.style.cssText = `
            padding: 12px 8px;
            text-align: center;
            border-bottom: 1px solid #e8e8e8;
        `;
                        // 计算连续的序号（根据当前页和行索引）
                        const seqNumber = (currentPage - 1) * pageSize + rowIndex + 1;
                        seqCell.textContent = seqNumber;
                        row.appendChild(seqCell);
                    }

                    // 添加数据列
                    columns.forEach(column => {
                        const cell = document.createElement('td');
                        cell.style.cssText = `
            padding: 12px 8px;
            border-bottom: 1px solid #e8e8e8;
        `;

                        const cellValue = rowData[column.name] !== undefined ? rowData[column.name] : '';
                        cell.textContent = cellValue;

                        row.appendChild(cell);
                    });

                    tbody.appendChild(row);
                });

                // 更新分页区域
                updatePagination();
            }

            // 获取当前页数据
            function getCurrentPageData() {
                const startIndex = (currentPage - 1) * pageSize;
                const endIndex = startIndex + pageSize;
                return filteredData.slice(startIndex, endIndex);
            }

            // 选中行
            function selectRow(index, rowData) {
                if (!mergedOptions.canCheck) {
                    // 单选模式，清空之前的选择
                    selectedRowKeys = [index];
                    selectedRows = [rowData];
                } else {
                    // 多选模式，添加到选中列表
                    if (!selectedRowKeys.includes(index)) {
                        selectedRowKeys.push(index);
                        selectedRows.push(rowData);
                    }
                }

                renderTable(currentPage);
            }

            // 取消选中行
            function deselectRow(index) {
                const rowIndex = selectedRowKeys.indexOf(index);
                if (rowIndex !== -1) {
                    selectedRowKeys.splice(rowIndex, 1);
                    selectedRows.splice(rowIndex, 1);
                }

                renderTable(currentPage);
            }

            // 更新分页区域
            function updatePagination() {
                // 计算总页数
                const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));

                // 清空分页导航
                paginationNav.innerHTML = '';

                // 创建上一页按钮
                const prevBtn = document.createElement('button');
                prevBtn.textContent = '<';
                prevBtn.style.cssText = `
    padding: 4px 8px;
    margin: 0 5px;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    background-color: ${currentPage === 1 ? '#f5f5f5' : '#fff'};
    cursor: ${currentPage === 1 ? 'not-allowed' : 'pointer'};
    color: ${currentPage === 1 ? '#c0c4cc' : '#606266'};
`;
                prevBtn.disabled = currentPage === 1;
                prevBtn.onclick = function () {
                    if (currentPage > 1) {
                        renderTable(currentPage - 1);
                    }
                };
                paginationNav.appendChild(prevBtn);

                // 创建页码按钮
                const maxVisiblePages = 5;
                let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

                if (endPage - startPage + 1 < maxVisiblePages) {
                    startPage = Math.max(1, endPage - maxVisiblePages + 1);
                }

                if (startPage > 1) {
                    // 添加第一页按钮
                    const firstPageBtn = document.createElement('button');
                    firstPageBtn.textContent = '1';
                    firstPageBtn.style.cssText = `
        padding: 4px 8px;
        margin: 0 5px;
        border: 1px solid #e8e8e8;
        border-radius: 4px;
        background-color: #fff;
        cursor: pointer;
        color: #606266;
    `;
                    firstPageBtn.onclick = function () {
                        renderTable(1);
                    };
                    paginationNav.appendChild(firstPageBtn);

                    if (startPage > 2) {
                        // 添加省略号
                        const ellipsis = document.createElement('span');
                        ellipsis.textContent = '...';
                        ellipsis.style.margin = '0 5px';
                        paginationNav.appendChild(ellipsis);
                    }
                }

                for (let i = startPage; i <= endPage; i++) {
                    const pageBtn = document.createElement('button');
                    pageBtn.textContent = i;
                    pageBtn.style.cssText = `
        padding: 4px 8px;
        margin: 0 5px;
        border: 1px solid ${i === currentPage ? '#409eff' : '#e8e8e8'};
        border-radius: 4px;
        background-color: ${i === currentPage ? '#409eff' : '#fff'};
        cursor: pointer;
        color: ${i === currentPage ? '#fff' : '#606266'};
    `;
                    pageBtn.onclick = function () {
                        renderTable(i);
                    };
                    paginationNav.appendChild(pageBtn);
                }

                if (endPage < totalPages) {
                    if (endPage < totalPages - 1) {
                        // 添加省略号
                        const ellipsis = document.createElement('span');
                        ellipsis.textContent = '...';
                        ellipsis.style.margin = '0 5px';
                        paginationNav.appendChild(ellipsis);
                    }

                    // 添加最后一页按钮
                    const lastPageBtn = document.createElement('button');
                    lastPageBtn.textContent = totalPages;
                    lastPageBtn.style.cssText = `
        padding: 4px 8px;
        margin: 0 5px;
        border: 1px solid #e8e8e8;
        border-radius: 4px;
        background-color: #fff;
        cursor: pointer;
        color: #606266;
    `;
                    lastPageBtn.onclick = function () {
                        renderTable(totalPages);
                    };
                    paginationNav.appendChild(lastPageBtn);
                }

                // 创建下一页按钮
                const nextBtn = document.createElement('button');
                nextBtn.textContent = '>';
                nextBtn.style.cssText = `
    padding: 4px 8px;
    margin: 0 5px;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    background-color: ${currentPage === totalPages ? '#f5f5f5' : '#fff'};
    cursor: ${currentPage === totalPages ? 'not-allowed' : 'pointer'};
    color: ${currentPage === totalPages ? '#c0c4cc' : '#606266'};
`;
                nextBtn.disabled = currentPage === totalPages;
                nextBtn.onclick = function () {
                    if (currentPage < totalPages) {
                        renderTable(currentPage + 1);
                    }
                };
                paginationNav.appendChild(nextBtn);

                // 更新页码信息
                pageInfo.textContent = `共${filteredData.length}条，页码${currentPage}/${totalPages}`;
            }

            // 执行搜索
            function performSearch() {
                searchText = searchInput.value.toLowerCase().trim();

                if (searchText === '') {
                    // 如果搜索框为空，显示所有数据
                    filteredData = [...originalData];
                } else {
                    // 过滤数据
                    filteredData = originalData.filter(item => {
                        if (searchField === 'all') {
                            // 搜索所有可搜索字段
                            return searchableFields.some(field => {
                                const value = item[field];
                                return value !== undefined &&
                                    String(value).toLowerCase().includes(searchText);
                            });
                        } else {
                            // 搜索指定字段
                            const value = item[searchField];
                            return value !== undefined &&
                                String(value).toLowerCase().includes(searchText);
                        }
                    });
                }

                // 重新渲染表格，从第一页开始
                renderTable(1);
            }

            // 重置搜索
            function resetSearch() {
                searchInput.value = '';
                searchText = '';
                searchField = 'all';
                typeSelect.value = 'all';
                filteredData = [...originalData];
                renderTable(1);
            }

            // 初始渲染
            renderTable(1);
        }
        /**
         * 显示自适应大小的提示弹窗
         * @param {string|Object|Array} content - 提示内容，支持以下几种格式：
         *                             1. 字符串：直接显示内容文本，支持多行文本（使用\n换行）
         *                             2. 对象：{title: '内容标题', content: '内容文本' | ['内容1', '内容2']}，title可省略
         *                             3. 数组模块：[{title: '模块标题', content: '内容' | ['项目1','项目2'] | [{title:'子标题',content:'子内容'},...], titleButton: {text: '按钮文本', onClick: function() {}}, titleBgColor: '#颜色值'}]
         *                             4. 子标题数组：[{title: '子标题1', content: '子内容' | ['子内容1','子内容2']}]
         * @param {Object} options - 可选配置项
         * @param {string} options.title - 弹窗标题，不设置则不显示标题栏
         * @param {string|number} options.width - 弹窗宽度，默认 '80%'
         * @param {string|number} options.minWidth - 弹窗最小宽度，默认 '250px'
         * @param {string|number} options.maxWidth - 弹窗最大宽度，默认 '600px'
         * @param {string} options.maxHeight - 弹窗最大高度，默认 '85vh'
         * @param {string} options.background - 弹窗背景色，默认 '#fff'
         * @param {string} options.color - 文字颜色，默认 '#333'
         * @param {number} options.duration - 自动关闭时间(ms)，不设置则不自动关闭
         * @param {function} options.onClose - 关闭后的回调函数
         * @example
         * // 基本示例：字符串内容
         * showTipPopup('这是一条简单的提示信息', {
         *   title: '提示'
         * });
         *
         * // 带标题的复杂结构示例
         * showTipPopup([
         *   {
         *     title: '模块一',
         *     titleBgColor: '#ffebee', // 错误提示背景色
         *     content: [
         *       {
         *         title: '子标题1',
         *         content: '子内容文本'
         *       },
         *       {
         *         title: '子标题2',
         *         content: '子项目内容'
         *       }
         *     ],
         *     titleButton: {
         *       text: '操作',
         *       onClick: function() {
         *         alert('点击了模块一的按钮');
         *       },
         *       style: 'background: #f0f0f0; color: #333;' // 可选样式
         *     }
         *   },
         *   {
         *     title: '模块二',
         *     titleBgColor: '#fff8e1', // 警告提示背景色
         *     content: '列表项内容'
         *   },
         *   {
         *     title: '模块三',
         *     titleBgColor: '#e1f5fe', // 建议提示背景色
         *     content: '列表项内容'
         *   }
         * ], {
         *   title: '复杂结构示例'
         * });
         *
         * // 不带标题的模块示例
         * showTipPopup([
         *   {
         *     title: '提示信息',
         *     content: '这是一条重要通知'
         *   },
         *   {
         *     title: '详细说明',
         *     content: '这里是详细说明内容'
         *   }
         * ]);
         */
        this.showTipPopup = function(content, options = {}) {
            // 默认选项
            const defaultOptions = {
                title: '',
                width: '80%',
                minWidth: '250px',
                maxWidth: '600px',
                maxHeight: '85vh',
                background: '#fff',
                color: '#333',
                duration: 0,
                onClose: null
            };

            // 合并选项
            const mergedOptions = { ...defaultOptions, ...options };

            // 获取视口尺寸和计算最大高度
            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;
            const maxHeightPx = mergedOptions.maxHeight.includes('vh')
                ? parseFloat(mergedOptions.maxHeight) / 100 * viewportHeight
                : parseInt(mergedOptions.maxHeight);

            // 计算宽度（像素）
            const maxWidthPx = mergedOptions.maxWidth.toString().includes('%')
                ? parseFloat(mergedOptions.maxWidth) / 100 * viewportWidth
                : parseInt(mergedOptions.maxWidth);

            const minWidthPx = mergedOptions.minWidth.toString().includes('%')
                ? parseFloat(mergedOptions.minWidth) / 100 * viewportWidth
                : parseInt(mergedOptions.minWidth);

            const widthPx = mergedOptions.width.toString().includes('%')
                ? parseFloat(mergedOptions.width) / 100 * viewportWidth
                : parseInt(mergedOptions.width);

            // 创建弹窗元素
            const popup = document.createElement('div');
            popup.className = 'tip-popup';

            // 设置弹窗基本样式
            popup.style.cssText = `
position: fixed;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
max-width: ${maxWidthPx}px;
min-width: ${minWidthPx}px;
background: ${mergedOptions.background};
color: ${mergedOptions.color};
border-radius: 8px;
box-shadow: 0 3px 20px rgba(0, 0, 0, 0.18);
z-index: 9999;
box-sizing: border-box;
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
display: flex;
flex-direction: column;
border: 1px solid rgba(0, 0, 0, 0.08);
overflow: hidden;
`;

            // 标题栏高度（初始为0）
            let titleBarHeight = 0;

            // 创建标题区域（如果有标题）
            if (mergedOptions.title) {
                const titleBar = document.createElement('div');
                titleBar.className = 'tip-popup-title';
                titleBar.style.cssText = `
padding: 14px 18px;
font-weight: 700;
font-size: 17px;
border-bottom: 1px solid #eee;
display: flex;
justify-content: space-between;
align-items: center;
background: #f9f9fa;
flex-shrink: 0;
letter-spacing: -0.01em;
color: #333;
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
`;

                const titleText = document.createElement('div');
                titleText.textContent = mergedOptions.title;
                titleBar.appendChild(titleText);

                // 创建关闭按钮
                const closeBtn = document.createElement('div');
                closeBtn.className = 'tip-popup-close';
                closeBtn.innerHTML = '&times;';
                closeBtn.style.cssText = `
cursor: pointer;
font-size: 22px;
color: #999;
width: 26px;
height: 26px;
line-height: 26px;
text-align: center;
border-radius: 50%;
margin-left: 8px;
transition: all 0.15s ease;
`;

                // 关闭按钮悬停效果
                closeBtn.onmouseover = () => {
                    closeBtn.style.backgroundColor = 'rgba(0, 0, 0, 0.08)';
                    closeBtn.style.color = '#666';
                };

                closeBtn.onmouseout = () => {
                    closeBtn.style.backgroundColor = 'transparent';
                    closeBtn.style.color = '#999';
                };

                titleBar.appendChild(closeBtn);
                popup.appendChild(titleBar);

                // 点击关闭按钮关闭弹窗
                closeBtn.onclick = closePopup;
            }

            // 创建内容区域容器
            const contentWrapper = document.createElement('div');
            contentWrapper.className = 'tip-popup-content-wrapper';
            contentWrapper.style.cssText = `
padding: ${mergedOptions.title ? '18px' : '22px'};
border-radius: ${mergedOptions.title ? '0 0 8px 8px' : '8px'};
`;

            // 创建内容容器
            const contentContainer = document.createElement('div');
            contentContainer.className = 'tip-popup-content-container';

            // 通用样式对象
            const styles = {
                title: `
font-weight: 650;
font-size: 15.5px;
margin-bottom: 0;
color: #333;
letter-spacing: -0.01em;
line-height: 1.3;
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
background-color: #f5f5f5;
padding: 10px 12px;
border-radius: 4px;
margin-left: -4px;
margin-right: -4px;
margin-top: 2px;
width: calc(100% + 8px);
box-sizing: border-box;
`,
                subtitle: `
font-weight: 600;
font-size: 14.5px;
margin-bottom: 0;
color: #444;
letter-spacing: -0.01em;
line-height: 1.3;
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
min-width: 80px;
flex-shrink: 0;
`,
                content: `
word-break: break-word;
line-height: 1.6;
font-size: 14px;
color: #555;
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
padding-left: 2px;
flex: 1;
max-width: 420px;
overflow-wrap: break-word;
`,
                ellipsisContent: `
display: -webkit-box;
-webkit-line-clamp: 2;
-webkit-box-orient: vertical;
overflow: hidden;
text-overflow: ellipsis;
white-space: normal;
`
            };

            // 处理长字符串，如果超过指定长度则自动插入换行符
            const formatLongText = (text, maxLength = 60) => {
                if (typeof text !== 'string' || text.length <= maxLength) {
                    return text;
                }

                // 在特定字符位置添加换行符
                let result = '';
                for (let i = 0; i < text.length; i++) {
                    result += text[i];
                    if ((i + 1) % maxLength === 0 && i < text.length - 1) {
                        // 避免在单词中间换行，寻找最近的合适位置
                        let breakPos = i;
                        for (let j = i; j > i - 10 && j >= 0; j--) {
                            if (/[\s,\[\]\(\){}:;"'=]/.test(text[j])) {
                                breakPos = j;
                                break;
                            }
                        }
                        if (breakPos !== i) {
                            result = result.substring(0, result.length - (i - breakPos)) + '\n' +
                                result.substring(result.length - (i - breakPos));
                        } else {
                            result += '\n';
                        }
                    }
                }
                return result;
            };

            // 处理内容格式，应用文本截断和提示功能
            const applyEllipsisToContent = (element, fullText) => {
                if (!element) return; // 确保元素存在

                // 保存全文以供展开时使用
                element.setAttribute('data-full-text', fullText);

                // 创建一个容器来包含文本内容和展开按钮
                const container = document.createElement('div');
                container.style.cssText = `
position: relative;
display: flex;
flex-wrap: wrap;
align-items: center;
width: 100%;
`;

                // 创建文本元素
                const textElement = document.createElement('div');
                textElement.textContent = fullText;
                textElement.style.cssText = styles.ellipsisContent + `
cursor: pointer;
position: relative;
transition: background-color 0.3s ease;
flex: 1;
min-width: 0;
`;

                // 复制提示元素
                const copyIndicator = document.createElement('span');
                copyIndicator.textContent = '（已复制）';
                copyIndicator.style.cssText = `
display: none;
color: #007700;
font-size: 12px;
margin-left: 5px;
font-weight: bold;
`;

                // 创建展开按钮
                const expandButton = document.createElement('button');
                expandButton.textContent = '展开全部';
                expandButton.style.cssText = `
display: none;
margin-left: 5px;
padding: 2px 5px;
font-size: 12px;
border-radius: 3px;
border: 1px solid rgba(0,0,0,0.1);
background: #f7f7f7;
color: #666;
cursor: pointer;
transition: all 0.15s ease;
flex-shrink: 0;
`;

                // 添加按钮悬停效果
                expandButton.onmouseover = () => {
                    expandButton.style.backgroundColor = '#e7e7e7';
                    expandButton.style.borderColor = 'rgba(0,0,0,0.15)';
                };

                expandButton.onmouseout = () => {
                    expandButton.style.backgroundColor = '#f7f7f7';
                    expandButton.style.borderColor = 'rgba(0,0,0,0.1)';
                };

                // 添加点击复制功能
                textElement.onclick = (e) => {
                    e.stopPropagation(); // 阻止冒泡

                    // 复制文本到剪贴板的函数
                    const copyTextToClipboard = (text) => {
                        // 方法1：使用 document.execCommand (兼容性好但已废弃)
                        const copyUsingExecCommand = () => {
                            const textarea = document.createElement('textarea');
                            textarea.value = text;
                            textarea.style.position = 'fixed';
                            textarea.style.opacity = '0';
                            document.body.appendChild(textarea);
                            textarea.select();

                            let success = false;
                            try {
                                success = document.execCommand('copy');
                            } catch (err) {
                                console.error('无法复制文本:', err);
                            }

                            document.body.removeChild(textarea);
                            return success;
                        };

                        // 方法2：使用 Clipboard API (新API，部分浏览器支持)
                        const copyUsingClipboardAPI = async () => {
                            try {
                                if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
                                    await navigator.clipboard.writeText(text);
                                    return true;
                                }
                                return false;
                            } catch (err) {
                                console.error('Clipboard API 复制失败:', err);
                                return false;
                            }
                        };

                        // 优先使用 Clipboard API，失败则回退到 execCommand
                        return copyUsingClipboardAPI().then(success => {
                            if (!success) {
                                return copyUsingExecCommand();
                            }
                            return true;
                        }).catch(() => {
                            return copyUsingExecCommand();
                        });
                    };

                    // 执行复制
                    copyTextToClipboard(fullText).then(success => {
                        if (success) {
                            // 视觉反馈 - 添加浅绿色背景
                            const originalBackgroundColor = textElement.style.backgroundColor;
                            textElement.style.backgroundColor = '#e8f5e9'; // 浅绿色

                            // 显示"已复制"提示
                            copyIndicator.style.display = 'inline-block';

                            // 2秒后恢复原样
                            setTimeout(() => {
                                textElement.style.backgroundColor = originalBackgroundColor;
                                copyIndicator.style.display = 'none';
                            }, 2000);
                        }
                    }).catch(err => {
                        console.error('复制失败:', err);
                    });
                };

                // 定义展开/收起状态变量
                let isExpanded = false;

                // 添加点击事件处理展开全部内容
                expandButton.onclick = (e) => {
                    e.stopPropagation(); // 阻止冒泡

                    // 找到最近的弹窗内容区域容器和弹窗
                    let contentWrapper = element.closest('.tip-popup-content-wrapper');
                    let popup = null;

                    if (!contentWrapper) {
                        // 往上查找可能的父元素
                        let parent = element;
                        while (parent && !contentWrapper) {
                            parent = parent.parentElement;
                            if (parent && parent.classList.contains('tip-popup-content-wrapper')) {
                                contentWrapper = parent;
                            }
                        }
                    }

                    if (contentWrapper) {
                        popup = contentWrapper.closest('.tip-popup');
                    }

                    // 更新内容状态
                    if (isExpanded) {
                        // 收起内容
                        textElement.style.webkitLineClamp = '2';
                        textElement.style.maxHeight = '';
                        textElement.style.overflow = 'hidden';
                        expandButton.textContent = '展开全部';
                        isExpanded = false;
                    } else {
                        // 展开全部内容
                        textElement.style.webkitLineClamp = 'unset';
                        textElement.style.maxHeight = 'none';
                        expandButton.textContent = '收起';
                        isExpanded = true;
                    }

                    // 无论是展开还是收起，都重新计算弹窗尺寸
                    if (contentWrapper && popup) {
                        // 先重置内容区域和弹窗高度，让它们能够自适应内容
                        contentWrapper.style.height = 'auto';
                        contentWrapper.style.maxHeight = '';
                        popup.style.height = 'auto';

                        // 延迟执行，确保DOM更新完成
                        setTimeout(() => {
                            // 计算视口高度和当前内容高度
                            const viewportHeight = window.innerHeight;
                            const maxHeight = viewportHeight * 0.85; // 使用85%视口高度作为最大高度

                            // 获取标题栏高度（如果有）
                            const titleBar = popup.querySelector('.tip-popup-title');
                            const titleBarHeight = titleBar ? titleBar.offsetHeight : 0;

                            // 获取内容实际高度
                            const contentActualHeight = contentWrapper.scrollHeight;

                            // 判断内容高度是否超过限制
                            if (titleBarHeight + contentActualHeight > maxHeight) {
                                // 内容过高，使用最大高度并添加滚动
                                contentWrapper.style.maxHeight = (maxHeight - titleBarHeight) + 'px';
                                contentWrapper.style.overflowY = 'auto';
                                popup.style.height = maxHeight + 'px';
                            } else {
                                // 内容高度适中，使用自适应高度
                                contentWrapper.style.maxHeight = '';
                                contentWrapper.style.overflowY = 'visible';
                                popup.style.height = 'auto';
                            }

                            // 更新弹窗位置，保持居中
                            popup.style.top = '50%';
                            popup.style.left = '50%';
                            popup.style.transform = 'translate(-50%, -50%)';
                        }, 50);
                    }
                };

                // 将元素添加到容器中
                container.appendChild(textElement);
                container.appendChild(copyIndicator);
                container.appendChild(expandButton);

                // 清空原始元素并添加新容器
                while (element.firstChild) {
                    element.removeChild(element.firstChild);
                }
                element.appendChild(container);

                // 检查内容是否超出了两行，如果超出则显示展开按钮
                setTimeout(() => {
                    if (textElement.scrollHeight > textElement.clientHeight) {
                        expandButton.style.display = 'inline-block';
                    }
                }, 10);
            };

            // 处理内容
            if (typeof content === 'string') {
                // 字符串内容
                const contentEl = document.createElement('div');
                contentEl.className = 'tip-popup-content';
                contentEl.style.cssText = styles.content;
                contentEl.textContent = formatLongText(content);
                contentContainer.appendChild(contentEl);
            } else if (Array.isArray(content)) {
                // 数组内容处理
                content.forEach((module, index) => {
                    const moduleEl = document.createElement('div');
                    moduleEl.className = 'tip-popup-module';
                    moduleEl.style.cssText = `
margin-bottom: ${index < content.length - 1 ? '20px' : '0'};
padding-bottom: ${index < content.length - 1 ? '20px' : '0'};
border-bottom: ${index < content.length - 1 ? '1px solid #eee' : 'none'};
`;

                    // 添加模块标题
                    if (module.title) {
                        const titleContainer = document.createElement('div');
                        titleContainer.className = 'tip-popup-title-container';

                        // 默认背景色或用户自定义背景色
                        const titleBgColor = module.titleBgColor || '#f5f5f5';

                        titleContainer.style.cssText = `
display: flex;
justify-content: space-between;
align-items: center;
background-color: ${titleBgColor};
padding: 10px 12px;
border-radius: 4px;
margin-left: -4px;
margin-right: -4px;
margin-top: 2px;
width: calc(100% + 8px);
box-sizing: border-box;
`;

                        const titleEl = document.createElement('div');
                        titleEl.className = 'tip-popup-inner-title';
                        titleEl.style.cssText = `
font-weight: 650;
font-size: 15.5px;
margin-bottom: 0;
color: #333;
letter-spacing: -0.01em;
line-height: 1.3;
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
`;
                        titleEl.textContent = module.title;
                        titleContainer.appendChild(titleEl);

                        // 如果有titleButton属性，添加按钮
                        if (module.titleButton) {
                            const button = document.createElement('button');
                            button.className = 'tip-popup-title-button';
                            button.textContent = module.titleButton.text || '操作';
                            button.style.cssText = `
  padding: 3px 8px;
  font-size: 12px;
  border-radius: 3px;
  border: 1px solid rgba(0,0,0,0.1);
  background: #fff;
  color: #666;
  cursor: pointer;
  margin-left: 8px;
  transition: all 0.15s ease;
  outline: none;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
`;

                            // 应用自定义样式（如果有）
                            if (module.titleButton.style) {
                                button.style.cssText += module.titleButton.style;
                            }

                            // 添加悬停效果
                            button.onmouseover = () => {
                                button.style.backgroundColor = '#f7f7f7';
                                button.style.borderColor = 'rgba(0,0,0,0.15)';
                            };

                            button.onmouseout = () => {
                                button.style.backgroundColor = '#fff';
                                button.style.borderColor = 'rgba(0,0,0,0.1)';
                            };

                            // 添加点击事件
                            if (typeof module.titleButton.onClick === 'function') {
                                button.onclick = (e) => {
                                    e.stopPropagation(); // 阻止冒泡，防止触发外部点击事件
                                    module.titleButton.onClick();
                                };
                            }

                            titleContainer.appendChild(button);
                        }

                        moduleEl.appendChild(titleContainer);

                        // 在标题和内容之间添加一些间距
                        if (module.content) {
                            const spacer = document.createElement('div');
                            spacer.style.height = '8px';
                            moduleEl.appendChild(spacer);
                        }
                    }

                    // 处理模块内容
                    if (module.content) {
                        if (Array.isArray(module.content)) {
                            // 检查数组的第一个元素是否为对象并且有title属性
                            const firstItem = module.content[0];
                            const isNestedObject = firstItem &&
                                typeof firstItem === 'object' &&
                                firstItem !== null &&
                                firstItem.title !== undefined;

                            if (isNestedObject) {
                                // 嵌套对象数组 - 每个对象有title和content
                                module.content.forEach((subItem, subIndex) => {
                                    // 创建一个包含标题和内容的单行元素
                                    if (subItem.title) {
                                        const lineEl = document.createElement('div');
                                        lineEl.className = 'tip-popup-line-item';
                                        lineEl.style.cssText = `
        display: flex;
        margin-bottom: ${subIndex < module.content.length - 1 ? '10px' : '0'};
        line-height: 1.6;
        padding: 4px 0;
      `;

                                        // 添加标题部分，使用subtitle样式
                                        const titleSpan = document.createElement('span');
                                        titleSpan.className = 'tip-popup-line-title';
                                        titleSpan.style.cssText = styles.subtitle;
                                        titleSpan.style.marginRight = '8px';
                                        titleSpan.textContent = `${subItem.title}：`;
                                        lineEl.appendChild(titleSpan);

                                        // 添加内容部分
                                        const contentSpan = document.createElement('span');
                                        contentSpan.className = 'tip-popup-line-content';
                                        contentSpan.style.cssText = styles.content;

                                        // 处理内容部分 - 只支持字符串
                                        if (subItem.content !== undefined) {
                                            if (Array.isArray(subItem.content)) {
                                                // 数组内容仅取第一个元素
                                                contentSpan.textContent = subItem.content.length > 0 ?
                                                    formatLongText(String(subItem.content[0] || '')) : '';
                                            } else {
                                                contentSpan.textContent = formatLongText(String(subItem.content || ''));
                                            }
                                            // 应用省略处理
                                            applyEllipsisToContent(contentSpan, contentSpan.textContent);
                                        }

                                        lineEl.appendChild(contentSpan);

                                        // 添加上边距（除了第一个）
                                        if (subIndex > 0) {
                                            lineEl.style.marginTop = '6px';
                                        }

                                        moduleEl.appendChild(lineEl);
                                    } else if (subItem.content !== undefined) {
                                        // 没有标题但有内容的情况
                                        const contentEl = document.createElement('div');
                                        contentEl.className = 'tip-popup-content';
                                        contentEl.style.cssText = styles.content;

                                        if (Array.isArray(subItem.content)) {
                                            // 数组内容仅取第一个元素
                                            contentEl.textContent = subItem.content.length > 0 ?
                                                formatLongText(String(subItem.content[0] || '')) : '';
                                        } else {
                                            contentEl.textContent = formatLongText(String(subItem.content || ''));
                                        }
                                        // 应用省略处理
                                        applyEllipsisToContent(contentEl, contentEl.textContent);

                                        moduleEl.appendChild(contentEl);
                                    }
                                });
                            } else {
                                // 普通数组 - 纯文本或简单值 - 仅支持第一个元素
                                const contentEl = document.createElement('div');
                                contentEl.className = 'tip-popup-content';
                                contentEl.style.cssText = styles.content;
                                contentEl.textContent = module.content.length > 0 ?
                                    formatLongText(String(module.content[0] || '')) : '';
                                // 应用省略处理
                                applyEllipsisToContent(contentEl, contentEl.textContent);
                                moduleEl.appendChild(contentEl);
                            }
                        } else if (typeof module.content === 'object' && module.content !== null) {
                            // 对象内容 - 可能有title和content
                            if (module.content.title) {
                                const lineEl = document.createElement('div');
                                lineEl.className = 'tip-popup-line-item';
                                lineEl.style.cssText = `
    display: flex;
    line-height: 1.6;
    padding: 4px 0;
  `;

                                // 添加标题部分，使用subtitle样式
                                const titleSpan = document.createElement('span');
                                titleSpan.className = 'tip-popup-line-title';
                                titleSpan.style.cssText = styles.subtitle;
                                titleSpan.style.marginRight = '8px';
                                titleSpan.textContent = `${module.content.title}：`;
                                lineEl.appendChild(titleSpan);

                                // 添加内容部分
                                const contentSpan = document.createElement('span');
                                contentSpan.className = 'tip-popup-line-content';
                                contentSpan.style.cssText = styles.content;

                                // 处理内容
                                if (module.content.content !== undefined) {
                                    if (Array.isArray(module.content.content)) {
                                        // 数组内容仅取第一个元素
                                        contentSpan.textContent = module.content.content.length > 0 ?
                                            formatLongText(String(module.content.content[0] || '')) : '';
                                    } else {
                                        contentSpan.textContent = formatLongText(String(module.content.content || ''));
                                    }
                                    // 应用省略处理
                                    applyEllipsisToContent(contentSpan, contentSpan.textContent);
                                }

                                lineEl.appendChild(contentSpan);
                                moduleEl.appendChild(lineEl);
                            } else if (module.content.content !== undefined) {
                                // 没有标题但有内容
                                const contentEl = document.createElement('div');
                                contentEl.className = 'tip-popup-content';
                                contentEl.style.cssText = styles.content;

                                if (Array.isArray(module.content.content)) {
                                    // 数组内容仅取第一个元素
                                    contentEl.textContent = module.content.content.length > 0 ?
                                        formatLongText(String(module.content.content[0] || '')) : '';
                                } else {
                                    contentEl.textContent = formatLongText(String(module.content.content || ''));
                                }
                                // 应用省略处理
                                applyEllipsisToContent(contentEl, contentEl.textContent);

                                moduleEl.appendChild(contentEl);
                            }
                        } else {
                            // 字符串或其他简单类型
                            const contentEl = document.createElement('div');
                            contentEl.className = 'tip-popup-content';
                            contentEl.style.cssText = styles.content;
                            contentEl.textContent = formatLongText(String(module.content || ''));
                            // 应用省略处理
                            applyEllipsisToContent(contentEl, contentEl.textContent);
                            moduleEl.appendChild(contentEl);
                        }
                    }

                    contentContainer.appendChild(moduleEl);
                });
            } else if (content && typeof content === 'object') {
                // 对象内容
                const containerEl = document.createElement('div');

                // 标题和内容合并到一行（如果都存在）
                if (content.title && content.content !== undefined) {
                    const lineEl = document.createElement('div');
                    lineEl.className = 'tip-popup-line-item';
                    lineEl.style.cssText = `
display: flex;
line-height: 1.6;
padding: 4px 0;
`;

                    // 添加标题部分，使用subtitle样式
                    const titleSpan = document.createElement('span');
                    titleSpan.className = 'tip-popup-line-title';
                    titleSpan.style.cssText = styles.subtitle;
                    titleSpan.style.marginRight = '8px';
                    titleSpan.textContent = `${content.title}：`;
                    lineEl.appendChild(titleSpan);

                    // 添加内容部分
                    const contentSpan = document.createElement('span');
                    contentSpan.className = 'tip-popup-line-content';
                    contentSpan.style.cssText = styles.content;

                    // 处理内容
                    if (Array.isArray(content.content)) {
                        // 数组内容仅取第一个元素
                        contentSpan.textContent = content.content.length > 0 ?
                            formatLongText(String(content.content[0] || '')) : '';
                    } else if (typeof content.content === 'object' && content.content !== null) {
                        // 对于内容是对象的情况，创建新的处理元素
                        const contentEl = document.createElement('div');
                        contentEl.className = 'tip-popup-content';

                        if (content.content.title) {
                            const subTitleEl = document.createElement('div');
                            subTitleEl.className = 'tip-popup-sub-title';
                            subTitleEl.style.cssText = styles.subtitle;
                            subTitleEl.textContent = content.content.title;
                            contentEl.appendChild(subTitleEl);
                        }

                        if (content.content.content !== undefined) {
                            const subContentEl = document.createElement('div');
                            subContentEl.style.cssText = styles.content;

                            if (Array.isArray(content.content.content)) {
                                // 数组内容仅取第一个元素
                                subContentEl.textContent = content.content.content.length > 0 ?
                                    formatLongText(String(content.content.content[0] || '')) : '';
                            } else {
                                subContentEl.textContent = formatLongText(String(content.content.content || ''));
                            }
                            // 应用省略处理
                            applyEllipsisToContent(subContentEl, subContentEl.textContent);

                            contentEl.appendChild(subContentEl);
                        }

                        containerEl.appendChild(contentEl);
                        contentContainer.appendChild(containerEl);
                        return; // 提前返回，避免下面的代码执行
                    } else {
                        contentSpan.textContent = formatLongText(String(content.content || ''));
                    }

                    lineEl.appendChild(contentSpan);
                    containerEl.appendChild(lineEl);
                } else {
                    // 只有标题没有内容
                    if (content.title) {
                        const titleContainer = document.createElement('div');
                        titleContainer.className = 'tip-popup-title-container';

                        // 默认背景色或用户自定义背景色
                        const titleBgColor = content.titleBgColor || '#f5f5f5';

                        titleContainer.style.cssText = `
display: flex;
justify-content: space-between;
align-items: center;
background-color: ${titleBgColor};
padding: 10px 12px;
border-radius: 4px;
margin-left: -4px;
margin-right: -4px;
margin-top: 2px;
width: calc(100% + 8px);
box-sizing: border-box;
`;

                        const titleEl = document.createElement('div');
                        titleEl.className = 'tip-popup-inner-title';
                        titleEl.style.cssText = `
font-weight: 650;
font-size: 15.5px;
margin-bottom: 0;
color: #333;
letter-spacing: -0.01em;
line-height: 1.3;
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
`;
                        titleEl.textContent = content.title;
                        titleContainer.appendChild(titleEl);

                        // 如果有titleButton属性，添加按钮
                        if (content.titleButton) {
                            const button = document.createElement('button');
                            button.className = 'tip-popup-title-button';
                            button.textContent = content.titleButton.text || '操作';
                            button.style.cssText = `
  padding: 3px 8px;
  font-size: 12px;
  border-radius: 3px;
  border: 1px solid rgba(0,0,0,0.1);
  background: #fff;
  color: #666;
  cursor: pointer;
  margin-left: 8px;
  transition: all 0.15s ease;
  outline: none;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
`;

                            // 应用自定义样式（如果有）
                            if (content.titleButton.style) {
                                button.style.cssText += content.titleButton.style;
                            }

                            // 添加悬停效果
                            button.onmouseover = () => {
                                button.style.backgroundColor = '#f7f7f7';
                                button.style.borderColor = 'rgba(0,0,0,0.15)';
                            };

                            button.onmouseout = () => {
                                button.style.backgroundColor = '#fff';
                                button.style.borderColor = 'rgba(0,0,0,0.1)';
                            };

                            // 添加点击事件
                            if (typeof content.titleButton.onClick === 'function') {
                                button.onclick = (e) => {
                                    e.stopPropagation(); // 阻止冒泡，防止触发外部点击事件
                                    content.titleButton.onClick();
                                };
                            }

                            titleContainer.appendChild(button);
                        }

                        containerEl.appendChild(titleContainer);
                    }

                    // 只有内容没有标题
                    if (content.content !== undefined) {
                        const contentEl = document.createElement('div');
                        contentEl.className = 'tip-popup-content';
                        contentEl.style.cssText = styles.content;

                        if (Array.isArray(content.content)) {
                            contentEl.textContent = formatLongText(content.content.join('\n'));
                        } else {
                            contentEl.textContent = formatLongText(String(content.content || ''));
                        }
                        // 应用省略处理
                        applyEllipsisToContent(contentEl, contentEl.textContent);

                        containerEl.appendChild(contentEl);
                    }
                }

                contentContainer.appendChild(containerEl);
            }

            contentWrapper.appendChild(contentContainer);
            popup.appendChild(contentWrapper);

            // 如果没有标题，需要单独添加关闭按钮
            if (!mergedOptions.title) {
                const closeBtn = document.createElement('div');
                closeBtn.className = 'tip-popup-close';
                closeBtn.innerHTML = '&times;';
                closeBtn.style.cssText = `
position: absolute;
top: 10px;
right: 10px;
cursor: pointer;
font-size: 22px;
color: #999;
width: 26px;
height: 26px;
line-height: 26px;
text-align: center;
border-radius: 50%;
z-index: 10000;
background-color: rgba(255, 255, 255, 0.8);
box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
transition: all 0.15s ease;
`;

                // 关闭按钮悬停效果
                closeBtn.onmouseover = () => {
                    closeBtn.style.backgroundColor = 'rgba(240, 240, 240, 0.95)';
                    closeBtn.style.color = '#666';
                };

                closeBtn.onmouseout = () => {
                    closeBtn.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
                    closeBtn.style.color = '#999';
                };

                popup.appendChild(closeBtn);

                // 点击关闭按钮关闭弹窗
                closeBtn.onclick = closePopup;
            }

            // 关闭弹窗函数
            function closePopup() {
                // 添加淡出动画
                popup.style.opacity = '0';
                popup.style.transform = 'translate(-50%, -50%) scale(0.95)';
                setTimeout(() => {
                    if (document.body.contains(popup)) {
                        document.body.removeChild(popup);
                        // 执行关闭回调
                        if (typeof mergedOptions.onClose === 'function') {
                            mergedOptions.onClose();
                        }
                    }
                }, 180);
            }

            // 点击弹窗外部关闭
            const outsideClickHandler = (e) => {
                if (!popup.contains(e.target) && document.body.contains(popup)) {
                    closePopup();
                    document.removeEventListener('click', outsideClickHandler);
                }
            };

            // 延迟添加点击事件，防止创建后立即触发
            setTimeout(() => {
                document.addEventListener('click', outsideClickHandler);
            }, 10);

            // 先隐藏添加到文档以便计算尺寸
            popup.style.opacity = '0';
            popup.style.visibility = 'hidden';
            document.body.appendChild(popup);

            // 临时移除宽度限制，让内容自然展开
            popup.style.width = 'auto';
            popup.style.maxWidth = 'none';
            contentContainer.style.maxWidth = 'none';
            contentContainer.style.width = 'auto';

            // 获取内容尺寸
            if (mergedOptions.title) {
                titleBarHeight = popup.querySelector('.tip-popup-title').offsetHeight;
            }
            const contentActualWidth = contentContainer.scrollWidth;
            const contentActualHeight = contentContainer.offsetHeight;

            // 计算内边距
            const contentPadding = mergedOptions.title ? 18 : 22;
            const paddingSpace = contentPadding * 2;

            // 计算最终宽度
            let finalWidth = Math.min(
                maxWidthPx,
                Math.max(minWidthPx, Math.min(widthPx, contentActualWidth + paddingSpace + 20))
            );

            // 如果内容太窄，设置最小宽度
            if (contentActualWidth < 200) {
                finalWidth = Math.max(finalWidth, 280);
            }

            // 计算最终高度
            const finalContentHeight = contentActualHeight + paddingSpace;
            const finalHeight = titleBarHeight + finalContentHeight;

            // 设置弹窗宽度
            popup.style.width = finalWidth + 'px';
            popup.style.maxWidth = maxWidthPx + 'px';

            // 限制高度并添加滚动
            if (finalHeight > maxHeightPx) {
                popup.style.height = maxHeightPx + 'px';
                contentWrapper.style.height = (maxHeightPx - titleBarHeight) + 'px';
                contentWrapper.style.overflowY = 'auto';
            } else {
                popup.style.height = 'auto';
                contentWrapper.style.height = 'auto';
                contentWrapper.style.overflowY = 'visible';
            }

            // 显示弹窗并添加进入动画
            popup.style.visibility = 'visible';
            popup.style.opacity = '0';
            popup.style.transform = 'translate(-50%, -50%) scale(0.95)';

            // 触发重绘并应用动画
            popup.offsetHeight;
            popup.style.transition = 'all 0.25s cubic-bezier(0.165, 0.84, 0.44, 1)';
            popup.style.opacity = '1';
            popup.style.transform = 'translate(-50%, -50%) scale(1)';

            // 自动关闭
            if (mergedOptions.duration > 0) {
                setTimeout(closePopup, mergedOptions.duration);
            }

            // 返回包含close方法的对象
            return {
                element: popup,
                close: closePopup
            };
        }

        /**
         * 模拟Windows文件夹弹窗选择器
         * @param {Object} options 配置项
         * @param {String} options.apiUrl 获取文件夹内容的接口地址
         * @param {Function} options.callback 点击确定按钮的回调函数，返回false可阻止弹窗关闭
         * @param {Object} options.extraParams 附加的API请求参数，会与默认的DirParentRid参数合并
         * @param {String} [options.title="文件选择器"] 弹窗标题，可选
         */
        this.showFolderSelector = function(options) {
            // 参数校验
            if (!options || !options.apiUrl || !options.callback) {
                console.error('缺少必要参数：apiUrl 或 callback');
                return;
            }

            // 附加参数对象，默认为空对象
            const extraParams = options.extraParams || {};

            // 弹窗标题
            const dialogTitle = options.title || "文件选择器";

            // 当前选中的文件/文件夹
            let currentSelectedItem = null;
            // 当前路径历史，用于面包屑导航
            let pathHistory = [{ rid: '', name: '根目录' }];
            // 当前文件夹RID
            let currentFolderRid = '';
            // 原始文件列表数据（用于搜索过滤）
            let originalFileList = [];

            // 创建弹窗DOM
            const dialog = document.createElement('div');
            dialog.className = 'folder-selector-dialog';
            dialog.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 800px;
        height: 600px;
        background-color: #fff;
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        display: flex;
        flex-direction: column;
        z-index: 9999;
    `;

            // 弹窗标题
            const header = document.createElement('div');
            header.style.cssText = `
        padding: 12px 16px;
        border-bottom: 1px solid #e8e8e8;
        font-size: 16px;
        font-weight: bold;
        display: flex;
        justify-content: space-between;
        align-items: center;
    `;
            header.innerHTML = `<span>${dialogTitle}</span>`;

            // 关闭按钮
            const closeBtn = document.createElement('span');
            closeBtn.innerHTML = '×';
            closeBtn.style.cssText = `
        cursor: pointer;
        font-size: 20px;
    `;
            closeBtn.onclick = function() {
                document.body.removeChild(dialog);
                document.body.removeChild(mask);
            };
            header.appendChild(closeBtn);

            // 面包屑导航
            const breadcrumb = document.createElement('div');
            breadcrumb.className = 'folder-breadcrumb';
            breadcrumb.style.cssText = `
        padding: 8px 16px;
        border-bottom: 1px solid #e8e8e8;
        display: flex;
        align-items: center;
        overflow-x: auto;
        white-space: nowrap;
    `;

            // 提示信息区域（用于显示错误提示）
            const alertContainer = document.createElement('div');
            alertContainer.style.cssText = `
        padding: 8px 16px;
        background-color: #fff2f0;
        border: 1px solid #ffccc7;
        border-radius: 4px;
        margin: 8px 16px 0;
        color: #ff4d4f;
        font-size: 14px;
        display: none;
    `;
            alertContainer.innerHTML = `
        <span style="margin-right: 8px;">⚠️</span>
        <span class="alert-message"></span>
    `;

            // 搜索栏容器
            const searchContainer = document.createElement('div');
            searchContainer.style.cssText = `
        padding: 8px 16px;
        border-bottom: 1px solid #e8e8e8;
        display: flex;
        align-items: center;
        gap: 8px;
    `;

            // 搜索输入框
            const searchInput = document.createElement('input');
            searchInput.type = 'text';
            searchInput.placeholder = '搜索当前目录文件...';
            searchInput.style.cssText = `
        flex: 1;
        padding: 6px 12px;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        font-size: 14px;
        outline: none;
        transition: border-color 0.3s;
    `;

            // 添加搜索框焦点样式
            searchInput.onfocus = function() {
                searchInput.style.borderColor = '#1890ff';
            };
            searchInput.onblur = function() {
                searchInput.style.borderColor = '#d9d9d9';
            };

            // 清除搜索按钮
            const clearSearchBtn = document.createElement('button');
            clearSearchBtn.innerHTML = '清除';
            clearSearchBtn.style.cssText = `
        padding: 6px 12px;
        background-color: #f5f5f5;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: background-color 0.3s;
    `;
            clearSearchBtn.onmouseover = function() {
                clearSearchBtn.style.backgroundColor = '#e6f7ff';
            };
            clearSearchBtn.onmouseout = function() {
                clearSearchBtn.style.backgroundColor = '#f5f5f5';
            };

            searchContainer.appendChild(searchInput);
            searchContainer.appendChild(clearSearchBtn);

            /**
             * 执行搜索过滤
             */
            function performSearch() {
                const searchTerm = searchInput.value.trim().toLowerCase();
                if (!searchTerm) {
                    // 搜索词为空，显示所有文件
                    renderFileList(originalFileList);
                    return;
                }

                // 过滤文件列表
                const filteredFiles = originalFileList.filter(file => {
                    return file.fileName.toLowerCase().includes(searchTerm);
                });

                renderFileList(filteredFiles);
            }

            // 搜索框输入事件 - 实时搜索
            searchInput.oninput = function() {
                performSearch();
            };

            // 搜索框回车事件
            searchInput.onkeypress = function(e) {
                if (e.key === 'Enter') {
                    performSearch();
                }
            };

            // 清除搜索事件
            clearSearchBtn.onclick = function() {
                searchInput.value = '';
                renderFileList(originalFileList);
                searchInput.focus();
            };

            // 文件列表容器
            const content = document.createElement('div');
            content.className = 'folder-content';
            content.style.cssText = `
        flex: 1;
        overflow-y: auto;
        padding: 0;
    `;

            // 文件列表表格
            const fileTable = document.createElement('table');
            fileTable.style.cssText = `
        width: 100%;
        border-collapse: collapse;
    `;

            // 表头
            const tableHeader = document.createElement('thead');
            tableHeader.innerHTML = `
        <tr style="background-color: #f5f5f5; position: sticky; top: 0; z-index: 10;">
            <th style="padding: 10px 16px; text-align: left; border-bottom: 1px solid #e8e8e8;">文件名</th>
            <th style="padding: 10px 16px; text-align: left; border-bottom: 1px solid #e8e8e8; width: 120px;">大小</th>
            <th style="padding: 10px 16px; text-align: left; border-bottom: 1px solid #e8e8e8; width: 160px;">上传时间</th>
            <th style="padding: 10px 16px; text-align: left; border-bottom: 1px solid #e8e8e8; width: 100px;">上传人员</th>
        </tr>
    `;
            fileTable.appendChild(tableHeader);

            // 表格内容
            const tableBody = document.createElement('tbody');
            tableBody.id = 'folder-table-body';
            fileTable.appendChild(tableBody);

            content.appendChild(fileTable);

            // 底部按钮区域
            const footer = document.createElement('div');
            footer.style.cssText = `
        padding: 12px 16px;
        border-top: 1px solid #e8e8e8;
        text-align: right;
    `;

            const cancelBtn = document.createElement('button');
            cancelBtn.innerText = '取消';
            cancelBtn.style.cssText = `
        margin-right: 8px;
        padding: 5px 16px;
        background-color: #f5f5f5;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        cursor: pointer;
    `;
            cancelBtn.onclick = function() {
                document.body.removeChild(dialog);
                document.body.removeChild(mask);
            };

            const confirmBtn = document.createElement('button');
            confirmBtn.innerText = '确定';
            confirmBtn.style.cssText = `
        padding: 5px 16px;
        background-color: #1890ff;
        border: 1px solid #1890ff;
        border-radius: 4px;
        color: white;
        cursor: pointer;
    `;
            confirmBtn.onclick = function() {
                if (currentSelectedItem) {
                    // 调用回调函数，支持返回字符串作为错误提示
                    const result = options.callback(currentSelectedItem);
                    
                    // 如果返回字符串，则显示错误提示并不关闭弹窗
                    if (typeof result === 'string') {
                        const alertMessage = alertContainer.querySelector('.alert-message');
                        alertMessage.textContent = result;
                        alertContainer.style.display = 'block';
                        return;
                    }
                    
                    // 如果返回false，则不关闭弹窗（兼容旧版本）
                    if (result === false) {
                        return;
                    }
                    
                    // 其他情况关闭弹窗
                    document.body.removeChild(dialog);
                    document.body.removeChild(mask);
                } else {
                    // 显示"请选择文件"的提示
                    const alertMessage = alertContainer.querySelector('.alert-message');
                    alertMessage.textContent = '请选择一个文件';
                    alertContainer.style.display = 'block';
                }
            };

            footer.appendChild(cancelBtn);
            footer.appendChild(confirmBtn);

            // 组装弹窗
            dialog.appendChild(header);
            dialog.appendChild(breadcrumb);
            dialog.appendChild(alertContainer);
            dialog.appendChild(searchContainer);
            dialog.appendChild(content);
            dialog.appendChild(footer);

            // 创建遮罩层
            const mask = document.createElement('div');
            mask.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.45);
        z-index: 9998;
    `;
            mask.onclick = function(e) {
                if (e.target === mask) {
                    document.body.removeChild(dialog);
                    document.body.removeChild(mask);
                }
            };

            // 添加到页面
            document.body.appendChild(mask);
            document.body.appendChild(dialog);

            /**
             * 更新面包屑导航
             */
            function updateBreadcrumb() {
                breadcrumb.innerHTML = '';

                // 添加导航图标
                const navIcon = document.createElement('div');
                navIcon.style.cssText = `
            width: 16px;
            height: 16px;
            margin-right: 8px;
            background-color: #1890ff;
            border-radius: 2px;
            position: relative;
            display: inline-block;
        `;
                // 添加导航图标内的条纹
                const navLine1 = document.createElement('div');
                navLine1.style.cssText = `
            position: absolute;
            width: 8px;
            height: 2px;
            background-color: white;
            top: 4px;
            left: 4px;
        `;
                const navLine2 = document.createElement('div');
                navLine2.style.cssText = `
            position: absolute;
            width: 8px;
            height: 2px;
            background-color: white;
            top: 8px;
            left: 4px;
        `;
                const navLine3 = document.createElement('div');
                navLine3.style.cssText = `
            position: absolute;
            width: 8px;
            height: 2px;
            background-color: white;
            top: 12px;
            left: 4px;
        `;
                navIcon.appendChild(navLine1);
                navIcon.appendChild(navLine2);
                navIcon.appendChild(navLine3);
                breadcrumb.appendChild(navIcon);

                pathHistory.forEach((path, index) => {
                    const breadcrumbItem = document.createElement('span');
                    breadcrumbItem.innerText = path.name;
                    breadcrumbItem.style.cssText = `
                cursor: pointer;
                color: ${index === pathHistory.length - 1 ? '#333' : '#1890ff'};
                ${index === pathHistory.length - 1 ? 'font-weight: bold;' : 'text-decoration: underline;'}
                padding: 4px 8px;
                border-radius: 4px;
                transition: background-color 0.2s;
            `;

                    if (index < pathHistory.length - 1) {
                        breadcrumbItem.onmouseover = function() {
                            breadcrumbItem.style.backgroundColor = '#e6f7ff';
                        };
                        breadcrumbItem.onmouseout = function() {
                            breadcrumbItem.style.backgroundColor = '';
                        };

                        breadcrumbItem.onclick = function() {
                            // 点击面包屑导航项，跳转到对应目录
                            pathHistory = pathHistory.slice(0, index + 1);
                            updateBreadcrumb(); // 立即更新面包屑显示
                            loadFolderContent(path.rid);
                        };
                    }

                    breadcrumb.appendChild(breadcrumbItem);

                    // 添加分隔符，最后一项不需要
                    if (index < pathHistory.length - 1) {
                        const separator = document.createElement('span');
                        separator.innerHTML = '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 2L8 6L4 10" stroke="#999" stroke-width="1.5" stroke-linecap="round"/></svg>';
                        separator.style.margin = '0 4px';
                        separator.style.display = 'inline-flex';
                        separator.style.alignItems = 'center';
                        breadcrumb.appendChild(separator);
                    }
                });
            }

            /**
             * 加载文件夹内容
             * @param {String} folderRid 文件夹RID
             */
            function loadFolderContent(folderRid) {
                currentFolderRid = folderRid;
                currentSelectedItem = null;

                // 显示加载中
                tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px;">加载中...</td></tr>';

                // 构建请求参数，合并附加参数
                const requestParams = {
                    DirParentRid: folderRid,
                    ...extraParams  // 展开附加参数
                };

                // 调用接口获取数据
                fetch(options.apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestParams)
                })
                    .then(response => response.json())
                    .then(response => {
                        // 支持新的接口返回格式 {code: xxx, data: [...]}
                        let data = response;

                        // 检查是否是新格式（包含code和data字段）
                        if (response && response.hasOwnProperty('code') && response.hasOwnProperty('data')) {
                            data = response.data;
                        }

                        if (data && Array.isArray(data)) {
                            // 保存原始文件列表数据
                            originalFileList = data;
                            // 检查是否包含uploader字段，决定是否显示上传人员列
                            updateTableHeader(data);
                            renderFileList(data);
                            // 清空搜索框
                            searchInput.value = '';
                        } else {
                            originalFileList = [];
                            tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px;">暂无数据</td></tr>';
                            searchInput.value = '';
                        }
                    })
                    .catch(error => {
                        console.error('获取文件夹内容失败：', error);
                        originalFileList = [];
                        tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px; color: red;">获取数据失败</td></tr>';
                        searchInput.value = '';
                    });
            }

            /**
             * 更新表格头部，根据数据决定是否显示上传人员列
             * @param {Array} files 文件列表数据
             */
            function updateTableHeader(files) {
                // 检查数据中是否包含上传人员信息
                const hasUploaderField = files.length > 0 && files.some(file => file.uploader);

                // 更新表头
                tableHeader.innerHTML = `
            <tr style="background-color: #f5f5f5; position: sticky; top: 0; z-index: 10;">
                <th style="padding: 10px 16px; text-align: left; border-bottom: 1px solid #e8e8e8;">文件名</th>
                <th style="padding: 10px 16px; text-align: left; border-bottom: 1px solid #e8e8e8; width: 120px;">大小</th>
                <th style="padding: 10px 16px; text-align: left; border-bottom: 1px solid #e8e8e8; width: 160px;">上传时间</th>
                ${hasUploaderField ? '<th style="padding: 10px 16px; text-align: left; border-bottom: 1px solid #e8e8e8; width: 100px;">上传人员</th>' : ''}
            </tr>
        `;

                // 更新空状态的列数
                const colSpan = hasUploaderField ? 4 : 3;
                if (tableBody.querySelector('td[colspan]')) {
                    tableBody.querySelector('td[colspan]').setAttribute('colspan', colSpan);
                }

                // 保存状态供渲染文件列表使用
                tableBody.dataset.hasUploaderField = hasUploaderField;
            }

            /**
             * 渲染文件列表
             * @param {Array} files 文件列表数据
             */
            function renderFileList(files) {
                if (!files || files.length === 0) {
                    const colSpan = tableBody.dataset.hasUploaderField === "true" ? 4 : 3;
                    const searchTerm = searchInput.value.trim();
                    const emptyMessage = searchTerm ? `未找到包含 "${searchTerm}" 的文件` : '当前文件夹为空';
                    tableBody.innerHTML = `<tr><td colspan="${colSpan}" style="text-align: center; padding: 20px; color: #999;">${emptyMessage}</td></tr>`;
                    return;
                }

                const hasUploaderField = tableBody.dataset.hasUploaderField === "true";
                tableBody.innerHTML = '';

                files.forEach(file => {
                    const row = document.createElement('tr');
                    row.style.cssText = `
                cursor: pointer;
                border-bottom: 1px solid #e8e8e8;
            `;

                    // 高亮选中行
                    row.onclick = function(e) {
                        const allRows = tableBody.querySelectorAll('tr');
                        allRows.forEach(r => r.style.backgroundColor = '');
                        row.style.backgroundColor = '#e6f7ff';
                        currentSelectedItem = file;
                        // 隐藏错误提示
                        alertContainer.style.display = 'none';
                    };

                    // 双击进入文件夹
                    row.ondblclick = function(e) {
                        if (file.isFolder) {
                            // 添加双击视觉反馈
                            row.style.backgroundColor = '#bae7ff';
                            setTimeout(() => {
                                pathHistory.push({ rid: file.rid, name: file.fileName });
                                updateBreadcrumb();
                                loadFolderContent(file.rid);
                            }, 150);
                        }
                    };

                    const fileNameCell = document.createElement('td');
                    fileNameCell.style.padding = '10px 16px';
                    fileNameCell.style.display = 'flex';
                    fileNameCell.style.alignItems = 'center';

                    // 文件图标 - 使用带样式的div代替文本
                    const fileIcon = document.createElement('div');

                    if (file.isFolder) {
                        // 文件夹图标样式
                        fileIcon.style.cssText = `
                    width: 20px;
                    height: 16px;
                    margin-right: 8px;
                    background-color: #faad14;
                    border-radius: 2px 2px 0 0;
                    position: relative;
                    transition: all 0.2s ease;
                `;
                        // 添加文件夹"折角"效果
                        const folderFlap = document.createElement('div');
                        folderFlap.style.cssText = `
                    position: absolute;
                    width: 40%;
                    height: 3px;
                    background-color: #faad14;
                    top: -3px;
                    border-radius: 2px 2px 0 0;
                    transition: all 0.2s ease;
                `;
                        fileIcon.appendChild(folderFlap);

                        // 添加文件夹悬停效果
                        row.onmouseover = function() {
                            if (currentSelectedItem !== file) {
                                row.style.backgroundColor = '#f5f5f5';
                            }
                            fileIcon.style.backgroundColor = '#ffc53d';
                            folderFlap.style.backgroundColor = '#ffc53d';
                        };
                        row.onmouseout = function() {
                            if (currentSelectedItem !== file) {
                                row.style.backgroundColor = '';
                            }
                            fileIcon.style.backgroundColor = '#faad14';
                            folderFlap.style.backgroundColor = '#faad14';
                        };
                    } else {
                        // 文件图标样式 - 根据文件扩展名设置不同颜色
                        const fileExt = file.fileName.split('.').pop().toLowerCase();
                        let fileColor = '#d9d9d9'; // 默认灰色

                        // 根据文件类型设置不同颜色
                        if (['doc', 'docx', 'txt', 'rtf'].includes(fileExt)) {
                            fileColor = '#4285f4'; // 文档类-蓝色
                        } else if (['xls', 'xlsx', 'csv'].includes(fileExt)) {
                            fileColor = '#0f9d58'; // 表格类-绿色
                        } else if (['ppt', 'pptx'].includes(fileExt)) {
                            fileColor = '#db4437'; // 演示类-红色
                        } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(fileExt)) {
                            fileColor = '#ff6d01'; // 图片类-橙色
                        } else if (['pdf'].includes(fileExt)) {
                            fileColor = '#db4437'; // PDF-红色
                        } else if (['zip', 'rar', '7z', 'tar', 'gz'].includes(fileExt)) {
                            fileColor = '#795548'; // 压缩包-棕色
                        }

                        fileIcon.style.cssText = `
                    width: 16px;
                    height: 20px;
                    margin-right: 8px;
                    background-color: ${fileColor};
                    border-radius: 2px;
                    position: relative;
                    transition: all 0.2s ease;
                    box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
                `;

                        // 添加文件右上角"折角"效果
                        const fileCorner = document.createElement('div');
                        fileCorner.style.cssText = `
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 0;
                    height: 0;
                    border-style: solid;
                    border-width: 4px 4px 0 0;
                    border-color: white transparent transparent transparent;
                    opacity: 0.5;
                `;
                        fileIcon.appendChild(fileCorner);

                        // 添加文件"条纹"效果
                        const fileLine1 = document.createElement('div');
                        fileLine1.style.cssText = `
                    position: absolute;
                    width: 60%;
                    height: 2px;
                    background-color: rgba(255, 255, 255, 0.6);
                    top: 5px;
                    left: 3px;
                `;
                        const fileLine2 = document.createElement('div');
                        fileLine2.style.cssText = `
                    position: absolute;
                    width: 60%;
                    height: 2px;
                    background-color: rgba(255, 255, 255, 0.6);
                    top: 10px;
                    left: 3px;
                `;
                        fileIcon.appendChild(fileLine1);
                        fileIcon.appendChild(fileLine2);

                        // 添加文件悬停效果
                        row.onmouseover = function() {
                            if (currentSelectedItem !== file) {
                                row.style.backgroundColor = '#f5f5f5';
                            }
                            fileIcon.style.transform = 'scale(1.1)';
                        };
                        row.onmouseout = function() {
                            if (currentSelectedItem !== file) {
                                row.style.backgroundColor = '';
                            }
                            fileIcon.style.transform = 'scale(1)';
                        };
                    }

                    fileNameCell.appendChild(fileIcon);

                    // 文件名
                    const fileName = document.createElement('span');
                    fileName.innerText = file.fileName;
                    fileNameCell.appendChild(fileName);

                    const fileSizeCell = document.createElement('td');
                    fileSizeCell.style.padding = '10px 16px';
                    fileSizeCell.innerText = file.isFolder ? '--' : formatFileSize(file.fileSize);

                    const uploadTimeCell = document.createElement('td');
                    uploadTimeCell.style.padding = '10px 16px';
                    uploadTimeCell.innerText = file.uploadTime || '--';

                    row.appendChild(fileNameCell);
                    row.appendChild(fileSizeCell);
                    row.appendChild(uploadTimeCell);

                    // 只有在需要显示上传人员列时添加
                    if (hasUploaderField) {
                        const uploaderCell = document.createElement('td');
                        uploaderCell.style.padding = '10px 16px';
                        uploaderCell.innerText = file.uploader || '--';
                        row.appendChild(uploaderCell);
                    }

                    tableBody.appendChild(row);
                });
            }

            /**
             * 格式化文件大小
             * @param {Number|String} size 文件大小（字节数或格式化后的字符串）
             * @returns {String} 格式化后的文件大小
             */
            function formatFileSize(size) {
                // 如果size是undefined或null，返回'--'
                if (size === undefined || size === null) return '--';

                // 如果size已经是字符串格式且不是纯数字，则直接返回
                if (typeof size === 'string' && isNaN(size)) {
                    return size;
                }

                // 如果size是数字或纯数字字符串，则进行格式化
                size = Number(size);
                if (size < 1024) {
                    return size + ' B';
                } else if (size < 1024 * 1024) {
                    return (size / 1024).toFixed(2) + ' KB';
                } else if (size < 1024 * 1024 * 1024) {
                    return (size / (1024 * 1024)).toFixed(2) + ' MB';
                } else {
                    return (size / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
                }
            }

            // 初始化加载根目录内容
            updateBreadcrumb();
            loadFolderContent('');
        }
    }

    /**
     *
     * @class
     * @classdesc page/tab 相关操作方法
     */
    function PageTab() {

        /**
         * 左上角的 表单非流程按钮获取
         * @param text
         * @returns {Node}
         */
        this.getOperateBtnByText = function (text) {
            let contextNodeArr = [
                document.querySelector('.generateForm-btn'),
                document.querySelector('.generate-form-btn'),
                document.querySelector('.sf-step-tool-footer')
            ]
            for (let i = 0; i < contextNodeArr.length; i++) {
                if(!contextNodeArr[i]){
                    continue;
                }
                let xPathResult = document.evaluate(".//button[contains(., '" + text + "')]", contextNodeArr[i], null, XPathResult.ANY_TYPE, null);
                let btnDom = xPathResult.iterateNext();
                if(btnDom){
                    return btnDom;
                }
            }
            return null
        }

        /**
         * 左上角的 表单业务流按钮按钮是否加载完毕
         * @param {String} key  按钮name（流程使用因为key，表单使用中文key）
         * @returns {boolean}
         * @example
         * co.PageTab.btnIsLoaded("save")
         * co.PageTab.btnIsLoaded("保存")
         */

        function btnIsLoaded(key) {
            let bPass = false;
            if ($("[name='" + key + "']").length > 0) {
                bPass = true;
            } else if (getOperateBtnByText(key)) {
                bPass = true;
            }
            return bPass
        }

        /**
         * 内部方法 隐藏表单业务流按钮
         * @param {String} key 按钮name（流程使用因为key，表单使用中文key）
         * @example
         * co.PageTab.setHide("save")
         * co.PageTab.setHide("保存")
         */
        function setHide(key) {
            if ($("[name='" + key + "']").length > 0) {
                $($("[name='" + key + "']")[0]).hide();
            } else if (getOperateBtnByText(key)) {
                $(getOperateBtnByText(key)).hide();
            }
        }

        /**
         * 内部方法 显示表单业务流按钮
         * @param {String} key 按钮name
         * @example
         * co.PageTab.setVisible("save")
         * co.PageTab.setVisible("保存")
         */
        function setVisible(key) {
            if ($("[name='" + key + "']").length > 0) {
                $($("[name='" + key + "']")[0]).show();
            } else if (getOperateBtnByText(key)) {
                $(getOperateBtnByText(key)).show();
            }
        }


        /**
         * 隐藏系统业务流按钮
         * @param key {String} 系统默认按钮name
         * @example
         * co.PageTab.hideMenuBtn(co.businessBtnType.保存)
         */
        this.hideMenuBtn = function (key) {
            mainObj.Dom.domIsLoaded(btnIsLoaded, key, setHide, key)
        }

        /**
         * 展示系统业务流按钮
         * @param key {String} 系统默认按钮name
         * @example
         * co.PageTab.showMenuBtn(co.businessBtnType.保存)
         */
        this.showMenuBtn = function (key) {
            mainObj.Dom.domIsLoaded(btnIsLoaded, key, setVisible, key)
        }


        /**
         * 获取当前页的url的参数对象
         * @param {String} key 参数key
         * @returns {any}
         * @example
         * co.PageTab.getTabUrlParam("formId")
         */
        this.getTabUrlParam = function (key) {
            const SearchQuery = new URLSearchParams(window.location.search)
            return SearchQuery.get(key)
        }

        /**
         * 当前标签页标识id
         * @returns {*}
         * @example
         * co.PageTab.getCurrTabId()
         */
        this.getCurrModuleId = function () {
            return window.top.currModule();
        }

        /**
         * 获取子系统特定模块Id （须有模块别名）
         * @param {String}  sAliasName 模块别名
         * @returns {*}
         * @example
         * 注意，仅能导航到外层大模块
         * co.PageTab.getModuleId("成果汇交")
         */
        this.getModuleId = function (sAliasName) {
            let moduleIds = window.parent.getModuleByAliasName(sAliasName);
            if (moduleIds && moduleIds.length > 0) {
                return moduleIds[0].moduleId;
            } else {
                console.log("别名：" + sAliasName + "模块未找到");
                return "";
            }
        }

        /**
         * 关闭指定标签页
         * @returns {*}
         * @example
         * co.PageTab.closeTab(sModuleId)
         */
        this.closeTab = function (sModuleId) {
            window.top.closeTab(sModuleId);
        }

        /**
         * 关闭当前标签页
         * @returns {*}
         * @example
         * co.PageTab.closeCurrTab()
         */
        this.closeCurrTab = function () {
            mainObj.PageTab.closeTab(mainObj.PageTab.getCurrModuleId());
        }

        /**
         * 切换到已有标签
         * @param {String}  moduleId 模块id
         * @example
         * co.PageTab.changeToTab(moduleId)
         */
        this.changeToTab = function (moduleId) {
            BtnFuncs.switchModule(moduleId);
        }

        /**
         * 打开指定模块标签
         * @param {String}  moduleId 模块id
         * @example
         * co.PageTab.openMouleTab(moduleId)
         */
        this.openMouleTab = function (moduleId) {
            window.top.openLeafMenu(moduleId)
        }

        /**
         * 新建页面标签
         * @param  {String}  title 标题
         * @param  {String}  pageUrl 页面地址
         * @param  {String}  moduleId 页面Id
         * @example
         * co.PageTab.addTab(title,pageUrl)
         */
        this.addTab = function (title, pageUrl, moduleId) {
            window.top.addTab({name: title, pageUrl: pageUrl, moduleId: moduleId || Date.now()});
        }


        /**
         * 页面滚动到指定控件的位置
         * @param  {String}  ElementId 页面元素Id  形如 ： "F274E17F445D6139B5E3"
         * @param  {Boolean} topPosition true=该控件页面顶部对齐,否则底部对齐
         * @example
         * co.PageTab.scrollToElement(co.subFormMap.material.link, true);
         */
        this.scrollToElement = function (ElementId, topPosition) {
            ElementId = ElementId.toUpperCase();
            let aEle = [];
            aEle = $(document.getElementById(ElementId));
            if (aEle && aEle.length > 0) {
                aEle[0].scrollIntoView(topPosition);
            } else {
                console.log("页面中未找到该元素，滚动失败")
            }
        }


        /**
         * 页面滚动到指定控件的位置(字段)
         * @param  {shortFieldName} fieldName 字段名
         * @param  {Boolean} topPosition  true=该控件页面顶部对齐,否则底部对齐
         * @example
         * co.PageTab.scrollToElement("YWBH", true);
         */
        this.scrollToField = function (fieldName, topPosition) {
            fieldName = fieldName.toUpperCase();
            let aEle = [];
            aEle = $(document.getElementById(mainObj.domainTableName + "." + fieldName));
            if (aEle && aEle.length > 0) {
                aEle[0].scrollIntoView(topPosition);
            } else {
                console.log("页面中未找到该字段，滚动失败")
            }
        }


    }

    /**
     * @class
     * @classdesc 短信相关方法
     */
    function Msg() {
        /**
         //msg
         //code
         //templateParam
         * @param {String} phoneNumbers 手机号码 复数号码支持方式需查看后台源代码
         * @param {String} msg 短信内容，一般为空，用模板发送
         * @param {String} code 手机模板code
         * @param {Array} templateParam 数组，手机模板空出的位置对应的值
         * @param {sucCallback} sucCallback 成功返回
         */
        this.smsSend = function (phoneNumbers, msg, code, templateParam, sucCallback) {
            let params = {
                phoneNumbers: phoneNumbers,
                msg: msg,
                code: code,
                templateParam: templateParam
            };
            mainObj.Http.request({
                url: "/sinfoweb/sms/public/send",
                data: JSON.stringify(params),
                success: (res) => {
                    if (sucCallback) {
                        sucCallback(res)
                    }
                }
            })
        }
    }

    /**
     * @class
     * @classdesc 进度条相关方法
     */
    function Progress() {

        this.state = {};
        /**
         * 进度条_假
         * 注: 尽量避免使用真实进度条，减少轮询查库及接口请求的问题
         * @param {String} title - 提示框标题
         * @param {Number} fakeTime 假的进度条持续时间 单位 ms 默认5000ms
         * @param {String} [displayText="处理中.."]  提示文本
         * @param {function} doneFunc 进度条结束时触发事件
         * @param {Object} doneParam 进度条结束时触发事件的参数
         * @example
         * co.Progress.baseProgressFake("提示",5000,"处理中..")
         */
        this.baseProgressFake = function (title, fakeTime, displayText, doneFunc, doneParam) {
            //state {'ongoing' | 'done' | 'fail'}
            if (!displayText) {
                displayText = '处理中..';
            }
            mainObj.Progress.state = {
                text: displayText,
                percent: 0,
                state: 'ongoing'
            }
            let isFake = true;
            const {baseModalProgress} = window.top.IBaseExpressLib
            baseModalProgress({
                vue: Sgui,
                title: title,
                isFake: isFake,
                fakeTime: fakeTime,
                percentDataCallback: () => {
                    return this.state
                },
                hiddenCallback: (ret) => {
                    if (doneFunc) {
                        doneFunc(ret, doneParam);
                    }
                }
            })
        }

        /**
         * 关闭进度条
         * @param {String} [doneOrFail='done'|'fail'|''] 成功或失败 默认成功。
         * @example
         * co.Progress.baseProgressClose()
         */
        this.baseProgressClose = function (doneOrFail, returnResult) {
            if (!doneOrFail) {
                doneOrFail = "done";
            }
            this.state.state = doneOrFail;
            this.state.result = returnResult;
            // if (doneOrFail === "done") {
            //     mainObj.Message.success_middle()
            // } else {
            //     mainObj.Message.error_middle("处理失败")
            // }
        }


        /**
         * 进度条_真
         * 注: 尽量避免使用真实进度条，减少轮询查库及接口请求的问题
         * @param {String} title - 提示框
         * @param {Number} [interval=100]  进度函数执行间隔
         * @param {String} [displayText = "处理中"]  文本 默认 '处理中..'
         * @param {sucCallback} processingFunc 进度获取方法
         * @param {Object} processingParam 处理方法的参数
         * @param {function} doneFunc 进度条结束时触发事件
         * @param {Object} doneParam 进度条结束时触发事件的参数
         * @example
         * 注意
         * processingFunc中：
         * ①进度获取方法返回值格式为
         *  {
         *      text: "处理中", //进度条展示文本
         *      percent: 0,   //进度进度百分比
         *      state: 'ongoing' //状态
         *   }
         * ②方法内可以采用全局sql查询的方法返回，后台处理时，需往约好的表中写入进度信息。
         *          也可自己写的接口查询后台作业进度返回，不设限制。
         *  co.Progress.baseProgressTrue(
         *  "提示",
         *  "处理中",
         *  processingFunc, //进度获取方法
         *  processingParam  //进度获取方法的参数，可能是map 也可能是其他，也可能是taskid之类的字符串
         *  )
         *  )
         */
        this.baseProgressTrue = function (title, displayText, processingFunc, processingParam, interval, doneFunc, doneParam,) {
            if (!interval) {
                interval = 100;
            }
            //state {'ongoing' | 'done' | 'fail'}
            if (!displayText) {
                displayText = '处理中..';
            }
            this.state = {
                text: displayText,
                percent: 0,
                state: 'ongoing'
            }
            let isFake = false;
            const {baseModalProgress} = window.top.IBaseExpressLib
            baseModalProgress({
                vue: Sgui,
                title: title,
                isFake: isFake,
                interval: interval,
                percentDataCallback: () => {
                    return processingFunc(processingParam)
                },
                hiddenCallback: (ret) => {
                    if (doneFunc) {
                        doneFunc(ret, doneParam);
                    }
                }
            })
        }
    }

    /**
     * @class
     * @classdesc  操作本地软件相关方法
     */
    function Local() {
        /**
         * 打开本地软件,传入启动参数
         * @param {Object} softParams 启动参数，可能各种各样
         * @example
         *  以打开cad为例
         *  var oParam =
         *         {
         *             "多测合一系统名称": "南方数码多测合一业务平台",
         *             "业务类型": 2,
         *             "下载路径": "123"
         *         }
         * co.Local.openSoft(oParam);
         */
        this.openSoft = function (softParams) {
            const {openCad} = window.top.IBaseExpressLib
            openCad({
                vue: Sgui,
                softParamsString: JSON.stringify(softParams)
            })
        }


        /**
         * 扫描仪(目前仅高拍仪)
         * @param {Boolean} devMode 开发者模式， 有模拟拍照逻辑按钮
         * @param {String=} modalTitle 窗口标题
         * @param {String=} photoNamePrefix 拍照文件默认前缀
         * @param {Object=} preParam 提前传入的参数对象，可传递到回调函数中进行后续处理。
         * @param {sucCallback=} confirmCallBack 提交的回调函数 返回boolean false=阻止弹窗关闭 true=继续关闭
         * @param {String=} confirmBtnText 确认按钮的文本
         * @param {String=} nameNotFilledHint 文件未命名的提示
         * @param {String=} photoZeroHint 无文件点提交的提示
         * @example
         * co.Local.openScanner(true)
         */
        this.openScanner = function (devMode, modalTitle, photoNamePrefix, preParam, confirmCallBack, confirmBtnText, nameNotFilledHint, photoZeroHint) {
            if (!modalTitle) {
                modalTitle = "窗口";
            }
            if (!photoNamePrefix) {
                photoNamePrefix = "照片";
            }
            if (!confirmBtnText) {
                confirmBtnText = "确认";
            }
            if (!nameNotFilledHint) {
                nameNotFilledHint = "请补全照片名称";
            }
            if (!photoZeroHint) {
                photoZeroHint = "请至少上传一张图片";
            }
            const {gaoPaiYi} = window.top.IBaseExpressLib
            gaoPaiYi({
                devMode: devMode, // 开发模式，用于绕过高拍仪，测试文件本身逻辑
                vue: Sgui,
                confirmBtnText: confirmBtnText,
                modalTitle: modalTitle,
                photoNamePrefix: photoNamePrefix,
                confirmCallback: (photoList) => {
                    console.log(photoList)
                    // 返回false意味着阻止弹窗关闭
                    if (photoList.find(photo => !photo.name)) {
                        Sgui.$msg.error(nameNotFilledHint)
                        return false;

                    }
                    if (photoList.length === 0) {
                        Sgui.$msg.error(photoZeroHint)
                        return false
                    }
                    //回调函数 返回false意味着阻止弹窗关闭
                    if (confirmCallBack) {
                        return confirmCallBack(preParam, photoList);
                    } else {
                        return true;
                    }
                }
            })
        }
    }

    /**
     * @class
     * @classdesc dom操作方法
     */
    function Dom() {

        /**
         * 特定条件满足的方法,返回true时，执行后续方法
         * 注:可用于控件加载延时
         * @param {function} makeSureFunc 特定条件的方法
         * @param {Object} makeSureParam 特定条件的方法的参数
         * @param {function} continueFunc 后续方法
         * @param {Object} continueParam 后续方法的参数
         * @param {Number=} maxTry 最大尝试次数，默认40
         * @param {Number=} interval 运行间隔，默认100ms
         * @example
         * co.Dom.domIsLoaded(btnIsLoaded, "save", setVisible, "save")
         */
        this.domIsLoaded = function (makeSureFunc, makeSureParam, continueFunc, continueParam, maxTry, interval) {
            if (!maxTry) {
                maxTry = 40;
            }
            if (!interval) {
                interval = 100;
            }
            const {pollingFun} = window.top.IBaseExpressLib;
            pollingFun(
                {
                    interval: interval,
                    maxTry: maxTry,
                    runFlag: () => {
                        return makeSureFunc(makeSureParam)
                    },
                    callback: () => {
                        continueFunc(continueParam)
                    },
                })
        }


        /**
         * 替换dom
         * vue组件配置，平台的vue代码块 http://192.168.10.9:3002/exampleshtml/#/form/button
         * 可从中选择合适的组件替换上去
         * @param {Object} newDomComponentObject 新组件对象
         * @param {String} oriDomId  旧组件Id
         * @example
         * co.Dom.replace("new dom object from sgui", "FD177177F1C89D165CD0")
         */
        this.replace = function (newDomComponentObject, oriDomId) {
            let oldDom = document.getElementById(oriDomId);
            if (!oldDom) {
                console.log("未找到原dom");
                return;
            }
            if (!newDomComponentObject) {
                console.log("未定义新组件");
                return;
            }
            const {renderCustomVue} = window.top.IBaseExpressLib
            renderCustomVue({
                vue: Sgui,
                vueComponent: newDomComponentObject,
                selector: document.getElementById(oriDomId)
            })
        }


    }

    /**
     * @class
     * @classdesc 常用的正则表达式筛选处理或验证规则
     */
    function Regex() {

        /**
         * 判断是否是正数
         * @param {String} str
         * @returns {boolean}
         * @example
         * co.Regex.isPositiveNumber(num)
         */
        this.isPositiveNumber = function (str) {
            var reg = /^\d+(?=\.{0,1}\d+$|$)/
            return reg.test(str);
        }
    }

    /**
     * @class
     * @classdesc 工具方法类
     */
    function Toolbox() {
        /**
         * 数组分页获取
         * @param {Array<Object>} arrayList 数组
         * @param {Number} size 大小
         * @param {Number} page 当前页
         * @returns {Array}
         * @example
         *    let params = {rowList:[1,2,3,4,5,6,7,8,9,0]}
         *    let param = {size:2,page:1};
         *    let displayList = [];
         *    if (param.page && param.size) {
         *        displayList = co.Toolbox.arrSlice(params.rowList, param.size, param.page);
         *    }
         */
        this.arrSlice = function (arrayList, size, page) {
            return arrayList.slice(size * (page - 1), size * page);
        }

        /**
         * 开启遮罩层,默认银灰,透明度0.5
         * @param {Number} [r=0~255]r RGB Red
         * @param {Number} [g=0~255]g RGB Green
         * @param {Number} [b=0~255]b RGB Blue
         * @param {Number} [t=0~1]t 透明度 范围0~1  默认0.5
         * @example
         * co.Toolbox.showMask();
         * co.Toolbox.showMask("","","",0.8);
         * co.Toolbox.showMask(200,100,150,0.5);
         */
        this.showMask = function (r, g, b, t) {
            if (!r) {
                r = 211;
            }
            if (!g) {
                g = 211;
            }
            if (!b) {
                b = 211;
            }
            if (!t) {
                t = 0.5
            }
            Vue.prototype.$loading.show(
                {
                    backgroundColor: 'rgba(' + r + ',' + g + ',' + b + ',' + t + ')'
                });
                document.querySelector('.sg-loading-fullscreen-wrapper').style = "z-index: 1006"
        }

        /**
         * 关闭遮罩层
         * @example
         * co.Toolbox.hideMask();
         */
        this.hideMask = function () {
            setTimeout(() => {
                Vue.prototype.$loading.hide();
            }, 100)
        }

        /**
         * 指定平台编码规则的下一个编码
         * 2022年10月28日 21:44:23 调整内部方法 由$.buildNo(expFla) 改为 /formengine/expression/autoBuildNo?rid=322aa287-2092-4962-baec-b6a257df9ce2&jid=接口
         * @param {String} sType 规则名
         * @returns {String}
         * @example
         * let abs = co.Toolbox.getNextSerialNo("工业不动产权籍调查业务申请编号");
         */
        this.getNextSerialNo = function (sType) {
            if (sType) {
                let serialTypeRid = mainObj.getValue("rid", "SERIALEXPFLA", "sname", sType, true);
                let serialNum = "";
                $.ajax({
                    url: "/formengine/expression/autoBuildNo",
                    contentType: "application/json",
                    dataType: "text",
                    type: 'get',
                    async: false,
                    data: {
                        rid: serialTypeRid,
                        jid: ""
                    },
                    error: function (res) {
                    },
                    success: function (res) {
                        serialNum = res;
                    }
                });
                // mainObj.Http.request({
                //     url: "/formengine/expression/autoBuildNo?rid=" + serialTypeRid + "&jid=",
                //     method: "get",
                //     responseType: "text",
                //     async: false,
                //     data: {
                //         rid: serialTypeRid,
                //         jid: ""
                //     },
                //     success: (res) => {
                //         serialNum = res;
                //     }
                // })
                return serialNum;
            } else {
                console.log("请传入编码规则种类")
                return "";
            }
        }

        /**
         * 是否是空对象{}
         * @param e 对象
         * @returns {boolean|jQuery}
         */
        this.isEmptyObject = function (e) {
            return $.isEmptyObject(e)
        }


        /**
         * 刷新展示质检/入库等结果
         * @param fieldValue 原始文本
         * @param showEleDomId domId
         * @param rules 规则，可放在配置文件中，设置默认值,字体样式、不同结果的展示等。
         * @example
         * ①rules配置参考
         *     "resultDisplayRules": {
        "FA56F180593B25AD6CDC": {
            "任务完成": {
                "displayText": "入库成功",
                "hideCtrl": [],
                "showCtrl": [],
                "textStyle": {
                    "color": "blue",
                    "strong": true,
                    "size": 25
                }
            },
            "DEFAULT":{
                "displayText": "未入库",
                "hideCtrl": [],
                "showCtrl": [],
                "textStyle": {
                    "color": "red",
                    "strong": true,
                    "size": 25
                }
            }
        }
    }
         ②使用：
         *    co.Toolbox.showStatus(
         *    co.getValue(mmCgglConfigMap.dataImport.dxt.resultStatusField),
         *    mmCgglConfigMap.dataImport.dxt.resultDom,
         *    mmCgglConfigMap.resultDisplayRules)
         */
        this.showStatus = function (fieldValue, showEleDomId, rules) {
            let ele = document.getElementById(showEleDomId);
            if (!ele) {
                mainObj.Message.error_topRight("未找到状态展示模块！请检查是否被隐藏或者未设置！");
                return;
            }
            let typeDomSetting = rules[showEleDomId];
            if (!typeDomSetting) {
                console.error("未找到此DOM展示配置")
            }
            let typeSetting = typeDomSetting[fieldValue];
            if (!typeSetting) {
                typeSetting = typeDomSetting["DEFAULT"];
                if (!typeSetting) {
                    console.error("未找到展示配置")
                } else {
                    //不给默认文本就以原始值作为文本
                    if (!typeSetting.displayText) {
                        //若取得的原始值为null,则默认为空
                        typeSetting.displayText = fieldValue ? fieldValue : "";
                    }
                }
            }

            for (const typeSettingElement of typeSetting.hideCtrl) {
                mainObj.Ctrl.setHide(typeSettingElement, true);
            }

            for (const typeSettingElement of typeSetting.showCtrl) {
                mainObj.Ctrl.setHide(typeSettingElement, false);
            }

            if (typeSetting.textStyle.strong) {
                ele.innerHTML = '<div style="font-size:' + typeSetting.textStyle.size + 'px;color:' + typeSetting.textStyle.color + '"> <strong> ' + typeSetting.displayText + '</strong></div>'
            } else {
                ele.innerHTML = '<div style="font-size:' + typeSetting.textStyle.size + 'px;color:' + typeSetting.textStyle.color + '">' + typeSetting.displayText + '</div>'

            }
        }

        /**
         * 修改级联选择器可选择非末节点（平台未能解决，临时方法，平台解决后可弃用）
         * @param returnType
         */
        this.setCascadeSelectorCanSelectNotLast = function (controlId) {
            let tempVue = document.getElementById(controlId).querySelector(".sf-cascader").__vue__;
            tempVue.changeOnSelect = true;
            tempVue.canSelectAllValues = tempVue.handleCanSelectValueList(tempVue.options);
        }
    }

    /**
     * @class
     * @classdesc 获取行政区 相关方法
     */
    function Azone() {
        /**
         * 获取可管理的行政区
         * @param {returnType} 返回值结构类型，传 tree 返回树结构，传 array 返回数组结构 ,传 idArray 返回ID数组
         * @returns {Array} 可管理的行政区
         * @example
         */
        this.getManagedDistrict = function (returnType) {
            var xzqData = [];
            $.ajax({
                url: "/sinfoweb/permissionManagement/getAzoneTree",
                type: "GET",
                async: false,
                success: function (result) {
                    if (result.code == 0) {
                        xzqData = result.data;
                        var arr = [];
                        var idArr = [];
                        setValueAndLabel(xzqData, arr, idArr);
                        if (returnType == "array") {
                            xzqData = arr;
                        } else if (returnType == "idArray") {
                            xzqData = idArr;
                        }
                    }
                },
                error: function (dataErr) {

                }
            });
            return xzqData;
        }
        /**
         * 获取最高行政区下的所有行政区
         * @param {returnType} 返回值结构类型，传 tree 返回树结构，传 array 返回数组结构 ,传 idArray 返回ID数组
         * @returns {Array} 可管理的行政区
         * @example
         */
        this.getAllDistrict = function (returnType) {
            var xzqData = [];
            $.ajax({
                url: "/sinfoweb/permissionManagement/getCurSystemAllAZoneTree",
                type: "POST",
                data: JSON.stringify({"returnType": "tree"}),
                contentType: 'application/json',
                async: false,
                success: function (result) {
                    if (result.code == 0) {
                        xzqData = result.data;
                        var arr = [];
                        var idArr = [];
                        setValueAndLabel(xzqData, arr, idArr);
                        if (returnType == "array") {
                            xzqData = arr;
                        } else if (returnType == "idArray") {
                            xzqData = idArr;
                        }
                    }
                },
                error: function (dataErr) {

                }
            });
            return xzqData;
        }

        function setValueAndLabel(xzqDataArr, arr, idArr) {
            for (var i = 0; i < xzqDataArr.length; i++) {
                xzqDataArr[i]["value"] = xzqDataArr[i]["id"];
                xzqDataArr[i]["label"] = xzqDataArr[i]["text"];
                if (xzqDataArr[i]["children"]) {
                    setValueAndLabel(xzqDataArr[i]["children"], arr, idArr);
                }
                arr.push(xzqDataArr[i]);
                idArr.push(xzqDataArr[i]["id"]);
            }
        }
    }

    console.timeEnd("CommonObjectTakeTimes")
}


/**
 * @file 通用表达式工具库支持
 * @author Tomato
 * TODO  自动文档 API
 * 方案1 git Hook 检测git提交
 * 方案2 jerkin 自动构建
 */


/**
 * 表单属性
 * @typedef  {Object} coParams 表单属性
 * @property {String} formId 表单Id
 * @property {String} jid  业务jid
 * @property {String} rid  表单rid
 * @property {String} sysParentId 表单父id(子表单内有)
 * @property {String} table 表单名
 * @property {String} taskId 当前任务id
 * @property {String} token  当天token 3.3.2起支持
 * @property {taskInfo} taskInfo 当前任务信息，含接办人、任务详情等
 * @property {Array<taskInfo>} taskInfoFull 当前业务历经的所有信息，含接办人、任务详情等
 *
 */


/**
 * 子表信息详情
 * @typedef  {Object} subFormInfo 子表信息详情
 * @property {String} link 表关联Id
 * @property {String} table 表名
 * @property {String} formId 表单id
 * @property {String} [sys_parentId=""] 子表的父关联id 会动态生成,留空即可
 */


/**
 * 任务属性详情
 * @typedef {Object} taskInfo 任务属性详情
 * @property {String} taskId   环节任务id
 * @property {String} linkInstanceId    环节实例id
 * @property {String} processInstanceId    流程实例id
 * @property {String} linkDefinitionName    环节名称
 * @property {String} taskDefinitionKey    环节定义标识
 * @property {String} processDefinitionId    流程定义id
 * @property {String} assignee    办理人名称
 * @property {String} assigneeName    办理人id
 * @property {Array<String>} candidates    可处理人id(候选人id)
 * @property {Array<String>} candidatesName    可处理人名称(候选人名称)
 * @property {Boolean} isMasterTask    是否主要任务
 * @property {Number} claimTime    接办时间
 * @property {Number} startTime    开始时间
 * @property {Number} endTime    结束时间
 * @property {Boolean} isSendback    是否重办
 * @property {Number} stepTimeOut    任务剩余处理时间
 * @property {Boolean} isFirstLink    是否首环节
 * @property {String} formTemplateId    表单模板id，多个以"，"隔开
 * @property {String} masterMen    当前环节主要处理人ID列表
 * @property {String} normalMen    当前环节一般处理人ID列表
 */


/**
 * @typedef {Object} TableRes - 表格展示方法参数 - 表格数据
 * @property {Array<columnInfo>} columns - 列
 * @property {Array<String>} hideColumns - 隐藏的列
 * @property {Array<Map<String,String>>} rowList - 行
 * @property {Number} count - 行总条数
 * @property {Array<keyInfo>} spanCols - 合并行的规则
 */

/**
 * @typedef {Object} columnInfo 表格展示方法参数 - 列信息
 * @property {String} key 列id
 * @property {String} label 列文本
 * @property {columnInfo=} children 被上级合并的列
 */

/**
 * @typedef {Object} keyInfo 表格展示方法参数 - key信息
 * @property {String}key key 列id
 *
 */

/**
 * @typedef  {Object} owSelectionSetting 表格展示方法参数 - 行勾选对象设定
 * @property {String | function(): any} rowKey - 行索引，可以是字符串或函数，默认 'key'
 * @property {'radio'|'checkbox'} selectionType - 行选择类型 单选或多选
 * @property {function(selectedRowKeys, Array<Map<String,String>>): any} rowSelectionChangeFunc - 行选择变更时的回调
 */


/**
 * @typedef  {Object} tempCol  表格展示方法参数 - 页渲染模板对象
 **/

/**
 * @typedef {Object} tableVue  表格展示方法参数 - 表格本体对象
 */

/***
 * @typedef {Object} baseTableParams - 表格展示方法参数
 * @property {function():Promise<TableRes>} tableResCallbackFunc 获取表格来源数据的方法，获取对象存放在 TableRes
 * @property {Array<columnInfo>} columns 直接传入已有数据作为数据来源 表头
 * @property {Array<String>}hideColumns 直接传入已有数据作为数据来源  隐藏列
 * @property {Array<Map<String,String>>} rowList 直接传入已有数据作为数据来源  数据对象
 * @property {Array<keyInfo>}spanCols 直接传入已有数据作为数据来源  需要进行合并的行(按列，指定某列相同的行进行合并)。
 * @property {Map<String,Object>} otherParams 直接传入已有数据作为数据来源  其他的自定义的数据对象，都集中放在这里
 * @property {Boolean} notPopUp - 不弹窗 =true 默认弹窗
 * @property {String} elementIdIfNotPopUp - 假如不弹窗，此时需要指定dom目标
 * @property {String} title - 弹窗标题
 * @property {String} loadingText - 遮罩层的提示文本
 * @property {Boolean} pagination - 是否分页，默认否
 * @property {number=} pageSize - 分页大小
 * @property {Number=} current - 当前页 默认1
 * @property {String} rowKey - 行key对应字段
 * @property {function(col, tempCol): any} colSettingFunc - 定制列渲染的函数
 * @property {'textColor'} colDefaultType - 采用预设方案渲染，暂时只有文字颜色方案
 * @property {Object} colDefaultTypeParam - 采用预设方案渲染时传递的参数
 * @property {function(TableRes): any} subTitleFunc - 定制表格头部html的函数
 * @property {String} subTitle - 不定制 直接传入固定表格头部html
 * @property {function(): any} onRowDblclickFunc - 双击行的回调
 * @property {rowSelectionSetting} rowSelection - 行的选择配置
 * @property {function(any): any} confirmCallbackFunc - 确认的回调事件
 * @property {String} width - 弹窗宽度，默认 '70vw'
 * @property {Boolean} hideHeader - 是否隐藏表格列头部，默认否
 * @property {function(tableVue): any} onloadFunc - 初始化完毕回调函数，tableVue 为表格vue的实例
 */

/**
 * @typedef {String} nickName 子表昵称代号
 */

/**
 * @typedef {String} shortFieldName 短字段名(不带表名前缀)
 * @example
 * 格式为[不带表名的字段名] 示例：
 * "RID"
 */

/**
 * @typedef {String} longFieldName 长字段名(带表名前缀)
 * @example
 * 格式为[表名.字段名] 示例：
 * "PROJ_CGHJB.RID"
 */

/**
 * @typedef {String} fieldValue 表单文本控件值
 */


/**
 * 成功回调
 * @callback sucCallback
 * @param data
 */

/**
 * 失败回调
 * @callback errCallback
 * @param data
 */


/**
 * @typedef  {Object} dataMappingConfig 数据映射
 * @property {String} toField 对方表的fieldName
 * @property {String} toField 对方表的fieldName
 * @property {String} currField 当前表的fieldName  系统字段需要添加sys_前缀,从方法获取需添加func_前缀 暂不支持传参，可后续提供支持或在方法中自取表内参数
 */

/**
 * @typedef  {Object} dropdownItem 下拉列表对象
 * @property {String} label 展示文本
 * @property {String} value 值
 */
/**
 ** @typedef {Object} formDataMappingConfig 通过配置，自动组装从当前表发起时，从本表获取的数据
 * @property {Boolean} isFlow 是流程
 * @property {String}  BusinessDefCode 业务代码(假如是流程)
 * @property {String} tableName 对方表名
 * @property {String} formId 对方表formId
 * @property {dataMappingConfig} dataMapping 数据映射
 */


/**
 * @typedef  rowSelectionSetting
 * @property {String | function(): any} rowKey - 行索引，可以是字符串或函数，默认 'key'
 * @property {'radio'|'checkbox'} selectionType - 行选择类型 单选或多选
 * @property {function(selectedRowKeys, Array<Map<String,String>>): any} rowSelectionChangeFunc - 行选择变更时的回调
 */


/**
 * @typedef  {Object} httpRequestParam http请求参数
 * @property {String=} baseUrl  路径前缀
 * @property {String} url  接口路径
 * @property {Object} data 参数json对象
 * @property {'POST'|'GET'|'PUT'|'DELETE'}  [method="POST"]  请求方式,默认POST
 * @property {Boolean=} async  异步请求 默认true
 * @property {function=} success 请求成功回调
 * @property {function=} error 请求错误处理
 * @property {Boolean=} backgroundRequest  后台请求 默认FALSE
 * @property {String=} contentType  请求数据类型 默认JSON
 * @property {String=} responseType  响应数据类型
 * @property {Number=} timeout 超时时长  单位秒 默认10s
 * @property {Object=} headers 自定义请求头,特殊需要时可传入
 */