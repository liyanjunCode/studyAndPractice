
// 创建链表节点
class Node {
  constructor(element, next) {
    this.current = element;
    this.next = next;
  }
}

// 单向链表
class LikeList {
  constructor() {
    this.head = {};
    this.size = 0;
  }
  /* 
    *.链表添加元素
    *. 传参可以传一个也可以传两个
    * 1个index是元素
    * 2个index是序列 element是元素
    * 
    * 
  */
  add (index, element) {
    // 如果只存在一个参数， 需要处理
    if (arguments.length === 1) {
      element = index;
      index = this.size;
    }
    // 如果index是0，直接获取head
    // 如果index不是0，需要先查找上一个元素节点
    if (index == 0) {

    } else {
      const prevNode = this.getPreNode(index);
    }
    // 添加完size要加1
    this.size++;
  }
  // 链表删除元素
  delete () {

  }
  // 获取前一个节点
  getPreNode (index) {

  }
}
const list = new LikeList();
list.add("aaa");
console.log(list)