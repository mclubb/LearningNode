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
});
