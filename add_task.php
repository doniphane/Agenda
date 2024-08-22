<?php
require 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $task_date = $_POST['task_date'];
    $task_text = $_POST['task_text'];

    $stmt = $pdo->prepare("INSERT INTO tasks (task_date, task_text) VALUES (:task_date, :task_text)");
    $stmt->bindParam(':task_date', $task_date);
    $stmt->bindParam(':task_text', $task_text);
    $stmt->execute();

    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
}
?>
