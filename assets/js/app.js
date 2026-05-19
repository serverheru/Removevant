/**
 * Removevant — Client-Side Application
 * Handles drag & drop, upload, processing, comparison slider, and downloads
 */

(function () {
    'use strict';

    // ─── DOM Elements ───────────────────────────
    const dropzone = document.getElementById('dropzone');
    const dropzoneContent = document.getElementById('dropzoneContent');
    const fileInput = document.getElementById('fileInput');
    const browseBtn = document.getElementById('browseBtn');
    const previewContainer = document.getElementById('previewContainer');
    const previewImage = document.getElementById('previewImage');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    const resetBtn = document.getElementById('resetBtn');
    const processBtn = document.getElementById('processBtn');
    const processingOverlay = document.getElementById('processingOverlay');
    const uploadSection = document.getElementById('uploadSection');
    const heroSection = document.getElementById('hero');
    const resultSection = document.getElementById('resultSection');
    const downloadBtn = document.getElementById('downloadBtn');
    const newImageBtn = document.getElementById('newImageBtn');
    const toastContainer = document.getElementById('toastContainer');

    // Comparison
    const comparisonWrapper = document.getElementById('comparisonWrapper');
    const comparisonAfter = document.getElementById('comparisonAfter');
    const comparisonSlider = document.getElementById('comparisonSlider');
    const compareOriginal = document.getElementById('compareOriginal');
    const compareResult = document.getElementById('compareResult');
    const resultImage = document.getElementById('resultImage');
    const resultTime = document.getElementById('resultTime');
    const resultModel = document.getElementById('resultModel');

    // Tabs
    const tabCompare = document.getElementById('tabCompare');
    const tabResult = document.getElementById('tabResult');
    const compareView = document.getElementById('compareView');
    const resultView = document.getElementById('resultView');

    // State
    let selectedFile = null;
    let resultFilename = '';
    let isDraggingSlider = false;

    // ─── Toast Notifications ────────────────────
    function showToast(message, type = 'info', duration = 4000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        toastContainer.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('toast-exit');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    // ─── File Helpers ───────────────────────────
    function formatSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1048576).toFixed(1) + ' MB';
    }

    function isValidFile(file) {
        const allowed = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowed.includes(file.type)) {
            showToast('Format tidak didukung. Gunakan JPG, PNG, atau WebP', 'error');
            return false;
        }
        if (file.size > 20 * 1024 * 1024) {
            showToast('Ukuran file melebihi batas 20MB', 'error');
            return false;
        }
        return true;
    }

    // ─── Show Preview ───────────────────────────
    function showPreview(file) {
        selectedFile = file;
        fileName.textContent = file.name;
        fileSize.textContent = formatSize(file.size);

        const reader = new FileReader();
        reader.onload = (e) => {
            previewImage.src = e.target.result;
            dropzone.style.display = 'none';
            previewContainer.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }

    function resetUpload() {
        selectedFile = null;
        fileInput.value = '';
        previewImage.src = '';
        dropzone.style.display = 'block';
        previewContainer.style.display = 'none';
    }

    // ─── Drag & Drop ────────────────────────────
    ['dragenter', 'dragover'].forEach(evt => {
        dropzone.addEventListener(evt, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropzone.classList.add('drag-over');
        });
    });

    ['dragleave', 'drop'].forEach(evt => {
        dropzone.addEventListener(evt, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropzone.classList.remove('drag-over');
        });
    });

    dropzone.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        if (files.length > 0 && isValidFile(files[0])) {
            showPreview(files[0]);
        }
    });

    dropzone.addEventListener('click', (e) => {
        if (e.target !== browseBtn) fileInput.click();
    });
    browseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.click();
    });

    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0 && isValidFile(fileInput.files[0])) {
            showPreview(fileInput.files[0]);
        }
    });

    resetBtn.addEventListener('click', resetUpload);

    // ─── Processing ─────────────────────────────
    function simulateSteps() {
        const steps = ['step1', 'step2', 'step3', 'step4'];
        let i = 0;

        function advance() {
            if (i > 0) document.getElementById(steps[i - 1]).classList.replace('active', 'done');
            if (i < steps.length) {
                document.getElementById(steps[i]).classList.add('active');
                i++;
                // Randomize timing to feel organic
                setTimeout(advance, 1500 + Math.random() * 2000);
            }
        }
        advance();
    }

    processBtn.addEventListener('click', async () => {
        if (!selectedFile) return;

        // Show processing overlay
        processingOverlay.style.display = 'flex';
        simulateSteps();

        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            const response = await fetch('api/process.php', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            // Hide processing
            processingOverlay.style.display = 'none';
            // Reset step classes
            document.querySelectorAll('.step').forEach(s => { s.classList.remove('active', 'done'); });

            if (data.success) {
                showResult(data);
                showToast('Background berhasil dihapus!', 'success');
            } else {
                showToast(data.error || 'Proses gagal', 'error', 6000);
                if (data.debug) console.error('Debug:', data.debug);
            }
        } catch (err) {
            processingOverlay.style.display = 'none';
            document.querySelectorAll('.step').forEach(s => { s.classList.remove('active', 'done'); });
            showToast('Koneksi gagal. Pastikan server berjalan.', 'error', 6000);
            console.error(err);
        }
    });

    // ─── Show Result ────────────────────────────
    function showResult(data) {
        // Set images
        compareOriginal.src = data.original;
        compareResult.src = data.result;
        resultImage.src = data.result;
        resultFilename = data.filename;

        // Meta
        resultTime.textContent = data.processing_time + 's';
        resultModel.textContent = data.model || 'BiRefNet';

        // Fix comparison after container width for proper image display
        const afterImg = comparisonAfter.querySelector('img');
        afterImg.style.width = comparisonWrapper.offsetWidth + 'px';

        // Show result, hide upload
        uploadSection.style.display = 'none';
        heroSection.style.display = 'none';
        resultSection.style.display = 'block';

        // Reset tabs
        switchTab('compare');

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Reset slider to 50%
        setSliderPosition(50);
    }

    // ─── Comparison Slider ──────────────────────
    function setSliderPosition(percent) {
        percent = Math.max(0, Math.min(100, percent));
        comparisonAfter.style.width = percent + '%';
        comparisonSlider.style.left = percent + '%';

        // Fix after image width to wrapper width so it doesn't stretch
        const afterImg = comparisonAfter.querySelector('img');
        if (comparisonWrapper.offsetWidth > 0) {
            afterImg.style.width = comparisonWrapper.offsetWidth + 'px';
        }
    }

    function getSliderPercent(e) {
        const rect = comparisonWrapper.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        return ((clientX - rect.left) / rect.width) * 100;
    }

    comparisonWrapper.addEventListener('mousedown', (e) => {
        isDraggingSlider = true;
        setSliderPosition(getSliderPercent(e));
    });
    comparisonWrapper.addEventListener('touchstart', (e) => {
        isDraggingSlider = true;
        setSliderPosition(getSliderPercent(e));
    }, { passive: true });

    document.addEventListener('mousemove', (e) => {
        if (isDraggingSlider) setSliderPosition(getSliderPercent(e));
    });
    document.addEventListener('touchmove', (e) => {
        if (isDraggingSlider) setSliderPosition(getSliderPercent(e));
    }, { passive: true });

    document.addEventListener('mouseup', () => { isDraggingSlider = false; });
    document.addEventListener('touchend', () => { isDraggingSlider = false; });

    // Resize handler for comparison
    window.addEventListener('resize', () => {
        if (resultSection.style.display !== 'none') {
            const afterImg = comparisonAfter.querySelector('img');
            if (comparisonWrapper.offsetWidth > 0) {
                afterImg.style.width = comparisonWrapper.offsetWidth + 'px';
            }
        }
    });

    // ─── Tabs ───────────────────────────────────
    function switchTab(tab) {
        tabCompare.classList.toggle('active', tab === 'compare');
        tabResult.classList.toggle('active', tab === 'result');
        compareView.classList.toggle('active', tab === 'compare');
        resultView.classList.toggle('active', tab === 'result');
    }

    tabCompare.addEventListener('click', () => switchTab('compare'));
    tabResult.addEventListener('click', () => switchTab('result'));

    // ─── Download ───────────────────────────────
    downloadBtn.addEventListener('click', () => {
        if (!resultFilename) return;
        const link = document.createElement('a');
        link.href = 'api/download.php?file=' + encodeURIComponent(resultFilename);
        link.download = resultFilename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        showToast('Download dimulai...', 'success', 2000);
    });

    // ─── New Image ──────────────────────────────
    newImageBtn.addEventListener('click', () => {
        resultSection.style.display = 'none';
        uploadSection.style.display = 'block';
        heroSection.style.display = 'block';
        resetUpload();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

})();
