;(function (window) {
    const Todo = {
        getAll () {
            const todo_json = window.localStorage.getItem("todos-vue") || "[]"
           
            try {
                // 判断try 中的代码能否执行如果可以就执行否则就执行catch中的语句
                return JSON.parse(todo_json)

            } catch(e) {
                 
                return []
            }
        },

        save (todos) {
            // 当调用改函数是 会将todos转化WieJSON格式的字符串‘存入到本地中
            window.localStorage.setItem("todos-vue",JSON.stringify(todos))
        }
    }
// 将对象挂载到window上
    window.Todo=Todo
})(window)