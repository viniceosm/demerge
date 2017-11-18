var socket;
socket = io.connect();

$(document).ready(function(){
	//pesquisa
	$('#formPesquisaUsuario').submit(function(e){
		$('#formPesquisaUsuario').attr('action', '/u/procurar/' + $('#pesquisaUsuario').val());
		if (!validaPesquisa($('#pesquisaUsuario').val())) {
			e.preventDefault();
		}
	});
	$('#formPesquisaUsuarioNav').submit(function(e){
		$('#formPesquisaUsuarioNav').attr('action', '/u/procurar/' + $('#pesquisaUsuarioNav').val());
		if (!validaPesquisa($('#pesquisaUsuarioNav').val())) {
			e.preventDefault();
		}
	});

	$('#submitFormPesquisaUsuarioNav').click(function(){
		$('#formPesquisaUsuarioNav').submit();
	});

	//escolher foto
	$('#btnUploadFoto').click(function(){
		$('#fileFoto').click();
	});
	$('#fileFoto').change(function(e){
		$('#fotoPreview').attr('src', URL.createObjectURL(e.target.files[0]));
		$('#btnModalPostar').click();
	});

	//postar
	$('#btnPostar').click(function(){
		$('#formPost').submit();
	});
	$('#formPost').submit(function(e){
		var data = new FormData();
		$.each($('#fileFoto')[0].files, function (i, file) {
			data.append('fileFoto-' + i, file);
		});

		$.ajax({
			url: 'p/novo',
			data: data,
			cache: false,
			contentType: false,
			processData: false,
			method: 'POST',
			type: 'POST',
			success: function (data) {
				$('#btnCloseModal').click();
			}
		});

		e.preventDefault();
	});
});

function seguir(id) {
	socket.emit('seguir', id);
};
socket.on('retornoSeguir', function (data) {
	$('#btnSeguir').html('Seguir');
	if(data==true){
		$('#btnSeguir').html('Seguindo');
	}
});

function curtir(id) {
	socket.emit('curtirPost', id);
};
socket.on('retornoCurtir', function (data) {
	$('#qCurtiu' + data.idPost).html(data.qCurtiu);

	$('#btnLike' + data.idPost).css('color', 'black');
	if (data.isCurte == true) {
		$('#btnLike' + data.idPost).css('color', 'red');
	}
});

function validaPesquisa(p){
	return (p.trim() !== '');
}