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

$CategoryStep = $_POST['CategoryStep'];
$code = $_POST['code'];

if($CategoryStep == '1'){
	$result = mysqli_query($connection,"UPDATE `dms_category1` SET `name`='".$modifyCategoryName."' WHERE `code` = '".$code."'");
}
else if($CategoryStep == '2'){
	$result = mysqli_query($connection,"UPDATE `dms_category2` SET `name`='".$modifyCategoryName."' WHERE `code` = '".$code."'");
}
else if($CategoryStep == '3'){
	$result = mysqli_query($connection,"UPDATE `dms_category3` SET `name`='".$modifyCategoryName."' WHERE `code` = '".$code."'");
}


if(!$result){
	$response["error"] = TRUE;
	$response["error_msg"] = "Result occured error!";
    echo json_encode($response);
}


?>