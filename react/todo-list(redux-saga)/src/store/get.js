function getItem () {
    return new Promise((resolve, reject) => {
        setTimeout(function(){
            console.log(1111)
            resolve([
                {id: 1, title: '看一小时React的课程', finished: false},
                {id: 2, title: '打一小时台球', finished: false},
                {id: 3, title: '看一小时Java的课程', finished: false},
                {id: 4, title: '看一小时Python的课程', finished: false},
            ])
        }, 1000)
    })
}
export {
   getItem 
}