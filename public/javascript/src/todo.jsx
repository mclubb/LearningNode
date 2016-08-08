var TodoListManager = React.createClass({

	getDefaultProps: function() {
		return {
			taskList: [{_id:'1', task:'placeholder', completed:false}]	
		};
	}, 
	getInitialState: function() {
		console.log(this.props);
		return {
			list: this.props.taskList
		};
	},
	render: function() {
		return (
<div className='todo_wrapper'>
	<span className='header'>Today</span>
	<span className='subheader'>I will accomplish...</span>

	<div className='newTask'>
		<input type="text" ref="newTask"  name="task" className="txtNewTask" onKeyUp={this.handleEnter} />
		<input type="submit" name="btnSubmit" className="btn btn-primary" value="Add Task" onClick={this.addTask}/>
	</div>

	<div className="notes">
			{this.state.list.map(function(row, index) {
			return (
				<div className='row' data-id={row._id} data-index={index}>
					<input type="checkbox" name={row._id} />
					<span>{row.task}</span>
					<i className="glyphicon glyphicon-trash" onClick={this.deleteClick}></i>
				</div>
			       );
		}.bind(this))}
	</div>
</div>
		);
	},

	handleEnter: function(e) {
		if( e.keyCode == 13 ) {
			this.addTask(e);
		}
	},

	addTask: function(e) {
		var newTask = this.refs.newTask.value;
		$.ajax({
			url: '/todo/create',
			data: {'task': newTask, 'completed':false },
			method: 'POST',
			success: function(data) {
				console.log('Returned from create: ', data);
				if( data.status == 'success' ) {
					var current_state = this.state.list;
					current_state.push({_id:data.result.insertedIds[0], task: newTask, completed: false});
					this.refs.newTask.value='';
					this.setState({list: current_state});
				}
			}.bind(this)
		});
	
	},

	deleteClick: function(e) {
		var parent = e.target.parentNode;
		var id = parent.getAttribute('data-id');
		var index = parent.getAttribute('data-index');

		$.ajax({
			url: '/todo/delete',
			data: {'id': id },
			method: 'POST',
			success: function(data) {
				if( data.status == 'success' ) {
					var current_state = this.state.list;
					current_state.splice(index, 1);
					this.setState({list: current_state});
				}
			}.bind(this)
		});
	}
});
