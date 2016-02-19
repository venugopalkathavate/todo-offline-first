var OnlineOffline = {
	workOffLine: false,
	onlineSwitch: function(ol) {
		this.workOffLine = ol;
	},
	isOnline: function() {
		return this.workOffLine || navigator.onLine;
		//return false;
	}
};

// Store to manage todo list
var Store = {
	model: null,
	init: function() {
		var	_this = this;

		// Register listeners
		window.addEventListener("offline", function() {
		    _this.save();
		});

		window.addEventListener("online", function() {
		    _this.save();
		});
	},
	save: function (todoList) {
		var localStore = !OnlineOffline.isOnline();

		if (todoList) {
			this.model = {list: todoList};
		}

		if (localStore) {
			localStorage.setItem("todoList", JSON.stringify(this.model));
			console.log("Local Store.... SAVE");
		} else {
			console.log("Database Store.... SAVE", this.model);

			$.ajax({
	        url : "/todolist",
	        type: "POST",
	        data: JSON.stringify(this.model),
	        contentType: "application/json; charset=utf-8",
	        dataType: "json",
	        success: function(data) {
	            console.log(data);
	        }
	    });
		}
	},
	fetch: function() {
		var localStore = !OnlineOffline.isOnline(),
			deferred = Q.defer(),
			_this = this;

		if (localStore) {
			deferred.resolve({list: JSON.parse(localStorage.getItem("todoList"))});
			console.log("Local Store.... FETCH");
		} else {
			console.log("Database Store.... FETCH");
			$.get("/todolist", function(data) {
				_this.model = data.list;
				deferred.resolve(data);
			});
		}

		return deferred.promise;
	}
};
