var task = $.W.getTask();
if(task){
  if(task.length>0){
      var userid = task[task.length-1].assignee;
      if(userid==null){
        if($.inArray($.O.getUserId(),task[task.length-1].candidates)>-1){
           $(".generate-btn-list .sg-btn-disabled").removeAttr("disabled");
        }
      }else if(userid == $.O.getUserId()){
        $(".generate-btn-list .sg-btn-disabled").removeAttr("disabled");
      }
  }
}