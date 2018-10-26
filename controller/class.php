<?php
	date_default_timezone_set("PRC");
	$con = mysql_connect("localhost","root","root");
	if (!$con){
  		die('Could not connect: ' . mysql_error());
  	}

	mysql_select_db("scoreanalysis", $con);
	$value=$_GET['a'];
	switch ($value){
		case 'all':
		classall();
		break;
		case 'list':
		classlist($_GET['limit'],$_GET['page']);
		break;
		case 'add':
		classadd($_POST['classname'],$_POST['grade'],$_POST['classDirector'],$_POST['teacher']);
		break;
		case 'del':
		classdel($_POST['id']);
		break;
		case 'detail':
		classdetail($_POST['id']);
		break;
		case 'edit':
		classedit($_POST['id'],$_POST['classname'],$_POST['grade'],$_POST['classDirector'],$_POST['teacher']);
		break;
	}
	function classall(){
		$sql="SELECT * FROM class";
		$result=mysql_query($sql,$GLOBALS['con']);
		if (!$result){
		  	die('Error: ' . mysql_error());
		  	$list=array('code'=>0,'msg'=>'列表加载失败');
		}else{
			$list=array('code'=>0,'msg'=>'','data'=>array());
			while($row = mysql_fetch_array($result))
			{
				$one=array();
				$one['id']=$row['id'];
				$one['classname']=$row['classname'];
				array_push($list['data'],$one);
			}
			$list=json_encode($list,JSON_UNESCAPED_UNICODE);
			echo $list;
		}	
	}
	function classlist($limit,$page){
		$page--;
		$page*=10;
		$gradeid=$_GET['grade'];
		if(!$gradeid){
			$sql_1="SELECT class.*,user.username,grade.gradename FROM class LEFT JOIN classDirector ON class.id=classDirector.classid LEFT JOIN user ON classDirector.userid=user.id LEFT JOIN grade  ON class.gradeId=grade.id LIMIT $page,$limit";
		}else{
			$sql_1="SELECT class.*,user.username,grade.gradename FROM class LEFT JOIN classDirector ON class.id=classDirector.classid LEFT JOIN user ON classDirector.userid=user.id LEFT JOIN grade  ON class.gradeId=grade.id WHERE class.gradeid='$gradeid' LIMIT $page,$limit";
		}
		$sql_0="SELECT * FROM class";
		$result=mysql_query($sql_1,$GLOBALS['con']);
		if (!$result){
		  	die('Error: ' . mysql_error());
		  	$list=array('code'=>0,'msg'=>'列表加载失败');
		}else{
			$list=array('code'=>0,'msg'=>'','data'=>array());
			while($row = mysql_fetch_array($result))
			{
				$one=array();
				$one['id']=$row['id'];
				$one['classname']=$row['classname'];
				$one['grade']=$row['gradename'];
				$one['classDirector']=$row['username'];
				array_push($list['data'],$one);
				// echo $row['FirstName'] . " " . $row['LastName'];
			 //  	echo "<br />";
			}
			$result1=mysql_query($sql_0,$GLOBALS['con']);
			if (!$result1){
			  	die('Error: ' . mysql_error());
			  	// $list=array('code'=>0,'msg'=>'列表加载失败');
			}else{
				$i=0;
				while($row = mysql_fetch_array($result1))
				{
					$i++;
				}
			}
			$list['count']=$i;
			$list=json_encode($list,JSON_UNESCAPED_UNICODE);
			echo $list;
		}
		
	}
	function classadd($classname,$grade,$classDirector,$teacher){
		$sql="SELECT user.username FROM classDirector LEFT JOIN user ON classDirector.userid=user.id WHERE classDirector.userid='$classDirector'";
		$result=mysql_query($sql,$GLOBALS['con']);
		$list=array('code'=>0,'msg'=>'添加失败');
		$row = mysql_fetch_array($result);
		if($row){
			$msg=$row['username'].'已经是其他班级的班主任了';
			$list=array('code'=>0,'msg'=>$msg);
		}else{
			$sql_0="INSERT INTO class (classname,gradeId) VALUES ('$classname','$grade')"; 
			// $result=mysql_query($sql,$GLOBALS['con']);
			if (!mysql_query($sql_0,$GLOBALS['con']))
			{
				die('Error: ' . mysql_error());
				$list=array('code'=>0,'msg'=>'添加失败');
			}else{
				$list=array('code'=>1,'msg'=>'添加成功');
				$date=date('Y-m-d H:i:s');
			  	$id=mysql_insert_id(); 
				
				$sql_2="INSERT INTO classDirector (classid,userid,starttime) VALUES ('$id','$classDirector','$date');";
				$result_2=mysql_query($sql_2,$GLOBALS['con']);
				if($result_2){
				}else{
					$list['msg']='修改user表isClassDirector失败';
				}
				$array=explode(',',$teacher);
				$leng=count($array);
				for($i=0;$i<$leng;$i++){
					$teacherarr=explode(':',$array[$i]);
					$subjectid=$teacherarr[0];
					$userid=$teacherarr[1];
					// echo  var_dump($teacherarr);
					if($teacherarr[1]!=""){
						$sql_3="INSERT INTO teaching (classid,subjectid,teacherid,starttime) VALUES ('$id','$subjectid','$userid','$date')";
						$result_3=mysql_query($sql_3,$GLOBALS['con']);
						if(!$result_3){
							$list['msg']='添加'.$subjectid.'教师失败';
							break;
						}else{
							$list['msg']='添加';
						}
					}
					
				}
				
				
			}
		}
		
		$list=json_encode($list,JSON_UNESCAPED_UNICODE);
		echo $list;
	}
	function classdel($id){
		$sql_0="SELECT id FROM student WHERE classid='$id";
		$result_0=mysql_query($sql_0,$GLOBALS['con']);
		if(!$result_0){
			$sql="DELETE FROM classDirector WHERE classid=$id;";
			$sql_2="DELETE FROM teaching WHERE classid=$id;"; 
			$result=mysql_query($sql,$GLOBALS['con']);
			$result_2=mysql_query($sql_2,$GLOBALS['con']);
		  	$sql_1="DELETE FROM class WHERE id=$id;";
		  	$result_1=mysql_query($sql_1,$GLOBALS['con']);
		  	if($result_1){
		  		$list=array('code'=>1,'msg'=>'删除成功');
		  	}else{
		  		$list=array('code'=>0,'msg'=>'删除失败');
		  	}
		}else{
			$list=array('code'=>0,'msg'=>'请先删除其下的学生');
		}
		$list=json_encode($list,JSON_UNESCAPED_UNICODE);
		echo $list;
	}
	function classdetail($id){
		$sql="SELECT class.*,user.username,grade.gradename,classDirector.userid FROM class LEFT JOIN classDirector ON class.id=classDirector.classid LEFT JOIN user ON classDirector.userid=user.id LEFT JOIN grade  ON class.gradeId=grade.id WHERE class.id=$id";
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
				$one['classname']=$row['classname'];
				$one['gradeid']=$row['gradeId'];
				$one['grade']=$row['gradename'];
				$one['classDirector']=$row['username'];
				$one['classDirectorId']=$row['userid'];
				$one['teacher']=array();
				$sql_0="SELECT teaching.*,user.username FROM teaching LEFT JOIN user ON teaching.teacherid=user.id WHERE classid=$id";
				$result_0=mysql_query($sql_0,$GLOBALS['con']);
				if (!$result_0){
				  	die('Error: ' . mysql_error());
				  	$list=array('code'=>0,'msg'=>'加载失败');
				}else{
					// $list=array('code'=>1,'msg'=>'加载成功','data'=>array());
					while($row_0 = mysql_fetch_array($result_0))
					{
						$teacher=array();
						$teacher['id']=$row_0['id'];
						$teacher['subjectid']=$row_0['subjectid'];
						$teacher['teacherid']=$row_0['teacherid'];
						$teacher['teachername']=$row_0['username'];
						array_push($one['teacher'],$teacher);
					}
				}
				array_push($list['data'],$one);
			}
		}
		$list=json_encode($list,JSON_UNESCAPED_UNICODE);
		echo $list;
	}
	function classedit($id,$classname,$grade,$classDirector,$teacher){
		$sql="SELECT user.username FROM classDirector LEFT JOIN user ON classDirector.userid=user.id WHERE classDirector.userid='$classDirector' and classDirector.classid!='$id'";
		$result=mysql_query($sql,$GLOBALS['con']);
		$list=array('code'=>0,'msg'=>'修改失败');
		$row = mysql_fetch_array($result);
		if($row){
			$msg=$row['username'].'已经是其他班级的班主任了';
			$list=array('code'=>0,'msg'=>$msg);
		}else{
			$sql_0="UPDATE class SET classname='$classname',gradeId='$grade' WHERE id='$id'"; 
			// $result=mysql_query($sql,$GLOBALS['con']);
			if (!mysql_query($sql_0,$GLOBALS['con']))
			{
				die('Error: ' . mysql_error());
				$list=array('code'=>0,'msg'=>'修改失败');
			}else{
				$list=array('code'=>1,'msg'=>'修改成功');
				$date=date('Y-m-d H:i:s'); 
				$sql_1="SELECT * FROM classDirector WHERE classid='$id' AND endtime='0000-00-00' AND userid='$classDirector'";
				$result_1=mysql_query($sql_1,$GLOBALS['con']);
				$row_1 = mysql_fetch_array($result_1);
				if(!$row_1){
					$sql_2="UPDATE classDirector SET endtime='$date' WHERE classid='$id' AND (endtime='0000-00-00' OR endtime  IS NULL)";
					$result_2=mysql_query($sql_2,$GLOBALS['con']);
					$sql_3="INSERT INTO classDirector (classid,userid,starttime) VALUES ('$id','$classDirector','$date');";
					$result_3=mysql_query($sql_3,$GLOBALS['con']);
					if($result_3){
					}else{
						$list['msg']='修改classDirector失败';
					}
				}
				
				$array=explode(',',$teacher);
				$leng=count($array);
				for($i=0;$i<$leng;$i++){
					$array[$i]=explode(':',$array[$i]);
				}
				$sql_4="SELECT * FROM teaching WHERE classid='$id' AND endtime='0000-00-00'";
				$result_4=mysql_query($sql_4,$GLOBALS['con']);
				$data=array();
				while($row_4 = mysql_fetch_array($result_4))
				{
					$one=array();
					$one['id']=$row_4['id'];
					$one['classid']=$row_4['classid'];
					$one['subjectid']=$row_4['subjectid'];
					$one['teacherid']=$row_4['teacherid'];
					array_push($data,$one);
				}
				$datalen=count($data);
				for($k=0;$k<$leng;$k++){
					for($j=0;$j<$datalen;$j++){
						if($data[$j]['subjectid']==$array[$k][0]){
							if($data[$j]['teacherid']!=$array[$k][1]){
								$teachingid=$data[$j]['id'];
								$sql_5="UPDATE teaching SET endtime='$date' WHERE id='$teachingid'";
								$result_5=mysql_query($sql_5,$GLOBALS['con']);
								
							}
						}
					}
					if($array[$k][1]!=""){
						$subjectid=$array[$k][0];
						$userid=$array[$k][1];
						$sql_6="INSERT INTO teaching (classid,subjectid,teacherid,starttime) VALUES ('$id','$subjectid','$userid','$date')";
						$result_6=mysql_query($sql_6,$GLOBALS['con']);
					}
				}
			}
		}
		
		$list=json_encode($list,JSON_UNESCAPED_UNICODE);
		echo $list;
	}
	mysql_close($con);
?>