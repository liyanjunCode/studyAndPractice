/* @flow */

import config from '../config'
import { initUse } from './use'
import { initMixin } from './mixin'
import { initExtend } from './extend'
import { initAssetRegisters } from './assets'
import { set, del } from '../observer/index'
import { ASSET_TYPES } from 'shared/constants'
import builtInComponents from '../components/index'
import { observe } from 'core/observer/index'

import {
  warn,
  extend,
  nextTick,
  mergeOptions,
  defineReactive
} from '../util/index'

export function initGlobalAPI (Vue: GlobalAPI) {
  // config
  const configDef = {}
  configDef.get = () => config
  if (process.env.NODE_ENV !== 'production') {
    configDef.set = () => {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      )
    }
  }
  Object.defineProperty(Vue, 'config', configDef)

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn,
    extend,
    mergeOptions,
    defineReactive
  }

  Vue.set = set
  Vue.delete = del
  Vue.nextTick = nextTick // 初始化（我们熟知的）nextTick方法，本质上是一个setTimeout。

  // 2.6 explicit observable API
  Vue.observable = <T>(obj: T): T => {
    observe(obj)
    return obj
  }

  // 初始化vue.options内的对象，并按照(/shared/constants.js)中的ASSET_TYPES初始化空对象(注意key值都加了个"s")
  Vue.options = Object.create(null)
  ASSET_TYPES.forEach(type => {
    Vue.options[type + 's'] = Object.create(null)
  })

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue


  // 将（/components/keep-alive.js）中的属性添加到Vue.options.components中
  extend(Vue.options.components, builtInComponents)

  // 初始化vue各个方法
  initUse(Vue) //** 添加Vue.use方法，将vue实例添加到传参的第一位，便于各个第三方插件使用.
  initMixin(Vue) // 添加mixin方法
  initExtend(Vue) // 添加extend方法
  /*
    给vue添加
      'component',
      'directive',
      'filter'
    三个方法(/shared/constants.js中定义)
   */
  initAssetRegisters(Vue)
  
  
  
  
}
