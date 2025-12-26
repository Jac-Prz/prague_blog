import { type SchemaTypeDefinition } from 'sanity'

import {blockContentType} from './blockContentType'
import {categoryType} from './categoryType'
import {postType} from './postType'
import {authorType} from './authorType'
import {youtubeEmbedType} from './youtubeEmbedType'
import {socialEmbedType} from './socialEmbedType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blockContentType, categoryType, postType, authorType, youtubeEmbedType, socialEmbedType],
}
