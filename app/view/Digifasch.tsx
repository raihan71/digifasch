import React, { FC, useRef, useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, StatusBar, ActivityIndicator, BackHandler, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import url from './../constant/url.json';

const Digifasch: FC = () =>  {
  const webviewRef = useRef<any>(null);
  const [parentUrl, setParentUrl] = useState<String>('');

  const handleChangeNavigate = (state: any) => {
    if (state) {
      setParentUrl(state?.url);
    }
  };

  const scripts = `const style = document.createElement('style'); style.innerHTML = '.elementor-element-81bd1d0 {margin-top: 30px!important } .elementor-element-f04962c {padding-left: 30px!important;padding-right: 20px!important} .elementor-element-084fd7e {padding-bottom: 20px!important} .elementor-element-69dbaab {background-color:#ffffff!important;position: fixed;left: 0;bottom: 0;width: 100%;z-index: 3;text-align: center; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);} .elementor-element-88ecc64 {background-color:#ffffff!important;position: fixed;left: 0;bottom: 0;width: 100%;z-index: 3;text-align: center; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);} .elementor-element-dc55e9a {background-color:#ffffff!important;position: fixed;left: 0;bottom: 0;width: 100%;z-index: 5;text-align: center; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);} .elementor-element-b03c1f5 {background-color:#ffffff!important;position: fixed;left: 0;bottom: 0;width: 100%;z-index: 3;text-align: center; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);}'; document.head.appendChild(style); document.getElementById("eael-lr-reg-toggle").href = "${parentUrl === url?.DONATUR ? url.DONATUR_DAFTAR : url.PROYEK_DAFTAR}"; document.getElementById("eael-lr-login-toggle").href = "${parentUrl === url?.DONATUR_DAFTAR ? url.DONATUR : url.PROYEK}"; document.getElementById("eael-lr-login-toggle-lostpassword").href = "${parentUrl === url?.DONATUR_PASSWORD ? url.DONATUR : url.PROYEK}"; document.getElementById("eael-lr-lostpassword-toggle").href = "${parentUrl === url?.DONATUR ? url.DONATUR_PASSWORD : url.PROYEK_PASSWORD}";`;

  useEffect(() => {
    const backAction = () => {
      Alert.alert("Konfirmasi", "Yakin Ingin Kembali?", [
        {
          text: "Iya",
          onPress: () => webviewRef.current?.goBack(),
          style: "default"
        },
        { text: "Tidak, Keluar", onPress: () => BackHandler.exitApp(), style: "cancel"}
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
        <SafeAreaView style={styles.container}>
            <StatusBar
              backgroundColor="transparent"
              translucent={true}
            />
            <WebView
              startInLoadingState={true}
              renderLoading={() => (
                <ActivityIndicator
                  color="green"
                  size="large"
                  style={styles.loading}
                />
              )}
              incognito={true}
              cacheEnabled={false}
              cacheMode={'LOAD_NO_CACHE'}
              source={{ uri: 'https://app.digifasch.com' }}
              automaticallyAdjustContentInsets={true}
              onNavigationStateChange={(state) => handleChangeNavigate(state)}
              javaScriptEnabled={true}
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