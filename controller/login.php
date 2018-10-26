<?php
	$con = mysql_connect("localhost","root","root");
	if (!$con){
  		die('Could not connect: ' . mysql_error());
  	}

	mysql_select_db("scoreanalysis", $con);
	$username=$_POST['username'];
	$password=$_POST['password'];
	$sql="SELECT * FROM user WHERE username='$username' AND password='$password'";
	$result=mysql_query($sql,$GLOBALS['con']);
	if (!$result){
	  	die('Error: ' . mysql_error());
	  	$list=array('code'=>0,'msg'=>'加载失败');
	}else{
		$list=array('code'=>1,'msg'=>'加载成功','data'=>array());
		while($row = mysql_fetch_array($result))
		{
			$one=array();
			$one['id']=$row['id'];
			$one['username']=$row['username'];
			$one['isAdmin']=$row['isAdmin'];		
			$list['data']=$one;
			// echo json_encode($list,JSON_UNESCAPED_UNICODE);
			// echo json_encode($one,JSON_UNESCAPED_UNICODE);
		}
		if($list['data']){
			// echo json_encode($list,JSON_UNESCAPED_UNICODE);
			$list['data']['isGradeDirector']=array();
			$list['data']['isClassDirector']=array();
			$list['data']['isTeacher']=array();
			$id=$list['data']['id'];
			$sql_0="SELECT gradeDirector.*,grade.gradename FROM gradeDirector LEFT JOIN grade ON grade.id=gradeDirector.gradeid WHERE gradeDirector.userid=$id and !gradeDirector.endTime";
			$result_0=mysql_query($sql_0,$GLOBALS['con']);
			if (!$result_0){
			  	die('Error: ' . mysql_error());
			  	$list['gradeDirectormsg']='加载失败';
			}else{

				while($row_0= mysql_fetch_array($result_0))
				{	
					$one_0=array();
					$one_0['id']=$row_0['id'];
					$one_0['gradeid']=$row_0['gradeid'];
					$one_0['gradename']=$row_0['gradename'];

					array_push($list['data']['isGradeDirector'],$one_0);	
				}
			}
			$sql_1="SELECT classDirector.*,class.classname FROM classDirector LEFT JOIN class ON class.id=classDirector.classid WHERE classDirector.userid=$id  and !classDirector.endtime";
			$result_1=mysql_query($sql_1,$GLOBALS['con']);
			if (!$result_1){
			  	die('Error: ' . mysql_error());
			  	$list['classDirectormsg']='加载失败';
			}else{

				while($row_1= mysql_fetch_array($result_1))
				{	
					$one_1=array();
					$one_1['id']=$row_1['id'];
					$one_1['classid']=$row_1['classid'];
					$one_1['classname']=$row_1['classname'];

					array_push($list['data']['isClassDirector'],$one_1);	
				}
			}
			$sql_2="SELECT teaching.*,class.classname,subject.subjectname FROM teaching LEFT JOIN class ON class.id=teaching.classid LEFT JOIN subject ON subject.id=teaching.subjectid WHERE teaching.teacherid=$id  and !teaching.endtime";
			$result_2=mysql_query($sql_2,$GLOBALS['con']);
			if (!$result_2){
			  	die('Error: ' . mysql_error());
			  	$list['teachingmsg']='加载失败';
			}else{

				while($row_2= mysql_fetch_array($result_2))
				{	
					$one_2=array();
					$one_2['id']=$row_2['id'];
					$one_2['classid']=$row_2['classid'];
					$one_2['classname']=$row_2['classname'];
					$one_2['subjectid']=$row_2['subjectid'];
					$one_2['subjectname']=$row_2['subjectname'];
					array_push($list['data']['isTeacher'],$one_2);	
				}
			}
		}else{
			$list=array('code'=>0,'msg'=>'用户名密码错误');
		}
		
	}
	$list=json_encode($list,JSON_UNESCAPED_UNICODE);
	echo $list;
?>