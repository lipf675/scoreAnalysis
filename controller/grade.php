<?php
	date_default_timezone_set("PRC");
	$con = mysql_connect("localhost","root","root");
	if (!$con){
  		die('Could not connect: ' . mysql_error());
  	}

	mysql_select_db("scoreanalysis", $con);
	$value=$_GET['a'];
	switch ($value){
		case "all":
		gradeall();
		break;
		case 'list':
		gradelist($_GET['limit'],$_GET['page']);
		break;
		case 'add':
		gradeadd($_POST['gradename'],$_POST['startdate'],$_POST['enddate'],$_POST['status'],$_POST['gradeDirector']);
		break;
		case 'del':
		gradedel($_POST['id']);
		break;
		case 'detail':
		gradedetail($_POST['id']);
		break;
		case 'edit':
		gradeedit($_POST['id'],$_POST['gradename'],$_POST['startdate'],$_POST['enddate'],$_POST['status'],$_POST['gradeDirector']);
		break;
	}
	function gradeall(){
		$sql="SELECT * FROM grade";
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
				$one['gradename']=$row['gradename'];
				array_push($list['data'],$one);
			}
			$list=json_encode($list,JSON_UNESCAPED_UNICODE);
			echo $list;
		}	
	}
	function gradelist($limit,$page){
		$page--;
		$page*=10;
		$sql_0="SELECT * FROM grade";
		$sql_1="SELECT grade.*,user.username,gradeDirector.endTime FROM grade LEFT JOIN gradeDirector ON grade.id=gradeDirector.gradeid LEFT JOIN user ON gradeDirector.userid=user.id WHERE gradeDirector.endTime IS NULL OR gradeDirector.endTime='0000-00-00' limit $page,$limit";
		$result=mysql_query($sql_1,$GLOBALS['con']);
		if (!$result){
		  	die('Error: ' . mysql_error());
		  	$list=array('code'=>0,'msg'=>'列表加载失败');
		}else{
			$list=array('code'=>0,'msg'=>'','data'=>array());
			while($row = mysql_fetch_array($result))
			{	
				// $list['count']++;
				// if(!$row['endTime']||$row['endTime']=='0000-00-00'){
					$one=array();
					$one['id']=$row['id'];
					$one['gradename']=$row['gradename'];
					$one['startdate']=$row['startdate'];
					$one['enddate']=$row['enddate'];
					if($row['status']==1){
						$one['grade']='一年级';
					}else if($row['status']==2){
						$one['grade']='二年级';
					}else if($row['status']==3){
						$one['grade']='三年级';
					}else{
						$one['grade']='已毕业';
					}
					$one['gradeDirector']=$row['username'];
					array_push($list['data'],$one);
				// }
			}
			$result1=mysql_query($sql_0,$GLOBALS['con']);
			if (!$result1){
			  	die('Error: ' . mysql_error());
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
	function gradeadd($name,$startdate,$enddate,$status,$gradeDirector){
		$sql_0="SELECT gradeDirector.*,user.username FROM gradeDirector LEFT JOIN user ON gradeDirector.userid=user.id WHERE user.id=$gradeDirector and gradeDirector.endTime='0000-00-00'";
		$result_0=mysql_query($sql_0,$GLOBALS['con']);
		$row=mysql_fetch_array($result_0);
		if($row){
			
			if($row['username']!=""){
				$list=array('code'=>0,'msg'=>'添加失败，'.$row['username'].'已经是其他年级的年级主任');
			}
			// echo json_encode($row,JSON_UNESCAPED_UNICODE);
		}else{
			$sql="INSERT INTO grade (gradename,startdate,enddate,status) VALUES ('$name','$startdate','$enddate','$status');";   	
			$result=mysql_query($sql,$GLOBALS['con']);
			if (!$result)
			{
			  die('Error: ' . mysql_error());
			  $list=array('code'=>0,'msg'=>'添加失败');
			}else{
			  	$id=mysql_insert_id(); 
			  	$date=date('Y-m-d H:i:s');
			  	//$sql_1="UPDATE gradeDirector SET endTime='$date' WHERE gradeid=$id and endTime='0000-00-00'";
			  	//$result_1=mysql_query($sql_1,$GLOBALS['con']);
			  	$sql_2="INSERT INTO gradeDirector (gradeid,userid,startTime) VALUES ('$id','$gradeDirector','$date')";
			  	$result_2=mysql_query($sql_2,$GLOBALS['con']);
			  	// if(!$result_1){
			  	// 	$list['endmsg']='未成功';
			  	// }
			  	if(!$result_2){
			  		$list['startmsg']='未成功';
			  	}
			  	$list=array('code'=>1,'msg'=>'添加成功');
			}
		}	
		$list=json_encode($list,JSON_UNESCAPED_UNICODE);
		echo $list;
	}
	function gradedel($id){
		$sql_0="SELECT id FROM class WHERE gradeid='$id";
		$result_0=mysql_query($sql_0,$GLOBALS['con']);
		if(!$result_0){
			$sql="DELETE FROM gradeDirector WHERE gradeid=$id;"; 	
			if (!mysql_query($sql,$GLOBALS['con'])){
			  	die('Error: ' . mysql_error());
			  	$list=array('code'=>0,'msg'=>'删除失败');
			}else{
			  	$sql_0="DELETE FROM grade WHERE id=$id;";
			  	$result_0=mysql_query($sql_0,$GLOBALS['con']);
			  	if($result_0){
			  		$list=array('code'=>1,'msg'=>'删除成功');
			  	}
			  	
			}
		
		}else{
			$list=array('code'=>0,'msg'=>'请先删除其下的班级');
		}
		$list=json_encode($list,JSON_UNESCAPED_UNICODE);
		echo $list;
	}
	function gradedetail($id){
		$sql="SELECT grade.*,user.username,gradeDirector.endTime FROM grade LEFT JOIN gradeDirector ON grade.id=gradeDirector.gradeid LEFT JOIN user ON gradeDirector.userid=user.id WHERE (gradeDirector.endTime IS NULL OR gradeDirector.endTime='0000-00-00') and grade.id=$id";
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
				$one['gradename']=$row['gradename'];
				$one['startdate']=$row['startdate'];
				$one['enddate']=$row['enddate'];
				if($row['status']==1){
					$one['grade']='一年级';
				}else if($row['status']==2){
					$one['grade']='二年级';
				}else if($row['status']==3){
					$one['grade']='三年级';
				}else{
					$one['grade']='已毕业';
				}
				$one['gradeDirector']=$row['username'];
				array_push($list['data'],$one);	
			}
		}
		$list=json_encode($list,JSON_UNESCAPED_UNICODE);
		echo $list;
	}
	function gradeedit($id,$gradename,$startdate,$enddate,$status,$gradeDirector){
		$sql_0="SELECT gradeDirector.*,user.username FROM gradeDirector LEFT JOIN user ON gradeDirector.userid=user.id WHERE user.id=$gradeDirector and gradeDirector.endTime='0000-00-00' and gradeDirector.gradeid!=$id";
		$result_0=mysql_query($sql_0,$GLOBALS['con']);
		$row=mysql_fetch_array($result_0);
		if($row){
			
			if($row['username']!=""){
				$list=array('code'=>0,'msg'=>'添加失败，'.$row['username'].'已经是其他年级的年级主任');
			}
		}else{
			$sql="UPDATE grade SET gradename='$gradename',startdate='$startdate',enddate='$enddate',status=$status WHERE id=$id;";   	
			$date=date('Y-m-d H:i:s');
			$sql_3="SELECT id FROM gradeDirector WHERE userid='$gradeDirector' and endTime='0000-00-00' and gradeid='$id'";
			$sql_2="UPDATE gradeDirector SET endTime='$date' WHERE gradeid=$id;";	
			$sql_1="INSERT INTO gradeDirector  (gradeid,userid,startTime) VALUES ('$id','$gradeDirector','$date')";
			// $sql_2="SELECT userid FROM gradeDirector WHERE gradeid=$id and endTime='';";
			// $result_2=mysql_query($sql_2,$GLOBALS['con']);
			$result=mysql_query($sql,$GLOBALS['con']);
			$result_3=mysql_query($sql_3,$GLOBALS['con']);
			$row=mysql_fetch_array($result_0);
			if(!$row){
				$result_2=mysql_query($sql_2,$GLOBALS['con']);
				$result_1=mysql_query($sql_1,$GLOBALS['con']);	
			}
			if ($result)
			{
			  	$list=array('code'=>1,'msg'=>'修改成功');
			  
			}else{
			  	die('Error: ' . mysql_error());
			  	$list=array('code'=>0,'msg'=>'修改失败');
			}
		}
		 
		
		$list=json_encode($list,JSON_UNESCAPED_UNICODE);
		echo $list;
	}
	function userall(){
		$sql_0="SELECT userid FROM gradeDirector WHERE gradeDirector.endTime='0000-00-00'";
		$sql="SELECT * FROM user";
		$result_0=mysql_query($sql_0,$GLOBALS['con']);
		$result=mysql_query($sql,$GLOBALS['con']);
		if($result_0){
			$gradeDirector = array();
			while($row_0 = mysql_fetch_array($result_0))
			{			
				$userid=$row_0['userid'];
				array_push($gradeDirector,$userid);
			}
		}
		if (!$result){
		  	die('Error: ' . mysql_error());
		  	$list=array('code'=>0,'msg'=>'加载失败');
		}else{
			$list=array('code'=>0,'msg'=>'','data'=>array());
			while($row = mysql_fetch_array($result))
			{
				$leng=count($gradeDirector);
				$one=array();
				$one['id']=$row['id'];
				$one['username']=$row['username'];
				$one['teaching']=$row['teaching'];
				for($i=0;$i<$leng;$i++){
					if($row['id']==$gradeDirector[$i]){
						$one=0;
					}
				}
				if($one!=0){
					array_push($list['data'],$one);
				}
			}
			$list=json_encode($list,JSON_UNESCAPED_UNICODE);
			echo $list;
		}	
	}
	mysql_close($con);
?>