<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');


$point = json_decode(file_get_contents('php://input'), true);

/* $point = [
'comment' => "1",
'loadDate' =>  "2022-02-02",
'loadPoint' =>  "PG, Pokrov",
'loadTime' =>  "18:00",
'shipment' =>  "1456",
'upLoadPoint' =>  "PG, Pokrov",
'uploadDate' =>  "2022-02-02",
'uploadTime' =>  "20:22",
];
 */

//добавить условие сравнения токена от юзера и значение из базы 

if ($point){

$data_base_name = "driver_telegram_bot"; $host = "localhost"; $data_base_user = "root"; $pass ="";
$connect = mysqli_connect ($host, $data_base_user, $pass, $data_base_name) or die (mysqli_error($connect)); 
If ($connect != TRUE) { exit (mysqli_error ($connect));} // если подключение не работает - делаем выход

//get loading point

$points = $connect->query ("SELECT * FROM `points` WHERE  `PointName`='{$point['loadPoint']}'");

$loadPoint = array();

		foreach ($points as $str){$loadPoint[] = $str;}
		
	$loadPoint = $loadPoint[0]; 
	$LoadingAdress = $loadPoint['Adress'];
	$LoadingCoordinates = $loadPoint['Coordinates'];


//get uploading point

$points = $connect->query ("SELECT * FROM `points` WHERE  `PointName`='{$point['upLoadPoint']}'");

$loadPoint = array();

		foreach ($points as $str){$loadPoint[] = $str;}

	$loadPoint = $loadPoint[0]; 
	$UpLoadingAdress = $loadPoint['Adress'];
	$UpLoadingCoordinates = $loadPoint['Coordinates'];


	//transform srting Date/Time to Unix stamp
	$time_loading = strtotime("{$point['loadDate']} {$point['loadTime']}")-3600; // Time Zone Correction
	$time_uploading = strtotime("{$point['uploadDate']} {$point['uploadTime']}")-3600; // Time Zone Correction


	$res = $connect->query ("INSERT INTO `shipments`(`shipment`, `adress_loading`, `adress_uploading`, `time_loading`, `time_uploading`, `coordinates_loading`, `coordinates_uploading`, `status`, `comment`) 
	VALUES (
	'{$point['shipment']}',
	'{$LoadingAdress}',
	'{$UpLoadingAdress}',
	'{$time_loading}',
	'{$time_uploading}',
	'{$LoadingCoordinates}',
	'{$UpLoadingCoordinates}',
	'open',
	'{$point['comment']}')");
	

		$response = [
		"response"=>"True",
		];
	echo json_encode($response);

	
}


