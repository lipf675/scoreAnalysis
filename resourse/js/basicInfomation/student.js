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
function getQueryString(name) {
    var result = window.location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return result[1];
}
var class_id=getQueryString('class');
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
    
    getClassList();
        
    function getClassList(){
    	var classUrl='../../../controller/class.php?a=all';
    	$.ajax({
    		url:classUrl,
    		data:{},
    		dataType:'json',
    		method:'post',
    		success:function(res){
    			// console.log(res)
    			var classlist=res.data;
    			var classstr='<option value="">请选择</option>';
    			var classleng=classlist.length;
    			for(var g=0;g<classleng;g++){
    				classstr+='<option value="'+classlist[g].id+'">'+classlist[g].gradename+'</option>';
    			}
    			$('#addClassId').html('');
    			$('#editClassId').html('');
    			$('#changeclassid').html('');
    			$('#addClassId').html(classstr);
    			$('#editClassId').html(classstr);
    			$('#changeclassid').html(classstr);
                if(class_id!=''){
                    $('#addClassId').val(class_id).attr('disabled','disabled');
                    $('#editClassId').val(class_id).attr('disabled','disabled');
                }
    		}
    	})
    }
    var url='../../../controller/student.php?a=list&class='+class_id,
        cols=[
        [
            // { field: 'check', title: '', width: 100,  fixed: 'left',type:'checkbox'},
            { field: 'number', title: '排序', width: '10%',  type:'numbers',fixed: 'left'},
            { field: 'studentname', title: '姓名', sort:true,width: '20%', align:'center'}, 
            { field: 'studentnumber', title: '学号', sort:true,width: '20%', align:'center'}, 
            { field: 'studentsex', title: '性别', sort:true,width: '20%', align:'center'}, 
            { field: 'class', title: '班级', sort: true, width: '20%', align:'center'},  
            { width:'30%', align:'center', toolbar: '#barDemo',title:'操作',fixed:'right'} 
        ]
        ];
    var toolbar=isAdmin?'#toolbarDemo':'';
    //第一个实例
    if(class_id){
    	var page=false;
    }else{
    	page=true;
    }
    var tableStudent=table.render({
        elem: '#studentTable',
        // height: 500,
        url: url,
        page: page,
        skin:'line',
        initsort:{
          field:'class',
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
        tableStudent.reload({
            page: {
                curr: 1 //重新从第 1 页开始
            }
        });
    }
    table.on('toolbar(student)', function(obj){
        var checkStatus = table.checkStatus(obj.config.id);
        switch(obj.event){
        case 'add':
            var layeradd=layer.open({
                type: 1,
                title:'学生添加',
                btn:['确认','取消'],
              	btnAlign:'c',
                yes:function(){
                    var studentname=$('#addStudentName').val(),
                        classid=$('#addClassId').val(),
                        sex=$('#addSex :checked').val(),
                        studentNum=$('#addStudentNum').val(),
                    var data={
                        studentname:studentname,
                        class:classid,
                        studentsex:sex,
                        studentnumber:studentNum
                    },
                    url='../../../controller/student.php?a=add';
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
                content: $('#addStudent') //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
            });
            break;
      };
    });
    table.on('tool(student)', function(obj){ //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
        var tr = obj.tr; //获得当前行 tr 的DOM对象
        var id=$(tr).find('.layui-btn').attr('data-id');
        if(layEvent === 'detail'){ //查看
            var url='../../../controller/student.php?a=detail',
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
                        var studentname=data.studentname||"——";
                        var classid=data.class||"——";
                        var studentnumber=data.studentnumber||"——";
                        var studentsex=data.studentsex||"";
                        $('#lookStudentName').text(studentname);
                        $('#lookClassId').text(classid);
                        $('#lookStudentNum').text(studentnumber);
                        $('#lookSex').text(studentsex);
                        var layerlook=layer.open({
                            type: 1,
                            title:'学生查看',
                            content: $('#lookStudent'),
              				btnAlign:'c'
                        });
                    }
                }
            });
        } else if(layEvent === 'del'){ //删除
            layer.confirm('真的删除行么', function(index){
                var url='../../../controller/student.php?a=del',
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
            var url='../../../controller/student.php?a=detail',
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
                        $('#editStudentName').val('');
                        $('#editClassId').val('');
                        $('#editStudentNum').val('');
                        $('#editSex :checked').removeAttr('checked');
                       	var data=res.data[0];
                        $('#editStudentName').val(data.studentname);
                        $('#editClassId').val(data.class);
                        $('#editStudentNum').val(data.studentnumber);
                        $('#editSex input[value="'+data.studentsex+'"]').attr('checked');
                        form.render('select');
                        var layeredit=layer.open({
                            type: 1,
                            title:'年级编辑',
                            content: $('#editStudent'),
                            btn:['确认','取消'],
              				btnAlign:'c',
                            yes:function(){
                                var studentname=$('#editStudentName').val(),
			                        classid=$('#editClassId').val(),
			                        sex=$('#editSex :checked').val(),
			                        studentNum=$('#editStudentNum').val(),
                                var editdata={
                                    id:id,
                                    studentname:studentname,
			                        class:classid,
			                        studentsex:sex,
			                        studentnumber:studentNum
                                }
                                editurl='../../../controller/student.php?a=edit';
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
                            },
                        });
                    }
                }
            });       
	    }else if(layEvent === 'outschool'){ //退学
	    	var data={
                id:id
            },
            url='../../../controller/student.php?a=outschool';
            $.ajax({
				url:url,
                data:data,
                dataType:'json',
                method:'post',
                success:function(res){
                    layer.msg(res.msg);
                    if(res.code==1){
                        // layer.close(layerchange);
                        tableReload();
                    }
                    
                }
            })
        }else if(layEvent === 'changeclass'){ //转班
            var layerchange=layer.open({
                type: 1,
                title:'转班',
                btn:['确认','取消'],
              	btnAlign:'c',
                yes:function(){
                    var classid=$('#addClassId').val();
                    var data={
                        id:id,
                        class:classid,
                    },
                    url='../../../controller/student.php?a=changeclass';
                    $.ajax({
                        url:url,
                        data:data,
                        dataType:'json',
                        method:'post',
                        success:function(res){
                            layer.msg(res.msg);
                            if(res.code==1){
                                layer.close(layerchange);
                                tableReload();
                            }
                            
                        }
                    })

                },
                content: $('#changeclass') //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
            });
        }
	});
});