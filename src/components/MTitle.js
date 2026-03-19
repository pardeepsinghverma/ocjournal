import { Link } from '@react-navigation/native'
import React from 'react'
import { H1, H2, H3, H4, H5, H6, View, XStack } from 'tamagui'

const titleMap = {
  1: H1,
  2: H2,
  3: H3,
  4: H4,
  5: H5,
  6: H6
}

const MTitle = ({
  title,
  level = 4,
  marginBottom = 12,
  marginTop = 20,
  endTitle,
  endLink
}) => {

  const TitleComponent = titleMap[level] || H4

  return (
    <View marginBottom={marginBottom} marginTop={marginTop}>
      <XStack justifyContent="space-between" alignItems="center">

        <TitleComponent>
          {title}
        </TitleComponent>

        {endTitle && endLink && (
          <Link to={endLink}>
            <TitleComponent color="$blue10">
              {endTitle}
            </TitleComponent>
          </Link>
        )}

      </XStack>
    </View>
  )
}

export default MTitle