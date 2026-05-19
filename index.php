<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Removevant — Hapus Background Gambar</title>
    <meta name="description" content="Hapus background gambar secara otomatis dengan kualitas HD. Gratis dan cepat.">
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>✂️</text></svg>">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:ital,wght@0,400;0,500;1,400&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>

    <!-- Navbar -->
    <nav class="navbar" id="navbar">
        <a href="/" class="brand">
            <div class="brand-mark">R</div>
            <span class="brand-name">removevant</span>
        </a>
        <div class="nav-status">
            <span class="status-dot"></span>
            Engine ready
        </div>
    </nav>

    <!-- Hero -->
    <section class="hero" id="hero">
        <p class="hero-eyebrow">Background removal yang bersih.</p>
        <h1 class="hero-heading">
            Upload gambar,<br>
            <span class="hero-em">sisanya biar kami.</span>
        </h1>
        <p class="hero-desc">
            Tidak perlu Photoshop. Tidak perlu skill editing.<br class="hide-mobile">
            AI kami mendeteksi objek dan menghapus background dalam hitungan detik.
        </p>
    </section>

    <!-- Upload Area -->
    <section class="workspace" id="workspace">
        <div class="upload-box" id="uploadBox">
            <!-- Dropzone State -->
            <div class="dropzone" id="dropzone">
                <div class="dropzone-visual">
                    <div class="dropzone-ring">
                        <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5">
                            <path d="M24 32V16M18 22l6-6 6 6" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                </div>
                <div class="dropzone-text">
                    <span class="dz-main">Drop file di sini</span>
                    <span class="dz-or">atau</span>
                    <button class="dz-browse" id="browseBtn" type="button">Pilih dari komputer</button>
                </div>
                <span class="dz-hint">JPG, PNG, WebP — maks 20 MB</span>
                <input type="file" id="fileInput" accept="image/jpeg,image/png,image/webp" hidden>
            </div>

            <!-- Preview State -->
            <div class="preview" id="preview" style="display:none;">
                <div class="preview-img-wrap">
                    <img id="previewImg" src="" alt="Preview">
                </div>
                <div class="preview-bar">
                    <div class="preview-info">
                        <span class="pi-name" id="piName">photo.jpg</span>
                        <span class="pi-size" id="piSize">2.4 MB</span>
                    </div>
                    <div class="preview-actions">
                        <button class="btn-ghost" id="resetBtn" type="button">Ganti</button>
                        <button class="btn-primary" id="processBtn" type="button">
                            Hapus Background
                            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Processing Modal -->
    <div class="modal-backdrop" id="processingModal" style="display:none;">
        <div class="modal-card">
            <div class="loader">
                <div class="loader-bar"></div>
            </div>
            <p class="modal-title">Memproses gambar...</p>
            <p class="modal-desc" id="modalDesc">Mendeteksi objek dan menghapus background</p>
            <div class="modal-steps" id="modalSteps">
                <div class="ms active" data-step="1"><span class="ms-num">1</span> Upload</div>
                <div class="ms" data-step="2"><span class="ms-num">2</span> Analisis</div>
                <div class="ms" data-step="3"><span class="ms-num">3</span> Proses</div>
                <div class="ms" data-step="4"><span class="ms-num">4</span> Selesai</div>
            </div>
        </div>
    </div>

    <!-- Result -->
    <section class="result" id="result" style="display:none;">
        <div class="result-head">
            <div class="result-head-left">
                <h2 class="result-title">Selesai.</h2>
                <span class="result-stats" id="resultStats">Diproses dalam 0.0 detik</span>
            </div>
            <div class="result-head-right">
                <button class="btn-primary" id="downloadBtn" type="button">
                    <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
                    Download PNG
                </button>
                <button class="btn-ghost" id="newBtn" type="button">Upload lagi</button>
            </div>
        </div>

        <!-- View Modes -->
        <div class="view-tabs">
            <button class="vt active" id="vtCompare" data-view="compare" type="button">Bandingkan</button>
            <button class="vt" id="vtResult" data-view="solo" type="button">Hasil saja</button>
        </div>

        <!-- Comparison -->
        <div class="compare-canvas" id="compareCanvas">
            <div class="compare-layer compare-original">
                <img id="cmpOriginal" src="" alt="Original">
                <span class="compare-tag">BEFORE</span>
            </div>
            <div class="compare-layer compare-result" id="compareResult">
                <img id="cmpResult" src="" alt="Hasil">
                <span class="compare-tag tag-after">AFTER</span>
            </div>
            <div class="compare-handle" id="compareHandle">
                <div class="handle-grip">
                    <span></span><span></span><span></span>
                </div>
            </div>
        </div>

        <!-- Solo Result -->
        <div class="solo-canvas" id="soloCanvas" style="display:none;">
            <div class="solo-checkerboard">
                <img id="soloImg" src="" alt="Hasil akhir">
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="foot">
        <span>removevant</span>
        <span class="foot-sep">·</span>
        <span class="foot-muted">background removal engine</span>
    </footer>

    <!-- Toasts -->
    <div class="toasts" id="toasts"></div>

    <script src="assets/js/app.js"></script>
</body>
</html>
