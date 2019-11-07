/* @flow */

import config from '../config'
import { initProxy } from './proxy'
import { initState } from './state'
import { initRender } from './render'
import { initEvents } from './events'
import { mark, measure } from '../util/perf'
import { initLifecycle, callHook } from './lifecycle'
import { initProvide, initInjections } from './inject'
import { extend, mergeOptions, formatComponentName } from '../util/index'

let uid = 0

export function initMixin (Vue: Class<Component>) {
  Vue.prototype._init = function (options?: Object) {
    const vm: Component = this
    // a uid
    vm._uid = uid++

    let startTag, endTag
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      startTag = `vue-perf-start:${vm._uid}`
      endTag = `vue-perf-end:${vm._uid}`
      mark(startTag)
    }

    // a flag to avoid this being observed，避免被监听标识
    vm._isVue = true
    // merge options，是否是一个组件（联想.vue文件中的传入参数）
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      // 组件形式得options合并， 并需要特殊处理
      initInternalComponent(vm, options)
    } else {
      
      // 将传入的options参数合并到vm.$options中，以便下面调用(此时vue实例中已经存在传入的create及beforeCreate等生命周期)
      vm.$options = mergeOptions(
        // resolveConstructorOptions 区分出是基础构造函数还是，Vue.extends产生的，如果是Vue.extends， 需要对options新增的属性进行添加
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
    }
    /* istanbul ignore else */
    // 开发环境就用proxy
    if (process.env.NODE_ENV !== 'production') {
      initProxy(vm)
    } else {
      vm._renderProxy = vm
    }
    // expose real self
    vm._self = vm

    // 此时vm.$options已经存在（仰仗于上面的mergeOptions）
    // 初始化关联本实例$parents和父级$children，初始化自己的$children
    // 初始化$refs, _watcher, _ismouted inDestoryed isBeingDestroyed等等属性
    initLifecycle(vm) // 初始化生命周期,初始化一些空的属性（null）
    
    initEvents(vm) // 初始化事件

    initRender(vm) // 初始化渲染函数
    
    // 调用生命周期函数beforeCreate
    callHook(vm, 'beforeCreate') 
    
    
    initInjections(vm) // resolve injections before data/props  // 初始化注入

    // vm 为当前 Vue 实例，Vue 会将我们传入的 data 属性赋值给 vm._data
    // **核心部分，加一层代理，每次访问this[key]时代理到this._data[key]。利用defineProperty，对数据对象的所有属性进行监听
    initState(vm)

    initProvide(vm) // resolve provide after data/props

    // 调用生命周期函数created
    callHook(vm, 'created')

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false)
      mark(endTag)
      measure(`vue ${vm._name} init`, startTag, endTag)
    }

    // 挂载el
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
}
// 初始化组件合并参数
export function initInternalComponent (vm: Component, options: InternalComponentOptions) {
  const opts = vm.$options = Object.create(vm.constructor.options)
  // doing this because it's faster than dynamic enumeration.
  const parentVnode = options._parentVnode
  opts.parent = options.parent
  opts._parentVnode = parentVnode

  const vnodeComponentOptions = parentVnode.componentOptions
  opts.propsData = vnodeComponentOptions.propsData
  opts._parentListeners = vnodeComponentOptions.listeners
  opts._renderChildren = vnodeComponentOptions.children
  opts._componentTag = vnodeComponentOptions.tag

  if (options.render) {
    opts.render = options.render
    opts.staticRenderFns = options.staticRenderFns
  }
}


/*
主要是解构获取构造器的options（函数名也能看出来），主要是其中有对于如果构造器也是extend添加的时候应该怎么处理，
以及它们的构造器如果有更新扩展，需要及时更新到下级。

 */
// 区分是Vue基础构造器的情况和Vue.extend的情况
export function resolveConstructorOptions (Ctor: Class<Component>) {
  let options = Ctor.options
  // 因为Vue.extend会存在super属性， 所以如果此属性存在， 就是Vue.extend情况需进行相应处理
  // 不是Vue.extend情况不需要处理， 直接返回即可
  if (Ctor.super) {
    // 一层层往上找， 直到找到不是Vue.extend而是基础构造函数， 拿到其options
    const superOptions = resolveConstructorOptions(Ctor.super)
    const cachedSuperOptions = Ctor.superOptions
    // 如果当前实例的cachedSuperOptions 和父级的superOptions不相等， 说明
    // 父级options变化， 需要更新父级options
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      // 子类更新父类options
      Ctor.superOptions = superOptions
      // check if there are any late-modified/attached options (#4976)
      // 核实是否新增属性
      const modifiedOptions = resolveModifiedOptions(Ctor)
      // update base extend options
      // 如果有新增的属性， 将Vue.extends的options更新
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions)
      }
      // 将基础options和自身options合并
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions)
      // 如果options里有name属性将其赋值给options的component， 值为当前Ctor， 以便通过name能找到组件
      if (options.name) {
        options.components[options.name] = Ctor
      }
    }
  }
  return options
}
// 对比， 看自身多出来的属性，整成对象返回
function resolveModifiedOptions (Ctor: Class<Component>): ?Object {
  let modified
  // 最新的options
  const latest = Ctor.options
  // 原来备份的options
  const sealed = Ctor.sealedOptions
  // 循环遍历最近的options的key， 如果latest 和sealed不等， 说明是新增加的属性
  // 新增加的属性存入modified， 返回出去
  for (const key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) modified = {}
      modified[key] = latest[key]
    }
  }
  return modified
}
