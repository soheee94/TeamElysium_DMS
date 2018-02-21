<?php

/**
 * @author Ravi Tamada
 * @link http://www.androidhive.info/2012/01/android-login-and-registration-with-php-mysql-and-sqlite/ Complete tutorial
 */
header("Content-Type:application/json; charset=utf-8");
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT');

include '../include/Config.php';
$connection = mysqli_connect(DB_HOST,DB_USER,DB_PASSWORD,DB_DATABASE);
$code = $_POST['code'];

$return_arr = Array();

$result = mysqli_query($connection,"SELECT * FROM `dms_documentVersion` WHERE `document_code` = '".$code."'");

while ($row = mysqli_fetch_array($result)) {
	$row_array['registrant'] = $row['registrant'];
	$row_array['code'] = $row['code'];
	$row_array['file'] = urlencode(iconv('UTF-8', 'EUC-KR', $row['file']));
	$row_array['encodefilename'] = $row['file'];
	$row_array['document_code'] = $code;
	$row_array['version'] =  $row['version'];
	
	array_push($return_arr,$row_array);
}

echo json_encode($return_arr,JSON_UNESCAPED_UNICODE);

if(!$result){
	$response["error"] = TRUE;
	$response["error_msg"] = "Result occured error!";
    echo json_encode($response);
}

?>