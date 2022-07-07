<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');


$point = json_decode(file_get_contents('php://input'), true);

//добавить условие сравнения токена от юзера и значение из базы 


$data_base_name = "driver_telegram_bot"; $host = "localhost"; $data_base_user = "root"; $pass ="";
$connect = mysqli_connect ($host, $data_base_user, $pass, $data_base_name) or die (mysqli_error($connect)); 
If ($connect != TRUE) { exit (mysqli_error ($connect));} // если подключение не работает - делаем выход
if ($point){
	$connect->query ("INSERT INTO `points`(`PointName`, `Adress`, `Coordinates`) VALUES ('{$point['PointName']}','{$point['Adress']}','{$point['Coordinates']}')");
	$response = [
		"response"=>"True",
	];
	echo json_encode($response);
}
