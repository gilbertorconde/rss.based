import { Audio } from 'expo-av';
import { Sound } from 'expo-av/build/Audio';
import useTheme from 'hooks/useTheme';
import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

export declare type AVPlaybackStatus = {
  error?: string;
  isLoaded: true;
  androidImplementation?: string;
  uri?: string;
  progressUpdateIntervalMillis?: number;
  durationMillis?: number;
  positionMillis?: number;
  playableDurationMillis?: number;
  seekMillisToleranceBefore?: number;
  seekMillisToleranceAfter?: number;
  shouldPlay?: boolean;
  isPlaying?: boolean;
  isBuffering?: boolean;
  rate?: number;
  shouldCorrectPitch?: boolean;
  volume?: number;
  isMuted?: boolean;
  isLooping?: boolean;
  didJustFinish?: boolean;
};

interface Props {
  uri: string
}

const calcProgress = (pos: number | undefined, total: number | undefined) => {
  return (pos || 0) * 100 / (total || 0)
}

const AudioPlayer: FC<Props> = ({ uri }) => {
  const [playing, setPlaying] = useState<boolean>(false);
  const [sound, setSound] = useState<Sound>();
  const [progress, setProgress] = useState<number>(0);
  const { colors } = useTheme();

  const handlePlayPauseButton = async () => {
    if (playing) {
      await pauseSound();
    } else {
      await playSound();
    }
  }

  useEffect(() => {
    let ref: NodeJS.Timeout;
    const fn = () => {
      ref = setTimeout(async () => {
        const soundPlaying = (await sound?.getStatusAsync()) as AVPlaybackStatus;
        setProgress((soundPlaying?.positionMillis || 0) * 100 / (soundPlaying?.durationMillis || 0));
        setProgress(calcProgress(soundPlaying?.positionMillis, soundPlaying?.durationMillis))
        fn();
      }, 1000);
    }
    if (playing) {
      fn();
    }
    return () => clearTimeout(ref);
  }, [playing]);

  async function playSound() {
    let aSound = sound;
    if (!aSound) {
      const { sound: s } = await Audio.Sound.createAsync({ uri: uri });
      aSound = s;
      setSound(s);
    }
    await aSound!.playAsync();
    setPlaying(true);
  }

  const pauseSound = async () => {
    await sound?.pauseAsync();
    setPlaying(false);
  }

  const stopSound = async () => {
    await sound?.stopAsync();
    setSound(undefined);
    setPlaying(false);
    setProgress(0);
  }

  const backwardSound = async () => {
    const soundPlaying = (await sound?.getStatusAsync()) as AVPlaybackStatus;
    const newPos = (soundPlaying?.positionMillis || 0) - (1000 * 20);
    await sound?.playFromPositionAsync(newPos < 0 ? 0 : newPos);
    setProgress(calcProgress(soundPlaying?.positionMillis, soundPlaying?.durationMillis))
  }

  const forwardSound = async () => {
    const soundPlaying = (await sound?.getStatusAsync()) as AVPlaybackStatus;
    const newPos = (soundPlaying?.positionMillis || 0) + (1000 * 30);
    const finalPos = (soundPlaying?.durationMillis || 0);
    await sound?.playFromPositionAsync(newPos > finalPos ? finalPos : newPos);
    setProgress(calcProgress(soundPlaying?.positionMillis, soundPlaying?.durationMillis))
  }

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync(); }
      : undefined;
  }, [sound]);

  const buttonStyle = {
    flex: 1,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    paddingLeft: 11,
    width: 68,
    height: 68,
    elevation: 3,
    size: 38,
    backgroundColor: colors.primary,
    color: colors.title,
  };

  return (
    <View>
      <View style={styles.controls}>
        <Icon.Button {...buttonStyle} name="backward" onPress={backwardSound} />
        <View style={styles.separator} />
        <Icon.Button {...buttonStyle} name={playing ? 'pause' : 'play'} onPress={handlePlayPauseButton} />
        <View style={styles.separator} />
        <Icon.Button {...buttonStyle} name="forward" onPress={forwardSound} />
        <View style={styles.separator} />
        <Icon.Button {...buttonStyle} name="stop" onPress={stopSound} />
      </View>
      <View style={{...styles.progress, backgroundColor: colors.background, width: `${progress}%`}} />
    </View>
  );
}

const styles = StyleSheet.create({
  progress: {
    marginTop: 10,
    height: 5
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  separator: {
    width: 10,
    height: 10,
  },
});

export default AudioPlayer;
