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
		var _this = this, fetchData;

		Store.init(Connection);
		fetchData = Store.fetch();

		if(fetchData.then) {
			fetchData.then(function(data) {
				_this.setState({list: data.list});
			});
		} else {
			this.setState(fetchData);
		}
	},

	saveItem: function(updatedList) {
		var _this = this, promise;

		promise = Store.save(updatedList);

		if(promise && promise.then) {
			promise.then(function(data) {
				_this.setState({list: updatedList});
			});
		}	else {
			this.setState({list: updatedList});
		}
	},

	addTodoItem: function(e) {
		if (e.keyCode === 13) { // Return Key
			e.preventDefault();

			this.saveItem(this.state.list.concat([{
				id: Date.now(),
				message: this.refs.inp.value,
				done: false
			}]));

			this.refs.inp.value = "";
		}
	},

	deleteItem: function(id, e) {
		e.preventDefault();
		e.stopPropagation();
		
		this.saveItem(this.state.list.filter(function(item, i) {
			return item.id !== id;
		}));
	},

	itemDone: function(item, e) {
		e.preventDefault();

		item.done = !item.done;
		this.refs[item.id].checked = item.done; // TODO: Check React way of DOM manipulation.
		Store.save(this.state.list);
	},

	render: function() {
		var _this = this;
		var createItem = function(item) {
      return (
				<li key={item.id} onClick={_this.itemDone.bind(_this, item)}>
					<input type="checkbox" id={item.id} ref={item.id} defaultChecked={item.done}/>
					<label htmlFor={item.id}>{item.message}</label>
					<button onClick={_this.deleteItem.bind(_this, item.id)} className="delete-item">&#x2715;</button>
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
			_this.setState({workOffLine: true});
		});

		window.addEventListener("online", function() {
			_this.makeOfflineSwitchReadOnly(false);
	    _this.setState({workOffLine: false});
		});

		this.makeOfflineSwitchReadOnly(!isOnline);
		this.setState({workOffLine: !isOnline});
	},

	makeOfflineSwitchReadOnly: function(readOnly) {
		// TODO: Should the DOM manipulation be handeled by data-biding
		this.refs.switch.checked = readOnly;
		this.refs.switch.disabled = readOnly;
	},

	toggleWorkOffline: function(e) {
		// TODO: Use better way to share common state
		this.setState({workOffLine: e.target.checked}, function() {
			Connection.setWorkOffLine(this.state.workOffLine);

			// Sync data with server
			if(Connection.isOnline()) {
				Store.save(JSON.parse(localStorage.getItem("todoList")).list);
			} else {
				Store.save(); // Store what ever is ther in the model to local storage.
			}
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
