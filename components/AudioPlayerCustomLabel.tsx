import { LabelProps } from '@ptomasroos/react-native-multi-slider';
import React, { FC, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

interface ClockTime {
  hours: number,
  minutes: number,
  seconds: number,
  clock: string
}

const convertTime = (value: number | string): ClockTime => {
  const ms = parseInt(`${value}`, 10);
  const hours = Math.floor(ms / 3600000); // 1 Hour = 36000 Milliseconds
  const minutes = Math.floor((ms % 3600000) / 60000); // 1 Minutes = 60000 Milliseconds
  const seconds = Math.floor(((ms % 360000) % 60000) / 1000); // 1 Second = 1000 Milliseconds
      return {
      hours : hours,
      minutes : minutes,
      seconds : seconds,
      clock : `${
        hours ? `${hours}:` : ''
      }${
        (minutes || hours) ? minutes > 9 ? `${minutes}:` : `0${minutes}:` : ''
      }${
        seconds > 9 ? seconds : `0${seconds}`
      }`
  };
}

const AnimatedView = Animated.createAnimatedComponent(View);

const width = 55;
const pointerWidth = width * 0.47;

interface Props {
  position: number;
  value: number | string;
  pressed: boolean;
};

const getFontSize = (len: number): number => {
  if (len > 7) {
    return 12
  }
  if (len > 5) {
    return 14
  }
  if (len > 2) {
    return 18
  }
  return 38;
}

const LabelBase: FC<Props> = ({ position, value, pressed }) => {
  const scaleValue = useRef(new Animated.Value(0.1)); // Behaves oddly if set to 0
  const cachedPressed = useRef(pressed);

  useEffect(() => {
    Animated.timing(scaleValue.current, {
      toValue: pressed ? 1 : 0.1,
      duration: 200,
      delay: pressed ? 0 : 2000,
      useNativeDriver: false,
    }).start();
    cachedPressed.current = pressed;
  }, [pressed]);

  const time = convertTime(value).clock;
  const fontSize = getFontSize(time.length);

  return (
    Number.isFinite(position) &&
    Number.isFinite(value) ? (
      <AnimatedView
        style={[
          styles.sliderLabel,
          {
            left: position - width / 2,
            opacity: scaleValue.current,
            transform: [
              { translateY: width },
              { scale: scaleValue.current },
              { translateY: -width },
            ],
          },
        ]}
      >
        <View style={styles.pointer} />
        <Text style={{
          ...styles.sliderLabelText,
          fontSize,
        }}>{time}</Text>
      </AnimatedView>
    ) : null
  );
}

const CustomLabel: FC<LabelProps> = ({
  oneMarkerValue,
  twoMarkerValue,
  oneMarkerLeftPosition,
  twoMarkerLeftPosition,
  oneMarkerPressed,
  twoMarkerPressed,
}) => {
  return (
    <View style={styles.parentView}>
      <LabelBase
        position={oneMarkerLeftPosition}
        value={oneMarkerValue}
        pressed={oneMarkerPressed}
      />
      <LabelBase
        position={twoMarkerLeftPosition}
        value={twoMarkerValue}
        pressed={twoMarkerPressed}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  parentView: {
    position: 'relative',
    zIndex: 999,
  },
  sliderLabel: {
    position: 'absolute',
    justifyContent: 'center',
    bottom: '100%',
    width: width,
    height: width,
  },
  sliderLabelText: {
    textAlign: 'center',
    lineHeight: width,
    borderRadius: width / 2,
    borderWidth: 2,
    borderColor: '#999',
    backgroundColor: '#fff',
    flex: 1,
    color: '#aaa',
  },
  pointer: {
    position: 'absolute',
    bottom: -pointerWidth / 4,
    left: (width - pointerWidth) / 2,
    transform: [{ rotate: '45deg' }],
    width: pointerWidth,
    height: pointerWidth,
    backgroundColor: '#999',
  },
});

export default CustomLabel;
