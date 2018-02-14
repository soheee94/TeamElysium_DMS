<?php

header("Content-Type:application/json; charset=utf-8");
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT');

header("Content-Type: text/html; charset=UTF-8");
header("Pragma: public"); // required 
header("Expires: 0"); 
header("Cache-Control: must-revalidate, post-check=0, pre-check=0"); 
header("Cache-Control: private",false); // required for certain browsers 
header("Content-Type: $ctype"); 
header("Content-Transfer-Encoding: binary");

include '../include/Config.php';
$connection = mysqli_connect(DB_HOST,DB_USER,DB_PASSWORD,DB_DATABASE);

$filename = iconv('UTF-8', 'EUC-KR', $_POST['filename']);
// $filename = $_POST['filename'];
$file = '/html/medical_document/'.$filename;
$code = $_POST['code'];

echo $filename;

//ftp login info
$ftp_server = "igrus.mireene.com";  
$ftp_user_name = "igrus";  
$ftp_user_pass = "dkdlrmfntm123";

// set up basic connection
$conn_id = ftp_connect($ftp_server);

// login with username and password
$login_result = ftp_login($conn_id, $ftp_user_name, $ftp_user_pass);

// try to delete $file
if (ftp_delete($conn_id, $file)) {
	$result = mysqli_query($connection, "DELETE FROM `dms_document` WHERE `code` = '".$code."'");
	if($result){
		echo "deleted successful\n";
	}
	else{
		echo "could not delete DB\n";
	}
	
} else {
	echo "could not delete $file\n";
}

// close the connection
ftp_close($conn_id);

?>