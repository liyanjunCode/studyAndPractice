
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
    this.head = null;
    this.size = 0;
  }
  limit (index) {
    if (index < 0 || index > this.size) { throw new Error('越界') }
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
    this.limit(index);
    // 如果index是0，直接获取head
    // 如果index不是0，需要先查找上一个元素节点
    if (index == 0) {
      const newHead = new Node(element, this.head);
      const last = this.size === 0 ? newHead : this.getNode(this.size - 1);
      this.head = newHead;
      last.next = this.head;
    } else {
      const prevNode = this.getNode(index - 1);
      prevNode.next = new Node(element, prevNode.next);
    }
    // 添加完size要加1
    this.size++;
  }
  // 修改制定位置的元素
  set (index, element) {
    this.limit(index);
    const currentNode = this.getNode(index);
    currentNode.current = element;
  }
  // 链表删除元素
  remove (index) {
    this.limit(index);
    if (index === 0) {
      if (this.size === 1) {
        this.head = null;
      } else {
        const last = this.getNode(this.size - 1);
        this.head = this.head.next;
        last.next = this.head;
      }
    } else {
      const prevNode = this.getNode(index - 1);
      prevNode.next = prevNode.next.next;
    }
    this.size--;
  }
  get (index) {
    return this.getNode(index);
  }
  // 获取前一个节点
  getNode (index) {
    let current = this.head;
    for (let i = 0; i < index; i++) {
      current = current.next;
    }
    return current;
  }
  // 清空链表
  clear () {
    this.head = null;
    this.size = 0;
  }

  // 反转链表 新建newHead方式
  // reverseLink () {
  //   let currentNode = this.head;
  //   if (!currentNode || !currentNode.next) { return this.head }
  //   let newHead;
  //   while (currentNode) {
  //     this.head = currentNode.next;
  //     currentNode.next = newHead;
  //     newHead = currentNode;
  //     currentNode = this.head;
  //   }
  //   this.head = newHead;
  //   return this.head;
  // }
}
const list = new LikeList();
list.add("a");
list.add("b");
list.add("c");

// list.add(2, "ff")
// list.set(4, "dd");
list.remove(0)
console.dir(list, { depth: 200 })
// console.dir(list.getNode(2), { depth: 200 })
// console.dir(list.reverseLink(), { depth: 200 })