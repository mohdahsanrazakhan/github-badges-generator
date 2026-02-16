// --- DATA STATE ---
let allTechs = [];
let selectedTechs = [];
let useDefaultColor = true;
let currentOrientation = 'flex-row';
let currentAlign = 'center';
let codeFormat = 'markdown';
let currentStyle = 'for-the-badge';

// --- CORE FUNCTIONS ---

async function loadTechData() {
    try {
        const response = await fetch('data.json');
        allTechs = await response.json();
        renderTechList(allTechs);
        // Initial Badge Generation
        generateBadges();
        // Set initial preview colors
        document.getElementById('badgeColorPreview').style.backgroundColor = '#000000';
        document.getElementById('logoColorPreview').style.backgroundColor = '#ffffff';
    } catch (error) {
        console.error("Error: Please ensure data.json exists.", error);
        document.getElementById('techContainer').innerHTML = "<p class='text-red-500 text-xs'>Failed to load data.json</p>";
    }
}

function renderTechList(techs) {
    const container = document.getElementById('techContainer');
    container.innerHTML = '';
    techs.forEach(tech => {
        const isSelected = selectedTechs.includes(tech.slug);
        const span = document.createElement('span');
        span.innerText = tech.name;
        span.className = `cursor-pointer px-4 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${isSelected ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105' : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'}`;
        span.onclick = () => toggleTech(tech.slug);
        container.appendChild(span);
    });
}

function toggleTech(slug) {
    selectedTechs = selectedTechs.includes(slug)
        ? selectedTechs.filter(s => s !== slug)
        : [...selectedTechs, slug];
    renderTechList(allTechs);
    generateBadges();
}

// --- UI CONTROL FUNCTIONS ---

window.updateStyle = function (style, btnElement) {
    currentStyle = style;
    document.querySelectorAll('.style-btn').forEach(btn => {
        btn.classList.remove('bg-blue-600', 'text-white', 'border-blue-600', 'shadow-md');
        btn.classList.add('bg-white', 'text-gray-700', 'hover:bg-gray-50');
    });
    btnElement.classList.remove('bg-white', 'text-gray-700', 'hover:bg-gray-50');
    btnElement.classList.add('bg-blue-600', 'text-white', 'border-blue-600', 'shadow-md');
    generateBadges();
};

window.updateOrientation = function (orient, btnElement) {
    currentOrientation = orient;
    document.querySelectorAll('.orient-btn').forEach(btn => {
        btn.classList.remove('bg-blue-600', 'text-white', 'border-blue-600', 'shadow-sm');
        btn.classList.add('bg-white', 'text-gray-900', 'hover:bg-gray-100');
    });
    btnElement.classList.remove('bg-white', 'text-gray-900', 'hover:bg-gray-100');
    btnElement.classList.add('bg-blue-600', 'text-white', 'border-blue-600', 'shadow-sm');
    generateBadges();
};

window.updateAlignment = function (align, btnElement) {
    currentAlign = align;
    document.querySelectorAll('.align-btn').forEach(btn => {
        btn.classList.remove('bg-blue-600', 'text-white', 'border-blue-600', 'shadow-sm');
        btn.classList.add('bg-white', 'text-gray-900', 'hover:bg-gray-100');
    });
    btnElement.classList.remove('bg-white', 'text-gray-900', 'hover:bg-gray-100');
    btnElement.classList.add('bg-blue-600', 'text-white', 'border-blue-600', 'shadow-sm');
    generateBadges();
};

window.setCodeFormat = function (format) {
    codeFormat = format;
    document.getElementById('mdBtn').classList.toggle('bg-white', format === 'markdown');
    document.getElementById('mdBtn').classList.toggle('shadow-sm', format === 'markdown');
    document.getElementById('htmlBtn').classList.toggle('bg-white', format === 'html');
    document.getElementById('htmlBtn').classList.toggle('shadow-sm', format === 'html');
    document.getElementById('codeTitle').innerText = format === 'markdown' ? "Markdown Output" : "HTML Output";
    generateBadges();
};

// --- MODAL CONTROL FUNCTIONS ---

window.resetAllSettings = function () {
    const modal = document.getElementById('resetModal');
    const content = document.getElementById('modalContent');

    modal.classList.remove('hidden');
    modal.classList.add('flex');

    // Animation delay
    setTimeout(() => {
        content.classList.remove('scale-95', 'opacity-0');
        content.classList.add('scale-100', 'opacity-100');
    }, 10);
};

window.closeResetModal = function () {
    const modal = document.getElementById('resetModal');
    const content = document.getElementById('modalContent');

    content.classList.remove('scale-100', 'opacity-100');
    content.classList.add('scale-95', 'opacity-0');

    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }, 200);
};

window.confirmReset = function () {
    // 1. Data State Reset
    selectedTechs = [];
    useDefaultColor = true;
    currentOrientation = 'flex-row';
    currentAlign = 'center';
    currentStyle = 'for-the-badge';
    codeFormat = 'markdown';

    // 2. UI Inputs Reset
    document.getElementById('techSearch').value = '';
    document.getElementById('customColor').value = '#000000';
    document.getElementById('logoColorPicker').value = '#ffffff';
    document.getElementById('badgeColorPreview').style.backgroundColor = '#000000';
    document.getElementById('logoColorPreview').style.backgroundColor = '#ffffff';

    // 3. Reset Button Visuals (Orientation, Alignment & Style)
    // Orientation Buttons
    document.querySelectorAll('.orient-btn').forEach(btn => {
        const isHorizontal = btn.innerText.includes('Horizontal');
        btn.className = `orient-btn p-2 border rounded-lg text-xs font-bold transition-all ${isHorizontal ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100'}`;
    });

    // Alignment Buttons
    document.querySelectorAll('.align-btn').forEach(btn => {
        const isCenter = btn.innerText === 'Center';
        btn.className = `align-btn p-2 border rounded-lg text-xs font-bold transition-all ${isCenter ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100'}`;
    });

    // Style Buttons
    document.querySelectorAll('.style-btn').forEach(btn => {
        const isDefault = btn.innerText.includes('For the Badge');
        btn.className = isDefault
            ? "style-btn col-span-2 p-3 border rounded-xl bg-blue-600 text-white shadow-md transition-all flex justify-between items-center group"
            : "style-btn p-2.5 border rounded-xl bg-white text-gray-700 hover:bg-gray-50 transition-all text-xs font-bold text-center";
    });

    // 4. Final Refresh
    renderTechList(allTechs);
    generateBadges();
    closeResetModal(); // Close the modal

    // Smooth scroll to top to show changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// --- GENERATOR LOGIC ---

function generateBadges() {
    const style = currentStyle;
    const badgeColor = document.getElementById('customColor').value.replace('#', '');
    const logoColor = document.getElementById('logoColorPicker').value.replace('#', '');
    const preview = document.getElementById('previewArea');
    const codeBox = document.getElementById('markdownCode');

    // Fix Preview Alignment Logic
    let alignClass = (currentOrientation === 'flex-row')
        ? `justify-${currentAlign} items-center`
        : `items-${currentAlign} justify-center`;

    preview.className = `w-full h-full flex ${currentOrientation} flex-wrap gap-4 ${alignClass} transition-all duration-300`;
    preview.innerHTML = '';

    let badgesArray = [];
    selectedTechs.forEach(slug => {
        const tech = allTechs.find(t => t.slug === slug);
        if (!tech) return;

        const finalColor = useDefaultColor ? tech.color : badgeColor;
        // Shields.io standard for names: replace space with %20 or dash
        const cleanName = tech.name.replace(/\s+/g, '%20');
        const url = `https://img.shields.io/badge/${cleanName}-${finalColor}.svg?style=${style}&logo=${tech.slug}&logoColor=${logoColor}`;

        const img = document.createElement('img');
        img.src = url;
        img.className = "shadow-sm";
        preview.appendChild(img);

        if (codeFormat === 'markdown') {
            badgesArray.push(`![${tech.name}](${url})`);
        } else {
            badgesArray.push(`<img src="${url}" alt="${tech.name}" />`);
        }
    });

    if (selectedTechs.length > 0) {
        const htmlAlign = currentAlign === 'start' ? 'left' : (currentAlign === 'end' ? 'right' : 'center');
        const separator = currentOrientation === 'flex-col' ? ' <br />\n ' : ' ';
        const combinedBadges = badgesArray.join(separator);

        if (codeFormat === 'markdown') {
            codeBox.innerText = `<p align="${htmlAlign}">\n\n${combinedBadges}\n\n</p>`;
        } else {
            codeBox.innerText = `<div align="${htmlAlign}">\n  ${combinedBadges}\n</div>`;
        }
    } else {
        codeBox.innerText = "Select a technology to generate code...";
    }
}

// --- UTILS ---

document.getElementById('techSearch').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allTechs.filter(t => t.name.toLowerCase().includes(term));
    renderTechList(filtered);
});

// Remove styleSelect listener if you are using Buttons now
// document.getElementById('styleSelect').addEventListener('change', generateBadges); 

document.getElementById('customColor').addEventListener('input', (e) => {
    useDefaultColor = false;
    document.getElementById('badgeColorPreview').style.backgroundColor = e.target.value;
    generateBadges();
});

document.getElementById('logoColorPicker').addEventListener('input', (e) => {
    document.getElementById('logoColorPreview').style.backgroundColor = e.target.value;
    generateBadges();
});

document.getElementById('resetColor').onclick = () => {
    useDefaultColor = true;
    document.getElementById('badgeColorPreview').style.backgroundColor = '#000000';
    generateBadges();
};

document.getElementById('resetLogoColor').onclick = () => {
    document.getElementById('logoColorPicker').value = "#ffffff";
    document.getElementById('logoColorPreview').style.backgroundColor = '#ffffff';
    generateBadges();
};

window.copyToClipboard = function () {
    const code = document.getElementById('markdownCode').innerText;
    if (!selectedTechs.length) return;
    navigator.clipboard.writeText(code).then(() => {
        const btn = document.getElementById('copyBtn');
        const original = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        btn.classList.replace('bg-blue-600', 'bg-green-600');
        setTimeout(() => {
            btn.innerHTML = original;
            btn.classList.replace('bg-green-600', 'bg-blue-600');
        }, 2000);
    });
};

loadTechData();