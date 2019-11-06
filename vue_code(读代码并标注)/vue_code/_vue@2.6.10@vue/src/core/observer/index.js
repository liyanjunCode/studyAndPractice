/* @flow */

import Dep from './dep'
import VNode from '../vdom/vnode'
import { arrayMethods } from './array'
import {
  def,
  warn,
  hasOwn,
  hasProto,
  isObject,
  isPlainObject,
  isPrimitive,
  isUndef,
  isValidArrayIndex,
  isServerRendering
} from '../util/index'

const arrayKeys = Object.getOwnPropertyNames(arrayMethods)

/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
// 是否禁用组件内部的观察，也就是说是否禁用初始化Observer
export let shouldObserve: boolean = true

export function toggleObserving (value: boolean) {
  shouldObserve = value
}

/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; // number of vms that have this object as root $data

  constructor (value: any) {
    this.value = value // 将当前属性值缓存下来
    this.dep = new Dep()
    this.vmCount = 0

    // 默认不可枚举，也就意味着正常情况，Vue帮我们在对象上添加的 __ob__属性，是遍历不到的
    // 每观察一个对象，就在对象上添加 __ob__ 属性，值为当前 Observer 实例
    // 前提是 value 本身是一个数组或对象，而非基础数据类型，如数字，字符串等。
    def(value, '__ob__', this)

    if (Array.isArray(value)) {

      // 这两行代码后面再讲解
      // 这里代码的作用是 为数组的操作函数赋能
      // 也就是，当我们使用 push pop splice 等数组的api时，也可以触发数据响应，更新视图。
      if (hasProto) {
        protoAugment(value, arrayMethods)
      } else {
        copyAugment(value, arrayMethods, arrayKeys)
      }

      // 遍历数组并观察
      this.observeArray(value)
    } else {

      // 遍历对象并观察
      // 这里会有存在 value 不是 Object 的情况，
      // 不过没事，Object.keys的参数为数字，字符串时 会 返回一个空数组。
      // 执行walk()方法，循环执行defineProperty方法，为data中属性添加监听
      this.walk(value)
    }
  }

  /**
   * Walk through all properties and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   */

  // 遍历对象并观察
  // 遍历data数据，调用defineReactive，为data中的每个属性绑定defineProperty方法
  walk (obj: Object) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {

      // 观察对象，defineReactive 函数内部如果是深度观察，则调用了 observe 方法，
      // observe 内部 调用了 Observer 构造函数
      defineReactive(obj, keys[i])
    }
  }

  /**
   * Observe a list of Array items.
   */
  observeArray (items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}

// helpers

/**
 * Augment a target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src: Object) {
  /* eslint-disable no-proto */
  target.__proto__ = src
  /* eslint-enable no-proto */
}

/**
 * Augment a target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target: Object, src: Object, keys: Array<string>) {
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i]
    def(target, key, src[key])
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
export function observe (value: any, asRootData: ?boolean): Observer | void {

  // 如果不是对象，或者是VNode实例，直接返回
  if (!isObject(value) || value instanceof VNode) {
    return
  }

  // 定义一个 变量，用来存储 Observer 实例
  let ob: Observer | void

  // 如果对象已经被观察过，Vue会自动给对象加上一个 __ob__ 属性，避免重复观察
  // 如果对象上已经有 __ob__属性，表示已经被观察过，就直接返回 __ob__
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else if (
    shouldObserve && // 是否应该观察
    !isServerRendering() && // 非服务端渲染
    (Array.isArray(value) || isPlainObject(value)) && // 是数组或者Object对象
    Object.isExtensible(value) && // 对象是否可扩展，也就是是否可向对象添加新属性
    !value._isVue // 非 Vue 实例
  ) {

    // 将当前data数据传入Observer，数据监听.
    ob = new Observer(value)
  }
  if (asRootData && ob) {
    ob.vmCount++
  }

  // 返回 Observer 实例
  return ob
}

/**
 * Define a reactive property on an Object.
 * 为数据绑定dep对象（以备之后使用）
 */
export function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {

  // 实例化一个dep(**核心，这里利用defineProperty，使每一个data中的属性都通过一个dep绑定一个watcher：依赖收集)
  const dep = new Dep()

  // 如果当前对象键值不可被设置，则直接return掉
  const property = Object.getOwnPropertyDescriptor(obj, key) // 返回当前对象key值的描述对象(解析：https://blog.csdn.net/qq_30100043/article/details/53424963)
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  // 如果用户"自己"未在对象上定义get 或 已在对象上定义set，且用户没有传入 val 参数
  // 则先计算对象的初始值，赋值给 val 参数
  const getter = property && property.get
  const setter = property && property.set
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key]
  }

  // 监听子属性
  // !shallow 表示 深度观察，shallow 不为 true 的情况下，表示默认深度观察
  // 如果是深度观察，执行 observe 方法观察对象
  let childOb = !shallow && observe(val)

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      // 获取对象的原有值
      const value = getter ? getter.call(obj) : val

      if (Dep.target) {

        // 添加依赖，将watcher添加到当前dep中的subs中,并更新Watcher中的newDepIds和newDeps，绑定Dep与Watcher.
        // 收集依赖。核心流程
        dep.depend()

        if (childOb) {

          // 如果有子属性，则给子属性增加Watcher依赖.
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }

      }
      return value
    },
    set: function reactiveSetter (newVal) {

      // 获取对象的原有值
      const value = getter ? getter.call(obj) : val

      /* eslint-disable no-self-compare */
      // 判断值是否改变
      // (newVal !== newVal && value !== value) 用来判断 NaN !== NaN 的情况
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) return

      // 触发对象原有的 setter，如果没有的话，用新值(newVal)覆盖旧值(val)
      if (setter) {
        setter.call(obj, newVal)
      } else {

        // 更改原对象指针的value值
        val = newVal
      }

      // 监听子属性
      // !shallow 表示 深度观察，shallow 不为 true 的情况下，表示默认深度观察
      // 如果是深度观察，执行 observe 方法观察对象
      childOb = !shallow && observe(newVal)

      // ***触发依赖。
      dep.notify()
    }
  })
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
export function set (target: Array<any> | Object, key: any, val: any): any {
  if (process.env.NODE_ENV !== 'production' &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(`Cannot set reactive property on undefined, null, or primitive value: ${(target: any)}`)
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key)
    target.splice(key, 1, val)
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val
    return val
  }
  const ob = (target: any).__ob__
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    )
    return val
  }
  if (!ob) {
    target[key] = val
    return val
  }
  defineReactive(ob.value, key, val)

  // 通知订阅者=》更新所有view
  ob.dep.notify()

  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
export function del (target: Array<any> | Object, key: any) {
  if (process.env.NODE_ENV !== 'production' &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(`Cannot delete reactive property on undefined, null, or primitive value: ${(target: any)}`)
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1)
    return
  }
  const ob = (target: any).__ob__
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    )
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key]
  if (!ob) {
    return
  }
  ob.dep.notify()
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value: Array<any>) {
  for (let e, i = 0, l = value.length; i < l; i++) {
    e = value[i]
    e && e.__ob__ && e.__ob__.dep.depend()
    if (Array.isArray(e)) {
      dependArray(e)
    }
  }
}
