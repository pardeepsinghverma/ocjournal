// src/screens/HomeScreen.js
import React, { useLayoutEffect } from 'react';
import { View, Text } from 'tamagui';
import ProductGrid from '../../modules/productGrid';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function CatalogScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const categoryId = route.params?.categoryId;
  const categoryName = route.params?.categoryName;

  useLayoutEffect(() => {
    if (categoryName) {
      navigation.setOptions({ title: categoryName });
    }
  }, [navigation, categoryName]);

  const item = {
    "products": {
      "59": {
        "classes": {
          "0": "",
          "swiper-slide": false,
          "isotope-item": false
        },
        "quantity": "500",
        "stock_status": "In Stock",
        "thumb2x": "https://image-test-sa.fathersolution.com/m/1/1541/0541/image/cache/catalog/stock-abstract-online-shop-logo-designs-template-illustration-graphic-of-smartphone-free-vector-700x700f.jpg",
        "second_thumb": false,
        "second_thumb2x": false,
        "labels": {
          "29": {
            "type": "custom",
            "label": "New",
            "display": "default"
          }
        },
        "extra_buttons": {
          "46": {
            "type": "custom",
            "label": "Buy Now",
            "action": "quickbuy",
            "link": {
              "type": "popup",
              "id": "22",
              "href": "javascript:open_popup(22)",
              "name": "",
              "total": null,
              "attrs": [],
              "classes": []
            }
          },
          "93": {
            "type": "custom",
            "label": "Question",
            "action": "link",
            "link": {
              "type": "popup",
              "id": "22",
              "href": "javascript:open_popup(22)",
              "name": "",
              "total": null,
              "attrs": [],
              "classes": []
            }
          }
        },
        "date_end": null,
        "price_value": true,
        "stat1": null,
        "stat2": {
          "label": "Product code",
          "text": "1005006833620834"
        },
        "product_id": "59",
        "thumb": "https://rukminim3.flixcart.com/image/388/494/xif0q/hand-messenger-bag/v/x/z/fashion-designer-custom-purses-ladies-bags-handbags-0082-hand-enriched-1-original-imaghq6mfcakugmu.jpeg?q=60&crop=false",
        "name": "Zarikon Romanian bracelets for women, stainless steel, simple, engineering jewelry, friendship, wholesale, simple sale, simple",
        "description": "window.adminAccountId=2675883498;..",
        "price": "SR.12.34",
        "special": false,
        "tax": "SR.12.34",
        "minimum": "1",
        "rating": 0,
        "href": "https://dev301.fathershops-test.xyz/?route=product/product&amp;product_id=59"
      },
      // "79": {
      //   "classes": {
      //     "0": "",
      //     "swiper-slide": false,
      //     "isotope-item": false
      //   },
      //   "quantity": "500",
      //   "stock_status": "In Stock",
      //   "thumb2x": "https://image-test-sa.fathersolution.com/fs/no_image-700x700f.jpg",
      //   "second_thumb": "https://image-test-sa.fathersolution.com/fs/no_image-350x350f.jpg",
      //   "second_thumb2x": "https://image-test-sa.fathersolution.com/fs/no_image-700x700f.jpg",
      //   "labels": {
      //     "29": {
      //       "type": "custom",
      //       "label": "New",
      //       "display": "default"
      //     }
      //   },
      //   "extra_buttons": {
      //     "46": {
      //       "type": "custom",
      //       "label": "Buy Now",
      //       "action": "quickbuy",
      //       "link": {
      //         "type": "popup",
      //         "id": "22",
      //         "href": "javascript:open_popup(22)",
      //         "name": "",
      //         "total": null,
      //         "attrs": [],
      //         "classes": []
      //       }
      //     },
      //     "93": {
      //       "type": "custom",
      //       "label": "Question",
      //       "action": "link",
      //       "link": {
      //         "type": "popup",
      //         "id": "22",
      //         "href": "javascript:open_popup(22)",
      //         "name": "",
      //         "total": null,
      //         "attrs": [],
      //         "classes": []
      //       }
      //     }
      //   },
      //   "date_end": null,
      //   "price_value": true,
      //   "stat1": null,
      //   "stat2": {
      //     "label": "Product code",
      //     "text": "1005002697669454"
      //   },
      //   "product_id": "79",
      //   "thumb": "https://image-test-sa.fathersolution.com/fs/no_image-350x350f.jpg",
      //   "name": "Zircon x metals hop earrings for women, neo Gothic girls luxury jewelry collection, simple Korean fashion, wedding party accessories, 2023",
      //   "description": "..",
      //   "price": "SR.31.58",
      //   "special": false,
      //   "tax": "SR.31.58",
      //   "minimum": "1",
      //   "rating": 0,
      //   "href": "https://dev301.fathershops-test.xyz/?route=product/product&amp;product_id=79"
      // },
      // "104": {
      //   "classes": {
      //     "0": "",
      //     "swiper-slide": false,
      //     "isotope-item": false
      //   },
      //   "quantity": "500",
      //   "stock_status": "In Stock",
      //   "thumb2x": "https://image-test-sa.fathersolution.com/m/1/1541/0541/image/cache/catalog/fatherstock/products/104/product_image_aesa_1005007568708545-700x700f.jpg",
      //   "second_thumb": false,
      //   "second_thumb2x": false,
      //   "labels": {
      //     "29": {
      //       "type": "custom",
      //       "label": "New",
      //       "display": "default"
      //     }
      //   },
      //   "extra_buttons": {
      //     "46": {
      //       "type": "custom",
      //       "label": "Buy Now",
      //       "action": "quickbuy",
      //       "link": {
      //         "type": "popup",
      //         "id": "22",
      //         "href": "javascript:open_popup(22)",
      //         "name": "",
      //         "total": null,
      //         "attrs": [],
      //         "classes": []
      //       }
      //     },
      //     "93": {
      //       "type": "custom",
      //       "label": "Question",
      //       "action": "link",
      //       "link": {
      //         "type": "popup",
      //         "id": "22",
      //         "href": "javascript:open_popup(22)",
      //         "name": "",
      //         "total": null,
      //         "attrs": [],
      //         "classes": []
      //       }
      //     }
      //   },
      //   "date_end": null,
      //   "price_value": true,
      //   "stat1": null,
      //   "stat2": {
      //     "label": "Product code",
      //     "text": "1005007568708545"
      //   },
      //   "product_id": "104",
      //   "thumb": "https://image-test-sa.fathersolution.com/m/1/1541/0541/image/cache/catalog/fatherstock/products/104/product_image_aesa_1005007568708545-350x350f.jpg",
      //   "name": "Football mortar for the foot muscles, treatment for relaxation with a remote control, physical therapy with partial current",
      //   "description": "&nbsp;\nFoldable foot massage pillow, foot massager, a natural remedy carpet for micro -stream, portable foot treatment equipment to form beautiful leg..",
      //   "price": "SR.59.77",
      //   "special": false,
      //   "tax": "SR.59.77",
      //   "minimum": "1",
      //   "rating": 0,
      //   "href": "https://dev301.fathershops-test.xyz/?route=product/product&amp;product_id=104"
      // },
      // "539": {
      //   "classes": {
      //     "0": "",
      //     "swiper-slide": false,
      //     "isotope-item": false
      //   },
      //   "quantity": "500",
      //   "stock_status": "In Stock",
      //   "thumb2x": "https://image-test-sa.fathersolution.com/m/1/1541/0541/image/cache/catalog/stock-abstract-online-shop-logo-designs-template-illustration-graphic-of-smartphone-free-vector-700x700f.jpg",
      //   "second_thumb": false,
      //   "second_thumb2x": false,
      //   "labels": {
      //     "29": {
      //       "type": "custom",
      //       "label": "New",
      //       "display": "default"
      //     }
      //   },
      //   "extra_buttons": {
      //     "46": {
      //       "type": "custom",
      //       "label": "Buy Now",
      //       "action": "quickbuy",
      //       "link": {
      //         "type": "popup",
      //         "id": "22",
      //         "href": "javascript:open_popup(22)",
      //         "name": "",
      //         "total": null,
      //         "attrs": [],
      //         "classes": []
      //       }
      //     },
      //     "93": {
      //       "type": "custom",
      //       "label": "Question",
      //       "action": "link",
      //       "link": {
      //         "type": "popup",
      //         "id": "22",
      //         "href": "javascript:open_popup(22)",
      //         "name": "",
      //         "total": null,
      //         "attrs": [],
      //         "classes": []
      //       }
      //     }
      //   },
      //   "date_end": null,
      //   "price_value": true,
      //   "stat1": null,
      //   "stat2": {
      //     "label": "Product code",
      //     "text": "1005006833620834"
      //   },
      //   "product_id": "539",
      //   "thumb": "https://image-test-sa.fathersolution.com/m/1/1541/0541/image/cache/catalog/stock-abstract-online-shop-logo-designs-template-illustration-graphic-of-smartphone-free-vector-350x350f.jpg",
      //   "name": "Zarikon Romanian bracelets for women, stainless steel, simple, engineering jewelry, friendship, wholesale, simple sale, simple",
      //   "description": "window.adminAccountId=2675883498;..",
      //   "price": "SR.12.34",
      //   "special": false,
      //   "tax": "SR.12.34",
      //   "minimum": "1",
      //   "rating": 0,
      //   "href": "https://dev301.fathershops-test.xyz/?route=product/product&amp;product_id=59"
      // },
      // "749": {
      //   "classes": {
      //     "0": "",
      //     "swiper-slide": false,
      //     "isotope-item": false
      //   },
      //   "quantity": "500",
      //   "stock_status": "In Stock",
      //   "thumb2x": "https://image-test-sa.fathersolution.com/fs/no_image-700x700f.jpg",
      //   "second_thumb": "https://image-test-sa.fathersolution.com/fs/no_image-350x350f.jpg",
      //   "second_thumb2x": "https://image-test-sa.fathersolution.com/fs/no_image-700x700f.jpg",
      //   "labels": {
      //     "29": {
      //       "type": "custom",
      //       "label": "New",
      //       "display": "default"
      //     }
      //   },
      //   "extra_buttons": {
      //     "46": {
      //       "type": "custom",
      //       "label": "Buy Now",
      //       "action": "quickbuy",
      //       "link": {
      //         "type": "popup",
      //         "id": "22",
      //         "href": "javascript:open_popup(22)",
      //         "name": "",
      //         "total": null,
      //         "attrs": [],
      //         "classes": []
      //       }
      //     },
      //     "93": {
      //       "type": "custom",
      //       "label": "Question",
      //       "action": "link",
      //       "link": {
      //         "type": "popup",
      //         "id": "22",
      //         "href": "javascript:open_popup(22)",
      //         "name": "",
      //         "total": null,
      //         "attrs": [],
      //         "classes": []
      //       }
      //     }
      //   },
      //   "date_end": null,
      //   "price_value": true,
      //   "stat1": null,
      //   "stat2": {
      //     "label": "Product code",
      //     "text": "1005002697669454"
      //   },
      //   "product_id": "749",
      //   "thumb": "https://image-test-sa.fathersolution.com/fs/no_image-350x350f.jpg",
      //   "name": "Zircon x metals hop earrings for women, neo Gothic girls luxury jewelry collection, simple Korean fashion, wedding party accessories, 2023",
      //   "description": "..",
      //   "price": "SR.31.58",
      //   "special": false,
      //   "tax": "SR.31.58",
      //   "minimum": "1",
      //   "rating": 0,
      //   "href": "https://dev301.fathershops-test.xyz/?route=product/product&amp;product_id=79"
      // },
      // "1044": {
      //   "classes": {
      //     "0": "",
      //     "swiper-slide": false,
      //     "isotope-item": false
      //   },
      //   "quantity": "500",
      //   "stock_status": "In Stock",
      //   "thumb2x": "https://image-test-sa.fathersolution.com/m/1/1541/0541/image/cache/catalog/fatherstock/products/104/product_image_aesa_1005007568708545-700x700f.jpg",
      //   "second_thumb": false,
      //   "second_thumb2x": false,
      //   "labels": {
      //     "29": {
      //       "type": "custom",
      //       "label": "New",
      //       "display": "default"
      //     }
      //   },
      //   "extra_buttons": {
      //     "46": {
      //       "type": "custom",
      //       "label": "Buy Now",
      //       "action": "quickbuy",
      //       "link": {
      //         "type": "popup",
      //         "id": "22",
      //         "href": "javascript:open_popup(22)",
      //         "name": "",
      //         "total": null,
      //         "attrs": [],
      //         "classes": []
      //       }
      //     },
      //     "93": {
      //       "type": "custom",
      //       "label": "Question",
      //       "action": "link",
      //       "link": {
      //         "type": "popup",
      //         "id": "22",
      //         "href": "javascript:open_popup(22)",
      //         "name": "",
      //         "total": null,
      //         "attrs": [],
      //         "classes": []
      //       }
      //     }
      //   },
      //   "date_end": null,
      //   "price_value": true,
      //   "stat1": null,
      //   "stat2": {
      //     "label": "Product code",
      //     "text": "1005007568708545"
      //   },
      //   "product_id": "1044",
      //   "thumb": "https://image-test-sa.fathersolution.com/m/1/1541/0541/image/cache/catalog/fatherstock/products/104/product_image_aesa_1005007568708545-350x350f.jpg",
      //   "name": "Football mortar for the foot muscles, treatment for relaxation with a remote control, physical therapy with partial current",
      //   "description": "&nbsp;\nFoldable foot massage pillow, foot massager, a natural remedy carpet for micro -stream, portable foot treatment equipment to form beautiful leg..",
      //   "price": "SR.59.77",
      //   "special": false,
      //   "tax": "SR.59.77",
      //   "minimum": "1",
      //   "rating": 0,
      //   "href": "https://dev301.fathershops-test.xyz/?route=product/product&amp;product_id=104"
      // },
      // "5139": {
      //   "classes": {
      //     "0": "",
      //     "swiper-slide": false,
      //     "isotope-item": false
      //   },
      //   "quantity": "500",
      //   "stock_status": "In Stock",
      //   "thumb2x": "https://image-test-sa.fathersolution.com/m/1/1541/0541/image/cache/catalog/stock-abstract-online-shop-logo-designs-template-illustration-graphic-of-smartphone-free-vector-700x700f.jpg",
      //   "second_thumb": false,
      //   "second_thumb2x": false,
      //   "labels": {
      //     "29": {
      //       "type": "custom",
      //       "label": "New",
      //       "display": "default"
      //     }
      //   },
      //   "extra_buttons": {
      //     "46": {
      //       "type": "custom",
      //       "label": "Buy Now",
      //       "action": "quickbuy",
      //       "link": {
      //         "type": "popup",
      //         "id": "22",
      //         "href": "javascript:open_popup(22)",
      //         "name": "",
      //         "total": null,
      //         "attrs": [],
      //         "classes": []
      //       }
      //     },
      //     "93": {
      //       "type": "custom",
      //       "label": "Question",
      //       "action": "link",
      //       "link": {
      //         "type": "popup",
      //         "id": "22",
      //         "href": "javascript:open_popup(22)",
      //         "name": "",
      //         "total": null,
      //         "attrs": [],
      //         "classes": []
      //       }
      //     }
      //   },
      //   "date_end": null,
      //   "price_value": true,
      //   "stat1": null,
      //   "stat2": {
      //     "label": "Product code",
      //     "text": "1005006833620834"
      //   },
      //   "product_id": "5139",
      //   "thumb": "https://image-test-sa.fathersolution.com/m/1/1541/0541/image/cache/catalog/stock-abstract-online-shop-logo-designs-template-illustration-graphic-of-smartphone-free-vector-350x350f.jpg",
      //   "name": "Zarikon Romanian bracelets for women, stainless steel, simple, engineering jewelry, friendship, wholesale, simple sale, simple",
      //   "description": "window.adminAccountId=2675883498;..",
      //   "price": "SR.12.34",
      //   "special": false,
      //   "tax": "SR.12.34",
      //   "minimum": "1",
      //   "rating": 0,
      //   "href": "https://dev301.fathershops-test.xyz/?route=product/product&amp;product_id=59"
      // },
      // "7429": {
      //   "classes": {
      //     "0": "",
      //     "swiper-slide": false,
      //     "isotope-item": false
      //   },
      //   "quantity": "500",
      //   "stock_status": "In Stock",
      //   "thumb2x": "https://image-test-sa.fathersolution.com/fs/no_image-700x700f.jpg",
      //   "second_thumb": "https://image-test-sa.fathersolution.com/fs/no_image-350x350f.jpg",
      //   "second_thumb2x": "https://image-test-sa.fathersolution.com/fs/no_image-700x700f.jpg",
      //   "labels": {
      //     "29": {
      //       "type": "custom",
      //       "label": "New",
      //       "display": "default"
      //     }
      //   },
      //   "extra_buttons": {
      //     "46": {
      //       "type": "custom",
      //       "label": "Buy Now",
      //       "action": "quickbuy",
      //       "link": {
      //         "type": "popup",
      //         "id": "22",
      //         "href": "javascript:open_popup(22)",
      //         "name": "",
      //         "total": null,
      //         "attrs": [],
      //         "classes": []
      //       }
      //     },
      //     "93": {
      //       "type": "custom",
      //       "label": "Question",
      //       "action": "link",
      //       "link": {
      //         "type": "popup",
      //         "id": "22",
      //         "href": "javascript:open_popup(22)",
      //         "name": "",
      //         "total": null,
      //         "attrs": [],
      //         "classes": []
      //       }
      //     }
      //   },
      //   "date_end": null,
      //   "price_value": true,
      //   "stat1": null,
      //   "stat2": {
      //     "label": "Product code",
      //     "text": "1005002697669454"
      //   },
      //   "product_id": "7429",
      //   "thumb": "https://image-test-sa.fathersolution.com/fs/no_image-350x350f.jpg",
      //   "name": "Zircon x metals hop earrings for women, neo Gothic girls luxury jewelry collection, simple Korean fashion, wedding party accessories, 2023",
      //   "description": "..",
      //   "price": "SR.31.58",
      //   "special": false,
      //   "tax": "SR.31.58",
      //   "minimum": "1",
      //   "rating": 0,
      //   "href": "https://dev301.fathershops-test.xyz/?route=product/product&amp;product_id=79"
      // },
      // "10424": {
      //   "classes": {
      //     "0": "",
      //     "swiper-slide": false,
      //     "isotope-item": false
      //   },
      //   "quantity": "500",
      //   "stock_status": "In Stock",
      //   "thumb2x": "https://image-test-sa.fathersolution.com/m/1/1541/0541/image/cache/catalog/fatherstock/products/104/product_image_aesa_1005007568708545-700x700f.jpg",
      //   "second_thumb": false,
      //   "second_thumb2x": false,
      //   "labels": {
      //     "29": {
      //       "type": "custom",
      //       "label": "New",
      //       "display": "default"
      //     }
      //   },
      //   "extra_buttons": {
      //     "46": {
      //       "type": "custom",
      //       "label": "Buy Now",
      //       "action": "quickbuy",
      //       "link": {
      //         "type": "popup",
      //         "id": "22",
      //         "href": "javascript:open_popup(22)",
      //         "name": "",
      //         "total": null,
      //         "attrs": [],
      //         "classes": []
      //       }
      //     },
      //     "93": {
      //       "type": "custom",
      //       "label": "Question",
      //       "action": "link",
      //       "link": {
      //         "type": "popup",
      //         "id": "22",
      //         "href": "javascript:open_popup(22)",
      //         "name": "",
      //         "total": null,
      //         "attrs": [],
      //         "classes": []
      //       }
      //     }
      //   },
      //   "date_end": null,
      //   "price_value": true,
      //   "stat1": null,
      //   "stat2": {
      //     "label": "Product code",
      //     "text": "1005007568708545"
      //   },
      //   "product_id": "10424",
      //   "thumb": "https://image-test-sa.fathersolution.com/m/1/1541/0541/image/cache/catalog/fatherstock/products/104/product_image_aesa_1005007568708545-350x350f.jpg",
      //   "name": "Football mortar for the foot muscles, treatment for relaxation with a remote control, physical therapy with partial current",
      //   "description": "&nbsp;\nFoldable foot massage pillow, foot massager, a natural remedy carpet for micro -stream, portable foot treatment equipment to form beautiful leg..",
      //   "price": "SR.59.77",
      //   "special": false,
      //   "tax": "SR.59.77",
      //   "minimum": "1",
      //   "rating": 0,
      //   "href": "https://dev301.fathershops-test.xyz/?route=product/product&amp;product_id=104"
      // },
      // "51139": {
      //   "classes": {
      //     "0": "",
      //     "swiper-slide": false,
      //     "isotope-item": false
      //   },
      //   "quantity": "500",
      //   "stock_status": "In Stock",
      //   "thumb2x": "https://image-test-sa.fathersolution.com/m/1/1541/0541/image/cache/catalog/stock-abstract-online-shop-logo-designs-template-illustration-graphic-of-smartphone-free-vector-700x700f.jpg",
      //   "second_thumb": false,
      //   "second_thumb2x": false,
      //   "labels": {
      //     "29": {
      //       "type": "custom",
      //       "label": "New",
      //       "display": "default"
      //     }
      //   },
      //   "extra_buttons": {
      //     "46": {
      //       "type": "custom",
      //       "label": "Buy Now",
      //       "action": "quickbuy",
      //       "link": {
      //         "type": "popup",
      //         "id": "22",
      //         "href": "javascript:open_popup(22)",
      //         "name": "",
      //         "total": null,
      //         "attrs": [],
      //         "classes": []
      //       }
      //     },
      //     "93": {
      //       "type": "custom",
      //       "label": "Question",
      //       "action": "link",
      //       "link": {
      //         "type": "popup",
      //         "id": "22",
      //         "href": "javascript:open_popup(22)",
      //         "name": "",
      //         "total": null,
      //         "attrs": [],
      //         "classes": []
      //       }
      //     }
      //   },
      //   "date_end": null,
      //   "price_value": true,
      //   "stat1": null,
      //   "stat2": {
      //     "label": "Product code",
      //     "text": "1005006833620834"
      //   },
      //   "product_id": "51139",
      //   "thumb": "https://image-test-sa.fathersolution.com/m/1/1541/0541/image/cache/catalog/stock-abstract-online-shop-logo-designs-template-illustration-graphic-of-smartphone-free-vector-350x350f.jpg",
      //   "name": "Zarikon Romanian bracelets for women, stainless steel, simple, engineering jewelry, friendship, wholesale, simple sale, simple",
      //   "description": "window.adminAccountId=2675883498;..",
      //   "price": "SR.12.34",
      //   "special": false,
      //   "tax": "SR.12.34",
      //   "minimum": "1",
      //   "rating": 0,
      //   "href": "https://dev301.fathershops-test.xyz/?route=product/product&amp;product_id=59"
      // },
      // "742219": {
      //   "classes": {
      //     "0": "",
      //     "swiper-slide": false,
      //     "isotope-item": false
      //   },
      //   "quantity": "500",
      //   "stock_status": "In Stock",
      //   "thumb2x": "https://image-test-sa.fathersolution.com/fs/no_image-700x700f.jpg",
      //   "second_thumb": "https://image-test-sa.fathersolution.com/fs/no_image-350x350f.jpg",
      //   "second_thumb2x": "https://image-test-sa.fathersolution.com/fs/no_image-700x700f.jpg",
      //   "labels": {
      //     "29": {
      //       "type": "custom",
      //       "label": "New",
      //       "display": "default"
      //     }
      //   },
      //   "extra_buttons": {
      //     "46": {
      //       "type": "custom",
      //       "label": "Buy Now",
      //       "action": "quickbuy",
      //       "link": {
      //         "type": "popup",
      //         "id": "22",
      //         "href": "javascript:open_popup(22)",
      //         "name": "",
      //         "total": null,
      //         "attrs": [],
      //         "classes": []
      //       }
      //     },
      //     "93": {
      //       "type": "custom",
      //       "label": "Question",
      //       "action": "link",
      //       "link": {
      //         "type": "popup",
      //         "id": "22",
      //         "href": "javascript:open_popup(22)",
      //         "name": "",
      //         "total": null,
      //         "attrs": [],
      //         "classes": []
      //       }
      //     }
      //   },
      //   "date_end": null,
      //   "price_value": true,
      //   "stat1": null,
      //   "stat2": {
      //     "label": "Product code",
      //     "text": "1005002697669454"
      //   },
      //   "product_id": "742219",
      //   "thumb": "https://image-test-sa.fathersolution.com/fs/no_image-350x350f.jpg",
      //   "name": "Zircon x metals hop earrings for women, neo Gothic girls luxury jewelry collection, simple Korean fashion, wedding party accessories, 2023",
      //   "description": "..",
      //   "price": "SR.31.58",
      //   "special": false,
      //   "tax": "SR.31.58",
      //   "minimum": "1",
      //   "rating": 0,
      //   "href": "https://dev301.fathershops-test.xyz/?route=product/product&amp;product_id=79"
      // },
      // "104224": {
      //   "classes": {
      //     "0": "",
      //     "swiper-slide": false,
      //     "isotope-item": false
      //   },
      //   "quantity": "500",
      //   "stock_status": "In Stock",
      //   "thumb2x": "https://image-test-sa.fathersolution.com/m/1/1541/0541/image/cache/catalog/fatherstock/products/104/product_image_aesa_1005007568708545-700x700f.jpg",
      //   "second_thumb": false,
      //   "second_thumb2x": false,
      //   "labels": {
      //     "29": {
      //       "type": "custom",
      //       "label": "New",
      //       "display": "default"
      //     }
      //   },
      //   "extra_buttons": {
      //     "46": {
      //       "type": "custom",
      //       "label": "Buy Now",
      //       "action": "quickbuy",
      //       "link": {
      //         "type": "popup",
      //         "id": "22",
      //         "href": "javascript:open_popup(22)",
      //         "name": "",
      //         "total": null,
      //         "attrs": [],
      //         "classes": []
      //       }
      //     },
      //     "93": {
      //       "type": "custom",
      //       "label": "Question",
      //       "action": "link",
      //       "link": {
      //         "type": "popup",
      //         "id": "22",
      //         "href": "javascript:open_popup(22)",
      //         "name": "",
      //         "total": null,
      //         "attrs": [],
      //         "classes": []
      //       }
      //     }
      //   },
      //   "date_end": null,
      //   "price_value": true,
      //   "stat1": null,
      //   "stat2": {
      //     "label": "Product code",
      //     "text": "1005007568708545"
      //   },
      //   "product_id": "104224",
      //   "thumb": "https://image-test-sa.fathersolution.com/m/1/1541/0541/image/cache/catalog/fatherstock/products/104/product_image_aesa_1005007568708545-350x350f.jpg",
      //   "name": "Football mortar for the foot muscles, treatment for relaxation with a remote control, physical therapy with partial current",
      //   "description": "&nbsp;\nFoldable foot massage pillow, foot massager, a natural remedy carpet for micro -stream, portable foot treatment equipment to form beautiful leg..",
      //   "price": "SR.59.77",
      //   "special": false,
      //   "tax": "SR.59.77",
      //   "minimum": "1",
      //   "rating": 0,
      //   "href": "https://dev301.fathershops-test.xyz/?route=product/product&amp;product_id=104"
      // }
    },
  }

  return (
    <ProductGrid key={categoryId ?? 's'} products={item.products} title={categoryName ?? ''} scroll={false} />
  );
}
