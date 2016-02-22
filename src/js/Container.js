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
		if (e.keyCode === 13) { // Return Key
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
		}
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
				<header className="heading">todos</header>
				<input className="todo-input" ref="inp" onKeyDown={this.addTodoItem} placeholder="What to do?"/>
				<ul>{this.state.list.map(createItem)}</ul>
			</div>
		);
	}
});

var OffLineNotification = React.createClass({
	render: function() {
		// TODO: Do a better job of assigning classnames
		return (
			<div className={this.props.offline ? "offLine-notification show" : "offLine-notification hide"}>
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
		var _this = this,
			isOnline = Connection.isOnline();

		// Register listeners
		window.addEventListener("offline", function() {
			_this.makeOfflineSwitchReadOnly(true);
			_this.setState({workOffLine: true, networkDown: true});
		});

		window.addEventListener("online", function() {
			_this.makeOfflineSwitchReadOnly(false);
	    _this.setState({workOffLine: false, networkDown: false});
		});

		this.makeOfflineSwitchReadOnly(!isOnline);
		this.setState({workOffLine: !isOnline});
	},

	makeOfflineSwitchReadOnly: function(readOnly) {
		this.refs.switch.checked = readOnly;
		this.refs.switch.disabled = readOnly;
	},

	toggleWorkOffline: function(e) {
		// TODO: Use better way to share common state
		this.setState({workOffLine: e.target.checked}, function() {
			Connection.setWorkOffLine(this.state.workOffLine);
		});
	},

	render: function() {
		return (
			<div className="offline-switch">
				<label htmlFor="switch">Work Offline</label>
				<label className={this.state.workOffLine ? "switch on" : "switch"}>
					<input id="switch" type="checkbox" onClick={this.toggleWorkOffline} ref="switch" />
					<div></div>
  			</label>
				<OffLineNotification offline={this.state.workOffLine}/>
			</div>
		);
	}
});

var Container = React.createClass({
	render: function() {
		return (
			<div>
				<TodoList/>
				<WorkOffLine/>
			</div>
		);
	}
});
