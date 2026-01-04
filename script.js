let imageData = [];
let currentImageIndex = 0;

// Initialize carousel functionality
document.getElementById('next').onclick = function(){
    let lists = document.querySelectorAll('.item');
    document.getElementById('slide').appendChild(lists[0]);
    updateActiveSlide();
}

document.getElementById('prev').onclick = function(){
    let lists = document.querySelectorAll('.item');
    document.getElementById('slide').prepend(lists[lists.length - 1]);
    updateActiveSlide();
}

// Add click functionality to images
function addImageClickHandlers() {
    const slides = document.querySelectorAll('.item');
    slides.forEach((slide, index) => {
        slide.onclick = function() {
            // When clicking on any image, shift to the next image (same as next button)
            let lists = document.querySelectorAll('.item');
            document.getElementById('slide').appendChild(lists[0]);
            updateActiveSlide();
        };

        // Add cursor pointer to indicate clickable
        slide.style.cursor = 'pointer';
    });
}

// Function to fetch images from Picsum API
async function fetchImages() {
    const searchTerm = document.getElementById('searchInput').value || 'nature';
    const loadingText = 'Loading images...';

    try {
        // Show loading state
        showLoadingState(loadingText);

        // Fetch random images from Picsum
        const imagePromises = [];
        for (let i = 0; i < 6; i++) {
            imagePromises.push(fetch(`https://picsum.photos/800/600?random=${Math.random()}`).then(response => response.url));
        }

        const imageUrls = await Promise.all(imagePromises);

        // Update slides with new images
        const slides = document.querySelectorAll('.item');
        slides.forEach((slide, index) => {
            if (imageUrls[index]) {
                slide.style.backgroundImage = `url(${imageUrls[index]})`;
                slide.setAttribute('data-image-url', imageUrls[index]);
            }
        });

        // Generate sample data for each image (in a real app, you'd fetch this from an API)
        imageData = imageUrls.map((url, index) => ({
            id: index + 1,
            title: `${searchTerm.charAt(0).toUpperCase() + searchTerm.slice(1)} Image ${index + 1}`,
            description: `Beautiful ${searchTerm} photograph captured with stunning detail and vibrant colors.`,
            author: `Photographer ${index + 1}`,
            dimensions: '800 x 600',
            url: url
        }));

        // Update the left panel with image information
        updateLeftPanel();

        // Update the active slide content
        updateActiveSlide();

    } catch (error) {
        console.error('Error fetching images:', error);
        showLoadingState('Error loading images. Please try again.');
    }
}

// Function to show loading state
function showLoadingState(message) {
    const slides = document.querySelectorAll('.item .name');
    const descriptions = document.querySelectorAll('.item .des');

    slides.forEach(element => {
        element.textContent = message;
    });
    

    descriptions.forEach(element => {
        element.textContent = 'Please wait while we load your images...';
    });
}

// Function to generate sample data for images (since we removed API input)
function generateImageData() {
    const imageUrls = [];
    const slides = document.querySelectorAll('.item');

    slides.forEach((slide) => {
        const url = slide.style.backgroundImage.match(/url\(["']?([^"']*)["']?\)/)[1];
        imageUrls.push(url);
    });

    imageData = imageUrls.map((url, index) => ({
        id: index + 1,
        title: `Image ${index + 1}`,
        description: `Beautiful photograph with stunning detail and vibrant colors.`,
        author: `Photographer ${index + 1}`,
        dimensions: '800 x 600',
        url: url
    }));

    return imageData;
}

// Function to update the left panel with image information
function updateLeftPanel() {
    const container = document.getElementById('imageInfoContainer');
    container.innerHTML = '';

    imageData.forEach((image, index) => {
        const imageInfo = document.createElement('div');
        imageInfo.className = 'image-info';
        imageInfo.innerHTML = `
            <div class="image-title">${image.title}</div>
            <div class="image-description">${image.description}</div>
            <div class="image-details">
                By ${image.author} • ${image.dimensions}
            </div>
        `;

        // Highlight active slide
        if (index === currentImageIndex) {
            imageInfo.style.borderLeft = '3px solid #bac383';
            imageInfo.style.paddingLeft = '10px';
        }

        container.appendChild(imageInfo);
    });
}

// Function to update the active slide content
function updateActiveSlide() {
    const slides = document.querySelectorAll('.item');
    let activeSlide = null;

    // Find the active slide (the one in second position)
    slides.forEach((slide, index) => {
        if (slide.offsetLeft === 0 && slide.offsetTop === 0) {
            activeSlide = slide;
            currentImageIndex = index;
        }
    });

    if (activeSlide && imageData.length > 0) {
        const imageId = parseInt(activeSlide.getAttribute('data-image-id'));
        const image = imageData.find(img => img.id === imageId);

        if (image) {
            document.getElementById(`title-${imageId}`).textContent = image.title;
            document.getElementById(`description-${imageId}`).textContent = image.description;
        }
    }

    // Update left panel highlighting
    updateLeftPanel();
}

// Function to load initial images and data
function loadInitialImages() {
    // Generate data for existing images
    generateImageData();

    // Add click handlers to images
    addImageClickHandlers();

    // Update the left panel with image information
    updateLeftPanel();

    // Update the active slide content
    updateActiveSlide();
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadInitialImages();
});
function loadInitialImages()
{
    generateImageData();
    addImageClickHandlers();
    updateLeftPanel();
    updateActiveSlide();
}