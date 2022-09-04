
const imagesContainer = document.querySelector('.gallery');

export default function appendImagesMarkup(images) {
   const markup = images
      .map(img => {
         const {id, largeImageURL, webformatURL, tags, likes,  views, comments, downloads,
         } = img;
         return `
         <a class="gallery__link" href="${largeImageURL}">
          <div class="gallery__item" id="${id}">
            <img class="gallery__item-img" src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
              <p class="info-item"><b>Likes</b>${likes}</p>
              <p class="info-item"><b>Views</b>${views}</p>
              <p class="info-item"><b>Comments</b>${comments}</p>
              <p class="info-item"><b>Downloads</b>${downloads}</p>
            </div>
          </div>
        </a>`;
      })
      .join('');
   imagesContainer.insertAdjacentHTML('beforeend', markup);
};