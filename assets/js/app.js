/**
 * Removevant — Client-Side Background Removal
 * Uses @imgly/background-removal (runs entirely in browser via WASM)
 */
import { removeBackground } from 'https://esm.sh/@imgly/background-removal@1.5.5';

(function () {
    'use strict';

    // ── Elements ────────────────────────────
    const dropzone        = document.getElementById('dropzone');
    const fileInput       = document.getElementById('fileInput');
    const browseBtn       = document.getElementById('browseBtn');
    const preview         = document.getElementById('preview');
    const previewImg      = document.getElementById('previewImg');
    const piName          = document.getElementById('piName');
    const piSize          = document.getElementById('piSize');
    const resetBtn        = document.getElementById('resetBtn');
    const processBtn      = document.getElementById('processBtn');
    const processingModal = document.getElementById('processingModal');
    const modalTitle      = document.getElementById('modalTitle');
    const modalDesc       = document.getElementById('modalDesc');
    const modalProgress   = document.getElementById('modalProgress');
    const loaderBar       = document.getElementById('loaderBar');
    const workspace       = document.getElementById('workspace');
    const hero            = document.getElementById('hero');
    const result          = document.getElementById('result');
    const downloadBtn     = document.getElementById('downloadBtn');
    const newBtn          = document.getElementById('newBtn');
    const toasts          = document.getElementById('toasts');

    // Compare
    const compareCanvas   = document.getElementById('compareCanvas');
    const compareResult   = document.getElementById('compareResult');
    const compareHandle   = document.getElementById('compareHandle');
    const cmpOriginal     = document.getElementById('cmpOriginal');
    const cmpResult       = document.getElementById('cmpResult');
    const soloImg         = document.getElementById('soloImg');
    const resultStats     = document.getElementById('resultStats');
    const soloCanvas      = document.getElementById('soloCanvas');

    // Tabs
    const vtCompare       = document.getElementById('vtCompare');
    const vtResult        = document.getElementById('vtResult');

    let selectedFile = null;
    let resultBlobUrl = '';
    let dragging = false;

    // ── Helpers ─────────────────────────────
    function fmtSize(b) {
        if (b < 1024) return b + ' B';
        if (b < 1048576) return (b / 1024).toFixed(1) + ' KB';
        return (b / 1048576).toFixed(1) + ' MB';
    }

    function toast(msg, type = '', dur = 3500) {
        const el = document.createElement('div');
        el.className = 'toast ' + type;
        el.textContent = msg;
        toasts.appendChild(el);
        setTimeout(() => {
            el.classList.add('toast-out');
            setTimeout(() => el.remove(), 250);
        }, dur);
    }

    function validFile(f) {
        if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/avif'].includes(f.type)) {
            toast('Format tidak didukung', 'error'); return false;
        }
        if (f.size > 20 * 1024 * 1024) {
            toast('File terlalu besar (maks 20 MB)', 'error'); return false;
        }
        return true;
    }

    // ── Preview ─────────────────────────────
    function showPreview(file) {
        selectedFile = file;
        piName.textContent = file.name;
        piSize.textContent = fmtSize(file.size);
        const r = new FileReader();
        r.onload = e => {
            previewImg.src = e.target.result;
            dropzone.style.display = 'none';
            preview.style.display = 'flex';
        };
        r.readAsDataURL(file);
    }

    function resetAll() {
        selectedFile = null;
        fileInput.value = '';
        previewImg.src = '';
        dropzone.style.display = 'flex';
        preview.style.display = 'none';
    }

    // ── Drag & Drop ─────────────────────────
    ['dragenter', 'dragover'].forEach(e => dropzone.addEventListener(e, ev => {
        ev.preventDefault(); ev.stopPropagation();
        dropzone.classList.add('hovering');
    }));
    ['dragleave', 'drop'].forEach(e => dropzone.addEventListener(e, ev => {
        ev.preventDefault(); ev.stopPropagation();
        dropzone.classList.remove('hovering');
    }));
    dropzone.addEventListener('drop', e => {
        const f = e.dataTransfer.files;
        if (f.length && validFile(f[0])) showPreview(f[0]);
    });
    dropzone.addEventListener('click', e => { if (e.target !== browseBtn) fileInput.click(); });
    browseBtn.addEventListener('click', e => { e.stopPropagation(); fileInput.click(); });
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length && validFile(fileInput.files[0])) showPreview(fileInput.files[0]);
    });
    resetBtn.addEventListener('click', resetAll);

    // ── Process (Client-Side) ───────────────
    processBtn.addEventListener('click', async () => {
        if (!selectedFile) return;

        // Show modal
        processingModal.style.display = 'flex';
        modalTitle.textContent = 'Memproses gambar...';
        modalDesc.textContent = 'Memuat mesin pemroses (pertama kali mungkin lambat)';
        modalProgress.textContent = '0%';
        loaderBar.style.width = '0%';
        loaderBar.style.animation = 'none';

        const startTime = performance.now();

        try {
            // Create object URL from file for the library
            const imageUrl = URL.createObjectURL(selectedFile);

            const config = {
                model: 'medium',
                output: { format: 'image/png', quality: 1.0 },
                progress: (key, current, total) => {
                    const pct = total > 0 ? Math.round((current / total) * 100) : 0;

                    if (key.includes('fetch')) {
                        modalDesc.textContent = 'Mengunduh komponen pemroses...';
                        modalProgress.textContent = pct + '%';
                        loaderBar.style.width = pct + '%';
                    } else if (key.includes('compute')) {
                        modalDesc.textContent = 'Menghapus background...';
                        modalProgress.textContent = pct + '%';
                        loaderBar.style.width = pct + '%';
                    } else {
                        modalDesc.textContent = 'Memproses...';
                        modalProgress.textContent = pct + '%';
                        loaderBar.style.width = pct + '%';
                    }
                }
            };

            // Run background removal in browser
            const rawBlob = await removeBackground(imageUrl, config);
            const blob = new Blob([rawBlob], { type: 'image/png' });

            // Cleanup object URL
            URL.revokeObjectURL(imageUrl);

            const elapsed = ((performance.now() - startTime) / 1000).toFixed(1);

            // Create result URL
            if (resultBlobUrl) URL.revokeObjectURL(resultBlobUrl);
            resultBlobUrl = URL.createObjectURL(blob);

            // Create original preview URL
            const originalUrl = URL.createObjectURL(selectedFile);

            processingModal.style.display = 'none';

            showResult({
                originalUrl: originalUrl,
                resultUrl: resultBlobUrl,
                processingTime: elapsed,
                fileName: selectedFile.name.replace(/\.[^.]+$/, '') + '_nobg.png'
            });

            toast('Background berhasil dihapus', 'success');

        } catch (err) {
            processingModal.style.display = 'none';
            toast('Proses gagal: ' + (err.message || 'Unknown error'), 'error', 6000);
            console.error('Removevant error:', err);
        }
    });

    // ── Result ──────────────────────────────
    let currentFileName = '';
    let currentOriginalUrl = '';

    function showResult(data) {
        cmpOriginal.src = data.originalUrl;
        cmpResult.src = data.resultUrl;
        soloImg.src = data.resultUrl;
        currentFileName = data.fileName;
        currentOriginalUrl = data.originalUrl;

        resultStats.textContent = 'Diproses dalam ' + data.processingTime + ' detik';

        const afterImg = compareResult.querySelector('img');
        afterImg.style.width = compareCanvas.offsetWidth + 'px';

        workspace.style.display = 'none';
        hero.style.display = 'none';
        result.style.display = 'block';
        switchView('compare');
        setSlider(50);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ── Compare Slider ──────────────────────
    function setSlider(pct) {
        pct = Math.max(0, Math.min(100, pct));
        compareResult.style.width = pct + '%';
        compareHandle.style.left = pct + '%';
        const img = compareResult.querySelector('img');
        if (compareCanvas.offsetWidth > 0) img.style.width = compareCanvas.offsetWidth + 'px';
    }

    function getPct(e) {
        const r = compareCanvas.getBoundingClientRect();
        const x = e.touches ? e.touches[0].clientX : e.clientX;
        return ((x - r.left) / r.width) * 100;
    }

    compareCanvas.addEventListener('mousedown', e => { dragging = true; setSlider(getPct(e)); });
    compareCanvas.addEventListener('touchstart', e => { dragging = true; setSlider(getPct(e)); }, { passive: true });
    document.addEventListener('mousemove', e => { if (dragging) setSlider(getPct(e)); });
    document.addEventListener('touchmove', e => { if (dragging) setSlider(getPct(e)); }, { passive: true });
    document.addEventListener('mouseup', () => dragging = false);
    document.addEventListener('touchend', () => dragging = false);

    window.addEventListener('resize', () => {
        if (result.style.display !== 'none') {
            const img = compareResult.querySelector('img');
            if (compareCanvas.offsetWidth > 0) img.style.width = compareCanvas.offsetWidth + 'px';
        }
    });

    // ── View Tabs ───────────────────────────
    function switchView(v) {
        vtCompare.classList.toggle('active', v === 'compare');
        vtResult.classList.toggle('active', v === 'solo');
        compareCanvas.style.display = v === 'compare' ? 'block' : 'none';
        soloCanvas.style.display = v === 'solo' ? 'block' : 'none';
    }
    vtCompare.addEventListener('click', () => switchView('compare'));
    vtResult.addEventListener('click', () => switchView('solo'));

    // ── Download ────────────────────────────
    downloadBtn.addEventListener('click', () => {
        if (!resultBlobUrl) return;
        const a = document.createElement('a');
        a.href = resultBlobUrl;
        a.download = currentFileName || 'removevant_result.png';
        document.body.appendChild(a);
        a.click();
        a.remove();
        toast('Download dimulai', 'success', 2000);
    });

    // ── New Image ───────────────────────────
    newBtn.addEventListener('click', () => {
        result.style.display = 'none';
        workspace.style.display = 'block';
        hero.style.display = 'block';
        // Cleanup old URLs
        if (currentOriginalUrl) URL.revokeObjectURL(currentOriginalUrl);
        resetAll();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

})();
