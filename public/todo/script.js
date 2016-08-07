$(document).ready(function() {
	$(":checkbox").on('change', function() {
		$.ajax({
			url: '/todo/update',
			method: 'POST',
			data: {id: $(this).attr('name'), completed: $(this).prop("checked")},
			success: function(data) {
				console.log(data);
			}
		});
	});

	$(".notes").on('click', '.glyphicon-trash', function() {
		$.ajax({
			url: '/todo/delete',
		       	method: 'POST',
			data: {id: $(this).attr('data-id') },
			success: function(data) {
				$(this).parent().remove();
			}.bind(this)
		});	
	});
});
