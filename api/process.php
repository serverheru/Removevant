<?php
/**
 * Removevant — Process API Endpoint
 * Handles image upload and triggers Python background removal
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

require_once __DIR__ . '/../config.php';

// Cleanup old files first
cleanupOldFiles(UPLOAD_DIR);
cleanupOldFiles(RESULT_DIR);

// Ensure directories exist
if (!is_dir(UPLOAD_DIR)) mkdir(UPLOAD_DIR, 0755, true);
if (!is_dir(RESULT_DIR)) mkdir(RESULT_DIR, 0755, true);

// Check file upload
if (!isset($_FILES['image'])) {
    jsonResponse(['success' => false, 'error' => 'Tidak ada file yang diupload'], 400);
}

$file = $_FILES['image'];

// Validate
$error = validateUpload($file);
if ($error !== null) {
    jsonResponse(['success' => false, 'error' => $error], 400);
}

// Get original file extension
$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
$inputFilename = generateFilename($ext);
$inputPath = UPLOAD_DIR . $inputFilename;

// Move uploaded file
if (!move_uploaded_file($file['tmp_name'], $inputPath)) {
    jsonResponse(['success' => false, 'error' => 'Gagal menyimpan file upload'], 500);
}

// Prepare output path (always PNG for transparency)
$outputFilename = pathinfo($inputFilename, PATHINFO_FILENAME) . '_nobg.png';
$outputPath = RESULT_DIR . $outputFilename;

// Build Python command
$pythonExe = PYTHON_EXE;
$script = PYTHON_SCRIPT;
$model = REMBG_MODEL;

$cmd = sprintf(
    '%s "%s" --input "%s" --output "%s" --model "%s"',
    escapeshellarg($pythonExe),
    $script,
    $inputPath,
    $outputPath,
    $model
);

// Add alpha matting flag if enabled
if (ALPHA_MATTING) {
    $cmd .= ' --alpha-matting';
}

// Execute Python script
$cmd .= ' 2>&1';
$output = shell_exec($cmd);

// Parse Python response
$result = json_decode($output, true);

if ($result === null) {
    // Python didn't return valid JSON — likely an error
    jsonResponse([
        'success' => false,
        'error' => 'Proses gagal. Pastikan Python dan rembg sudah terinstall.',
        'debug' => $output
    ], 500);
}

if (!$result['success']) {
    // Cleanup uploaded file on failure
    @unlink($inputPath);
    jsonResponse([
        'success' => false,
        'error' => $result['error'] ?? 'Unknown error'
    ], 500);
}

// Success!
jsonResponse([
    'success' => true,
    'original' => 'uploads/' . $inputFilename,
    'result' => 'results/' . $outputFilename,
    'filename' => $outputFilename,
    'processing_time' => $result['processing_time'] ?? 0,
    'original_size' => $result['input_size'] ?? [],
    'model' => $result['model'] ?? REMBG_MODEL
]);
