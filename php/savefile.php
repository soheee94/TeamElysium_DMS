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

	function generateRandomString($length = 10) {
	    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
	    $charactersLength = strlen($characters);
	    $randomString = '';
	    for ($i = 0; $i < $length; $i++) {
	        $randomString .= $characters[rand(0, $charactersLength - 1)];
	    }
	    return $randomString;
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

		// file exists check
		$contents = ftp_nlist($conn_id, "/html/medical_document/");

		function encoding($s1, $s2, $arr) { // 배열 전체 인코딩
		    while (list($key, $val) = each($arr)) {
		        $arr[$key] = iconv($s1, $s2, $val);
		    }
		}
		encoding("UTF-8", "EUC-KR", $contents);

	    foreach ($file_ary as $file) {
	    	$filenamedb = $file["name"];
	    	$filename = iconv("UTF-8", "EUC-KR", $file["name"]);

			//[0] : code, [1] : name
			$dbfilename = explode("_", $filenamedb);
			//[0] : documentcode, [1] : version
			//$code = explode("(", $dbfilename[0]);
			$documentname = str_replace(".hwp", "", $dbfilename[1]);

			if(in_array("/html/medical_document/".$filename, $contents)){
				$randomString = generateRandomString(5);
				//[0]:filename [1]:filetype
				$FtpfilenameExplode = explode(".", $filename);
				$filename = $FtpfilenameExplode[0].$randomString.".".$FtpfilenameExplode[1];
				// $filenameArray[0] = $filenameArray[0]."_1";

				$filenameExplode = explode(".", $filenamedb);
				$filenamedb = $filenameExplode[0].$randomString.".".$filenameExplode[1];
			}

			$tmp_file = $file["tmp_name"];
			$remote_file = "/html/medical_document/". $filename;

			// upload a file
			if (ftp_put($conn_id, $remote_file, $tmp_file, FTP_BINARY)) {
				$filename = iconv("EUC-KR", "UTF-8", $file["name"]);

				$querycheck = mysqli_query($connection, "SELECT * FROM `dms_document` WHERE `c3_code` = '".$c3_code."' AND `name` = '".$documentname."' LIMIT 1");
				$querycountrows = mysqli_num_rows($querycheck);
				
				if($querycountrows == '1'){
					echo "It's a real name.\n";
				}
				else{
					$code = generateRandomString();
					$versioncode = generateRandomString();
					$result = mysqli_query($connection, "INSERT INTO `dms_document`(`code`, `c3_code`, `name`, `filename`, `date`, `registrant`) VALUES ('".$code."','".$c3_code."','".$documentname."','".$filenamedb."', now(), '".$registrant."')");

					if($result){
						mysqli_query($connection,"INSERT INTO `dms_documentVersion`(`code`, `document_code`, `registrant`, `version`, `file`, `date`) VALUES ('".$versioncode."','".$code."','".$registrant."','0','".$filenamedb."', now())");
						echo "successfully uploaded\n";
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