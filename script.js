document.addEventListener("DOMContentLoaded", function(event) {
    const imageGrid = document.getElementById('image-grid');
    const searchInput = document.getElementById('search-bar');

    function loadImagesFromZip(zipFile) {
        JSZip.loadAsync(zipFile)
            .then(function (zip) {
                zip.forEach(function (relativePath, file) {
                    if (file.dir) return;

                    const fileName = file.name.split('/').pop();
                    const fileExtension = fileName.split('.').pop();
                    const imageName = fileName.split('.').slice(0, -1).join('.');

                    const imageContainer = document.createElement('div');
                    imageContainer.className = 'image-container';

                    file.async('blob').then(function (blob) {
                        const imageUrl = URL.createObjectURL(blob);

                        const img = document.createElement('img');
                        img.src = imageUrl;
                        img.alt = imageName;

                        const imageCaption = document.createElement('div');
                        imageCaption.className = 'image-name';
                        imageCaption.innerText = imageName;

                        imageContainer.appendChild(img);
                        imageContainer.appendChild(imageCaption);

                        imageGrid.appendChild(imageContainer);

                        imageContainer.addEventListener('click', () => {
                            downloadImage(imageUrl, fileName, fileExtension);
                        });
                    });
                });
            });
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

    function downloadImage(url, fileName, fileExtension) {
        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    searchInput.addEventListener('input', handleSearch);

    fetch('emoji.zip')
        .then(response => response.arrayBuffer())
        .then(data => {
            loadImagesFromZip(data);
        });
});