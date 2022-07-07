<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization');


$user = json_decode(file_get_contents('php://input'), true);

// db params
$data_base_name = "driver_telegram_bot"; $host = "localhost"; $data_base_user = "root"; $pass ="";
$connect = mysqli_connect ($host, $data_base_user, $pass, $data_base_name) or die (mysqli_error($connect)); 
If ($connect != TRUE) { exit (mysqli_error ($connect));} // если подключение не работает - делаем выход
$admins = $connect->query ("SELECT * FROM `admins` WHERE  `email`='{$user['email']}'");

$data = array();
foreach ($admins as $str){
    $data[] = $str;
}
$data = $data[0]; 
$email = $data['email'];
$pass = $data['password'];
$token = $data['token'];
$tokenExp = $data['tokenExp'];

$now = time();
$tokenExpDate = $now+3600;

$generated_token = bin2hex(random_bytes(30));
// echo ($generated_token);

$auth = Array (
    "auth" => "true",
    "token" => $generated_token,
    "tokenExpDate" => $tokenExpDate,
);

if ($user['email'] == $email and $user['password']==$pass){
    echo json_encode($auth);
    $connect->query ("UPDATE `admins` SET `token`='{$generated_token}',`tokenExp`='{$now}' WHERE  `email`='{$user['email']}'");
} 

?>