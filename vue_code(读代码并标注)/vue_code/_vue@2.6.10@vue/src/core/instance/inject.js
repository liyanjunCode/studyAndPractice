/* @flow */

import { hasOwn } from 'shared/util'
import { warn, hasSymbol } from '../util/index'
import { defineReactive, toggleObserving } from '../observer/index'

export function initProvide (vm: Component) {
  const provide = vm.$options.provide
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide
  }
}

export function initInjections (vm: Component) {
  // 拿到定义的inject 存入到对象中
  const result = resolveInject(vm.$options.inject, vm)
  // 有inject才处理
  if (result) {
    // 先禁用初始化Observer，禁止
    toggleObserving(false)
// 将inject都设置成响应式
    Object.keys(result).forEach(key => {
      /* istanbul ignore else */
      if (process.env.NODE_ENV !== 'production') {
        defineReactive(vm, key, result[key], () => {
          warn(
            `Avoid mutating an injected value directly since the changes will be ` +
            `overwritten whenever the provided component re-renders. ` +
            `injection being mutated: "${key}"`,
            vm
          )
        })
      } else {
        defineReactive(vm, key, result[key])
      }
    })

    // 在允许初始化Observer
    toggleObserving(true)
  }
}
// 解析inject
export function resolveInject (inject: any, vm: Component): ?Object {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    const result = Object.create(null)
    // 如果原生支持Reflect就用Reflect读取键值， 否则用Object.keys, 获取到键值数组
    const keys = hasSymbol
      ? Reflect.ownKeys(inject)
      : Object.keys(inject)

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      // #6574 in case the inject object is observed...
      // 值是响应式， 就跳过
      if (key === '__ob__') continue
      const provideKey = inject[key].from
      let source = vm
      // 传了vm
      while (source) {
        // 当前vm存在 provide数据， 并且当前key值 在自身的provide里
        if (source._provided && hasOwn(source._provided, provideKey)) {
          // 取出相应值存入result对象中跳出循环
          result[key] = source._provided[provideKey]
          break
        }
        //当前vm不存在provide数据， 就去其父级找， 值到找到相应的值
        source = source.$parent
      }
      // 不存在vm 
      if (!source) {
        // 如果定义了inject 中数据默认的类型
        if ('default' in inject[key]) {
          const provideDefault = inject[key].default
          // 如果default是按函数形式写的需先执行， 得到默认初始数据， 不是函数直接获取
          result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault
        } else if (process.env.NODE_ENV !== 'production') {
          warn(`Injection "${key}" not found`, vm)
        }
      }
    }
    return result
  }
}
