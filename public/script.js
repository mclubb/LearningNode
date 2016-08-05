$(document).ready(function() {
	$('.newTaskButton').on('click', function() {
		$('.newTask').slideToggle();
	});

	$('.author').each(function() {
		$(this).find('span').each(function() {
			if( $(this).text().length > 80 ) {
				console.log("removed");
				$(this).text( $(this).text().substring(0, 80) + ' ...' );
			}
		});
	});
});
