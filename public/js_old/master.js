$(document).ready(function(){
	var socket = io.connect();
	socket.on('seilaPo', function(data){

	});

	function seguir(){
		$.get("ajax/seguir", { usuarioSeguir: 'teste' }, function (data) {
			alert(`usuario ${data.seguido} seguido.`);
		});
	}
})