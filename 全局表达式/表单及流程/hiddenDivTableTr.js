// param: id-> div id属性
// param：list-> 隐藏的tr的序号数组，如 [0,2,7,8];
// param: isHidden-> 默认为true 为false时将隐藏的tr恢复
// return: None
function hiddenDivTableTr(id, list, isHidden=true){
    let bigDiv = document.getElementById(id)
    let trList = bigDiv.getElementsByTagName('tr')
    if (isHidden){
        for(let i=0;i<trList.length;i++){
            if(list.indexOf(i)!=-1){
                trList[i].style.display = 'none'
            }
        }
    }else{
        for(let i=0;i<trList.length;i++){
            if(list.indexOf(i)!=-1){
                trList[i].style.display = 'table-row'
            }
        }
    }
}