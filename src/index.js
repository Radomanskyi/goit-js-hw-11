import { refs } from './js/refs';
import { fetchPixabay } from './js/pixabayAPI';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const lightbox = new SimpleLightbox('#gallery a');

refs.searchForm.addEventListener('submit', onUserSearchSub);
refs.loadMoreBtn.addEventListener('click', onClickLoadMore);

let page = 1;

async function onClickLoadMore() {
  page += 1;

  const userSearchValue = localStorage.getItem('userSearch');
  const { hits, totalHits } = await fetchPixabay(userSearchValue, page);

  if (page > totalHits / 40) {
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
    refs.loadMoreBtn.classList.toggle('hidden');
  }
  renderGalleryMarkup(hits);
  lightbox.refresh();
}

function renderGalleryMarkup (images) {
  const marckup = images.map(
    elem => `
    <div class="photo-card">
    <a class="photo-card1" href="${elem.largeImageURL}">
        <img class="photo-card__image" src="${elem.webformatURL}" alt="${elem.tags}" width="180px" height="180px" loading="lazy" />
    </a>
      <div class="info">
          <p class="info-item">
              <b>Likes</b>
              ${elem.likes}
          </p>
          <p class="info-item">
              <b>Views</b>
              ${elem.views}
          </p>
          <p class="info-item">
              <b>Comments</b>
              ${elem.comments}
          </p>
              <p class="info-item">
              <b>Downloads</b>
          ${elem.downloads}
          </p>   
          </div> 
      </div>`
  ).join();
  
  refs.imageContainer.insertAdjacentHTML('beforeend', marckup);
}

async function onUserSearchSub(event) {
  event.preventDefault();
  refs.imageContainer.innerHTML = '';
  page = 1;

  const userSearchValue = refs.searchForm.children.searchQuery.value.trim();

  if (!userSearchValue) {
    refs.loadMoreBtn.classList.add('hidden');
    return;
  }
  const { hits, totalHits } = await fetchPixabay(userSearchValue, page);
  refs.loadMoreBtn.classList.add('hidden');
  renderGalleryMarkup(hits);

  if (totalHits === 0) {
    refs.loadMoreBtn.classList.add('hidden');
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    refs.searchForm.reset();
    return;
  } else {
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    refs.loadMoreBtn.classList.toggle('hidden');
    localStorage.setItem('userSearch', userSearchValue);
  }
  if (totalHits <= 40) {
    refs.loadMoreBtn.classList.add('hidden');
  }
  lightbox.refresh();
  refs.searchForm.reset();
}