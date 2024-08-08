// update_data.php
<?php
header('Content-Type: application/json');

// Get the JSON input
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Path to your data file
$dataFile = 'data.json';

// Read existing data
if (file_exists($dataFile)) {
    $existingData = json_decode(file_get_contents($dataFile), true);
} else {
    $existingData = [];
}

// Handle different actions
if ($data['action'] === 'add') {
    // Add new data
    $existingData[] = $data['data'];
} elseif ($data['action'] === 'update') {
    // Update existing data
    foreach ($existingData as &$event) {
        if ($event['Bale Number'] === $data['data']['Bale Number']) {
            $event = $data['data'];
        }
    }
}

// Save the updated data
file_put_contents($dataFile, json_encode($existingData, JSON_PRETTY_PRINT));

// Send response
echo json_encode(['status' => 'success']);
?>
