const imageFolder = 'emoji';
const imageGrid = document.getElementById('image-grid');
const searchInput = document.getElementById('search-bar');

function loadImages() {
    fetchImages(imageFolder).then(images => {
        images.forEach(image => {
            const imageName = decodeURI(image.split('/').pop().split('.')[0]);
            const imageContainer = document.createElement('div');
            imageContainer.className = 'image-container';

            const img = document.createElement('img');
            img.src = image;
            img.alt = imageName;

            const imageCaption = document.createElement('div');
            imageCaption.className = 'image-name';
            imageCaption.innerText = imageName;

            imageContainer.appendChild(img);
            imageContainer.appendChild(imageCaption);

            imageGrid.appendChild(imageContainer);

            imageContainer.addEventListener('click', () => {
                downloadImage(image, imageName);
            });
        });
    });
}

async function fetchImages(folder) {
    const response = await fetch(folder);
    const text = await response.text();
    const parser = new DOMParser();
    const htmlDocument = parser.parseFromString(text, 'text/html');
    const imageLinks = Array.from(htmlDocument.links).map(link => link.href);
    return imageLinks.filter(link => /\.(jpe?g|png|gif)$/i.test(link));
}

function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    const imageContainers = document.querySelectorAll('.image-container');

    imageContainers.forEach(container => {
        const imageName = container.querySelector('.image-name').innerText.toLowerCase();
        if (imageName.includes(searchTerm)) {
            container.style.display = 'block';
        } else {
            container.style.display = 'none';
        }
    });
}

function downloadImage(url, fileName) {
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

searchInput.addEventListener('input', handleSearch);

loadImages();