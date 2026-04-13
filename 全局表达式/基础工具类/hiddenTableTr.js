function hiddenTableTr(id, list, isHidden=true){
    let bigDiv = document.getElementById(id)
    let trList = bigDiv.getElementsByTagName('tr')
    if (isHidden){
        for(let i=0;i<trList.length;i++){
            if(list.indexOf(i)!=-1){
                trList[i].style.display = 'none'
            }z
        }
    }else{
        for(let i=0;i<trList.length;i++){
            if(list.indexOf(i)!=-1){
                trList[i].style.display = 'table-row'
            }
        }
    }
}
