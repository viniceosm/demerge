var socket;
socket = io.connect();

$(document).ready(function(){
	//campo usuario cadastro
	$('#formCadastroUsuario #txtNome').on('input', function(e){
		validaBarraUsuario();
	});
	$('#formCadastroUsuario').submit(function(e){
		var nome = $('#formCadastroUsuario [name="nome"]').val();
		var nomeCompleto = $('#formCadastroUsuario [name="nomeCompleto"]').val();
		var email = $('#formCadastroUsuario [name="email"]').val();
		var senha = $('#formCadastroUsuario [name="senha"]').val();
		
		if (validaBarraUsuario()) {
			socket.emit('cadastroUsuario', { nome, nomeCompleto, email, senha });
		}
		e.preventDefault();
	});
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
		$('#fileFotoPostar').click();
	});
	$('#fileFotoPostar').change(function(e){
		$('#fotoPreview').attr('src', URL.createObjectURL(e.target.files[0]));
		if ($('#modalPostar').css('display') !== 'block') {
			$('#btnModalPostar').click();
		}
	});
	$('#fotoPreview').click(function(){
		$('#fileFotoPostar').click();
	});
	$('#modalPostar').on('shown.bs.modal', function () {
		$('#descricaoPost').focus();
	})
	
	//postar
	$('#formPost').submit(function(e){
		$('#btnPostar').prop('disabled', true);
		
		var data = new FormData();
		$.each($('#fileFotoPostar')[0].files, function (i, file) {
			data.append('fileFoto-' + i, file);
		});
		data.append('descricao', $('#formPost [name="descricao"]').val());
		
		$.ajax({
			url: '/p/novo',
			data: data,
			cache: false,
			contentType: false,
			processData: false,
			method: 'POST',
			type: 'POST',
			success: function (data) {
				$('#btnCloseModalPostar').click();
				$('#btnModalAvisoPostado').click();
				setTimeout(function(){
					$('#btnPostar').prop('disabled', false);
				}, 2000);
				setTimeout(function(){
					$('#btnCloseModalAvisoPostado').click();
				}, 1000);
			}
		});

		e.preventDefault();
	});

	
	//escolher foto perfil
	$('#btnAlterarFotoPerfil').click(function () {
		$('#fileFotoPerfil').click();
	});
	$('#fileFotoPerfil').change(function (e) {
		$('#fotoPreviewFotoPerfil').attr('src', URL.createObjectURL(e.target.files[0]));
		if ($('#modalFotoPerfil').css('display') !== 'block') {
			$('#btnAlterarFotoPerfil').click();
		}
	});
	$('#fotoPreviewFotoPerfil').click(function () {
		$('#fileFotoPerfil').click();
	});
	
	//alterar foto
	$('#formFotoPerfil').submit(function(e){
		$('#btnSalvarFotoPerfil').prop('disabled', true);
		
		var data = new FormData();
		$.each($('#fileFotoPerfil')[0].files, function (i, file) {
			data.append('fileFoto-' + i, file);
		});
		
		$.ajax({
			url: '/u/alteraFoto',
			data: data,
			cache: false,
			contentType: false,
			processData: false,
			method: 'POST',
			type: 'POST',
			success: function (data) {
				$('#fotoPerfil').attr('src', '/img/post/' + data.imagemPerfil);
				$('#btnCloseModalFotoPerfil').click();
				setTimeout(function(){
					$('#btnSalvarFotoPerfil').prop('disabled', false);
				}, 2000);
			}
		});

		e.preventDefault();
	});

	//link para notificação
	$.each($('#dropdown-notificacoes .aNotificacao'), function(i, notificacao) {
		$(notificacao).click(function(e){
			$(location).attr('href', $(notificacao).attr('href-notificacao'));
		});
	});
	
	//comentar
	$.each($('[id^="formComentar"]'), function(i, comentar) {
		$(comentar).submit(function(e) {
			let id = $(comentar).attr('post-target');
			comentarPost(id, $('#msgComentar' + id).val());
			$('#msgComentar' + id).val('');

			e.preventDefault();
		});
	});
	//autocomplete
	autocompletev.adicionaEventosDataList('#pesquisaUsuario');
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

function comentarPost(id, msg) {
	socket.emit('comentarPost', {id, msg});
}
socket.on('retornoComentarPost', function(data) {
	$('#comentarios' + data.idPost).append(`
			<div class="col-xs-12">
				${data.comentario.dono.nome}: ${data.comentario.descricao}
			</div>`);
});

socket.on('erroCadastrarUsuario', function(data) {
	$('#msgValUsuario').html(data);
});
socket.on('retornoCadastroUsuario', function(data) {
	$('#btnModalAvisoEmailEnviado').click();
	setTimeout(function() {
		$('#btnCloseModalAvisoEmailEnviado').click();
		setTimeout(function() {
			location.href = '/';
		}, 500);
	}, 2500);
});

function validaPesquisa(p){
	return (p.trim() !== '');
};
function validaBarraUsuario(){
	$('#msgValUsuario').html('');
	var valido = /^[a-zA-Z0-9_.-]*$/.test($('#formCadastroUsuario #txtNome').val());
	if (!valido) {
		$('#msgValUsuario').html('Os nomes de usuário só podem usar letras, números, sublinhados e pontos.');
	}
	return valido;
}