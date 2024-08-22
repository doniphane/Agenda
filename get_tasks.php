<?php
require 'config.php';

if (isset($_GET['date'])) {
    $date = $_GET['date'];

    $stmt = $pdo->prepare("SELECT * FROM tasks WHERE task_date = :task_date");
    $stmt->bindParam(':task_date', $date);
    $stmt->execute();
    $tasks = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($tasks);
} else {
    echo json_encode([]);
}
?>
