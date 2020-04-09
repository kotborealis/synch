import React, {useState} from 'react';
import {Player} from '../Player/Player';

export const PlayerStandalone = ({room, initialMute = false, autoplay = true}) => {
    const [playing, setPlaying] = useState(autoplay || room.playing);
    const [videoTime, setVideoTime] = useState({current: 0, duration: 0});

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onSeek = (time) => setVideoTime({...videoTime, current: time});

    return (<Player
        room={{
            ...room,
            time: videoTime.current,
            playing,
        }}
        initialMute={initialMute}
        onPlay={onPlay}
        onPause={onPause}
        onSeek={onSeek}
        fullscreenEnabled={false}
    />);
}