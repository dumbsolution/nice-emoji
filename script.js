document.addEventListener("DOMContentLoaded", function(event) {
    const imageGrid = document.getElementById('image-grid');
    const searchInput = document.getElementById('search-bar');

    function loadImagesFromZip(zipFile) {
        JSZip.loadAsync(zipFile)
            .then(function (zip) {
                const imagePromises = [];

                zip.forEach(function (relativePath, file) {
                    if (file.dir) return;

                    const imageName = file.name.split('/').pop().split('.')[0];
                    const imageContainer = document.createElement('div');
                    imageContainer.className = 'image-container';

                    imagePromises.push(
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
                                downloadImage(imageUrl, imageName);
                            });
                        })
                    );
                });

                return Promise.all(imagePromises);
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

    function downloadImage(url, fileName) {
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
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