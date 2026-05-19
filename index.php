<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Removevant — AI Background Remover HD</title>
    <meta name="description" content="Hapus background gambar secara otomatis dengan kualitas HD menggunakan AI BiRefNet. Gratis, cepat, dan detail.">
    
    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>✂️</text></svg>">

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">

    <!-- Stylesheet -->
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <!-- Animated Background -->
    <div class="bg-grid"></div>
    <div class="bg-glow bg-glow-1"></div>
    <div class="bg-glow bg-glow-2"></div>
    <div class="bg-glow bg-glow-3"></div>

    <!-- Header / Navigation -->
    <header class="header" id="header">
        <div class="container">
            <a href="/" class="logo" id="logo">
                <div class="logo-icon">
                    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2" y="2" width="28" height="28" rx="8" fill="url(#logoGrad)" opacity="0.15"/>
                        <path d="M10 16L14 20L22 12" stroke="url(#logoGrad)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <defs>
                            <linearGradient id="logoGrad" x1="2" y1="2" x2="30" y2="30">
                                <stop stop-color="#7c3aed"/>
                                <stop offset="1" stop-color="#06b6d4"/>
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                <span class="logo-text">Remove<span class="logo-accent">vant</span></span>
            </a>
            <nav class="nav">
                <span class="nav-badge" id="modelBadge">
                    <span class="badge-dot"></span>
                    BiRefNet AI
                </span>
            </nav>
        </div>
    </header>

    <!-- Main Content -->
    <main class="main">
        <!-- Hero Section -->
        <section class="hero" id="hero">
            <div class="container">
                <div class="hero-badge">
                    <span class="hero-badge-icon">⚡</span>
                    Powered by BiRefNet AI Engine
                </div>
                <h1 class="hero-title" id="heroTitle">
                    Hapus Background
                    <span class="gradient-text">Dengan Presisi HD</span>
                </h1>
                <p class="hero-subtitle" id="heroSubtitle">
                    Upload gambar Anda dan biarkan AI BiRefNet menghapus background dengan detail rambut, bulu, dan edge yang sempurna. Tidak perlu skill editing.
                </p>
            </div>
        </section>

        <!-- Upload Section -->
        <section class="upload-section" id="uploadSection">
            <div class="container">
                <div class="upload-card glass-card" id="uploadCard">
                    <!-- Drop Zone -->
                    <div class="dropzone" id="dropzone">
                        <div class="dropzone-content" id="dropzoneContent">
                            <div class="dropzone-icon" id="dropzoneIcon">
                                <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="4" y="4" width="56" height="56" rx="16" stroke="url(#uploadGrad)" stroke-width="2" stroke-dasharray="6 4" opacity="0.5"/>
                                    <path d="M32 20V44M20 32L32 20L44 32" stroke="url(#uploadGrad)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    <defs>
                                        <linearGradient id="uploadGrad" x1="4" y1="4" x2="60" y2="60">
                                            <stop stop-color="#7c3aed"/>
                                            <stop offset="1" stop-color="#06b6d4"/>
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                            <p class="dropzone-text">
                                <span class="dropzone-primary">Drag & drop gambar di sini</span>
                                <span class="dropzone-secondary">atau <button class="browse-btn" id="browseBtn" type="button">pilih file</button></span>
                            </p>
                            <p class="dropzone-info">JPG, PNG, WebP • Maks 20MB</p>
                        </div>
                        <input type="file" id="fileInput" accept="image/jpeg,image/png,image/webp" hidden>
                    </div>

                    <!-- Preview (before upload) -->
                    <div class="preview-container" id="previewContainer" style="display: none;">
                        <div class="preview-header">
                            <div class="preview-file-info" id="previewFileInfo">
                                <span class="file-icon">🖼️</span>
                                <span class="file-name" id="fileName">image.jpg</span>
                                <span class="file-size" id="fileSize">2.4 MB</span>
                            </div>
                            <button class="btn-reset" id="resetBtn" type="button" title="Ganti gambar">
                                <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
                                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                                </svg>
                            </button>
                        </div>
                        <div class="preview-image-wrap">
                            <img id="previewImage" src="" alt="Preview gambar yang diupload">
                        </div>
                        <button class="btn-process" id="processBtn" type="button">
                            <span class="btn-process-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                                    <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </span>
                            <span class="btn-process-text">Hapus Background</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Processing Overlay -->
        <div class="processing-overlay" id="processingOverlay" style="display: none;">
            <div class="processing-card glass-card">
                <div class="processing-spinner">
                    <div class="spinner-ring"></div>
                    <div class="spinner-ring spinner-ring-2"></div>
                    <div class="spinner-ring spinner-ring-3"></div>
                    <div class="spinner-icon">✂️</div>
                </div>
                <h3 class="processing-title">Sedang Memproses...</h3>
                <p class="processing-subtitle" id="processingStatus">AI BiRefNet sedang menganalisis gambar Anda</p>
                <div class="processing-steps">
                    <div class="step active" id="step1">
                        <span class="step-dot"></span>
                        <span class="step-text">Mengupload gambar</span>
                    </div>
                    <div class="step" id="step2">
                        <span class="step-dot"></span>
                        <span class="step-text">Menganalisis objek</span>
                    </div>
                    <div class="step" id="step3">
                        <span class="step-dot"></span>
                        <span class="step-text">Menghapus background</span>
                    </div>
                    <div class="step" id="step4">
                        <span class="step-dot"></span>
                        <span class="step-text">Memfinalisasi hasil</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Result Section -->
        <section class="result-section" id="resultSection" style="display: none;">
            <div class="container">
                <div class="result-header">
                    <h2 class="result-title">
                        <span class="result-check">✅</span>
                        Background Berhasil Dihapus!
                    </h2>
                    <div class="result-meta" id="resultMeta">
                        <span class="meta-item">
                            <span class="meta-icon">⏱️</span>
                            <span class="meta-value" id="resultTime">0.0s</span>
                        </span>
                        <span class="meta-item">
                            <span class="meta-icon">🤖</span>
                            <span class="meta-value" id="resultModel">BiRefNet</span>
                        </span>
                    </div>
                </div>

                <!-- Comparison Slider -->
                <div class="comparison-card glass-card" id="comparisonCard">
                    <div class="comparison-tabs">
                        <button class="tab-btn active" id="tabCompare" data-tab="compare" type="button">
                            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm1 0v12h5V4H4zm7 0v12h5V4h-5z"/></svg>
                            Bandingkan
                        </button>
                        <button class="tab-btn" id="tabResult" data-tab="result" type="button">
                            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"/></svg>
                            Hasil
                        </button>
                    </div>

                    <!-- Compare View -->
                    <div class="tab-content active" id="compareView">
                        <div class="comparison-wrapper" id="comparisonWrapper">
                            <div class="comparison-image comparison-before" id="comparisonBefore">
                                <img id="compareOriginal" src="" alt="Gambar original">
                                <span class="comparison-label">ORIGINAL</span>
                            </div>
                            <div class="comparison-image comparison-after" id="comparisonAfter">
                                <img id="compareResult" src="" alt="Gambar tanpa background">
                                <span class="comparison-label">HASIL</span>
                            </div>
                            <div class="comparison-slider" id="comparisonSlider">
                                <div class="slider-line"></div>
                                <div class="slider-handle">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                                        <path d="M8 6L4 12L8 18M16 6L20 12L16 18" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Result Only View -->
                    <div class="tab-content" id="resultView">
                        <div class="result-image-wrap checkerboard">
                            <img id="resultImage" src="" alt="Hasil background removal">
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="result-actions">
                    <button class="btn-download" id="downloadBtn" type="button">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Download PNG
                    </button>
                    <button class="btn-new" id="newImageBtn" type="button">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                            <path d="M12 5v14M5 12h14" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Upload Gambar Baru
                    </button>
                </div>
            </div>
        </section>
    </main>

    <!-- Footer -->
    <footer class="footer" id="footer">
        <div class="container">
            <p class="footer-text">
                <span class="footer-brand">Removevant</span> — AI Background Removal Engine
            </p>
            <p class="footer-sub">
                Powered by BiRefNet • rembg • PHP + Python
            </p>
        </div>
    </footer>

    <!-- Toast Notification -->
    <div class="toast-container" id="toastContainer"></div>

    <!-- Scripts -->
    <script src="assets/js/app.js"></script>
</body>
</html>
