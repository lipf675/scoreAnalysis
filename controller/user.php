<?php
	$con = mysql_connect("localhost","root","root");
	if (!$con){
  		die('Could not connect: ' . mysql_error());
  	}

	mysql_select_db("scoreanalysis", $con);
	$value=$_GET['a'];
	switch ($value){
		case 'all':
		userall();
		break;
		case 'list':
		userlist($_GET['limit'],$_GET['page']);
		break;
		case 'add':
		useradd($_POST['username'],$_POST['password'],$_POST['isAdmin']);
		break;
		case 'del':
		userdel($_POST['id']);
		break;
		case 'detail':
		userdetail($_POST['id']);
		break;
		case 'edit':
		useredit($_POST['id'],$_POST['username'],$_POST['password'],$_POST['isAdmin']);
		break;
	}
	function userall(){
		$sql="SELECT id,username,teaching FROM user";
		$result=mysql_query($sql,$GLOBALS['con']);
		if (!$result){
		  	die('Error: ' . mysql_error());
		  	$list=array('code'=>0,'msg'=>'加载失败');
		}else{
			$list=array('code'=>0,'msg'=>'','data'=>array());
			while($row = mysql_fetch_array($result))
			{
				$one=array();
				$one['id']=$row['id'];
				$one['username']=$row['username'];
				$one['teaching']=$row['teaching'];
				// $one['isClassDirector']=$row['isClassDirector'];
				array_push($list['data'],$one);
				// echo $row['FirstName'] . " " . $row['LastName'];
			 //  	echo "<br />";
			}
			$list=json_encode($list,JSON_UNESCAPED_UNICODE);
			echo $list;
		}
		
	}
	function userlist($limit,$page){
		$page--;
		$page*=10;
		$sql_0="SELECT * FROM user";
		$sql_1="SELECT user.*,class.classname,grade.gradename FROM user LEFT JOIN gradeDirector ON user.id=gradeDirector.userid and gradeDirector.endTime='0000-00-00' LEFT JOIN grade ON gradeDirector.gradeid=grade.id LEFT JOIN classDirector ON user.id=classDirector.userid and classDirector.endtime='0000-00-00' LEFT JOIN class ON classDirector.classid=class.id  limit $page,$limit";
		$result=mysql_query($sql_1,$GLOBALS['con']);
		if (!$result){
		  	die('Error: ' . mysql_error());
		  	$list=array('code'=>0,'msg'=>'列表加载失败');
		}else{
			$list=array('code'=>0,'msg'=>'','data'=>array());
			while($row = mysql_fetch_array($result))
			{
				$one=array();
				$one['number']=0;
				$one['id']=$row['id'];
				$one['username']=$row['username'];
				$one['isAdmin']=$row['isAdmin'];
				$one['isYearDirector']=$row['gradename'];
				$one['isClassDirector']=$row['classname'];
				$one['done']='';
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
	function useradd($username,$password,$isAdmin){
		$sql="INSERT INTO user (username,password,isAdmin) VALUES ('$username','$password','$isAdmin')";   	
		// $result=mysql_query($sql,$GLOBALS['con']);
		if (!mysql_query($sql,$GLOBALS['con']))
		  {
		  die('Error: ' . mysql_error());
		  $list=array('code'=>0,'msg'=>'添加失败');
		  }else{
		  	$list=array('code'=>1,'msg'=>'添加成功');
		  }
		
		$list=json_encode($list,JSON_UNESCAPED_UNICODE);
		echo $list;
	}
	function userdel($id){
		$sql="DELETE FROM user WHERE id=$id";   	
		if (!mysql_query($sql,$GLOBALS['con']))
		  {
		  die('Error: ' . mysql_error());
		  $list=array('code'=>0,'msg'=>'删除失败');
		  }else{
		  	$list=array('code'=>1,'msg'=>'删除成功');
		  }
		
		$list=json_encode($list,JSON_UNESCAPED_UNICODE);
		echo $list;
	}
	function userdetail($id){
		$sql="SELECT user.*,class.classname,grade.gradename FROM user LEFT JOIN gradeDirector ON user.id=gradeDirector.userid and gradeDirector.endTime='0000-00-00' LEFT JOIN grade ON gradeDirector.gradeid=grade.id LEFT JOIN classDirector ON user.id=classDirector.userid and classDirector.endtime='0000-00-00' LEFT JOIN class ON classDirector.classid=class.id WHERE user.id=$id";
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
				$one['password']=$row['password'];
				$one['isAdmin']=$row['isAdmin'];
				$one['isYearDirector']=$row['gradename'];
				$one['isClassDirector']=$row['classname'];
				$one['teacher']=array();
				$sql_0="SELECT teaching.*,class.classname,subject.subjectname FROM teaching LEFT JOIN class ON class.id=teaching.classid LEFT JOIN subject ON subject.id=teaching.subjectid WHERE teaching.teacherid='$id' and teaching.endtime='0000-00-00'";
				$result_0=mysql_query($sql_0,$GLOBALS['con']);
				if($result_0){
					while($row_0 = mysql_fetch_array($result_0))
					{
						$one_0=$row_0['classname'].$row_0['subjectname'];
						// echo $row_0['id'],$one_0;
						array_push($one['teacher'],$one_0);
					}
				}
				array_push($list['data'],$one);
			}

		}
		$list=json_encode($list,JSON_UNESCAPED_UNICODE);
		echo $list;
	}
	function useredit($id,$username,$password,$isAdmin){
		$sql="UPDATE user SET username='$username',password='$password',isAdmin='$isAdmin' WHERE id=$id";   	
		// $result=mysql_query($sql,$GLOBALS['con']);
		if (!mysql_query($sql,$GLOBALS['con']))
		  {
		  die('Error: ' . mysql_error());
		  $list=array('code'=>0,'msg'=>'编辑失败');
		  }else{
		  	$list=array('code'=>1,'msg'=>'编辑成功');
		  }
		
		$list=json_encode($list,JSON_UNESCAPED_UNICODE);
		echo $list;
	}
	mysql_close($con);
?>