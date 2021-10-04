import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { Audio } from 'expo-av';
import { Sound } from 'expo-av/build/Audio';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import useTheme from 'hooks/useTheme';
import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AudioPlayerCustomLabel from './AudioPlayerCustomLabel';

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
  uri: string,
  width: number,
  title: string,
}

const AudioPlayer: FC<Props> = ({ uri, title, width }) => {
  const [playing, setPlaying] = useState<boolean>(false);
  const [sound, setSound] = useState<Sound>();
  const [progress, setProgress] = useState<number>(0);
  const [sliderMax, setSliderMax] = useState<number>(100);
  const { colors } = useTheme();

  const handlePlayPauseButton = async () => {
    if (playing) {
      await pauseSound();
    } else {
      await playSound(progress);
    }
  }

  useEffect(() => {
    let ref: NodeJS.Timeout;
    const fn = () => {
      ref = setTimeout(async () => {
        const soundPlaying = (await sound?.getStatusAsync()) as AVPlaybackStatus;
        setProgress(soundPlaying?.positionMillis || 0);
        fn();
      }, 1000);
    }
    if (playing) {
      fn();
    }
    return () => clearTimeout(ref);
  }, [playing]);

  async function playSound(pos: number) {
    let aSound = sound;
    if (!aSound) {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
        playThroughEarpieceAndroid: false,
      });
      const { sound: s } = await Audio.Sound.createAsync({ uri: uri });
      aSound = s;
      setSound(s);
    }
    let newPos = pos;
    const soundPlaying = (await aSound.getStatusAsync()) as AVPlaybackStatus;
    if (sliderMax === 100 && pos <= 100) {
      setSliderMax(soundPlaying?.durationMillis || 100);
      newPos = pos * (soundPlaying?.durationMillis || 0) / 100;
      setProgress(newPos);
    } else {
      setProgress(newPos);
    }
    await aSound.playFromPositionAsync(newPos);
    activateKeepAwake();
    setPlaying(true);
  }

  const pauseSound = async () => {
    await sound?.pauseAsync();
    deactivateKeepAwake();
    setPlaying(false);
  }

  const stopSound = async () => {
    await sound?.stopAsync();
    setSound(undefined);
    setPlaying(false);
    deactivateKeepAwake();
    setProgress(0);
  }

  const backwardSound = async () => {
    const soundPlaying = (await sound?.getStatusAsync()) as AVPlaybackStatus;
    const newPos = (soundPlaying?.positionMillis || 0) - (1000 * 20);
    await playSound(newPos < 0 ? 0 : newPos);
  }

  const forwardSound = async () => {
    const soundPlaying = (await sound?.getStatusAsync()) as AVPlaybackStatus;
    const newPos = (soundPlaying?.positionMillis || 0) + (1000 * 30);
    const finalPos = (soundPlaying?.durationMillis || 0);
    await playSound(newPos > finalPos ? finalPos : newPos);
  }

  const handleOnSliderChange = async ([value]: number[]) => {
    await playSound(value);
  };

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
      deactivateKeepAwake();
    }
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
    size: 38,
    backgroundColor: colors.primary,
    color: colors.title,
  };

  return (
    <View>
      <View style={styles.controls}>
        <View style={styles.controlButton}>
          <Icon.Button {...buttonStyle} name="backward" onPress={backwardSound} />
        </View>
        <View style={styles.controlButton}>
          <Icon.Button {...buttonStyle} name={playing ? 'pause' : 'play'} onPress={handlePlayPauseButton} />
        </View>
        <View style={styles.controlButton}>
          <Icon.Button {...buttonStyle} name="forward" onPress={forwardSound} />
        </View>
        <View style={styles.controlButton}>
          <Icon.Button {...buttonStyle} name="stop" onPress={stopSound} />
        </View>
      </View>
      <MultiSlider
        min={0}
        max={sliderMax}
        trackStyle={styles.tracker}
        enableLabel
        customLabel={props => <AudioPlayerCustomLabel {...props} />}
        allowOverlap
        markerStyle={{ backgroundColor: colors.primary, ...styles.marker }}
        selectedStyle={{ backgroundColor: colors.primary }}
        values={[progress]}
        sliderLength={width}
        onValuesChangeFinish={handleOnSliderChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  controlButton: {
    elevation: 4,
    borderRadius: 5,
  },
  tracker: {
    height: 16,
    borderRadius: 4,
  },
  marker: {
    width: 20,
    height: 20,
    marginTop: 16,
    elevation: 5,
  }
});

export default AudioPlayer;
