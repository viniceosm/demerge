function Autocompletev(){}

Autocompletev.prototype.adicionaEventosDataList = function(selector) {
	var elemento = document.querySelector('.datalist-input' + selector);

	elemento.addEventListener('input', function (e) {
		filtrarAutoComplete(elemento.value, elemento.getAttribute('target'));
	});
	
	elemento.addEventListener('focus', function (e) {
		mostraDatalist(elemento.getAttribute('target'));
	});

	elemento.addEventListener('blur', function (e) {
		escondeDatalist(elemento.getAttribute('target'));
	});
	
	var elTarget = elemento.getAttribute('target');
	var options = document.querySelectorAll(elTarget + ' div');
	
	[].forEach.call(options, function (opt) {
		opt.addEventListener('click', function (e) {
			elemento.value = opt.innerHTML;
		});
	});
	
	function mostraDatalist(elTarget) {
		document.querySelector(elTarget).style.display = 'block';
	}

	function escondeDatalist(elTarget) {
		document.querySelector(elTarget).style.display = 'none';
	}
	
	function filtrarAutoComplete(valor, elTarget) {
		var options = document.querySelectorAll(elTarget + ' div');

		[].forEach.call(options, function (opt) {
			if (opt.innerHTML.indexOf(valor) == -1) {
				opt.style.display = 'none';
			} else {
				opt.style.display = '';
			}
		});
	}
}

var autocompletev = new Autocompletev();