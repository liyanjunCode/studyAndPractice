/* @flow */

import config from '../config'
import { warn } from './debug'
import { set } from '../observer/index'
import { unicodeRegExp } from './lang'
import { nativeWatch, hasSymbol } from './env'

import {
  ASSET_TYPES,
  LIFECYCLE_HOOKS
} from 'shared/constants'

import {
  extend,
  hasOwn,
  camelize,
  toRawType,
  capitalize,
  isBuiltInTag,
  isPlainObject
} from 'shared/util'

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
const strats = config.optionMergeStrategies

/**
 * Options with restrictions
 */
// strats 格式类型是由限制的 这个是默认的合并策略
if (process.env.NODE_ENV !== 'production') {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    // 开发中如果不存在vm则报警 但不影响合并
    if (!vm) {
      warn(
        `option "${key}" can only be used during instance ` +
        'creation with the `new` keyword.'
      )
    }
    return defaultStrat(parent, child)
  }
}

/**
 * Helper that recursively merges two data objects together.
 */
// 递归的将data合并到一起
function mergeData (to: Object, from: ?Object): Object {
  if (!from) return to  // 不存在from参数直接返回to
  let key, toVal, fromVal
// 获取第二个参数对象from的键数组
  const keys = hasSymbol
    ? Reflect.ownKeys(from)
    : Object.keys(from)

  for (let i = 0; i < keys.length; i++) {
    key = keys[i]
    // in case the object is already observed...
    // 如果数据已经是响应式的了， 就跳过， 说明已经处理过了
    if (key === '__ob__') continue
    toVal = to[key]
    fromVal = from[key]
    // 如果to中没有当前key， 直接将 from的键值合并到to中
    if (!hasOwn(to, key)) {
      set(to, key, fromVal)
      // 如果当前key值在to和from中都有，并且他们还都是对象
      // 需要递归去合并
    } else if (
      toVal !== fromVal &&
      isPlainObject(toVal) &&
      isPlainObject(fromVal)
    ) {
      mergeData(toVal, fromVal)
    }
  }
  //返回合并后的data to
  return to
}

/**
 * Data
 */
// 合并data是函数的情况
export function mergeDataOrFn (
  parentVal: any,
  childVal: any,
  vm?: Component
): ?Function {
  // vm不存在就是组件， data是函数形式
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    // 两个都得是函数， 其中一个不存在就直接返回存在的退出， 不执行
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    // 如果是函数， 就先执行获取对象数据
    // 然后用mergeData进行数据合并
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
     // vm存在就是根页面，如果childval存在， 就进行合并数据
     // childval不存在， 就返回默认的数据
  } else {
    return function mergedInstanceDataFn () {
      // instance merge
      const instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal
      const defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}
// 此处应该是对组件和根组件得判断
// 如果不存在vm则是组件， 那么他的data需要是函数， 然后进行数据合并
// 如果存在vm说明他不是组件，是根页面直接合并
strats.data = function (
  parentVal: any,
  childVal: any,
  vm?: Component
): ?Function {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
      process.env.NODE_ENV !== 'production' && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      )

      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
}

/**
 * Hooks and props are merged as arrays.
 */
// 把钩子函数和props合并为数组
function mergeHook (
  parentVal: ?Array<Function>,
  childVal: ?Function | ?Array<Function>
): ?Array<Function> {
  // 如果childVal不存在， 就直接返回parentVal
  //如果childVal存在， 判断parentVal存不存在， 存在 合并parentVal 和childVal
  // 如果childVal存在， 判断parentVal不存在， 判断childVal是不是数组， 是数组直接返回，不是数组， 转为数组形式
  const res = childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal
    // res存在 就需要进行合并去重
  return res
    ? dedupeHooks(res)
    : res
}
// 将钩子函数合并去重,
function dedupeHooks (hooks) {
  const res = []
  for (let i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i])
    }
  }
  return res
}

LIFECYCLE_HOOKS.forEach(hook => {
  strats[hook] = mergeHook
})

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (
  parentVal: ?Object,
  childVal: ?Object,
  vm?: Component,
  key: string
): Object {
  const res = Object.create(parentVal || null)
  if (childVal) {
    process.env.NODE_ENV !== 'production' && assertObjectType(key, childVal, vm)
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets
})

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (
  parentVal: ?Object,
  childVal: ?Object,
  vm?: Component,
  key: string
): ?Object {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) parentVal = undefined
  if (childVal === nativeWatch) childVal = undefined
  /* istanbul ignore if */
  if (!childVal) return Object.create(parentVal || null)
  if (process.env.NODE_ENV !== 'production') {
    assertObjectType(key, childVal, vm)
  }
  if (!parentVal) return childVal
  const ret = {}
  extend(ret, parentVal)
  for (const key in childVal) {
    let parent = ret[key]
    const child = childVal[key]
    if (parent && !Array.isArray(parent)) {
      parent = [parent]
    }
    ret[key] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child]
  }
  return ret
}

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal: ?Object,
  childVal: ?Object,
  vm?: Component,
  key: string
): ?Object {
  if (childVal && process.env.NODE_ENV !== 'production') {
    assertObjectType(key, childVal, vm)
  }
  if (!parentVal) return childVal
  const ret = Object.create(null)
  extend(ret, parentVal)
  if (childVal) extend(ret, childVal)
  return ret
}
strats.provide = mergeDataOrFn

/**
 * Default strategy.
 */
// 默认合并策略， 如果无子options就返回父options 否则返回子
const defaultStrat = function (parentVal: any, childVal: any): any {
  return childVal === undefined
    ? parentVal
    : childVal
}

/**
 * Validate component names
 */
// 循环遍历出挂在的组件名称, 并通过函数检验是否为符合规范， 或是否为保留字， 如果是报警
function checkComponents (options: Object) {
  for (const key in options.components) {
    validateComponentName(key)
  }
}
// 上面用到
export function validateComponentName (name: string) {
  // 判断组件名合不合规范
  if (!new RegExp(`^[a-zA-Z][\\-\\.0-9_${unicodeRegExp.source}]*$`).test(name)) {
    warn(
      'Invalid component name: "' + name + '". Component names ' +
      'should conform to valid custom element name in html5 specification.'
    )
  }
  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    warn(
      'Do not use built-in or reserved HTML elements as component ' +
      'id: ' + name
    )
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
// 校验props是否是要求的格式， 可以是对象和数组， 其他格式在开发环境报警
function normalizeProps (options: Object, vm: ?Component) {
  const props = options.props
  if (!props) return    // 不存在直接返回，不需校验
  const res = {}
  let i, val, name
  if (Array.isArray(props)) {
    i = props.length
    // 如果是数组的话， 每一项必须是字符串, 否则报警提示
    while (i--) {
      val = props[i]
      if (typeof val === 'string') {
        // 将有-的转为驼峰
        name = camelize(val)
        res[name] = { type: null }
      } else if (process.env.NODE_ENV !== 'production') {
        warn('props must be strings when using array syntax.')
      }
    }
  } else if (isPlainObject(props)) {
    for (const key in props) {
      val = props[key]
      // 将有-的转为驼峰
      name = camelize(key)
      // val 是对象直接赋值， 不是需转换为对象
      res[name] = isPlainObject(val)
        ? val
        : { type: val }
    }
  } else if (process.env.NODE_ENV !== 'production') {
    warn(
      `Invalid value for option "props": expected an Array or an Object, ` +
      `but got ${toRawType(props)}.`,
      vm
    )
  }

  // 将开发者写的props转为需要个时候，给options使用
  options.props = res
}

/**
 * Normalize all injections into Object-based format
 */
// 与props相同， 将inject进行判断并转成想要的格式
function normalizeInject (options: Object, vm: ?Component) {
  const inject = options.inject
  if (!inject) return  // 不存在返回
  // 先将options中的inject和normalized设置为空对象,并引用同一对象
  const normalized = options.inject = {}
  // 如果是数组循环数据
  if (Array.isArray(inject)) {
    for (let i = 0; i < inject.length; i++) {
      // 以数据名为key存入normalized对象中
      normalized[inject[i]] = { from: inject[i] }
    }
  } else if (isPlainObject(inject)) {
    for (const key in inject) {
      const val = inject[key]
      normalized[key] = isPlainObject(val)
      // 此处如果val是对象，那就取出对象中所有键值对， 放到extend第一个对象中拍平

        ? extend({ from: key }, val)
        : { from: val }
    }
    // 不是对象数组报警
  } else if (process.env.NODE_ENV !== 'production') {
    warn(
      `Invalid value for option "inject": expected an Array or an Object, ` +
      `but got ${toRawType(inject)}.`,
      vm
    )
  }
}

/**
 * Normalize raw function directives into object format.
 */
// 将自定义指令格式化成对象形式, 因为自定义指令既能是对象形式，也能是函数形式
function normalizeDirectives (options: Object) {
  const dirs = options.directives
  if (dirs) {
    for (const key in dirs) {
      const def = dirs[key]
      if (typeof def === 'function') {
        dirs[key] = { bind: def, update: def }
      }
    }
  }
}

function assertObjectType (name: string, value: any, vm: ?Component) {
  if (!isPlainObject(value)) {
    warn(
      `Invalid value for option "${name}": expected an Object, ` +
      `but got ${toRawType(value)}.`,
      vm
    )
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
export function mergeOptions (
  parent: Object,
  child: Object,
  vm?: Component
): Object {
  // 开发环境对组件名称进行校验
  if (process.env.NODE_ENV !== 'production') {
    checkComponents(child)
  }
// 可能是Vue.extend创造出来的子类
  if (typeof child === 'function') {
    child = child.options
  }
// 检查props并转为所需要的格式
  normalizeProps(child, vm)
  // 检查normalizeInject并转为所需要的格式
  normalizeInject(child, vm)
  // 将自定义指令并转为所需要的格式(对象)
  normalizeDirectives(child)

  // Apply extends and mixins on the child options,
  // but only if it is a raw options object that isn't
  // the result of another mergeOptions call.
  // Only merged options has the _base property.
  //当前有_base属性 就进行extends和mixins合并
  if (!child._base) {
    // 如果当前实例有extends选项，取出所有的extends选项混入到开发者写的options中
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm)
    }
    // 如果当前实例有mixins选项，取出所有的mixins选项混入到开发者写的options中
    if (child.mixins) {
      for (let i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm)
      }
    }
  }

  const options = {}
  let key
  for (key in parent) {
    mergeField(key)
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key)
    }
  }
  // 合并props data methods watch computed collhook 等 strats[key]是事先定义好的合并函数
  function mergeField (key) {
    const strat = strats[key] || defaultStrat
    options[key] = strat(parent[key], child[key], vm, key)
  }
  // 将合并后的对象返回出去
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
export function resolveAsset (
  options: Object,
  type: string,
  id: string,
  warnMissing?: boolean
): any {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  const assets = options[type]
  // check local registration variations first
  if (hasOwn(assets, id)) return assets[id]
  const camelizedId = camelize(id)
  if (hasOwn(assets, camelizedId)) return assets[camelizedId]
  const PascalCaseId = capitalize(camelizedId)
  if (hasOwn(assets, PascalCaseId)) return assets[PascalCaseId]
  // fallback to prototype chain
  const res = assets[id] || assets[camelizedId] || assets[PascalCaseId]
  if (process.env.NODE_ENV !== 'production' && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    )
  }
  return res
}
