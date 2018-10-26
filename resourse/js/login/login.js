//JavaScript代码区域
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
    form.on('submit(login)', function(data){
        var logindata=data.field //当前容器的全部表单字段，名值对形式：{name: value}
        $.ajax({
            method:"post",
            url:'../../../controller/login.php',
            data:logindata,
            dataType:'json',
            success:function(res){
                if(res.code=="1"){
                    var data=res.data;
                    var username=data.username;
                    var isAdmin=data.isAdmin;
                    var isGradeDirector=data.isGradeDirector;
                    var isClassDirector=data.isClassDirector;
                    var isTeacher=data.isTeacher;
                    var id=data.id;
                    sessionStorage.setItem('id',id);
                    sessionStorage.setItem('username',username);
                    sessionStorage.setItem('isAdmin',isAdmin);
                    sessionStorage.setItem('isTeacher',isTeacher);
                    sessionStorage.setItem('isClassDirector',isClassDirector);
                    sessionStorage.setItem('isGradeDirector',isGradeDirector);
                    // sessionStorage.username=username;
                    // sessionStorage.isAdmin=isAdmin;
                    // sessionStorage.isTeacher=isTeacher;
                    // sessionStorage.isClassDirector=isClassDirector;
                    // sessionStorage.isGradeDirector=isGradeDirector;
                    // return false;
                    location.href="../basicInfomation/grade.html";         
                }else{
                    layer.msg('用户名密码错误');
                    return false;
                }
            }
        });
        return false;
    });
    $('form').submit(function(){
    	var username=$('#username').val();
    	var password=$('#password').val();
    	
    })
});