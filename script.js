const posterForm = document.getElementById('posterForm');
const nameInput = document.getElementById('name');
const customTextInput = document.getElementById('customText');
const photoInput = document.getElementById('photo');
const bgPhotoInput = document.getElementById('bgPhoto');
const backgroundSelect = document.getElementById('background');
const textStyleSelect = document.getElementById('textStyle');
const colorSelect = document.getElementById('colorSelect');
const bgFitSelect = document.getElementById('bgFit');
const posterGallery = document.getElementById('posterGallery');
const downloadBtn = document.getElementById('downloadBtn');
const sizeSlider = document.getElementById('sizeSlider');

// Define poster styles
const posters = [
    { element: document.getElementById('poster1') },
    { element: document.getElementById('poster2') },
    { element: document.getElementById('poster3') }
];

// Handle form submission
posterForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    posterForm.querySelectorAll('input, select, button').forEach(input => input.disabled = true);

    const name = nameInput.value.trim();
    const customText = customTextInput.value.trim();
    const background = backgroundSelect.value || 'bg-default';
    const textStyle = textStyleSelect.value;

    const photoFile = photoInput.files[0];
    if (!photoFile || !/\.(jpg|jpeg|png|gif)$/i.test(photoFile.name)) {
        alert('Please upload a valid image file.');
        return;
    }

    const photoReader = new FileReader();
    photoReader.onload = (e) => {
        const bgFile = bgPhotoInput.files[0];
        const bgReader = bgFile ? new FileReader() : null;

        if (bgFile) {
            bgReader.onload = (bgEvent) => {
                updatePosters(e.target.result, bgEvent.target.result, background, textStyle, name, customText);
            };
            bgReader.readAsDataURL(bgFile);
        } else {
            updatePosters(e.target.result, null, background, textStyle, name, customText);
        }
    };
    photoReader.readAsDataURL(photoFile);
});

// Update poster elements
function updatePosters(photoSrc, bgSrc, background, textStyle, name, customText) {
    const posterSize = sizeSlider.value + '%';

    posters.forEach((poster) => {
        const posterElement = poster.element;
        posterElement.className = `${background} ${textStyle} ${colorSelect.value}`;
        posterElement.style.backgroundImage = bgSrc ? `url(${bgSrc})` : '';
        posterElement.style.backgroundSize = bgFitSelect.value;
        posterElement.style.width = posterSize;
        posterElement.style.height = `auto`;
        posterElement.innerHTML = `
            <h2>${name}</h2>
            <p>${customText}</p>
            <img src="${photoSrc}" alt="User Photo">
        `;
        posterElement.classList.remove('hidden');
    });

    posterGallery.classList.remove('hidden');
    downloadBtn.classList.remove('hidden');
}

// Handle poster selection
let selectedPoster = null;
document.querySelectorAll('.poster').forEach((poster) => {
    poster.addEventListener('click', () => {
        document.querySelectorAll('.poster').forEach((p) => p.classList.remove('selected'));
        poster.classList.add('selected');
        selectedPoster = poster;
        downloadBtn.classList.remove('hidden');
    });
});

// Handle download of selected poster
downloadBtn.addEventListener('click', () => {
    if (selectedPoster) {
        html2canvas(selectedPoster).then((canvas) => {
            const link = document.createElement('a');
            link.download = 'poster.png';
            link.href = canvas.toDataURL();
            link.click();
        });
    }
});
