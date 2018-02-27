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

$upperCategoryCode = $_POST['upperCategoryCode'];
$CategoryStep = $_POST['CategoryStep'];
$categoryName = $_POST['categoryName'];
$code = $_POST['code'];

if($CategoryStep == '1'){
	$result = mysqli_query($connection,"INSERT INTO `dms_category1`(`code`, `name`) VALUES ('".$code."','".$categoryName."')");
}
else if($CategoryStep == '2'){
	$result = mysqli_query($connection,"INSERT INTO `dms_category2`(`code`, `c1_code`, `name`) VALUES ('".$code."','".$upperCategoryCode."','".$categoryName."')");
}
else if($CategoryStep == '3'){
	$result = mysqli_query($connection,"INSERT INTO `dms_category3`(`code`, `c2_code`, `name`) VALUES ('".$code."','".$upperCategoryCode."','".$categoryName."')");
}


if(!$result){
	$response["error"] = TRUE;
	$response["error_msg"] = "Result occured error!";
    echo json_encode($response);
}


?>