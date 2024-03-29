import axios from 'axios';
import { setAlert } from './alert';

/**
 * Pull trending images from Giphy User
 * @param {integer} offset - Starting position for pulling images
 */

export const getImages = (offset) => async (dispatch) => {
  try {
    const res = await axios.post('/api/images/get-trending', { offset });

    let data = res.data;
    return data;
  } catch (err) {
    console.log(err);
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'error')));
    } else {
      dispatch(setAlert(err.response.data.msg, 'error'));
    }
  }
};

/**
 * Pull images from search query
 * @param {string} query - Starting position for pulling images
 */

export const searchImages = (query) => async (dispatch) => {
  try {
    const res = await axios.post('/api/images/search-images', { query });
    let data = res.data;

    // to be implemented in search history
    if (localStorage.getItem('searches') === null) {
      let searches = [];
      searches[0] = query;
      localStorage.setItem('searches', JSON.stringify(searches));
    } else {
      let searches = JSON.parse(localStorage.getItem('searches'));
      searches.push(query);
      localStorage.setItem('searches', JSON.stringify(searches));
    }

    return data;
  } catch (err) {
    console.log(err);
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'error')));
    } else {
      dispatch(setAlert(err.response.data.msg, 'error'));
    }
  }
};
