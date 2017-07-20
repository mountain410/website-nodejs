$(function(){
    $(".del").click(function(e){
        alert("删啦啦啦啦");
        var target = $(e.target);
        var id = target.data('id');
        var tr = $('.item-id-'+id);

        $.ajax({
            type:'DELETE',
            url:'/admin/list?id=' + id   //问号后面加id 传参
        })
        .done(function(results){
            if(results.success ===1){
                if(tr.length>0){
                    tr.remove();
                }
            }
        })
    })
})
