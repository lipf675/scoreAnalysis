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
var grade=getQueryString('grade')
console.log(grade)
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
    
    getGradeList();
        
    function getGradeList(){
    	var teacherUrl='../../../controller/grade.php?a=all';
    	$.ajax({
    		url:teacherUrl,
    		data:{},
    		dataType:'json',
    		method:'post',
    		success:function(res){
    			console.log(res)
    			var gradelist=res.data;
    			var gradestr='<option value="">请选择</option>';
    			var gradeleng=gradelist.length;
    			for(var g=0;g<gradeleng;g++){
    				gradestr+='<option value="'+gradelist[g].id+'">'+gradelist[g].gradename+'</option>';
    			}
    			$('#addGradeId').html('');
    			$('#editGradeId').html('');
    			$('#addGradeId').html(gradestr);
    			$('#editGradeId').html(gradestr);
                if(grade!=''){
                    $('#addGradeId').val(grade).attr('disabled','disabled');
                    $('#editGradeId').val(grade).attr('disabled','disabled');
                }
    			getSubjectList()
    		}
    	})
    }
    function getSubjectList(){
    	var teacherUrl='../../../controller/subject.php?a=all';
    	$.ajax({
    		url:teacherUrl,
    		data:{},
    		dataType:'json',
    		method:'post',
    		success:function(res){
    			var list=res.data;
    			var lookstr='';
    			var addstr='';
    			var leng=list.length;
    			for(var i=0;i<leng;i++){
    				addstr+='<div class="layui-form-item" data-subjectid="'+list[i].id+'"><label class="layui-form-label">'+list[i].subjectname+'老师</label><div class="layui-input-block"><select></select></div></div>'
    				lookstr+='<div class="layui-form-item" data-subjectid="'+list[i].id+'"><label class="layui-form-label">'+list[i].subjectname+'老师</label><div class="layui-input-block"><span></span></div></div>';
    			}
    			$('#editTeacher').next('fieldset').html(addstr);
				$('#addTeacher').next('fieldset').html(addstr);
				$('#lookTeacher').next('fieldset').html(lookstr);
				getTeacherList(leng);

    		}
    	})
    }
    function getTeacherList(leng){
    	var teacherUrl='../../../controller/user.php?a=all';
    	$.ajax({
    		url:teacherUrl,
    		data:{},
    		dataType:'json',
    		method:'post',
    		// async:false,
    		success:function(res){
    			var list=res.data;
    			var strarr=[];
    			for(var s=0;s<leng;s++){
    				strarr[s]='<option value="">请选择</option>';
    			}

    			var str='<option value="">请选择</option>';
    			var listleng=list.length;
    			for(var i=0;i<listleng;i++){
    				var teaching=list[i].teaching;
    				teaching=teaching.split(',');
					for(var t=0;t<teaching.length;t++){
						var num=+teaching[t]-1
						strarr[num]+='<option value="'+list[i].id+'">'+list[i].username+'</option>';
					}
    				str+='<option value="'+list[i].id+'">'+list[i].username+'</option>';
    			}
    			$('#editClassDirector').html(str);
    			$('#addClassDirector').html(str);
    			$('fieldset div[data-subjectid]').each(function(){
    				var subject=$(this).attr('data-subjectid');
    				subject=+subject-1;
    				$(this).find('select').html(strarr[subject]);
    			});
    			form.render('select')
    		}
    	})
    }
    var url='../../../controller/class.php?a=list&grade='+grade,
        cols=[
        [
            // { field: 'check', title: '', width: 100,  fixed: 'left',type:'checkbox'},
            { field: 'number', title: '排序', width: '10%',  type:'numbers',fixed: 'left'},
            { field: 'classname', title: '名称', sort:true,width: '20%', align:'center'}, 
            { field: 'grade', title: '年级', sort: true, width: '20%', align:'center'}, 
            { field: 'classDirector', title: '班主任', width: '20%',align:'center'}, 
            { width:'30%', align:'center', toolbar: '#barDemo',title:'操作'} 
        ]
        ];
    var toolbar=isAdmin?'#toolbarDemo':'';
    //第一个实例
    var tableClass=table.render({
        elem: '#classTable',
        // height: 500,
        url: url,
        page: true,
        skin:'line',
        initsort:{
          field:'grade',
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
        tableClass.reload({
            page: {
                curr: 1 //重新从第 1 页开始
            }
        });
    }
    table.on('toolbar(class)', function(obj){
        var checkStatus = table.checkStatus(obj.config.id);
        switch(obj.event){
        case 'add':
            var layeradd=layer.open({
                type: 1,
                title:'班级添加',
                btn:['确认','取消'],
              	maxWidth:"800px",
              	btnAlign:'c',
                yes:function(){
                    var classname=$('#addClassName').val(),
                        grade=$('#addGradeId').val(),
                        classDirector=$('#addClassDirector').val(),
                        teacher=[];
                        $('#addTeacher+fieldset select').each(function(){
                        	var val=$(this).val();
                        	var name=$(this).parents('.layui-form-item').attr('data-subjectid');
                        	teacher.push(''+name+':'+val);
                        })
                        teacher=teacher.join(',');
                        console.log(teacher)
                        var data={
                            classname:classname,
                            grade:grade,
                            classDirector:classDirector,
                            teacher:teacher
                        }
                        url='../../../controller/class.php?a=add';
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
                content: $('#addClass') //这里content是一个DOM，注意：最好该元素要存放在body最外层，否则可能被其它的相对元素所影响
            });
            break;
      };
    });
    table.on('tool(class)', function(obj){ //注：tool是工具条事件名，test是table原始容器的属性 lay-filter="对应的值"
        var data = obj.data; //获得当前行数据
        var layEvent = obj.event; //获得 lay-event 对应的值（也可以是表头的 event 参数对应的值）
        var tr = obj.tr; //获得当前行 tr 的DOM对象
        var id=$(tr).find('.layui-btn').attr('data-id');
        if(layEvent === 'detail'){ //查看
            var url='../../../controller/class.php?a=detail',
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
                    	// $('#lookClassName').text('——');
                     //    $('#lookGradeId').text('——');
                     //    $('#lookClassDirector').text('——');
                     //    $('#lookClass fieldset .layui-form-item[data-subjectid] span').text('——');
                        var data=res.data[0];
                        var teacher=data.teacher;
                        var leng=teacher.length;
                        var subject;
                        var classname=data.classname||"——";
                        var grade=data.grade||"——";
                        var classDirector=data.classDirector||"——";
                        $('#lookClassName').text(classname);
                        $('#lookGradeId').text(grade);
                        $('#lookClassDirector').text(classDirector);
                        $('#lookClass fieldset .layui-form-item[data-subjectid]').each(function(){
                        	subject=$(this).attr('data-subjectid');
                        	for(var i=0;i<leng;i++){
                        		if(teacher[i].subjectid==subject){
                        			$(this).attr('data-id',teacher[i].id);
                        			var teachername=teacher[i].teachername||"——";
                        			$(this).find('span').html(teachername);
                        			break;
                        		}
                        	}
                        })
                        
                        var layerlook=layer.open({
                            type: 1,
                            title:'班级查看',
                            content: $('#lookClass'),
                            maxWidth:"800px",
              				btnAlign:'c'
                        });
                    }
                }
            });
        } else if(layEvent === 'del'){ //删除
            layer.confirm('真的删除行么', function(index){
                var url='../../../controller/class.php?a=del',
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
            var url='../../../controller/class.php?a=detail',
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
                        $('#editClassName').val('');
                        $('#editGradeId').val('');
                        $('#editClassDirector').val('');
                        $('#editClass fieldset .layui-form-item[data-subjectid] select').val('');
                        var data=res.data[0];
                        var teacher=data.teacher;
                        var leng=teacher.length;
                        var subject;
                        var classname=data.classname;
                        var gradeid=data.gradeid;
                        var classDirector=data.classDirectorId;
                        $('#editClassName').val(classname);
                        $('#editGradeId').val(gradeid);
                        $('#editClassDirector').val(classDirector);
                       
                        $('#editClass fieldset .layui-form-item[data-subjectid]').each(function(){
                        	subject=$(this).attr('data-subjectid');
                        	for(var i=0;i<leng;i++){
                        		if(teacher[i].subjectid==subject){
                        			$(this).attr('data-id',teacher[i].id);
                        			var teacherid=teacher[i].teacherid||"";
                        			$(this).find('select').val(teacherid);
                        			break;
                        		}
                        	}
                        })
                        form.render('select');
                        var layeredit=layer.open({
                            type: 1,
                            title:'年级编辑',
                            content: $('#editClass'),
                            btn:['确认','取消'],
                            maxWidth:"800px",
              				btnAlign:'c',
                            yes:function(){
                                var classname=$('#editClassName').val(),
                                    grade=$('#editGradeId').val(),
                                    classDirector=$('#editClassDirector').val(),
                                    teacher=[];
                                    $('#editClass fieldset .layui-form-item[data-subjectid]').each(function(){
                                        var arr=[]
                                        arr[0]=$(this).attr('data-subjectid');//学科ID
                                        // var teacher_id=$(this).attr('data-id');//teacher表id
                                        arr[1]=$(this).find('select').val();//用户ID
                                        teacher.push(arr.join(':'));
                                    })
                                    teacher=teacher.join(',');
                                    console.log(teacher);
                                    var editdata={
                                        id:id,
                                        classname:classname,
                                        grade:grade,
                                        classDirector:classDirector,
                                        teacher:teacher
                                    }
                                    editurl='../../../controller/class.php?a=edit';
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
        
	    }else if(layEvent === 'enter'){ //进入
            location.href="student.html?class="+id; 
        }
	});
});