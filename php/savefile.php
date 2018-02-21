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
	$c3_code = $_POST['c3_code'];
	$registrant = $_POST['registrant'];

    //multiFile array seperation
    function reArrayFiles(&$file_post) {
	    $file_ary = array();
	    $file_count = count($file_post['name']);
	    $file_keys = array_keys($file_post);

	    for ($i=0; $i<$file_count; $i++) {
	        foreach ($file_keys as $key) {
	            $file_ary[$i][$key] = $file_post[$key][$i];
	        }
	    }
	    return $file_ary;
	}

	if ($_FILES['file']) {
	    $file_ary = reArrayFiles($_FILES['file']);

	    //ftp login info
	    $ftp_server = "igrus.mireene.com";  
	    $ftp_user_name = "igrus";  
	    $ftp_user_pass = "dkdlrmfntm123";  

		// set up basic connection
		$conn_id = ftp_connect($ftp_server);

		// login with username and password
		$login_result = ftp_login($conn_id, $ftp_user_name, $ftp_user_pass);

	    foreach ($file_ary as $file) {
	    	$filenamedb = $file["name"];
	    	$filename = iconv("UTF-8", "EUC-KR", $file["name"]);
			$tmp_file = $file["tmp_name"];
			$remote_file = "/html/medical_document/". $filename;

			//[0] : code, [1] : name
			$dbfilename = explode("_", $filenamedb);
			//[0] : documentcode, [1] : version
			$code = explode("(", $dbfilename[0]);
			$documentname = str_replace(".hwp", "", $dbfilename[1]);

			// upload a file
			if (ftp_put($conn_id, $remote_file, $tmp_file, FTP_BINARY)) {
				$filename = iconv("EUC-KR", "UTF-8", $file["name"]);

				$querycheck = mysqli_query($connection, "SELECT * FROM `dms_document` WHERE `c3_code` = '".$c3_code."' AND `name` = '".$documentname."' LIMIT 1");
				$querycountrows = mysqli_num_rows($querycheck);
				
				if($querycountrows == '1'){
					echo "존재하는 이름입니다.\n";
				}
				else{
					$result = mysqli_query($connection, "INSERT INTO `dms_document`(`code`, `c3_code`, `name`, `filename`) VALUES ('".$code[0]."','".$c3_code."','".$documentname."','".$filenamedb."')");

					if($result){
						mysqli_query($connection,"INSERT INTO `dms_documentVersion`(`code`, `document_code`, `registrant`, `version`, `file`, `date`) VALUES ('".$dbfilename[0]."','".$code[0]."','".$registrant."','0','".$filenamedb."', now())");
						echo "successfully uploaded $filename\n";
					}
				}
			 	
			} else {
			 echo "There was a problem while uploading $file\n";
			}
	    }

		// close the connection
		ftp_close($conn_id);
	}
 
?>