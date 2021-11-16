<?php

$url = $_GET["url"];
$auth = $_SERVER["PHP_AUTH_DIGEST"];
$verb = $_GET["verb"];
$data = file_get_contents('php://input');
$len =  strlen($data);

if ($auth == "")
  $auth = $_GET["auth"];

if ($verb == "")
  $verb="GET";

$header = array();
$header[] = 'Content-length: ' . $len; 
$header[] = 'Content-type: application/json';
$header[] = 'Authorization: ' . $auth;

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => $url,
  CURLOPT_HTTPHEADER => $header,
  CURLOPT_RETURNTRANSFER => 1, /* return string, do not print immediately */
  CURLOPT_FAILONERROR => 1,
  CURLOPT_TIMEOUT => 10, /* seconds */
  CURLOPT_CONNECTTIMEOUT => 5, /* seconds */
));

if ($verb !== "GET") {
  curl_setopt_array($curl, array(
    CURLOPT_CUSTOMREQUEST => $verb
  ));
  if ($len) {
    curl_setopt_array($curl, array(
      CURLOPT_POSTFIELDS => $data,
      CURLOPT_POST => 1,
    ));
  }
}

$resp = curl_exec($curl);

curl_close($curl);

if ($resp == "")
{
  if (curl_error($curl) == "") {
    header("HTTP/1.0 599 Connection Timeout");
    header('Content-Type: application/json; charset=UTF-8');
    die("Response timed out.  The target may not be up to be configured.</p>"
      . "<p>Close this dialog and retry later");
  } else
    throw new Exception('Curl error: ' . curl_error($crl));
} else {
  $err = curl_getinfo(curl, CURLINFO_RESPONSE_CODE);
  if ($err) {
    header("HTTP/1.0 " . $err . " Server Error");
    header('Content-Type: application/json; charset=UTF-8');
    print_r(json_encode(array('message' => $resp, 'code' => $err)));
  } else
    print_r($resp);
  }
?>
