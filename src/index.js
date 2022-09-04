
import { fetchImages } from './js/fetch-images';


import "./sass/main.scss";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import { onScroll, onToTopBtn } from './js/scroll';
import fetchImages from './js/fetch-images';
import appendImagesMarkup from './js/render-gallery';

const refs = {
   searchForm: document.querySelector('#search-form'),
   imagesContainer: document.querySelector('.gallery'),
   infiniteScroll: document.querySelector('.more'),
};

const observer = new IntersectionObserver(onLoadMore, {
   root: null,
   rootMargin: '500px',
   treshold: 1,
});

refs.searchForm.addEventListener('submit', onSearch);

let simplelightbox = null;
let page = 1;
let query = '';
const perPage = 40;
let fetchedAll = false;

function onSearch(event) {
   event.preventDefault();

   page = 1;
   query = event.currentTarget.searchQuery.value.trim();

   observer.unobserve(refs.infiniteScroll);
   clearImagesContainer();

   if ('' === query) {
      alertNoEmptySearch();
      return;
   }


   fetchImages(query, page, perPage)
      .then(data => {
         appendImagesMarkup(data.hits);
         simplelightbox = new SimpleLightbox('.gallery a').refresh();
         alertImagesFound(data)
         observer.observe(refs.infiniteScroll);
      })

      .catch(error => {
         Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      });
}

async function onLoadMore(data) {
   if (data[0].isIntersecting) {
      page += 1;

      try {
         await fetchImages(query, page, perPage)
            .then(data => {
               appendImagesMarkup(data.hits);
               const fetchedImages = (page - 1) * perPage + data.hits.length;

               if (fetchedImages >= data.totalHits) {
                  alertEndOfSearch()
                  return;
               }
      
            })
      }
      catch (error) {
         Notify.failure('Oooops, something went wrong, try again');
      };
   }
}
function clearImagesContainer() {
   refs.imagesContainer.innerHTML = '';
}



function alertNoEmptySearch() {
   Notiflix.Notify.failure('The search string cannot be empty. Please specify your search query.');
};

function alertNoImagesFound() {
   Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
   );
};

function alertImagesFound(data) {
   Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
};

function alertEndOfSearch() {
   Notiflix.Notify.success("We're sorry, but you've reached the end of search results.");
};