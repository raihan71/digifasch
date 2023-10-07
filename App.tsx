import React, { useEffect, useState, FC, lazy, Suspense, StrictMode } from 'react';
import { View, Text, Image, StyleSheet, StatusBar, ImageBackground, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppIntroSlider from 'react-native-app-intro-slider';
import SplashScreen from 'react-native-splash-screen'
import dataSlide from './src/constant/slide';
import { logoWhite } from './src/constant/img';
const Digifasch = lazy(() => import('./src/view/Digifasch'));

type Item = (typeof dataSlide)[0];

const App: FC = () =>  {
  const [showRealApp, setShowRealApp] = useState(false);
  useEffect( () => {
    let update = true;
    const prepare = async () => {
        try{
            new Promise(resolve => {
              if (update) {
                setTimeout(resolve,1500);
              }
            });
        }catch(e){
            console.warn(e);
        }finally{
            SplashScreen.hide();
        }
    }
    prepare();
    return () => {
      update = false;
    }
  }, []);

  useEffect(() => {
    let update = true;
    const fetch = async () => {
      AsyncStorage.getItem('first_time').then((value) => {
        if (update) {
          setShowRealApp(!!value);
        }
      })
    }
    fetch()
      .catch(err => err)
    return () => {
      update = false;
    }
  }, [showRealApp]);

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
        prevLabel="Sebelumnya"
        nextLabel="Berikutnya"
        doneLabel="Selesai"
        onDone={_onDone}
        onSkip={_onDone}
        skipLabel="Lewati"
        data={dataSlide}
      />
    </View>
  );

  return (
  <StrictMode>
    <Suspense fallback={<ActivityIndicator color="green" size="large" style={styles.loading} />}>
      {showRealApp ? <Digifasch /> : _renderAppSlider}
    </Suspense>
  </StrictMode>
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
    padding: 10,
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
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
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
