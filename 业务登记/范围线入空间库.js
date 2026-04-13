var sRANGEDATA = $.F.getFieldValue('PROJ_LHCHYWDJB.RANGEDATA');
if (!sRANGEDATA) {
    function warningAlert(sMsg) {
        $.messager.notice({
            type: 'info',
            title: '提示',
            desc: "请先上传范围线文件"
        })
    }
} else {
    window.Vue.prototype.$modal.alert({
        title: '提示',
        content: '正在归档入库...',
        similar: true,
        closable: false,
        footerHide: true,// true隐藏确认，取消
        onOk: () => {
            // this.$modal.remove()
            // this.Vue.prototype.$modal.remove()
        },
    })
    setTimeout(() => {
        var aCoordinates = [];
        var aRangedata = sRANGEDATA.split(";");
        for (var i = 0; i < aRangedata.length; i++) {
            var sItem = aRangedata[i];
            var aItem = sItem.split(",");
            var aNewArr = [];
            aNewArr.push(parseFloat(aItem[0]));
            aNewArr.push(parseFloat(aItem[1]));
            aNewArr.push(0);
            aCoordinates.push(aNewArr);
        };
        var oPostData =
        {
            "rid": $.F.getFieldValue('PROJ_LHCHYWDJB.RID'),
            "gcbh": $.F.getFieldValue('PROJ_LHCHYWDJB.GCBH'),
            "gcmc": $.F.getFieldValue('PROJ_LHCHYWDJB.GCMC'),
            "jsdw": $.F.getFieldValue('PROJ_LHCHYWDJB.JSDW'),
            "rangedata": {
                "type": "Polygon",
                "coordinates": [
                    aCoordinates
                ]
            }
        };
        $.ajax({
            url: "/sinfoweb/lhchywdjb/public/WebGisCreateProjectRegion",
            //url: "/sinfoweb-hdy/lhchywdjb/public/WebGisCreateProjectRegion",
            type: "POST",
            async: false,
            contentType: 'application/json',
            dataType: "JSON",
            data: JSON.stringify(oPostData),
            success: function (oData) {
                window.Vue.prototype.$modal.remove();// 移除遮罩
                $.messager.notice({
                    type: 'info',
                    title: '提示',
                    desc: "归档入库成功"
                })
            },
            error: function (d) {
                window.Vue.prototype.$modal.remove();// 移除遮罩
                if(d.status === 200){
                    $.messager.notice({
                        type: 'info',
                        title: '提示',
                        desc: "归档入库成功"
                    })
                }else{
                    $.messager.notice({
                        type: 'error',
                        title: '提示',
                        desc: "归档入库失败"
                    })
                }
            }
        });
    }, 100);
}