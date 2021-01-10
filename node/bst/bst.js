class Node {
  constructor(element, parent) {
    this.element = element;
    this.parent = parent;
    this.left = null;
    this.right = null;
  }
}

class Bst {
  constructor(compare) {
    this.root = null;
    this.size = 0;
    this.compare = compare || this.compare;
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
        compare = this.compare(element, currentNode.element);
        parent = currentNode;
        if (compare > 0) {
          currentNode = currentNode.right;
        } else if (compare < 0) {
          currentNode = currentNode.left;
        } else {
          currentNode.element = element;
          return;
        }
      }
      const newNode = new Node(element, parent);
      if (compare > 0) {
        parent.right = newNode;
      } else if (compare < 0) {
        parent.left = newNode;
      }
    }
    this.size++;
    return this.root;
  }
  // 前序遍历
  preorderTraversal(visitor){
    const traversal = (node) => {
      if(node == null || visitor == null){return;}
      visitor(node);
      traversal(node.left);
      traversal(node.right);
    }
    traversal(this.root);
  }
  // 中序遍历
  inorderTraversal(visitor){
    const traversal = (node) => {
      if(node == null || visitor == null){return;}
      traversal(node.left);
      visitor(node);
      traversal(node.right);
    }
    traversal(this.root);
  }
  // 后续遍历
  postorderTraversal(visitor){
    const traversal = (node) => {
      if(node == null || visitor == null){return;}
      traversal(node.left);
      traversal(node.right);
      visitor(node);
    }
    traversal(this.root);
  }
  // 层序遍历
  levelorderTraversal(visitor){
    if(this.root == null || visitor == null){return;}
    const stack = [this.root];
    let index = 0;
    let currentNode = null;
    while( currentNode = stack[index++]) {
      visitor(currentNode);
      if(currentNode.left) {
        stack.push(currentNode.left)
      }
      if(currentNode.right) {
        stack.push(currentNode.right)
      }
    }
  }
  invertTree(){
    if(this.root == null){return;}
    const stack = [this.root];
    let current;
    let index = 0;
    while(current= stack[index++]){
      const tem = current.left;
      current.left = current.right;
      current.right = tem;
      if(current.left) {
        stack.push(current.left)
      }
      if(current.right) {
        stack.push(current.right)
      }
    }
  }
  remove () {
    this.size--;
  }
  contain () {

  }
  compare (a, b) {
    return a - b;
  }
}
const bst = new Bst();
let arr = [10, 8, 19, 6, 15, 22,20];
arr.forEach(item => {
  bst.add(item);
});
bst.invertTree();
bst.preorderTraversal((node) => {
  console.log(node.element)
})
// bst.inorderTraversal((node) => {
//     console.log(node.element)
//   });
// bst.postorderTraversal((node) => {
//   console.log(node.element)
// })
// bst.levelorderTraversal((node) => {
//   console.log(node.element)
// })
// console.dir(, {depth:200})