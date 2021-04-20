// import { mockVideos } from '../../mockData';
import loginApi from '../../utils/login.api';

export const GLOBAL_ACTIONS = {
  UPDATE_SEARCH_VALUE: 'UPDATE_SEARCH_VALUE',
  SELECT_VIDEO: 'SELECT_VIDEO',
  SWITCH_THEME: 'SWITCH_THEME',

  ADD_FAVORITE_VIDEO: 'ADD_FAVORITE_VIDEO',
  REMOVE_FAVORITE_VIDEO: 'REMOVE_FAVORITE_VIDEO',

  GET_VIDEOS_REQUEST: 'GET_VIDEOS_REQUEST',
  GET_VIDEOS_SUCCESS: 'GET_VIDEOS_SUCCESS',
  GET_VIDEOS_FAILURE: 'GET_VIDEOS_FAILURE',

  LOGIN_REQUEST: 'LOGIN_REQUEST',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
};

export const switchTheme = (dispatch, themeValue) => {
  dispatch({ type: GLOBAL_ACTIONS.SWITCH_THEME, themeValue });
};

export const onChangeSearch = (dispatch, searchValue) => {
  dispatch({ type: GLOBAL_ACTIONS.UPDATE_SEARCH_VALUE, searchValue });
};

export const fetchVideos = async (dispatch, searchValue, select) => {
  dispatch({ type: GLOBAL_ACTIONS.GET_VIDEOS_REQUEST });
  try {
    const response = await fetch(
      `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=30&q=${searchValue}&type=video&key=${process.env.REACT_APP_API_KEY}`,
      {
        method: 'get',
        headers: { 'Content-Type': 'application/json' },
      }
    );
    const videoList = await response.json();
    // const videoList = mockVideos;
    console.log('FETCHING');
    dispatch({ type: GLOBAL_ACTIONS.GET_VIDEOS_SUCCESS, videoList });
    if (select) {
      const video = videoList.items[0];
      const { title, description, channelTitle } = video?.snippet;
      const { url } = video?.snippet.thumbnails.medium;
      const videoId = video?.id?.videoId;
      const videoSelected = { videoId, title, description, channelTitle, url };
      dispatch({ type: GLOBAL_ACTIONS.SELECT_VIDEO, videoSelected });
    }
  } catch (error) {
    dispatch({ type: GLOBAL_ACTIONS.GET_VIDEOS_FAILURE, error });
  }
};

export const selectVideo = (dispatch, videoSelected) => {
  dispatch({ type: GLOBAL_ACTIONS.SELECT_VIDEO, videoSelected });
};

export const loginUser = async (dispatch, username, password) => {
  dispatch({ type: GLOBAL_ACTIONS.LOGIN_REQUEST });
  try {
    const user = await loginApi(username, password);
    dispatch({ type: GLOBAL_ACTIONS.LOGIN_SUCCESS, user });
    return user;
  } catch (error) {
    const errorAuth = error.message;
    dispatch({ type: GLOBAL_ACTIONS.LOGIN_FAILURE, errorAuth });
    return null;
  }
};

export const logOut = (dispatch) => {
  dispatch({ type: GLOBAL_ACTIONS.LOGOUT });
};

export const addVideo = (dispatch, favoriteVideos) => {
  dispatch({ type: GLOBAL_ACTIONS.ADD_FAVORITE_VIDEO, favoriteVideos });
};

export const removeVideo = (dispatch, favoriteVideos) => {
  dispatch({ type: GLOBAL_ACTIONS.REMOVE_FAVORITE_VIDEO, favoriteVideos });
};
