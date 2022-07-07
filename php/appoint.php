<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');


$driver = json_decode(file_get_contents('php://input'), true);

//добавить условие сравнения токена от юзера и значение из базы 


$data_base_name = "driver_telegram_bot"; $host = "localhost"; $data_base_user = "root"; $pass ="";
$connect = mysqli_connect ($host, $data_base_user, $pass, $data_base_name) or die (mysqli_error($connect)); 
If ($connect != TRUE) { exit (mysqli_error ($connect));} // если подключение не работает - делаем выход
if ($driver){
	$connect->query ("UPDATE `users` SET `status`='in_processing', `current_shipment`='{$driver['current_shipment']}' WHERE `user_id`='{$driver['driver_id']}'");
	$connect->query ("UPDATE `shipments` SET `user`='{$driver['driver_id']}', `driver`='{$driver['driver_full_name']}',`status`='in_processing' WHERE `shipment`='{$driver['current_shipment']}'");
	
	$response = [
		"response"=>"True",
	];
	echo json_encode($response);
	
}