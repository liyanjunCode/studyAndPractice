/* @flow */

import * as nodeOps from 'web/runtime/node-ops' // nodeOps 封装了一系列 DOM 操作的方法(js原生操作dom方法封装)
import { createPatchFunction } from 'core/vdom/patch'
import baseModules from 'core/vdom/modules/index'
import platformModules from 'web/runtime/modules/index'

// the directive module should be applied last, after all
// built-in modules have been applied.
const modules = platformModules.concat(baseModules) // modules 定义了一些模块的钩子函数的实现(如比较熟悉的v-bind，v-for...)


// 运用函数柯里化的技巧，通过 createPatchFunction 把差异化参数提前固化(用于区分平台)
export const patch: Function = createPatchFunction({ nodeOps, modules })
