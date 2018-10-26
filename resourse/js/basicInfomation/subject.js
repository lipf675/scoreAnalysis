//JavaScript代码区域
var userid=sessionStorage.getItem('id');
var username=sessionStorage.getItem('username');
var isAdmin=sessionStorage.getItem('isAdmin');
var isGradeDirector=sessionStorage.getItem('isGradeDirector');
var isClassDirector=sessionStorage.getItem('isClassDirector');
var isTeacher=sessionStorage.getItem('isTeacher');
layui.config({
    base: '../../js/' //你存放新模块的目录，注意，不是layui的模块目录
})

layui.use(['element', 'form', 'laydate', 'layer', 'table', 'laypage', 'jquery'], function() {
    var element = layui.element,
        form = layui.form,
        laydate = layui.laydate,
        layer = layui.layer,
        table = layui.table,
        laypage = layui.laypage,
        $ = layui.jquery;
    $('.layui-header').load('../../../pages/commen/head.html');
    $('.layui-side-scroll').load('../../../pages/commen/sidebar.html');
    var url='../../../controller/subject.php?a=list',
        cols=[
        [
            // { field: 'check', title: '', width: 100,  fixed: 'left',type:'checkbox'},
            { field: 'number', title: '排序', width: '10%',  type:'numbers',fixed: 'left'},
            { field: 'subjectname', title: '名称', width: '70%',align:'left'},  
            { width:'20%', align:'center', toolbar: '#barDemo',title:'操作'} 
        ]
    ];
    var toolbar=isAdmin?'#toolbarDemo':'';
    //第一个实例
    var tableSubject=table.render({
        elem: '#subjectTable',
        // height: 500,
        url: url,
        page: true,
        skin:'line',
        initsort:{
          field:'subjectname',
          type:'desc'
        },
        cols:cols,
        toolbar:toolbar, 
        parseData:function(res){
            if(isAdmin){
                var data=res.data;
                var leng=data.length;
                for(var i=0;i<leng;i++){
                    data[i].auth=4;
                }
                return res;
            }
        }
    });
    function tableReload(){
        tableSubject.reload({
            page: {
                curr: 1 //重新从第 1 页开始
            }
        });
    }
    table.on('toolbar(subject)', function(obj){
        var checkStatus = table.checkStatus(obj.config.id);
        switch(obj.event){
        case 'add':
            var layeradd=layer.open({
                type: 1,
                title:'年级添加',
                btn:['确认','取消'],
                yes:function(){
                    var subjectname=$('#addSubjectName').val(),
                        data={
                            subjectname:subjectname
                        },
                        url='../../../controller/subject.php?a=add';
                        $.ajax({
                            url:url,
                            data:data,
                            dataType:'json',
                            method:'post',
                            success:function(res){
                                layer.msg(res.msg);
                                if(res.code==1){
                                    layer.close(layeradd);
                                    tableReload();
                                }
                                
                            }
                        })
                    // }else{
                    //     layer.msg('尚有未填项');
                    //     return 0;
                    // }
                },
                content: $('#addSubject') //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
            });
            break;
      };
    });
    table.on('tool(subject)', function(obj){ //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
        var tr = obj.tr; //获得当前行 tr 的DOM对象
        var id=$(tr).find('.layui-btn').attr('data-id');
        console.log(1)
        if(layEvent === 'detail'){ //查看
            var url='../../../controller/subject.php?a=detail',
                data={
                    id:id
                };
            $.ajax({
                url:url,
                data:data,
                dataType:'json',
                method:'post',
                success:function(res){
                    if(res.code==1){
                        var data=res.data[0];
                        $('#lookSubjectName').text(data.subjectname);
                        var layerlook=layer.open({
                            type: 1,
                            title:'年级查看',
                            content: $('#lookSubject')
                        });
                    }
                }
            });
        } else if(layEvent === 'del'){ //删除
            layer.confirm('真的删除行么', function(index){
                var url='../../../controller/subject.php?a=del',
                    data={
                        id:id
                    };
                $.ajax({
                    url:url,
                    data:data,
                    dataType:'json',
                    method:'post',
                    success:function(res){
                        layer.msg(res.msg);
                        if(res.code==1){
                            tableReload();
                        }
                    }
                })
                
                //向服务端发送删除指令
            });
        } else if(layEvent === 'edit'){ //编辑
            var url='../../../controller/subject.php?a=detail',
                data={
                    id:id
                };
            $.ajax({
                url:url,
                data:data,
                dataType:'json',
                method:'POST',
                success:function(res){
                    if(res.code==1){
                        var data=res.data[0];
                        $('#editSubjectName').val(data.subjectname);
                        var layeredit=layer.open({
                            type: 1,
                            title:'年级编辑',
                            content: $('#editSubject'),
                            btn:['确认','取消'],
                            yes:function(){
                                var subjectname=$('#editSubjectName').val();
                                var editdata={
                                    id:id,
                                    subjectname:subjectname,
                                },
                                editurl='../../../controller/subject.php?a=edit';
                                $.ajax({
                                    url:editurl,
                                    data:editdata,
                                    dataType:'json',
                                    method:'post',
                                    success:function(res){
                                        layer.msg(res.msg);
                                        if(res.code==1){
                                            layer.close(layeredit);
                                            tableReload();
                                        }
                                        
                                    }
                                })
                                // }else{
                                //     layer.msg('尚有未填项');
                                //     return 0;
                                // }
                            },
                        });
                    }
                }
            });  
        }
    });
});