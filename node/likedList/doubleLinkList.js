
// 创建链表节点
class Node {
  constructor(element, prev, next) {
    this.current = element;
    this.prev = prev;
    this.next = next;
  }
}

// 单向链表
class LikeList {
  constructor() {
    this.head = null;
    this.tail = null;
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
    // 在尾部添加， 需要处理tail指向
    if (this.size === index) {
      const oldTail = this.tail;
      // 向最后插入，老的尾部是新节点的前一个，头部是新节点的下一个
      this.tail = new Node(element, oldTail, this.head);
      if (oldTail == null) {
        this.head = this.tail;
        this.tail.next = this.tail;
        this.tail.prev = this.tail;
      } else {
        oldTail.next = this.tail;
        this.head.prev = this.tail;
      }
    } else {// 这个判断链表至少有一个元素，因为链表为空时 this.size === index
      // 不在尾部添加
      // 首先获取要插入位置的原有节点,原有位置的节点需要向后 移动一位当成下一个节点
      const nextNode = this.getNode(index);
      //根据查找的节点获取到当前节点的上一个节点，位置不动
      const prveNode = nextNode.prev;
      const newNode = new Node(element, prveNode, nextNode);
      prveNode.next = newNode;
      nextNode.prve = newNode;
      if (index == 0) {
        // 当index为0时，是像头部插入，需要改变head指针
        this.head = newNode;
      }
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
    // if (index === 0) {
    //   this.head = this.head.next;
    // } else {
    //   const prevNode = this.getNode(index - 1);
    //   prevNode.next = prevNode.next.next;
    // }
    if (this.size == 1) {
      this.head = null;
      this.tail = null;
      this.size = 0;
    } else {
      const curNode = this.getNode(index);
      const prevNode = curNode.prev;
      const nextNode = curNode.next;
      prevNode.next = nextNode;
      nextNode.prev = prevNode;

      if (this.size == index - 1) {
        this.tail = prevNode;
      }
      if (index == 0) {
        this.head = nextNode;
      }
      this.size--;
    }

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
    this.tail = null;
    this.size = 0;
  }
  // 反转链表 两两互换方式 递归
  // reverseLink () {

  //   const reverse = (head) => {
  //     if (!head || !head.next) { return head }
  //     let newHead = reverse(head.next);
  //     head.next.next = head
  //     head.next = null;
  //     return newHead;
  //   }

  //   this.head = reverse(this.head);
  //   return this.head;
  // }
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
// list.add("b");
// list.add("c");

// // list.add(2, "ff")
// // list.set(4, "dd");
list.remove(0)
console.dir(list, { depth: 200 })

// console.dir(list.reverseLink(), { depth: 200 })