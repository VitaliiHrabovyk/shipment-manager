<?php
	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Headers: *");
	
    $data_base_name = "driver_telegram_bot"; $host = "localhost"; $data_base_user = "root"; $pass ="";
    
    $connect = mysqli_connect ($host, $data_base_user, $pass, $data_base_name) or die (mysqli_error($connect)); // инициируем подключение
    If ($connect != TRUE) { exit (mysqli_error ($connect));} // если подключение не работает - делаем выход
    $shipments = $connect->query ("SELECT * FROM `shipments` ORDER BY `time_loading` DESC");
	
	$data = array();
	
	foreach ($shipments as $str){
		$data[] = $str;
	}
	echo json_encode($data);

?>


