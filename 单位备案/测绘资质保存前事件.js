let ret = true;
var zzdj = $.F.getFieldValue('PROJ_CHDWZZXX.ZZDJ');
var zzzsbh = $.F.getFieldValue('PROJ_CHDWZZXX.ZZZSBH');
var zzrid = $.F.getFieldValue('PROJ_CHDWZZXX.RID');
var zzprid = $.F.getFieldValue('PROJ_CHDWZZXX.SYS_PARENTRID');
console.log(zzdj);
console.log(zzzsbh);
console.log(zzrid);
console.log(zzprid);
var zzData = $.execsql(null, "获取当前单位已有资质等级", { "zzdj": zzdj, "zzzsbh": zzzsbh, "zzrid": zzrid, "zzprid": zzprid }, null, null, null, null);
var objZz = zzData['sql1'];
console.log("objZz="+objZz);
if (objZz.length > 0) {
  $.messager.confirm("新增失败","资质证书编号重复，请检查");
  ret = false;
}
console.log("ret="+ret);
ret;