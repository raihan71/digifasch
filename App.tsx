import React, { useEffect, useState, FC } from 'react';
import { View, Text, Image, StyleSheet, StatusBar, ImageBackground} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppIntroSlider from 'react-native-app-intro-slider';
import SplashScreen from 'react-native-splash-screen'
import Digifasch from './app/view/Digifasch';
import dataSlide from './app/constant/slide';
import { logoWhite } from './app/constant/img';

type Item = (typeof dataSlide)[0];

const App: FC = () =>  {
  const [showRealApp, setShowRealApp] = useState(false);
  useEffect( () => {
    const prepare = async () => {
        try{
            new Promise(resolve => setTimeout(resolve,1000)); // wait for 5 secs
        }catch(e){
            console.warn(e);
        }finally{
            SplashScreen.hide();
        }
    }
    prepare();
  });
  const _renderItem = ({item}: {item: Item}) => {
    return (
    <ImageBackground
      style={styles.container}
      source={item?.image}
      imageStyle={{opacity: 0.8}}
    >
      <View style={[styles.container, styles.imgColor]}>
        <View style={styles.logoContainer}>
          <Image
            source={logoWhite}
            style={styles.logo}
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

  useEffect(() => {
    const fetch = async () => {
      AsyncStorage.getItem('first_time').then((value) => {
        setShowRealApp(!!value);
      })
    }
    fetch()
      .catch(err => err)
  }, [])


  const _onDone = async () => {
    await AsyncStorage.setItem('first_time', 'true').then(() => {
      setShowRealApp(true);
    }).catch(err => err);
  };

  const _renderAppSlider = (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <AppIntroSlider
        keyExtractor={_keyExtractor}
        renderItem={_renderItem}
        showPrevButton
        showSkipButton
        onDone={_onDone}
        onSkip={_onDone}
        data={dataSlide}
      />
    </View>
  );

  return (
    <>
      {showRealApp ? <Digifasch /> : _renderAppSlider}
    </>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  text: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    paddingVertical: 20,
    fontSize: 20,
    fontFamily: 'PlusJakartaSans-VariableFont_wght'
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    fontFamily: 'PlusJakartaSans-Italic-VariableFont_wght'
  },
  button: {
    backgroundColor: 'rgba(255, 0, 0, 1)',
    color: '#FFF'
  },
  imgColor: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  titleContainer: {
    paddingTop: 80,
    flex: 2,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  logoContainer: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'flex-end'
  },
  logo: {
    resizeMode: 'contain',
    width: 100,
    height: 100,
  }
});

export default App;
