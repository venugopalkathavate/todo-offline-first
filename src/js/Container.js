var TodoList = React.createClass({
	getInitialState: function() {
		return {list: []};
	},

	componentDidMount: function() {
		var _this = this;

		Store.init();
		Store.fetch().then(
			function(data) {
				_this.setState({list: data.list});
			}
		);
	},

	addTodoItem: function(e) {
		e.preventDefault();

		var _this = this;
		this.setState({list: this.state.list.concat([{
				id: Date.now(),
				message: this.refs.inp.value,
				done: false
			}])
		}, function() {
			Store.save(_this.state.list);
		});

		this.refs.inp.value = "";
	},

	render: function() {
		var createItem = function(item) {
      return (
				<li key={item.id}>
					<input type="checkbox" id={item.id} />
					<label htmlFor={item.id}>{item.message}</label>
				</li>
			);
    };

  	return (
  		<div className="container">
				<ul>{this.state.list.map(createItem)}</ul>
				<input ref="inp" />
				<button onClick={this.addTodoItem}>Add</button>
			</div>
		);
	}
});

// var WorkOffLine = React.createClass({
// 	getInitialState: function() {
// 		return {}
// 	}
// });

var Container = React.createClass({
	render: function() {
		return (
			<div>
				<div>My TODO List</div>
				<TodoList/>
				// TODO: Include below widgets
				// <WorkOffLine/>
				// <OffLineNotification/>
			</div>
		);
	}
});
