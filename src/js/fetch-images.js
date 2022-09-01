import axios from 'axios';
export { fetchImages };


axios.defaults.baseURL = 'https://pixabay.com/api/';
const KEY = '29647575-185f66041bf3c07be0622bf5a';

async function fetchImages(query, page, perPage) {
   const response = await axios.get(
      `?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`,
   );
   return response;
}