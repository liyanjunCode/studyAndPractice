import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }


  // 用执行了一次下面的initMixin函数（执行new 之后的vue初始化参数）
  this._init(options)
}

// 就是这里，initMixin 函数会在 Vue 的 prototype 上扩展一个 _init 方法
// 我们 new Vue 的时候就是执行的 this._init(options) 方法
// 初始化生命周期、事件、渲染函数,初始化一些空的属性（null）
initMixin(Vue)

stateMixin(Vue) // 经典环节：observer类，vue数据驱动、vue原型绑定get、set方法和watch监听
eventsMixin(Vue) // 初始化$once、$off、$emit、$on等函数
lifecycleMixin(Vue) // 初始化生命周期:_update、$forceUpdate、$destroy

// 渲染render函数，虚拟dom相关、一些方法挂在到vue原型上(如：slot、keyword等)、$nextTick、挂在_render方法
// 初始化的_render方法用于生成vnode。在_update(vnode)方法中传入。***
renderMixin(Vue)

export default Vue
