import React from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'

const NoInternet = ({styles,img}:any) => {
  return (
    <View style={styles.container}>
      <View style={styles.lostContainer}>
        <Image
          source={img}
          style={styles.logo}
          alt="No connecction internet"
        />
        <Text>No Connection</Text>
        <TouchableOpacity style={styles.retry}>
          <Text style={{fontSize:20,color:'#ffffff'}}>Retry</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default NoInternet