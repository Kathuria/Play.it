import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { NowPlayingButton } from "../player-buttons/player-buttons.component";

import { selectPlaylistsPlaying } from "../../redux/playlists/playlists.selector";
import {
  toggleIsPlaylistsPlaying,
  setIsPlaylistPlaying,
} from "../../redux/playlists/playlists.actions";
import { addPlaylistToQueue } from "../../redux/queue/queue.actions";
import { setCurrentTrack } from "../../redux/player/player.actions";

import PlaylistPreviewItem from "../playlist-preview-item/playlist-preview-item.component";

import "./playlist-preview-dialog.styles.scss";

const PlaylistPreviewDialog = ({
  playlist,
  toggleHidden,
  handlePlay,
  isPlaylistsPlaying,
  setIsPlaylistPlaying,
  toggleIsPlaylistsPlaying,
  addPlaylistToQueue,
  setCurrentTrack,
}) => {
  let isDeleteable = playlist.tracks.length > 1;
  const isPlaylistPlaying = playlist.isPlaying;

  const handleTrackPlay = (track) => {
    if (!isPlaylistPlaying) {
      if (!isPlaylistsPlaying) toggleIsPlaylistsPlaying();
      addPlaylistToQueue(playlist);
      setIsPlaylistPlaying(playlist);
    }
    setCurrentTrack(track);
  };

  return (
    <div className="playlist-preview-dialog">
      <div className="title-container">
        <h2 className="title">{playlist.name}</h2>
        {isPlaylistPlaying ? (
          <NowPlayingButton />
        ) : (
          <button className="btn" onClick={handlePlay}>
            Play
          </button>
        )}
        <span className="close-btn" onClick={toggleHidden}>
          X
        </span>
      </div>
      <div className="playlist-details">
        <div className="image-container">
          <div
            className="image"
            style={{ backgroundImage: `url(${playlist.tracks[0].imgSrc})` }}
          />
        </div>
        <ul className="tracks-list">
          {playlist.tracks.map((track) => (
            <PlaylistPreviewItem
              key={track.id}
              track={track}
              isPlaylistPlaying={isPlaylistPlaying}
              handleTrackPlay={() => handleTrackPlay(track)}
              playlistId={playlist.id}
              isDeleteable={isDeleteable}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  isPlaylistsPlaying: selectPlaylistsPlaying,
});

const mapDispatchToProps = (dispatch) => ({
  toggleIsPlaylistsPlaying: () => dispatch(toggleIsPlaylistsPlaying()),
  setIsPlaylistPlaying: (playlist) => dispatch(setIsPlaylistPlaying(playlist)),
  addPlaylistToQueue: (playlist) => dispatch(addPlaylistToQueue(playlist)),
  setCurrentTrack: (track) => dispatch(setCurrentTrack(track)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlaylistPreviewDialog);
