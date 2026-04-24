function checkBeforeSubmit() {
    let kzqkSubform = co.getList("CLZT,CLSX", "PROJ_YWDJ_CLKZQK", "JID", co.params.jid, true);
    let bPass = true;
    for (let i = 0; i < kzqkSubform.length; i++) {
        let clzt = kzqkSubform[i]["CLZT"];
        let clsx = kzqkSubform[i]["CLSX"];
        if (clzt !== "审核通过" && clzt !== "已完成") {
            if (!window.clsxDic) {
                window.clsxDic = {};
                let clsxArr = co.Sql.execSql("根据code获取测量事项value", null);
                if (clsxArr && clsxArr.sql1 && clsxArr.sql1.length > 0) {
                    for (let j = 0; j < clsxArr.sql1.length; j++) {
                        window.clsxDic[clsxArr.sql1[j]["CODE"]] = clsxArr.sql1[j]["SHOWVALUE"];
                    }
                }
            }
            co.Message.info_middle("【" + window.clsxDic[clsx] + "】未完成，无法完成项目！");
            bPass = false;
            break;
        }
    }
    return bPass;
}

if (checkBeforeSubmit()) {
    co.Dialog.confirm("是否确认完成项目？", "确认", () => {
        co.Flow.readySubmitComplete();
    })
}