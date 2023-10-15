import React from 'react'
import { View, Text, ImageBackground, StatusBar, Image } from 'react-native'
import AppIntroSlider from 'react-native-app-intro-slider';
import dataSlide from '../constant/slide'

type Item = (typeof dataSlide)[0];

const SliderIntro = ({styles,handle,img}:any) => {
  const _renderItem = ({item}: {item: Item}) => {
    return (
    <ImageBackground
      style={styles.container}
      source={item?.image}
      imageStyle={{opacity: 0.8}}
      alt={`Background image ${item?.title}`}
    >
      <View style={[styles.container, styles.imgColor]}>
        <View style={styles.logoContainer}>
          <Image
            source={img}
            style={styles.logo}
            alt="Logo digifasch"
          />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            {item?.title}
          </Text>
          <Text style={styles.text}>{item?.text}</Text>
        </View>
      </View>
    </ImageBackground>
    );
  };

  const _keyExtractor = (item: Item) => item.title;

  const _renderAppSlider = (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <AppIntroSlider
        keyExtractor={_keyExtractor}
        renderItem={_renderItem}
        showPrevButton
        showSkipButton
        prevLabel="Sebelumnya"
        nextLabel="Berikutnya"
        doneLabel="Selesai"
        onDone={handle?._onDone}
        onSkip={handle?._onDone}
        skipLabel="Lewati"
        data={dataSlide}
      />
    </View>
  );

  return _renderAppSlider;
}

export default SliderIntro