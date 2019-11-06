/* @flow */

import { parse } from './parser/index'
import { optimize } from './optimizer'
import { generate } from './codegen/index'
import { createCompilerCreator } from './create-compiler'

// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.
export const createCompiler = createCompilerCreator(function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {

  // 将template模板字符串 => ast（抽象语法树）
  const ast = parse(template.trim(), options)

  // 将ast进行静态优化，静态内容指的是和数据没有关系，不需要每次都刷新的内容。
  if (options.optimize !== false) {
    optimize(ast, options)
  }

  // 将抽象语法树 => 代码字符串（用户后续toFunction）
  const code = generate(ast, options)
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
})
