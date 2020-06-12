import React, { Fragment } from "react";
import { connect } from "react-redux";
import PlayArrowRoundedIcon from "@material-ui/icons/PlayArrowRounded";
import PauseRoundedIcon from "@material-ui/icons/PauseRounded";
import SkipPreviousRoundedIcon from "@material-ui/icons/SkipPreviousRounded";
import SkipNextRoundedIcon from "@material-ui/icons/SkipNextRounded";
import RepeatRoundedIcon from "@material-ui/icons/RepeatRounded";
import RepeatOneRoundedIcon from "@material-ui/icons/RepeatOneRounded";
import ShuffleRoundedIcon from "@material-ui/icons/ShuffleRounded";
import VolumeUp from "@material-ui/icons/VolumeUpRounded";
import VolumeOffRoundedIcon from "@material-ui/icons/VolumeOffRounded";

import { formatTime } from "./player.utils";
import {
  toggleIsPaused,
  setCurrTime,
  setDuration,
  toggleIsMuted,
  toggleIsRepeated,
} from "../../redux/player/player.actions";

import RangeSlider from "../range-slider/range-slider.component";

import "./player.styles.scss";

class Player extends React.Component {
  componentDidMount() {
    const { setCurrTime } = this.props;
    this.track = new Audio();
    this.track.addEventListener("timeupdate", () =>
      setCurrTime(this.track.currentTime)
    );
    this.track.volume = 0.2;
  }

  componentWillUnmount() {
    this.track.removeEventListener("timeupdate", () => {});
  }

  playTrack = () => {
    const track = this.track;
    const { isPaused, toggleIsPaused } = this.props;
    let playPromise = track.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          if (isPaused) toggleIsPaused();
        })
        .catch((err) => console.log("Something went wrong.", err));
    }
  };

  pauseTrack = () => {
    const track = this.track;
    const { toggleIsPaused } = this.props;
    track.pause();
    toggleIsPaused();
  };

  seekTrack = (evt, value) => {
    this.track.currentTime = value;
  };

  setVolume = (evt, value) => {
    this.track.volume = value;
  };

  clearPlayer = () => {
    this.props.toggleIsPaused();
    this.track.currentTime = 0;
  };

  toggleMuteTrack = () => {
    const track = this.track;
    track.muted = !track.muted;
    this.props.toggleIsMuted();
  };

  toggleRepeatTrack = () => {
    const track = this.track;
    track.loop = !track.loop;
    this.props.toggleIsRepeated();
  };

  componentDidUpdate(prevProps) {
    if (prevProps.currentTrack !== this.props.currentTrack) {
      const { currentTrack, setDuration } = this.props;
      const track = this.track;
      track.src = currentTrack.src;
      track.onloadedmetadata = () => {
        setDuration(track.duration);
        this.playTrack();
      };
      track.onended = this.clearPlayer;
    }
  }

  render() {
    const {
      currTime,
      isPaused,
      currentTrack,
      duration,
      isMuted,
      isRepeated,
    } = this.props;
    return (
      <div className="player">
        <div className="progress">
          <span className="time">{formatTime(currTime)}</span>
          <div className="bar">
            <RangeSlider
              min={0}
              max={duration}
              value={currTime}
              handleChange={this.seekTrack}
              disabled={Boolean(!currentTrack)}
            />
          </div>
          <span className="time">{formatTime(duration)}</span>
        </div>
        <div className="controles">
          <div className="currently-playing">
            <h3>{currentTrack ? currentTrack.name : ""}</h3>
            <span>{currentTrack ? currentTrack.singer : ""}</span>
          </div>
          <div className="buttons-primary">
            <SkipPreviousRoundedIcon
              color={currentTrack ? "inherit" : "disabled"}
              fontSize="large"
            />
            {isPaused ? (
              <PlayArrowRoundedIcon
                onClick={currentTrack ? this.playTrack : () => {}}
                color={currentTrack ? "inherit" : "disabled"}
                fontSize="large"
              />
            ) : (
              <PauseRoundedIcon
                onClick={this.pauseTrack}
                color={currentTrack ? "inherit" : "disabled"}
                fontSize="large"
              />
            )}
            <SkipNextRoundedIcon
              color={currentTrack ? "inherit" : "disabled"}
              fontSize="large"
            />
          </div>
          <div className="buttons-secondary">
            {isRepeated ? (
              <RepeatOneRoundedIcon
                color={currentTrack ? "inherit" : "disabled"}
                fontSize="default"
                onClick={currentTrack ? this.toggleRepeatTrack : () => {}}
              />
            ) : (
              <RepeatRoundedIcon
                color={currentTrack ? "inherit" : "disabled"}
                fontSize="default"
                onClick={currentTrack ? this.toggleRepeatTrack : () => {}}
              />
            )}

            <ShuffleRoundedIcon
              color={currentTrack ? "inherit" : "disabled"}
              fontSize="default"
            />
            <Fragment>
              {isMuted ? (
                <VolumeOffRoundedIcon
                  color={currentTrack ? "inherit" : "disabled"}
                  onClick={currentTrack ? this.toggleMuteTrack : () => {}}
                  disabled={Boolean(currentTrack)}
                />
              ) : (
                <VolumeUp
                  color={currentTrack ? "inherit" : "disabled"}
                  onClick={currentTrack ? this.toggleMuteTrack : () => {}}
                />
              )}

              <RangeSlider
                min={0}
                max={1}
                step={0.05}
                defaultValue={0.2}
                handleChange={this.setVolume}
                disabled={Boolean(!currentTrack) || isMuted}
              />
            </Fragment>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({
  player: { currentTrack, isPaused, currTime, duration, isMuted, isRepeated },
}) => ({
  currentTrack,
  isPaused,
  currTime,
  duration,
  isMuted,
  isRepeated,
});

const mapDispatchToProps = (dispatch) => ({
  setCurrTime: (time) => dispatch(setCurrTime(time)),
  setDuration: (time) => dispatch(setDuration(time)),
  toggleIsPaused: () => dispatch(toggleIsPaused()),
  toggleIsMuted: () => dispatch(toggleIsMuted()),
  toggleIsRepeated: () => dispatch(toggleIsRepeated()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Player);
