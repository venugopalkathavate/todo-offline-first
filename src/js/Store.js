// Storage classes
function DataStore() {
	var getDataStore = function(localStore) {
		return localStore ? localDataStorage : databaseStore;
	};

	var localDataStorage = {
		save: function(model) {
			console.log("Local Store.... SAVE");
			localStorage.setItem("todoList", JSON.stringify(model));
		},
		fetch: function() {
			var deferred = Q.defer();

			console.log("Local Store.... FETCH");
			deferred.resolve({list: JSON.parse(localStorage.getItem("todoList"))});

			return deferred.promise;
		}
	};

	var databaseStore = {
		save: function(model) {
			console.log("Database Store.... SAVE", this.model);
			$.ajax({
	        url : "/todolist",
	        type: "POST",
	        data: JSON.stringify(model),
	        contentType: "application/json; charset=utf-8",
	        dataType: "json",
	        success: function(data) {
	            console.log(data);
	        }
	    });
		},
		fetch: function() {
			var deferred = Q.defer(),
				_this = this;

			console.log("Database Store.... FETCH");
			$.get("/todolist", function(data) {
				if (!data.list) {
					data = {list: []};
				}

				_this.model = data.list;
				deferred.resolve(data);
			});

			return deferred.promise;
		}
	};

	return getDataStore;
}

// Store to manage todo list
var Store = {
	model: null,
	init: function(connection) {
		var	_this = this;

		this.connection = connection;
		this.store = new DataStore();

		// Register listeners
		window.addEventListener("offline", function() {
		    _this.save();
		});

		window.addEventListener("online", function() {
		    _this.save();
		});
	},
	save: function (todoList) {
		if (todoList) {
			this.model = {list: todoList};
		}

		this.store(!this.connection.isOnline()).save(this.model);
	},
	fetch: function() {
		return this.store(!this.connection.isOnline()).fetch();
	}
};
