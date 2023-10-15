import React, { useEffect, useState, FC, lazy, Suspense, StrictMode } from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from 'react-native-splash-screen'
import { useNetInfo } from '@react-native-community/netinfo';
import { logoWhite, noSignal } from './src/constant/img';

const Digifasch = lazy(() => import('./src/view/Digifasch'));
const SliderIntro = lazy(() => import('./src/view/SliderIntro'));
const NoInternet = lazy(() => import('./src/view/NoInternet'));

const App: FC = () =>  {
  const info = useNetInfo();
  const [showRealApp, setShowRealApp] = useState(false);
  const [loadApp, setLoadApp] = useState(true);

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
            setTimeout(() => setLoadApp(false), 500);
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
      await AsyncStorage.getItem('first_time').then((value) => {
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

  const handle = {
    _onDone: async () => {
      await AsyncStorage.setItem('first_time', 'true').then(() => {
        setShowRealApp(true);
      }).catch(err => err);
    }
  };


  const renderApp = (
    <>
      {info.isConnected === true ?
        showRealApp ? <Digifasch /> : <SliderIntro styles={styles} handle={handle} img={logoWhite} />
      : <NoInternet styles={styles} img={noSignal} />
      }
    </>
  );

  return (
  <StrictMode>
    <Suspense fallback={<ActivityIndicator color="green" size="large" style={styles.loading} />}>
      {!loadApp ? renderApp : ''}
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
  },
  lostContainer: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center'
  },
  retry: {
    width:100,
    height:33,
    backgroundColor:'#0061C1',
    justifyContent:'center',
    alignItems:'center',
    borderRadius:6,
    marginTop:10,
    alignSelf:'center'
  }
});

export default App;
