<?php
/**
 * Removevant — Download API Endpoint
 * Serves processed images for download
 */

require_once __DIR__ . '/../config.php';

$filename = $_GET['file'] ?? '';

if (empty($filename)) {
    http_response_code(400);
    echo 'Parameter file diperlukan';
    exit;
}

// Sanitize filename — prevent directory traversal
$filename = basename($filename);
$filepath = RESULT_DIR . $filename;

if (!file_exists($filepath)) {
    http_response_code(404);
    echo 'File tidak ditemukan';
    exit;
}

// Verify it's a PNG file
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mimeType = finfo_file($finfo, $filepath);
finfo_close($finfo);

if ($mimeType !== 'image/png') {
    http_response_code(400);
    echo 'Tipe file tidak valid';
    exit;
}

// Serve file for download
$downloadName = 'removevant_' . $filename;
$fileSize = filesize($filepath);

header('Content-Type: image/png');
header('Content-Length: ' . $fileSize);
header('Content-Disposition: attachment; filename="' . $downloadName . '"');
header('Cache-Control: no-cache, must-revalidate');
header('Pragma: no-cache');

readfile($filepath);
exit;
