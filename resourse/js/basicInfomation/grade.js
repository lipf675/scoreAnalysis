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

    laydate.render({
        type:'month',
        elem:'#addStartTime'
    })
    laydate.render({
        type:'month',
        elem:'#addEndTime'
    })
    laydate.render({
        type:'month',
        elem:'#editStartTime'
    })
    laydate.render({
        type:'month',
        elem:'#editEndTime'
    })
    $('.layui-header').load('../../../pages/commen/head.html');
    $('.layui-side-scroll').load('../../../pages/commen/sidebar.html');
    function getTeacherList(){
    	var teacherUrl='../../../controller/user.php?a=all';
    	$.ajax({
    		url:teacherUrl,
    		data:{},
    		dataType:'json',
    		method:'post',
    		// async:false,
    		success:function(res){
    			var list=res.data;
    			var str='<option value="">请选择</option>';
    			var listleng=list.length;
    			for(var i=0;i<listleng;i++){
    				str+='<option value="'+list[i].id+'">'+list[i].username+'</option>';
    			}
    			$('#editGradeDirector').html(str);
    			$('#addGradeDirector').html(str);
    			form.render('select')
    		}
    	})
    }
    getTeacherList();
    
    var url='../../../controller/grade.php?a=list',
        cols=[
        [
            // { field: 'check', title: '', width: 100,  fixed: 'left',type:'checkbox'},
            { field: 'number', title: '排序', width: '10%',  type:'numbers',fixed:'left'},
            { field: 'gradename', title: '名称', width: '15%', align:'center'}, 
            { field: 'startdate', title: '入学年月', sort: true, width: '15%', align:'center'}, 
            { field: 'enddate', title: '毕业时间', sort: true, width: '15%', align:'center'}, 
            { field: 'grade', title: '年级', width: '15%', align:'center'}, 
            {field: 'gradeDirector', title: '年级主任', width: '10%', align:'center'},
            { width:'20%', align:'center', toolbar: '#barDemo',title:'操作'} 
        ]
        ];
    var toolbar=isAdmin?'#toolbarDemo':'';
    //第一个实例
    var tableGrade=table.render({
        elem: '#gradeTable',
        // height: 500,
        url: url,
        page: true,
        skin:'line',
        initsort:{
          field:'gradename',
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
        tableGrade.reload({
            page: {
                curr: 1 //重新从第 1 页开始
            }
        });
    }
    table.on('toolbar(grade)', function(obj){
        var checkStatus = table.checkStatus(obj.config.id);
        switch(obj.event){
        case 'add':
        	$('#addGrade input').val('');
        	$('#addGrade select').val('');
            var layeradd=layer.open({
                type: 1,
                title:'年级添加',
                btn:['确认','取消'],
                yes:function(){
                    var gradename=$('#addGradeName').val(),
                        startdate=$('#addStartTime').val(),
                        enddate=$('#addEndTime').val(),
                        status=$('#addStatus').val();
                        director=$('#addGradeDirector').val();
                    if(!gradename){
                        layer.msg('年级名称不能为空')
                    }else{
                        var data={
                            gradename:gradename,
                            startdate:startdate,
                            enddate:enddate,
                            status:status,
                            gradeDirector:director
                        }
                        url='../../../controller/grade.php?a=add';
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
                    }
                },
                content: $('#addGrade') //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
            });
            break;
        };
    });
    table.on('tool(grade)', function(obj){ //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
        var tr = obj.tr; //获得当前行 tr 的DOM对象
        var id=$(tr).find('.layui-btn').attr('data-id');
        if(layEvent === 'detail'){ //查看
            var url='../../../controller/grade.php?a=detail',
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
                        if(!data.gradeDirector){
                        	data.gradeDirector="——";
                        }
                        $('#lookGradeName').text(data.gradename);
                        $('#lookStartTime').text(data.startdate);
                        $('#lookEndTime').text(data.enddate);
                        $('#lookStatus').text(data.grade);
                        $('#lookGradeDirector').text(data.gradeDirector);
                        var layerlook=layer.open({
                            type: 1,
                            title:'年级查看',
                            content: $('#lookGrade'),
                            area:['400px','360px']
                        });
                    }
                }
            });
        } else if(layEvent === 'del'){ //删除
            layer.confirm('真的删除行么', function(index){
                var url='../../../controller/grade.php?a=del',
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
            var url='../../../controller/grade.php?a=detail',
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
                        $('#editGradeName').val(data.gradename);
                        $('#editStartTime').val(data.startdate);
                        $('#editEndTime').val(data.enddate);
                        $('#editStatus option').each(function(){
                            if($(this).text()==data.grade){
                                $(this).attr('selected','selected').siblings().removeAttr('selected');
                            }
                        });
                        $('#editGradeDirector option').each(function(){
                            if($(this).text()==data.gradeDirector){
                                $(this).attr('selected','selected').siblings().removeAttr('selected');
                            }
                        });
                        form.render('select');
                        var layeredit=layer.open({
                            type: 1,
                            title:'年级编辑',
                            content: $('#editGrade'),
                            btn:['确认','取消'],
                            yes:function(){
                                var gradename=$('#editGradeName').val(),
                                    startdate=$('#editStartTime').val(),
                                    enddate=$('#editEndTime').val(),
                                    status=$('#editStatus').val();
                                    director=$('#editGradeDirector').val();
                                if(!gradename){
                                    layer.msg('年级名称不能为空')
                                }else{
                                    var editdata={
                                        id:id,
                                        gradename:gradename,
                                        startdate:startdate,
                                        enddate:enddate,
                                        status:status,
                                        gradeDirector:director
                                    }
                                    editurl='../../../controller/grade.php?a=edit';
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
                                }
                            },
                        });
                    }
                }
            });
        
            //同步更新缓存对应的值
            // obj.update({
            //     username: '123'
            //     ,title: 'xxx'
            // });
        } else if(layEvent === 'enter'){ //进入
            location.href="class.html?grade="+id; 
        }
    });


});