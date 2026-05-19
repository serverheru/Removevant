<?php
/**
 * Removevant — Configuration
 * Background Removal Web Application
 */

// ─── Paths ───────────────────────────────────────────────
define('BASE_DIR', __DIR__);
define('UPLOAD_DIR', BASE_DIR . '/uploads/');
define('RESULT_DIR', BASE_DIR . '/results/');
define('PYTHON_SCRIPT', BASE_DIR . '/python/remove_bg.py');

// Python executable — uses venv if available, else system Python
$venvPython = BASE_DIR . '/python/venv/Scripts/python.exe';
define('PYTHON_EXE', file_exists($venvPython) ? $venvPython : 'python');

// ─── Upload Settings ─────────────────────────────────────
define('MAX_FILE_SIZE', 20 * 1024 * 1024); // 20MB
define('ALLOWED_TYPES', ['image/jpeg', 'image/png', 'image/webp']);
define('ALLOWED_EXTENSIONS', ['jpg', 'jpeg', 'png', 'webp']);

// ─── Processing Settings ─────────────────────────────────
define('REMBG_MODEL', 'birefnet-general'); // Best quality model
define('ALPHA_MATTING', true);             // Better edge detail (hair, fur)
define('CLEANUP_AGE', 3600);              // Auto-delete files older than 1 hour (seconds)

// ─── Helpers ─────────────────────────────────────────────
/**
 * Generate a unique filename with timestamp
 */
function generateFilename(string $extension): string {
    return date('Ymd_His') . '_' . bin2hex(random_bytes(4)) . '.' . $extension;
}

/**
 * Clean up old files in a directory
 */
function cleanupOldFiles(string $directory, int $maxAge = CLEANUP_AGE): void {
    if (!is_dir($directory)) return;
    
    $files = glob($directory . '*');
    $now = time();
    
    foreach ($files as $file) {
        if (is_file($file) && basename($file) !== '.gitkeep') {
            if ($now - filemtime($file) > $maxAge) {
                @unlink($file);
            }
        }
    }
}

/**
 * Return a JSON response
 */
function jsonResponse(array $data, int $statusCode = 200): void {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

/**
 * Validate uploaded file
 */
function validateUpload(array $file): ?string {
    if ($file['error'] !== UPLOAD_ERR_OK) {
        $errors = [
            UPLOAD_ERR_INI_SIZE   => 'File terlalu besar (melebihi batas server)',
            UPLOAD_ERR_FORM_SIZE  => 'File terlalu besar (melebihi batas form)',
            UPLOAD_ERR_PARTIAL    => 'File hanya terupload sebagian',
            UPLOAD_ERR_NO_FILE    => 'Tidak ada file yang diupload',
            UPLOAD_ERR_NO_TMP_DIR => 'Folder temporary tidak ditemukan',
            UPLOAD_ERR_CANT_WRITE => 'Gagal menulis file ke disk',
        ];
        return $errors[$file['error']] ?? 'Error upload tidak diketahui';
    }

    if ($file['size'] > MAX_FILE_SIZE) {
        return 'Ukuran file melebihi batas ' . (MAX_FILE_SIZE / 1024 / 1024) . 'MB';
    }

    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);

    if (!in_array($mimeType, ALLOWED_TYPES)) {
        return 'Tipe file tidak didukung. Gunakan JPG, PNG, atau WebP';
    }

    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($ext, ALLOWED_EXTENSIONS)) {
        return 'Ekstensi file tidak didukung';
    }

    return null; // No error
}
