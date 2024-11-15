import React from 'react'
import { H1, H2, H3, H4, H5, H6, View } from 'tamagui'

const MTitle = ({ title, level, marginBottom }) => {
    const TitleLevel = () => { 
        if (level === '1') {
            return <H1 marginBottom={0} paddingBottom={0}>{title}</H1>
        } else if (level === '2') {
            return <H2 marginBottom={0} paddingBottom={0}>{title}</H2>
        } else if (level === '3') {
            return <H3 marginBottom={0} paddingBottom={0}>{title}</H3>
        } else if (level === '4') {
            return <H4 marginBottom={0} paddingBottom={0}>{title}</H4>
        } else if (level === '5') {
            return <H5 marginBottom={0} paddingBottom={0}>{title}</H5>
        } else if (level === '6') {
            return <H6 marginBottom={0} paddingBottom={0}>{title}</H6>
        } else {
            return <H4 marginBottom={0} paddingBottom={0}>{title}</H4>
        }
    }
    return (
        <View marginBottom={marginBottom}>
            <TitleLevel />
        </View>
    )
}

export default MTitle