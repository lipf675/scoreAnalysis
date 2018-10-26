<?php
	$con = mysql_connect("localhost","root","root");
	if (!$con){
  		die('Could not connect: ' . mysql_error());
  	}

	mysql_select_db("scoreanalysis", $con);
	$value=$_GET['a'];
	switch ($value){
		case "all":
		subjectall();
		break;
		case 'list':
		subjectlist($_GET['limit'],$_GET['page']);
		break;
		case 'add':
		subjectadd($_POST['subjectname']);
		break;
		case 'del':
		subjectdel($_POST['id']);
		break;
		case 'detail':
		subjectdetail($_POST['id']);
		break;
		case 'edit':
		subjectedit($_POST['id'],$_POST['subjectname']);
		break;
	}
	function subjectall(){
		$sql="SELECT * FROM subject";
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
				$one['subjectname']=$row['subjectname'];
				array_push($list['data'],$one);
			}
			$list=json_encode($list,JSON_UNESCAPED_UNICODE);
			echo $list;
		}
		
	}
	function subjectlist($limit,$page){
		$page--;
		$page*=10;
		$sql_0="SELECT * FROM subject";
		$sql_1="SELECT * FROM subject limit $page,$limit";
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
				$one['subjectname']=$row['subjectname'];
				$one['done']='';
				array_push($list['data'],$one);
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
	function subjectadd($name){
		$sql="INSERT INTO subject (subjectname) VALUES ('$name')";   	
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
	function subjectdel($id){
		$sql="DELETE FROM subject WHERE id=$id";   	
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
	function subjectdetail($id){
		$sql="SELECT * FROM subject WHERE id=$id";
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
				$one['subjectname']=$row['subjectname'];
				array_push($list['data'],$one);
				
			}

		}
		$list=json_encode($list,JSON_UNESCAPED_UNICODE);
		echo $list;
	}
	function subjectedit($id,$subjectname){
		$sql="UPDATE subject SET subjectname='$subjectname' WHERE id=$id";   	
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
	mysql_close($con);
?>