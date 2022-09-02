import "./sass/main.scss";
import { onScroll, onToTopBtn } from './js/scroll';
import { fetchImages } from './js/fetch-images';
import Notiflix from 'notiflix';
import { renderGallery } from './js/render-gallery';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const loadMoreBtn = document.querySelector('.btn-load-more');
const gallery = document.querySelector('.gallery');
const searchForm = document.querySelector('#search-form');
const infiniteScroll = document.querySelector('.more');
const perPage = 40;
let page = 1;
let query = '';
let simpleLightBox;

const observer = new IntersectionObserver(onLoadMoreBtn, {
   root: null,
   rootMargin: '500px',
   treshold: 1,
});

searchForm.addEventListener('submit', onSearchForm);
// loadMoreBtn.addEventListener('click', onLoadMoreBtn);

onScroll();
onToTopBtn();

function onSearchForm(e) {
   e.preventDefault();
   window.scrollTo({ top: 0 });
   page = 1;
   query = e.currentTarget.searchQuery.value.trim();
   gallery.innerHTML = '';
   loadMoreBtn.classList.add('is-hidden');
   observer.unobserve(infiniteScroll);

   if (query === '') {
      alertNoEmptySearch();
      return;
   };

   fetchImages(query, page, perPage)
      .then(({ data }) => {
         if (data.totalHits === 0) {
            alertNoImagesFound();
         } else {
            renderGallery(data.hits);
            simpleLightBox = new SimpleLightbox('.gallery a').refresh();
            alertImagesFound(data);
            observer.observe(infiniteScroll);
            if (data.totalHits > perPage) {
               loadMoreBtn.classList.remove('is-hidden');
            }
         }
      })
      .catch(error => console.log(error))
      .finally(() => {
         searchForm.reset();
      });
};

function onLoadMoreBtn() {
   page += 1;
   simpleLightBox.destroy();
   fetchImages(query, page, perPage)
      .then(({ data }) => {
         renderGallery(data.hits);
         simpleLightBox = new SimpleLightbox('.gallery a').refresh();
         
         const totalPages = Math.ceil(data.totalHits / perPage);
         if (page > totalPages) {
            loadMoreBtn.classList.add('is-hidden');
            alertEndOfSearch();
            observer.unobserve(infiniteScroll);
         }
      })
      .catch(error => console.log(error));
};

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
   Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
};