import type { CardProps } from 'tamagui'
import { Button, Card, H2, H3, H4, Image, Paragraph, XStack, YStack } from 'tamagui'

export function ProductCard({products}: any) {
 
  // const products = [
  //   {
  //     id: 1,
  //     name: 'Sony A7IV',
  //     price: 2499.99,
  //     image: 'https://site.pardeep.app/image/cache/catalog/journal3/products/home/armchair/9-250x250.png',
  //   },
  //   {
  //     id: 2,
  //     name: 'Sony A7IV',
  //     price: 2499.99,
  //     image: 'https://site.pardeep.app/image/cache/catalog/journal3/products/home/armchair/9-250x250.png',
  //   },
  //   {
  //     id: 3,
  //     name: 'Sony A7IV',
  //     price: 2499.99,
  //     image: 'https://site.pardeep.app/image/cache/catalog/journal3/products/home/armchair/9-250x250.png',
  //   },
  //   {
  //     id: 4,
  //     name: 'Sony A7IV',
  //     price: 2499.99,
  //     image: 'https://site.pardeep.app/image/cache/catalog/journal3/products/home/armchair/9-250x250.png',
  //   },
  // ]
  
  return (
    <XStack $sm={{ flexDirection: 'column' }} paddingHorizontal="$4" space>
      <H3>Products</H3>
      <XStack $sm={{ flexDirection: 'row', flexWrap: 'wrap', gap: 20 }} justifyContent='space-between'>
        {products.map((product:any) => (
          <DemoCard key={product.id} maxWidth={'47%'} height={280} />
        ))}
      </XStack>
    </XStack>
  )
}

export function DemoCard(props: CardProps) {
  return (
    <Card size="$1" bordered {...props}>
      
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Image
          src="https://site.pardeep.app/image/cache/catalog/journal3/products/home/armchair/9-250x250.png"
          width={200}
          height={140}
          background={'$background'}
          borderRadius="$4"
        />
        <H4>Sony A7IV</H4>
        <Paragraph numberOfLines={1} theme="alt2">$2,499.99</Paragraph>
      </YStack>
      
      <Card.Footer padded justifyContent='center'>
        <Button borderRadius="$10" width={'100%'} flex={1}>Add to Cart</Button>
      </Card.Footer>

    </Card>
  )
}