const imagesLoaded = require('imagesloaded');

// Imagens responsivas + pré-carregamento = carregamentos de imagem mais rápidos #


// Preload images
const preloadImages = (selector = 'img') => {
    return new Promise((resolve) => {
        imagesLoaded(document.querySelectorAll(selector), {background: true}, resolve);
    });
};


export { 
    preloadImages
};