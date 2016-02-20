var Connection = {
	workOffLine: false,
	setWorkOffLine: function(online) {
		this.workOffLine = online;
	},

	isOnline: function() {
		return !this.workOffLine && navigator.onLine;
	}
};

var TodoList = React.createClass({
	getInitialState: function() {
		return {list: []};
	},

	componentDidMount: function() {
		var _this = this;

		Store.init(Connection);
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

var OffLineNotification = React.createClass({
	render: function() {
		return (
			<div className={this.props.offline ? "show" : "hide"}>
				Offline
			</div>
		);
	}
});

var WorkOffLine = React.createClass({
	getInitialState: function() {
		return {workOffLine: false};
	},

	componentDidMount: function() {
		var _this = this;

		// Register listeners
		window.addEventListener("offline", function() {
			_this.refs.switch.checked = true;
			_this.refs.switch.disabled = true;
			_this.setState({workOffLine: true, networkDown: true});
		});

		window.addEventListener("online", function() {
			_this.refs.switch.checked = false;
			_this.refs.switch.disabled = false;
	    _this.setState({workOffLine: false, networkDown: false});
		});
	},

	toggleWorkOffline: function(e) {
		// TODO: Use better way to share common state
		this.setState({workOffLine: e.target.checked}, function() {
			Connection.setWorkOffLine(this.state.workOffLine);
		});
	},

	render: function() {
		return (
			<div>
				<label htmlFor="switch">Work Offline</label>
				<input id="switch" type="checkbox" onClick={this.toggleWorkOffline} ref="switch"/>
				<OffLineNotification offline={this.state.workOffLine}/>
			</div>
		);
	}
});

var Container = React.createClass({
	render: function() {
		return (
			<div>
				<div>My TODO List</div>
				<TodoList/>
				<WorkOffLine/>
			</div>
		);
	}
});
