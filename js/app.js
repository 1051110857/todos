(function (Vue,window ,Todo) {
	const app = new Vue({
		el: '#app',
		data: {
			CurrentEdit: null, //类名条件初始化
			// 数据持久化 获取localStorage并将转化为Json对象或空数据
			todos: Todo.getAll(),
			FilterTodos:[],//路由数据
		},
		methods:{
			addData (e) {//等价于function adddata（）{} 
				// 添加数据
				const text=e.target.value.trim()
				const todos=this.todos
				const lastItem=todos[todos.length-1]
			
				if (text.length===0) return
				todos.push({
					id:lastItem ? lastItem.id+1 : 1,
					text,
					done:false
				})
				// window.localStorage.setItem("todos-vue",JSON.stringify(todos))
				e.target.value= ''

			},

			cutoverAll (e) {
				//  选中所有
				const toggle=e.target.checked
				function myF(t){
					t.done=toggle
				}
				this.todos.forEach(myF)
			},

			removeTodo (id) {
				// 删除数据
				const todo = this.todos
				const removeIndex =todo.findIndex( t =>  t.id === id  )
				// findTindex ES6新增方法用于用于遍历数组 参数是一个方法条件满足条件时返回第一次符合条件的数据 没有找到就是反回-1
				removeIndex !==-1 && todo.splice( removeIndex,1 )
				// 利用&&运算符的特性 :&&运算符语句中会执行到判断结果为false的语句停止执行并返回结果 
				// ||运算符: ||运算符语句中会执行到判断结果为true的语句、停止执行并 返回结果 否则执行到最后
			},
			getEditing (todo) {
				// 当触发事件时将当前的列表的数据赋值给初始化的数据
				this.CurrentEdit=todo
			},
			Editing (todo,e) {
				todo.text = e.target.value
				this.cancelEdit()
				// 当输入框失去焦点或按下enter键是恢复默认样式
			},
			cancelEdit (id) {
				// 取消编辑
				this.CurrentEdit=null
			},
			// Remain () {
			// 	//显示未完成的任务项
			// 	// 方法一：使用函数的调用
			//     console.log("重新执行")
			// 	return this.todos.filter ( t => !t.done ).length
			// 	// 返回done为false的对象数组的 长度
			// }
			ClearSeed () {
				const todo = this.todos

				for(let i=0;i<todo.length;i++){
					if(todo[i].done){
						todo.splice(i,1)
						i--
					}
					// 注在遍历中删除数组中的成员会出bug的
					// 所以判断要判断当前遍历项是否是选中状态 如果是删除该项然后i--让遍历项从上一个不符合条件的选项开始遍历
					// splice方法删除后会改变原数组并返回删除的项

				}
			}
		},
		// filters: {
		// 	Remain (todo) {
		// 		//方法二：使用过滤器
		// 		console.log("重新执行")
		// 		// 过滤器一般只用来处理字符串和拼接时间戳的格式上所以Vue对其功能上设置了限制比如无法访问Vue实列对象的this
		// 		return todo.filter ( t => !t.done ).length
		// 	}
		// },


		directives: {
			// 自定义指令

			focus: {
				inserted (el, binding) {
					// el指的是当前DOm元素
					// 调用方法 v-自定义指令名

					el.focus();
				}
			},

			todoFocus: {
				// updaate 当所绑定的模板视图发生变化是调用
				update (el,binding) {
					// binding.value 得到的值是自定义指令所传入的参数

					if(binding.value){
						// 
						// 当binding.value值为真是就将这个元素设为自动聚焦
						el.focus()
					}

				}
 			}

		},
		computed: {	 
			Remianing () {
				// 方法三：使用计算属性
				// console.log("重新执行")
				// 计算属性本质上是方法但是不能当方法调用 只需要Mustache语法或v-bind中写入函数名就能调用
				// 计算属性依赖于内部的数据数据一变动就会调用 而且函数本身会缓存执行的结果 如果需要执行多次数据会自动从缓存中提取数据 不需要执行多次
				// 计算属性可以访问Vue实例对象中的this
				return this.todos.filter ( t => !t.done ).length
			},

			Hasdone () {
				// 显示删除所有选中项的按钮
				return this.todos.some( t => t.done )
			}
		},
		// 数据持久化
		watch: {
			// 数据监视
			// watch中的成员只能用于监视data  和 computed 中的成员 如果其中的成员发生变化 watch 中对应的函数就会执行
			// 如果监视的是对象数据等复杂数据类型则需要配置深度监视 不然无法检测到数据的修改
			// 简单数据类型不需要配置
			// todos () {
			// 	console.log("数据修改了")
			// }
			todos: {
				handler () {
					// 当数据发生变化时将数据转化为字符串并储存到localStorage中
					Todo.save(this.todos)
				},
				deep: true //用于配置深度监视
			}
		}
	})

	window.onhashchange = function () {
		const hashs = window.location.hash.substr(1);
		// 当路由条件满足是将vue实例 中的todo中的数据进行过滤 再将过滤好的数据赋值给FilterTodo
		// 而视图中则渲染FilterTod中的数据而不会改变todo中的数据
		switch (hashs) {
			case "/active" :
			// 路由判断条件
				app.FilterTodos = app.todos.filter( t => t.done )
			break
			case "/completed" :
				app.FilterTodos = app.todos.filter( t => !t.done )
			break

			default :
				app.FilterTodos = app.todos
			break
		}
	}
	window.onhashchange()
})(Vue,window,Todo);
