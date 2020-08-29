import { takeLatest, call, put, all, select } from "redux-saga/effects";

import { getUserPlaylistsRef } from "../../firebase/firebase.utils";
import { UserActionTypes } from "../user/user.types";
import { PLAYLISTS_ACTION_TYPES } from "./playlists.types";
import { setPlaylistsFromFirebase, clearPlaylists } from "./playlists.actions";
import { selectCurrentUser } from "../user/user.selectors";
import { selectUserPlaylists } from "./playlists.selector";

export function* updatePlaylistsInFirebase() {
  const currentUser = yield select(selectCurrentUser);
  if (currentUser) {
    try {
      const playlistsRef = yield getUserPlaylistsRef(currentUser.userId);
      const playlists = yield select(selectUserPlaylists);
      yield playlistsRef.update({ playlists });
    } catch (error) {
      console.log(error);
    }
  }
}

export function* checkPlaylistsFromFirebase({ payload: { userId } }) {
  try {
    const playlistsRef = yield getUserPlaylistsRef(userId);
    const playlistsSnapshot = yield playlistsRef.get();
    const playlists = playlistsSnapshot.data().playlists;
    if (playlists.length) {
      yield put(setPlaylistsFromFirebase(playlists));
    }
  } catch (error) {
    console.log(error);
  }
}

export function* clearUserPlaylists() {
  yield put(clearPlaylists());
}

export function* onUserSignIn() {
  yield takeLatest(UserActionTypes.SIGN_IN_SUCCESS, checkPlaylistsFromFirebase);
}

export function* onUserSignOut() {
  yield takeLatest(UserActionTypes.SIGN_OUT_SUCCESS, clearUserPlaylists);
}

export function* onPlaylistsUpdate() {
  yield takeLatest(
    [
      PLAYLISTS_ACTION_TYPES.ADD_TO_PLAYLISTS,
      PLAYLISTS_ACTION_TYPES.REMOVE_PLAYLIST_FROM_PLAYLISTS,
      PLAYLISTS_ACTION_TYPES.REMOVE_TRACK_FROM_PLAYLIST,
    ],
    updatePlaylistsInFirebase
  );
}

export function* playlistsSagas() {
  yield all([call(onUserSignIn), call(onPlaylistsUpdate), call(onUserSignOut)]);
}
