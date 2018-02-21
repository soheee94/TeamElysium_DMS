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

	$document_code = $_POST['document_code'];
	$registrant = $_POST['registrant'];

	$filename = $_FILES['file']['name'];

	//[0] : code, [1] : name
	$dbfilename = explode("_", $filename);


	//ftp login info
    $ftp_server = "igrus.mireene.com";  
    $ftp_user_name = "igrus";  
    $ftp_user_pass = "dkdlrmfntm123";  

	// set up basic connection
	$conn_id = ftp_connect($ftp_server);

	// login with username and password
	$login_result = ftp_login($conn_id, $ftp_user_name, $ftp_user_pass);

	$ftpfilename = iconv("UTF-8", "EUC-KR", $filename);
	$tmp_file = $_FILES['file']['tmp_name'];
	$remote_file = "/html/medical_document/". $ftpfilename;

	// upload a file
	if (ftp_put($conn_id, $remote_file, $tmp_file, FTP_BINARY)) {
		$result = mysqli_query($connection,"INSERT INTO `dms_documentVersion`(`code`, `document_code`, `registrant`, `version`, `file`, `date`) VALUES ('".$dbfilename[0]."','".$document_code."','".$registrant."','0','".$filename."', now())");

		if($result){
			mysqli_query($connection, "UPDATE `dms_documentVersion` SET `version`= IF(`code` != '".$dbfilename[0]."', `version`+1 , `version`) WHERE `document_code` = '".$document_code."'");
			mysqli_query($connection, "UPDATE `dms_document` SET `filename`= '".$filename."' WHERE `code` = '".$document_code."'");
		}

		else{
			echo "DB 등록 실패\n";
		}

	 	
	} else {
	 echo "There was a problem while uploading $file\n";
	}



 
?>