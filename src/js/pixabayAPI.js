import axios from 'axios';

async function fetchPixabay(searchQuery, pageNum = 1) {
  try {
    const responce = await axios(
      `https://pixabay.com/api/?key=35917773-69c30edf6ec6a269aa0ed0b0d&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${pageNum}`
    );
    return responce.data;
    
  } catch (e) {
    console.log(e);
  }
}

export { fetchPixabay };
