import React, { FC, useRef, useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, StatusBar, ActivityIndicator, BackHandler, ToastAndroid } from 'react-native';
import { WebView } from 'react-native-webview';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import url from './../constant/url.json';
import ExpireStorage from '../service/asyncStorage';

const Digifasch: FC = () =>  {
  const [weburi, setWeburi] = useState<String>('https://app.digifasch.com');
  const [loading, setLoading] = useState(true);
  const [backPressed, setBackPressed] = useState<any>(0);
  const webviewRef = useRef<any>(null);
  const [parentUrl, setParentUrl] = useState<String>('');

  const handleChangeNavigate = (state: any) => {
    if (state) {
      setParentUrl(state?.url);
      setStorage('url', url.DONATUR_DASHBOARD, 10);
      setLoading(true);
    }
  };

  const setStorage = async (key:any, value:any, time: any) => {
    try {
      await ExpireStorage.setItem(key, value, time);
    } catch (error) {
      return error;
    }
  };

  const getStorage = async (key:any) => {
    await ExpireStorage.getItem(key).then((value) => {
        if (value) setWeburi(value);
    });
  }

  const scripts = `const style = document.createElement('style'); style.innerHTML = '.elementor-element-81bd1d0 {margin-top: 30px!important } .elementor-element-f04962c {padding-left: 30px!important;padding-right: 20px!important} .elementor-element-084fd7e {padding-bottom: 20px!important} .elementor-element-69dbaab {background-color:#ffffff!important;position: fixed;left: 0;bottom: 0;width: 100%;z-index: 3;text-align: center; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);} .elementor-element-88ecc64 {background-color:#ffffff!important;position: fixed;left: 0;bottom: 0;width: 100%;z-index: 3;text-align: center; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);} .elementor-element-dc55e9a {background-color:#ffffff!important;position: fixed;left: 0;bottom: 0;width: 100%;z-index: 5;text-align: center; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);} .elementor-element-b03c1f5 {background-color:#ffffff!important;position: fixed;left: 0;bottom: 0;width: 100%;z-index: 3;text-align: center; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);}'; document.head.appendChild(style); document.getElementById("eael-lr-reg-toggle").href = "${parentUrl === url?.DONATUR ? url.DONATUR_DAFTAR : url.PROYEK_DAFTAR}"; document.getElementById("eael-lr-login-toggle").href = "${parentUrl === url?.DONATUR_DAFTAR ? url.DONATUR : url.PROYEK}"; document.getElementById("eael-lr-login-toggle-lostpassword").href = "${parentUrl === url?.DONATUR_PASSWORD ? url.DONATUR : url.PROYEK}"; document.getElementById("eael-lr-lostpassword-toggle").href = "${parentUrl === url?.DONATUR ? url.DONATUR_PASSWORD : url.PROYEK_PASSWORD}";`;

  useEffect(() => {
    getStorage('url')
      .catch(err => err)

  }, [weburi])

  useEffect(() => {
    let update = true;
    const backAction:any = () => {
      if (update) {
        if (backPressed > 0){
          BackHandler.exitApp();
          setBackPressed(0);
        } else {
          setBackPressed(backPressed+1);
          ToastAndroid.show("Tap sekali lagi untuk keluar", ToastAndroid.SHORT);
          setTimeout(() => {
            webviewRef.current?.goBack();
            setBackPressed(0);
          }, 1000);
        };
      }
      return true;
    };

    const backHandler =  BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => {
      backHandler.remove();
      update = false;
    }
  }, [backPressed]);

  const _renderLoading = (
    <>
      {loading ? <ActivityIndicator
        color="green"
        size="large"
        style={styles.loading}
      /> : ''}
    </>
  )
  return (
    <GestureHandlerRootView style={{flex: 1}}>
        <SafeAreaView style={styles.container}>
            <StatusBar
              backgroundColor="transparent"
              translucent={true}
            />
            <WebView
              domStorageEnabled={true}
              startInLoadingState={loading}
              renderLoading={() => _renderLoading}
              incognito={false}
              cacheEnabled={true}
              thirdPartyCookiesEnabled
              sharedCookiesEnabled
              cacheMode={'LOAD_CACHE_ELSE_NETWORK'}
              source={{ uri: `${weburi}` }}
              automaticallyAdjustContentInsets={true}
              onNavigationStateChange={(state) => handleChangeNavigate(state)}
              javaScriptEnabled={true}
              androidLayerType="hardware"
              ref={webviewRef}
              injectedJavaScript={scripts}
            />
        </SafeAreaView>
    </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default Digifasch;