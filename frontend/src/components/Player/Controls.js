import styles from './styles.less';
import React, {useState} from 'react';
import IconButton from '@material-ui/core/IconButton';
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import Grid from '@material-ui/core/Grid';
import {Fullscreen, FullscreenExit, VolumeDown, VolumeOff, VolumeUp} from '@material-ui/icons';
import Slider from '@material-ui/core/Slider';
import {secondsToTime} from '../../lib/time';

export const Controls =
    ({
         room,
         videoTime: {current: time, duration},
         volume,
         onPlay = () => 0,
         onPause = () => 0,
         onSeek = () => 0,
         onMute = () => 0,
         onVolume = () => 0,
         fullscreen,
         onFullscreen = () => 0,
     } = {}) => {
        const [seekTo, setSeekTo] = useState(0);
        const [seeking, setSeeking] = useState(false);

        let VolumeIcon = VolumeDown;
        if(volume > 0.5) VolumeIcon = VolumeUp;
        else if(volume === 0) VolumeIcon = VolumeOff;

        return (<Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
            className={styles.controls}>

            <Grid item>
                <IconButton onClick={room.playing ? onPause : onPlay}>
                    {room.playing ? <PauseIcon/> : <PlayArrowIcon/>}
                </IconButton>
            </Grid>
            <Grid item className={styles.seekControl}>
                <Slider
                    value={seeking ? seekTo : time}
                    valueLabelDisplay="auto"
                    valueLabelFormat={secondsToTime}
                    min={0}
                    max={duration}
                    onMouseDownCapture={() => {
                        setSeekTo(time);
                        setSeeking(true);
                    }}
                    onChange={(_, value) => setSeekTo(value)}
                    onChangeCommitted={() => {
                        setTimeout(() => setSeeking(false), 500);
                        onSeek(seekTo);
                    }}
                />
            </Grid>

            <Grid item>
                <IconButton onClick={onMute}>
                    <VolumeIcon/>
                </IconButton>
            </Grid>
            <Grid item className={styles.volumeControl}>
                <Slider
                    value={volume}
                    onChange={(_, value) => onVolume(value)}
                    min={0}
                    max={1}
                    step={0.01}
                />
            </Grid>
            <Grid item>
                <IconButton onClick={onFullscreen}>
                    {fullscreen ? <FullscreenExit/> : <Fullscreen/>}
                </IconButton>
            </Grid>
        </Grid>);
    };