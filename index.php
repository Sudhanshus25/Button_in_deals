<?php
// Log Bitrix24 POST data for debugging (optional)
if (!empty($_POST)) {
    file_put_contents("debug.log", print_r($_POST, true), FILE_APPEND);
}

// Always serve index.html
readfile("index.html");
?>
