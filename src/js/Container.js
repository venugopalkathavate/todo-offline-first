var TodoList = React.createClass({
	getInitialState: function() {
	    return {
	    	list: [
	    		{id: Date.now(), message: "this test mes 1", done: false},
	    		{id: Date.now() + 1, message: "this test mes 2", done: true}
	    	]
	    };
  	},

  	addTodoItem: function(e) {
  		e.preventDefault();

  		this.setState({
  			list: this.state.list.concat([{
	  			id: Date.now(),
	  			message: this.refs.inp.value,
	  			done: false
	  		}])
  		});
  	},

	render: function() {
		var createItem = function(item) {
      		return (
				<li key={item.id}>
					<input type="checkbox" id={item.id} />
					<label htmlFor={item.id}>{item.message}</label>
				</li>
			)
    	};

    	return (
    		<div>
				<ul>{this.state.list.map(createItem)}</ul>
				<input ref="inp" />
				<button onClick={this.addTodoItem}>Add</button>
			</div>
		)
	}
});

var Container = React.createClass({
	render: function(){
		return (
			<div>
				<div>My TODO List</div>			
				<TodoList/>
			</div>
		)
	}
});