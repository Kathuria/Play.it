import { call, all } from "redux-saga/effects";

import { userSagas } from "./user/user.sagas";
import { recentsSagas } from "./recents/recents.sagas";
import { playlistsSagas } from "./playlists/playlists.sagas";
import { playerSagas } from "../redux/player/player.sagas";
import { queueSagas } from "../redux/queue/queue.sagas";

export default function* rootSaga() {
  yield all([
    call(userSagas),
    call(recentsSagas),
    call(playlistsSagas),
    call(playerSagas),
    call(queueSagas),
  ]);
}
