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
    var url='../../../controller/user.php?a=list',
        cols=[
        [
            // { field: 'check', title: '', width: 100,  fixed: 'left',type:'checkbox'},
            { field: 'number', title: '排序', width: '10%',  type:'numbers',fixed: 'left'},
            { field: 'username', title: '用户名', width: '15%', align:'center' }, 
            { field: 'isAdmin', title: '是否为管理员', sort: true, width: '15%' , align:'center'}, 
            { field: 'isYearDirector', title: '是否为年级主任', sort: true, width: '20%' , align:'center'}, 
            { field: 'isClassDirector', title: '是否为班主任', sort: true,width: '20%', align:'center'}, 
            // { field: 'isTeacher', title: '是否为科任教师', width: 200 }, 
            { width:'20%', align:'center', toolbar: '#barDemo',title:'操作'} 
        ]
        ];
    var toolbar=isAdmin?'#toolbarDemo':'';
    //第一个实例
    var tableUser=table.render({
        elem: '#userTable',
        // height: 500,
        url: url,
        page: true,
        skin:'line',
        initsort:{
          field:['isYearDirector','isClassDirector'],
          type:'desc'
        },
        cols:cols,
        toolbar:toolbar,
        parseData:function(res){
            var leng=res.data.length;
            for(var i=0;i<leng;i++){
                if(res.data[i].isAdmin==1){
                    res.data[i].isAdmin='是';
                }else{
                    res.data[i].isAdmin='否';
                }
            }
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
        tableUser.reload({
            page: {
                curr: 1 //重新从第 1 页开始
            }
        });
    }
    table.on('toolbar(user)', function(obj){
        var checkStatus = table.checkStatus(obj.config.id);
        switch(obj.event){
        case 'add':
            var layeradd=layer.open({
                type: 1,
                title:'教师添加',
                btn:['确认','取消'],
                yes:function(){
                    var username=$('#addUserName').val(),
                        password=$('#addPassword').val(),
                        isAdmin=$('#addIsAdmin').val();
                        // isYearDirector=$('#addIsYearDirector').val(),
                        // isClassDirector=$('#addIsClassDirector').val(),
                        // isTeacher=$('#addIsTeacher').val();
                        if(isAdmin=='on'){
                        	isAdmin=1;
                        }else{
                        	isAdmin=0;
                        }
                        var data={
                            username:username,
                            password:password,
                            isAdmin:isAdmin,
                            // isYearDirector:isYearDirector,
                            // isClassDirector:isClassDirector,
                            // isTeacher:isTeacher
                        }
                        url='../../../controller/user.php?a=add';
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

                },
                content: $('#addUser') //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
            });
            break;
      };
    });
    table.on('tool(user)', function(obj){ //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
        var tr = obj.tr; //获得当前行 tr 的DOM对象
        var id=$(tr).find('.layui-btn').attr('data-id');
        if(layEvent === 'detail'){ //查看           
            var url='../../../controller/user.php?a=detail',
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
                        var username=data.username||'——';
                        var password=data.password||'——';
                        var isAdmin=data.isAdmin?'是':'否';
                        var isYearDirector=data.isYearDirector||'——';
                        var isClassDirector=data.isClassDirector||'——';
                        
                        $('#lookUserName').text(username);
                        $('#lookPassword').text(password);
                        $('#lookIsAdmin').text(isAdmin);
                        $('#lookIsYearDirector').text(isYearDirector);
                        $('#lookIsClassDirector').text(isClassDirector);
                        var teacher=data.teacher.join(' , ');
                        teacher=teacher||'——';
                        $('#lookIsTeacher').text(teacher);
                        var layerlook=layer.open({
                            type: 1,
                            title:'年级查看',
                            content: $('#lookUser'),
                            area:['400px','450px']
                        });
                    }
                }
            });
        } else if(layEvent === 'del'){ //删除
            layer.confirm('真的删除行么', function(index){
                var url='../../../controller/user.php?a=del',
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
            var url='../../../controller/user.php?a=detail',
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
                        $('#editUserName').val(data.username);
                        $('#editPassword').val(data.password);
                        $('#editIsAdmin').val(data.isAdmin);
                        var layeredit=layer.open({
                            type: 1,
                            title:'教师编辑',
                            content: $('#editUser'),
                            btn:['确认','取消'],
                            yes:function(){
                                var username=$('#editUserName').val(),
                                    password=$('#editPassword').val(),
                                    isAdmin=$('#editIsAdmin').val(),
                                    isYearDirector=$('#editIsYearDirector').val(),
                                    isClassDirector=$('#editIsClassDirector').val(),
                                    isTeacher=$('#editIsTeacher').val();
                                    // director=$('#editGradeDirector').val();
                                // if(name&&startdate&&enddate&&status){
                                    var editdata={
                                        id:id,
                                        username:username,
                                        password:password,
                                        isAdmin:isAdmin,
                                        isYearDirector:isYearDirector,
                                        isClassDirector:isClassDirector,
                                        isTeacher:isTeacher
                                    },
                                    editurl='../../../controller/user.php?a=edit';
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
// 快速生成大量用户
// function newUser(){
//     var users=newTName(120);
//     users=users.split(',');
//     var password='000000';
//     var data={
//         password:password,
//         isAdmin:0,
//     }
//     url='../../../controller/user.php?a=add';
//     for(var i=0;i<120;i++){
//         data.username=users[i];
//         $.ajax({
//             url:url,
//             data:data,
//             dataType:'json',
//             method:'post',
//             success:function(res){
//                 console.log(i)
//             }
//         })
//     }   
// }
// newUser();
});

