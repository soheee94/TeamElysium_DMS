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
	$filenameArray = explode("_", $filename);

	//ftp login info
    $ftp_server = "igrus.mireene.com";  
    $ftp_user_name = "igrus";  
    $ftp_user_pass = "dkdlrmfntm123";  

	// set up basic connection
	$conn_id = ftp_connect($ftp_server);

	// login with username and password
	$login_result = ftp_login($conn_id, $ftp_user_name, $ftp_user_pass);

	// file exists check
	$contents = ftp_nlist($conn_id, "/html/medical_document/");

	function encoding($s1, $s2, $arr) { // 배열 전체 인코딩
	    while (list($key, $val) = each($arr)) {
	        $arr[$key] = iconv($s1, $s2, $val);
	    }
	}

	function generateRandomString($length = 10) {
	    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	    $charactersLength = strlen($characters);
	    $randomString = '';
	    for ($i = 0; $i < $length; $i++) {
	        $randomString .= $characters[rand(0, $charactersLength - 1)];
	    }
	    return $randomString;
	}

	encoding("UTF-8", "EUC-KR", $contents);

	$ftpfilename = iconv("UTF-8", "EUC-KR", $filename);

	if(in_array("/html/medical_document/".$ftpfilename, $contents)){
		//[0]:filename [1]:filetype
		$randomString = generateRandomString(5);
		$FtpfilenameExplode = explode(".", $ftpfilename);
		$ftpfilename = $FtpfilenameExplode[0].$randomString.".".$FtpfilenameExplode[1];
		// $filenameArray[0] = $filenameArray[0]."_1";

		$filenameExplode = explode(".", $filename);
		$filename = $filenameExplode[0].$randomString.".".$filenameExplode[1];
	}
	
	$tmp_file = $_FILES['file']['tmp_name'];
	$remote_file = "/html/medical_document/". $ftpfilename;

	$code = generateRandomString();
	// upload a file
	if (ftp_put($conn_id, $remote_file, $tmp_file, FTP_BINARY)) {
		$result = mysqli_query($connection,"INSERT INTO `dms_documentVersion`(`code`, `document_code`, `registrant`, `version`, `file`, `date`) VALUES ('".$code."','".$document_code."','".$registrant."','0','".$filename."', now())");

		if($result){
			mysqli_query($connection, "UPDATE `dms_documentVersion` SET `version`= IF(`code` != '".$code."', `version`+1 , `version`) WHERE `document_code` = '".$document_code."'");
			mysqli_query($connection, "UPDATE `dms_document` SET `filename`= '".$filename."' WHERE `code` = '".$document_code."'");
		}

		else{
			echo "Failed Insert DB\n";
		}

	 	
	} else {
	 echo "There was a problem while uploading $file\n";
	}



 
?>