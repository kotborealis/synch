import styles from './styles.less';
import React, {useEffect, useState} from 'react';
import IconButton from '@material-ui/core/IconButton';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import Grid from '@material-ui/core/Grid';
import {VolumeDown, VolumeUp} from '@material-ui/icons';
import Slider from '@material-ui/core/Slider';
import {secondsToTime} from '../../../lib/time';

export const Controls =
    ({
         video,
         room,
         onPlay = () => 0,
         onPause = () => 0,
         onSeek = () => 0,
     } = {}) => {
        const [time, setTime] = useState(0);
        const [seekTo, setSeekTo] = useState(0);
        const [duration, setDuration] = useState(0);
        const [userControl, setUserControl] = useState(false);

        useEffect(() => {
            setInterval(() => {
                if(!video.current) return;

                setTime(video.current.currentTime);
                setDuration(video.current.duration);
            }, 500);
        }, []);

        return (<div className={styles.controls}>
            <IconButton onClick={room.playing ? onPause : onPlay}>
                {room.playing ? <PauseIcon/> : <PlayArrowIcon/>}
            </IconButton>

            <Grid container spacing={2}>
                <Grid item xs>
                    <Slider
                        value={userControl ? seekTo : time}
                        valueLabelDisplay="auto"
                        valueLabelFormat={secondsToTime}
                        min={0}
                        max={duration}
                        onMouseDownCapture={() => {
                            setSeekTo(time);
                            setUserControl(true);
                        }}
                        onChange={(_, value) => setSeekTo(value)}
                        onChangeCommitted={() => {
                            setUserControl(false);
                            onSeek(seekTo);
                        }}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item>
                    <VolumeDown/>
                </Grid>
                <Grid item xs>
                    <Slider/>
                </Grid>
                <Grid item>
                    <VolumeUp/>
                </Grid>
            </Grid>
        </div>);
    };