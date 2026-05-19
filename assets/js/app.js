/**
 * Removevant — Client Application
 */
(function () {
    'use strict';

    // ── Elements ────────────────────────────
    const dropzone       = document.getElementById('dropzone');
    const fileInput      = document.getElementById('fileInput');
    const browseBtn      = document.getElementById('browseBtn');
    const preview        = document.getElementById('preview');
    const previewImg     = document.getElementById('previewImg');
    const piName         = document.getElementById('piName');
    const piSize         = document.getElementById('piSize');
    const resetBtn       = document.getElementById('resetBtn');
    const processBtn     = document.getElementById('processBtn');
    const processingModal = document.getElementById('processingModal');
    const modalSteps     = document.getElementById('modalSteps');
    const workspace      = document.getElementById('workspace');
    const hero           = document.getElementById('hero');
    const result         = document.getElementById('result');
    const downloadBtn    = document.getElementById('downloadBtn');
    const newBtn         = document.getElementById('newBtn');
    const toasts         = document.getElementById('toasts');

    // Compare
    const compareCanvas  = document.getElementById('compareCanvas');
    const compareResult  = document.getElementById('compareResult');
    const compareHandle  = document.getElementById('compareHandle');
    const cmpOriginal    = document.getElementById('cmpOriginal');
    const cmpResult      = document.getElementById('cmpResult');
    const soloImg        = document.getElementById('soloImg');
    const resultStats    = document.getElementById('resultStats');
    const soloCanvas     = document.getElementById('soloCanvas');

    // Tabs
    const vtCompare      = document.getElementById('vtCompare');
    const vtResult       = document.getElementById('vtResult');

    let selectedFile = null;
    let resultFilename = '';
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
        if (!['image/jpeg','image/png','image/webp'].includes(f.type)) {
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
    ['dragenter','dragover'].forEach(e => dropzone.addEventListener(e, ev => {
        ev.preventDefault(); ev.stopPropagation();
        dropzone.classList.add('hovering');
    }));
    ['dragleave','drop'].forEach(e => dropzone.addEventListener(e, ev => {
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

    // ── Process ─────────────────────────────
    function stepAnim() {
        const steps = modalSteps.querySelectorAll('.ms');
        let i = 0;
        function next() {
            if (i > 0) { steps[i-1].classList.remove('active'); steps[i-1].classList.add('done'); }
            if (i < steps.length) { steps[i].classList.add('active'); i++; setTimeout(next, 1200 + Math.random() * 1500); }
        }
        next();
    }

    processBtn.addEventListener('click', async () => {
        if (!selectedFile) return;
        processingModal.style.display = 'flex';
        stepAnim();

        const fd = new FormData();
        fd.append('image', selectedFile);

        try {
            const res = await fetch('api/process.php', { method: 'POST', body: fd });
            const data = await res.json();

            processingModal.style.display = 'none';
            modalSteps.querySelectorAll('.ms').forEach(s => s.classList.remove('active','done'));

            if (data.success) {
                showResult(data);
                toast('Background berhasil dihapus', 'success');
            } else {
                toast(data.error || 'Proses gagal', 'error', 5000);
                if (data.debug) console.error('Debug:', data.debug);
            }
        } catch (err) {
            processingModal.style.display = 'none';
            modalSteps.querySelectorAll('.ms').forEach(s => s.classList.remove('active','done'));
            toast('Koneksi gagal — cek server', 'error', 5000);
            console.error(err);
        }
    });

    // ── Result ──────────────────────────────
    function showResult(data) {
        cmpOriginal.src = data.original;
        cmpResult.src = data.result;
        soloImg.src = data.result;
        resultFilename = data.filename;

        resultStats.textContent = 'Diproses dalam ' + data.processing_time + ' detik';

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
    compareCanvas.addEventListener('touchstart', e => { dragging = true; setSlider(getPct(e)); }, {passive:true});
    document.addEventListener('mousemove', e => { if (dragging) setSlider(getPct(e)); });
    document.addEventListener('touchmove', e => { if (dragging) setSlider(getPct(e)); }, {passive:true});
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
        if (!resultFilename) return;
        const a = document.createElement('a');
        a.href = 'api/download.php?file=' + encodeURIComponent(resultFilename);
        a.download = resultFilename;
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
        resetAll();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

})();
