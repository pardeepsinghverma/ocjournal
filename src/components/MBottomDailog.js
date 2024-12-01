import { X } from '@tamagui/lucide-icons';
import {
  Adapt,
  Button,
  Dialog,
  ScrollView,
  Sheet,
  Text,
  Unspaced,
  View,
  XStack,
  YStack,
} from 'tamagui';

const BottomDialog = ({ title, dialogTitle, children, buttons }) => {
  return (
    <Dialog modal>
      <Dialog.Trigger asChild>
        <Text>{title}</Text>
      </Dialog.Trigger>

      <Adapt when="sm" platform="touch">
        <Sheet animation="medium" zIndex={200000} modal dismissOnSnapToBottom>
          <Sheet.Frame padding="$4" gap="$2">
            <Adapt.Contents />
          </Sheet.Frame>
          <Sheet.Overlay
            animation="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Sheet>
      </Adapt>

      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="slow"
          backgroundColor={'black'}
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />

        <Dialog.Content
          backgroundColor={'yellow'}
          bordered
          elevate
          key="content"
          animateOnly={['transform', 'opacity']}
          animation={[
            'quicker',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          width="100%"
          alignItems="center"
          justifyContent="center"
        >
          {/* Title Section */}
          <Text fontSize={18} fontWeight={'bold'}>
            {dialogTitle}
          </Text>

          {/* Content Section */}
          <View flex={1} width="100%">
            <ScrollView>
              {children}
            </ScrollView>
          </View>

          {/* Buttons Section */}
          <XStack justifyContent="flex-end" gap={"$4"}>
            {buttons.map((button, index) => (
              <Button
                key={index}
                theme={button.theme || 'default'}
                onPress={button.onPress}
              >
                {button.label}
              </Button>
            ))}
          </XStack>

          {/* Close Button */}
          <Unspaced>
            <Dialog.Close asChild>
              <Button
                position="absolute"
                top="$3"
                right="$3"
                size="$2"
                circular
                icon={X}
              />
            </Dialog.Close>
          </Unspaced>
        </Dialog.Content>

      </Dialog.Portal>
    </Dialog>
  );
};

export default BottomDialog;
