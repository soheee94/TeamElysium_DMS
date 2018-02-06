<?php

/**
 * @author Ravi Tamada
 * @link http://www.androidhive.info/2012/01/android-login-and-registration-with-php-mysql-and-sqlite/ Complete tutorial
 */

header("Content-Type:application/json; charset=utf-8");
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT');

Header("Content-type: file/unknown");
Header("Content-Disposition: attachment; filename=$value");
Header("Content-Description: PHP3 Generated Data");
header("Pragma: no-cache");
header("Expires: 0");

include '../include/Config.php';
$filename = $_POST['filename'];
$filename = urlencode(iconv('UTF-8', 'EUC-KR', $filename));

echo $filename;



?>