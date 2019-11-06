

/* 学习资料
1. https://blog.csdn.net/u011068996/article/details/80970284
2.https://blog.csdn.net/longzhoufeng/article/details/80987527  // mvvm的整体思路图
3.https://blog.csdn.net/yayayayaya_/article/details/80932297   // dom更新详解
4.https://www.cnblogs.com/riona/p/10064542.html // vue流程详细解释
5.https://blog.csdn.net/weixin_33728708/article/details/88016918 // *****非常好的文章(三)
6.https://juejin.im/post/5c15de1be51d4514a87dc672 // *****非常好的文章(二)
7.https://juejin.im/post/5bfa1b4ef265da61327efb8b // *****非常好的文章(一)
8.https://www.jianshu.com/p/4dff7c2cdaaa
9.https://blog.csdn.net/wangweianger/article/details/79826801
10.https://blog.csdn.net/refreeom/article/details/90239281 // Vue源码系列10------VueDOM的首次渲染---update
11.https://blog.csdn.net/Forever201295/article/details/80048161 // 对render函数有很好的解析
12.https://segmentfault.com/a/1190000013469565 // 虚拟dom更新
13.https://www.cnblogs.com/wind-lanyan/p/9061684.html // diff算法详解*****经典
14.https://segmentfault.com/a/1190000012922342  // template模板编译好文章

 */

// var app = new Vue({
//   el: '#app',
//   data: {
//     message: 'Hello Vue!',
//     show: false,
//   },
//
//   created () {
//     // console.log('created')
//
//   },
//
//   mounted () {
//
//     // defineProperty示例
//     // 作用：对象内属性的劫持
//     let bValue = {
//       a: 3,
//       b: 1
//     };
//     Object.defineProperty(bValue, "b", {
//       // value: 'abc', // 初始化属性值
//       // writable: false, // 是否可以被重写
//       enumerable: true, // 是否可以被枚举(使用for...in或Object.keys())
//       configurable: true, // 是否可以删除目标属性或是否可以再次修改属性的特性（writable, configurable, enumerable）
//       get : function(){
//         console.log('get:', bValue)
//         return 123;
//       },
//       set : function(newValue){
//         console.log('set:', newValue)
//       }
//     });
//
//     // console.log(bValue.b)
//
//     bValue.b = 38;
//
//     // delete bValue.b
//     // console.log(bValue)
//
//     // console.log(Object.keys(bValue))
//
//     // bValue.b = 100
//     // console.log(bValue)
//
//     // console.log(bValue)
//
//
//
//
//
//
//     // 函数科里化示例
//     // 主要用于参数复用，参数固化（制造某种可变的公用函数）
//
//     // function curriedAdd (x) {
//     //   return function(y) {
//     //     return x + y
//     //   }
//     // }
//     //
//     // var addTwo = curriedAdd(1)
//     // var addTen = curriedAdd(10)
//     //
//     // console.log(addTwo(2)) // 将所传参数加1，输出3
//     // console.log(addTen(2)) // 将所传参数加10，输出12
//     //
//     //
//     // // 例子
//     // // 输出数据格式化
//     // function outPut (name) {
//     //   return function (json) {
//     //     return {
//     //       [name]: json
//     //     }
//     //   }
//     // }
//     //
//     // let result_name = outPut('result')
//     // let data_name = outPut('data')
//     //
//     // console.log(result_name({a:1, b: 2}))
//     // console.log(data_name({a:1, b: 2}))
//
//
//   }
//
// })







// vue简单demo
// var app = new Vue({
//   el: '#app',
//   data: {
//     message: 'Hello Vue!',
//     message: 'Hello Vue!',
//     message: 'Hello Vue!',
//     message: 'Hello Vue!',
//     message: 'Hello Vue!',
//     message: 'Hello Vue!',
//   },
//   created () {},
//   mounted () {},
//   ...
// })

// function Myvue (options) {
//   const vm = this
//
//   if (options.el) {
//     this['$el'] = options.el
//   }
//
//   if (options.data) {
//     for (let key in options.data) {
//       vm[key] = options.data[key]
//     }
//   }
//
//   // options.created && options.created(arguments)
//   // options.mounted && options.mounted(arguments)
//   options.created && options.created.call(vm, arguments)
//   options.mounted && options.mounted.call(vm, arguments)
//
// }
//
// let myvue = new Myvue({
//   el: '#app',
//   data: {
//     message: 'Hello Vue!',
//     name: '曹方晖'
//   },
//   created () {
//     // console.log(this)
//     console.log(this.message)
//   },
//   mounted () {
//     console.log(this.name)
//   },
//
// })






// Deps图文解析
// var app = new Vue({
//   el: '#app',
//   data: {
//     a: 'a',  // a => new Dep() =>(连接) Watcher(subs)
//     b: 'b',  // b => new Dep() =>(连接) Watcher(subs)
//     c: 'c',  // c => new Dep() =>(连接) Watcher(subs)
//     d: 'd',  // d => new Dep() =>(连接) Watcher(subs)
//     e: 'e',  // e => new Dep() =>(连接) Watcher(subs)
//     f: 'f',  // f => new Dep() =>(连接) Watcher(subs)
//     g: 'g',  // g => new Dep() =>(连接) Watcher(subs)
//     h: 'h',  // h => new Dep() =>(连接) Watcher(subs)
//   },
//   created () {},
//   mounted () {
//
//     this.a = 'abc'
//     /*
//      set() => Dep.notify() => 循环this.subs => 执行update(也就是执行run方法) => 执行Watcher内的get()方法
//      => get方法中内容：更新所有Dep的this.subs数组，保持监听一个且最新的Watcher(同时生成一个新的虚拟Dom)
//
//      注：没执行一次set操作（更改属性值操作）就执行一遍上述流程
//     */
//
//   },
// })








// render渲染函数示例
var app = new Vue({
  el: '#app',
  // template:`
  //       <ul class = "bg" style = "fontSize:20px" abc = "yyy">
  //           <li>1</li>
  //           <li>2</li>
  //           <li>3</li>
  //       </ul>
  //   `,
  render: function (createElement) {
    let text = createElement('div', {
      attrs: {
        id: 'app'
      },
    }, this.message)

    return createElement('div', {
      attrs: {
        id: 'app3'
      },
    }, [text, text])
  },
  data: {
    list: [1,3,3,4,5],
    message: 'Hello Vue!',
    a: 1,
  },
  watch: {
    message (newValue, oldValue) {
      console.log(newValue)
    },
    a (newValue, oldValue) {
      console.log(newValue)

    }


  },
  mounted () {
    // setTimeout(() => {
    //
    //   this.message = '扑街'
    //
    // }, 1000)


    setTimeout(() => {
      this.a = '3'
      // this.message = '又扑街'

    }, 2000)

    this.list = [1,2,3,4,5,6]


    window.b = 100
    let code = 'console.log(b)'
    // let func = new Function(code)
    let func = new Function(`with(this){return ${code}}`)

    console.log(func)
    func()


  }
})

