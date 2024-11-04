import { StyleSheet, Text, View } from 'react-native'
import React, { Children } from 'react'

const Layout = ({Children}:any) => {
  return (
    <View>
        { Children }      
    </View>
  )
}

export default Layout

const styles = StyleSheet.create({})