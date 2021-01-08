class Node {
  constructor(element, parent) {
    this.element = element;
    this.parent = parent;
    this.left = null;
    this.right = null;
  }
}

class Bst {
  constructor() {
    this.root = null;
    this.size = 0;
  }
  add (element) {
    if (!this.root) {
      this.root = new Node(element, null,)
    } else {
      let currentNode = this.root;
      let parent;
      let compare;
      // 获取节点，直到获取到无法比较大小， 当前元素大于比较节点，则取右侧查找，否则去左侧
      // 直到currentNode不存在，可以确定位置
      while (currentNode) {
        compare = this.getVisited(element - currentNode.element);
        parent = currentNode;
        if (compare > 0) {
          currentNode = currentNode.right;
        } else if (compare < 0) {
          currentNode = currentNode.left;
        } else {
          currentNode.element = element;
        }
      }
      if (compare > 0) {
        parent.right = new Node(element, parent);
      } else if (compare < 0) {
        parent.left = new Node(element, parent);
      }
    }
    this.size++;
    return this.root;
  }
  remove () {
    this.size--;
  }
  contain () {

  }
  getVisited (a, b) {
    return a - b;
  }
}
const bst = new Bst();
let arr = [10, 8, 19, 6, 15, 22];
arr.forEach(item => {
  bst.add(item);
});
console.log(bst.root)