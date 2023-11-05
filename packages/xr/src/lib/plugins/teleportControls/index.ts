import { Raycaster } from 'three'
import { currentWritable, watch } from '@threlte/core'
import { setTeleportContext, type Context, type HandContext } from './context'
import { injectTeleportControlsPlugin } from './plugin'
import { hasTeleportControls } from '../../internal/stores'
import { defaultComputeFunction } from './defaults'
import { setHandContext } from './context'
import { setupTeleportControls } from './setup'

export type TeleportControlsOptions = {
  enabled?: boolean
}

export const context: Context = {
  interactiveObjects: [],
  surfaces: new Map(),
  blockers: new Map(),
  dispatchers: new WeakMap(),
  raycaster: new Raycaster(),
  compute: defaultComputeFunction
}

export const handContext: {
  left: HandContext
  right: HandContext
} = {
  left: {
    hand: 'left',
    enabled: currentWritable(true),
    hovered: currentWritable(undefined),
  },
  right: {
    hand: 'right',
    enabled: currentWritable(true),
    hovered: currentWritable(undefined),
  }
}

export const teleportControls = (options?: TeleportControlsOptions) => {
  setTeleportContext(context)
  injectTeleportControlsPlugin()

  const createHandContext = (hand: 'left' | 'right') => {
    setHandContext(hand, handContext[hand])
    setupTeleportControls(context, handContext[hand])
    return handContext[hand]
  }

  const left = createHandContext('left')
  const right = createHandContext('right')

  watch([left.enabled, right.enabled], ([leftEnabled, rightEnabled]) => {
    hasTeleportControls.set(leftEnabled || rightEnabled)
  })

  return {
    left,
    right,
    state: context,
  }
}
