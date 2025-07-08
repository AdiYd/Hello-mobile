import { defaultConfig, tokens } from '@tamagui/config/v4'
import { createTamagui } from 'tamagui'


const customConfig = createTamagui(defaultConfig)

// export const tamaguiConfig = createTamagui(defaultConfig)

export default customConfig

export type Conf = typeof customConfig

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}