import { X } from '@tamagui/lucide-icons'
import React from 'react'
import { Text, View } from 'tamagui'

const NoData = ({icon, text}) => {
    return (
        <View flex={1} flexDirection='column' alignItems='center' margin={'$4'} gap={'$2'}>
            {
                icon ? icon : <X size={50} />
            }
            <Text>
                {
                    text ? text : 'No Data Found'    
                }
            </Text>
        </View>
  )
}

export default NoData
