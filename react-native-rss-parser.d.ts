declare module 'react-native-rss-parser' {
  declare interface Link {
    url: string,
    rel: string,
  }

  declare interface Author {
    name: string,
  }

  declare interface SubCategory {
    name: string,
  }

  declare interface Category {
    name: string,
    subCategories?: SubCategory[],
  }

  declare interface Owner {
    name: string,
    email: string,
  }

  declare interface Image {
    url: string,
    title: string,
    description: string,
    width: string,
    height: string,
  }

  declare interface Itunes {
    author?: Author[],
    authors?: Author[],
    block: string,
    duration?: string,
    categories?: Category[],
    image: string,
    explicit: string,
    complete?: string,
    isClosedCaptioned?: string,
    newFeedUrl?: string,
    owner?: Owner,
    order?: string,
    subtitle: string,
    summary: string,
  }

  declare interface Enclosure {
    url: string,
    length: string,
    mimeType: string,
  }

  declare interface Item {
    id: string,
    title: string,
    imageUrl: string,
    links: Link[],
    description: string,
    content: string,
    categories: Category[],
    authors: Author[],
    published: string,
    enclosures: Enclosure[],
    itunes: Itunes,
  }

  declare interface Feed {
    type: string,
    title: string,
    links: Link[],
    description: string,
    language: string,
    copyright: string,
    authors: Author[],
    lastUpdated: string,
    lastPublished: string,
    categories: Category[],
    image: Image,
    itunes: Itunes,
    items: Item[],
  }

  declare function parse (text: string): Promise<Feed>;
}