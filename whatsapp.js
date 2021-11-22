var nomeGlobal = "";
var phoneGlobal = "";
var nomeVendedor = "";
var nomeFaculdade = "";
var contador = 0; 

document.getElementsByTagName("body")[0].addEventListener("load", init(), false);

async function init() {
	var objetoWhatsApp = await pegarObjetoNoStorageSync(['contador', 'ultimaDataInserida']);

	var modal_estilos = 'display: block;'
	+'background: #fff; padding: 15px;'
	+'border-radius: 5px;'
	+'-webkit-box-shadow: 0px 6px 14px -2px rgba(0,0,0,0.75);'
	+'-moz-box-shadow: 0px 6px 14px -2px rgba(0,0,0,0.75);'
	+'box-shadow: 0px 6px 14px -2px rgba(0,0,0,0.75);'
	+'position: fixed;'
	+'top: 50%; left: 50%;'
	+'transform: translate(-50%,-50%);'
	+'z-index: 99999999; text-align: center;'
	+'color: #333';

	var fundo_modal_estilos = 'top: 0; right: 0;'
	+'bottom: 0; left: 0; position: fixed;'
	+'background-color: rgba(0, 0, 0, 0.6); z-index: 99999999;'
	+'display: none;';

	var meu_modal = '<div id="fundo_modal" style="'+fundo_modal_estilos+'">'
	+'<div id="meu_modal" style="'+modal_estilos+'">'
		+'<div style="width: 300px; display: inline-block; text-align: left;">'
			+'<p>Numero:</p></br>'
			+'<input name="numero" class="form-control" id="numero" style="width: calc(100% - 22px); padding: 10px;"/></br></br>'
			+'<p>Nome:</p></br>'
			+'<input name="nome" class="form-control" id="nome" style="width: calc(100% - 22px); padding: 10px;"/></br>'
			+'<button class="btn-ok" id="botaoEvento" style="float: right; margin: 10px 0 0;cursor: pointer;color: rgb(27, 25, 25); height: 36px; line-height: 36px; min-width: 88px; text-align: center;background-color: transparent; display: inline-block;-webkit-tap-highlight-color: rgba(0, 0, 0, 0.12);font-size: 14px;border-radius: 2px;transition: all 0.45s cubic-bezier(0.23, 1, 0.32, 1) 0s;outline: 0px !important; background-color:#038a7b;color: #FFF; padding: 0 10px;">Enviar Saudação</button></br>'
	   +'</div>'
	   +'<button type="button" class="close" style="top: 5px; right: 10px; position: absolute; cursor: pointer;"><span>&times;</span></button>'
	+'</div></div>';

	var contadorP = '<p id="contador" style="font-size: 50px; position: absolute; bottom: 62px; right: 0; color: #FF0; z-index: 999999;" title="Quantas pessoas foram chamadas pelo WhatsApp++ nessa sessão."></p>'

	$("body").append(meu_modal);
	$("body").append(contadorP);

	dataAtual = new Date();

	dataAtual.setHours(0);
	dataAtual.setMinutes(0);
	dataAtual.setSeconds(0)


	if(objetoWhatsApp.ultimaDataInserida == null){
		alert('Olá! O contador que fica na parte inferior direita do seu monitor é reiniciado uma vez ao dia! Use-o para saber quantas pessoas você chamou com o WhatsApp++');

		contador = 0;
		chrome.storage.sync.set({'ultimaDataInserida': dataAtual.getTime(), 'contador': contador});
	} else if(objetoWhatsApp.ultimaDataInserida < dataAtual.getTime()){
		alert('Olá! Tudo bem? Seu contador foi resetado, o numero de pessoas chamados da ultima vez foi de: ' + objetoWhatsApp.contador);

		contador = 0;
		chrome.storage.sync.set({'ultimaDataInserida': dataAtual.getTime(), 'contador': contador});
	} else {
		contador = objetoWhatsApp.contador;
	}

	document.querySelector('#contador').textContent = contador;

	$("#fundo_modal, .close").click(function(){ $("#fundo_modal").hide(); });
	$("#meu_modal").click(function(e){ e.stopPropagation(); });

	$('html').keydown(function(e) {
		if (e.which == 18) {
			$('#fundo_modal').fadeIn();
			$('#meu_modal').fadeIn();
			document.querySelector('#numero').focus();
		}
	});

	$("#botaoEvento").click(function(){
		novaMensagem(document.querySelector('#numero').value, document.querySelector('#nome').value);

		document.querySelector('#numero').value = "";
		document.querySelector('#nome').value = "";
	});
};

async function pegarObjetoNoStorageSync(keys){
	return new Promise(function(resolve, reject){
	    chrome.storage.sync.get(keys, function(objetoWhats){
	        resolve(objetoWhats);
	    })
    })
}

const openChat = phone => {
  const link = document.createElement("a");
  link.setAttribute("href", `whatsapp://send?phone=${phone}`);
  document.body.append(link);
  link.click();
  document.body.removeChild(link);
};


function primeiraLetraMaiuscula(nome) {
	nome = nome.toLowerCase();
	nome = nome[0].toUpperCase() + nome.slice(1);

    return nome;
}

async function novaMensagem(phone, nome) {
	let objetoWhatsApp = await pegarObjetoNoStorageSync(['nome_vendedor', 'nome_faculdade', 'frase_oferta', 'pergunta']);

	phoneGlobal = phone;
	nomeGlobal = nome;

	nomeVendedor = await objetoWhatsApp.nome_vendedor;
	nomeFaculdade = await objetoWhatsApp.nome_faculdade;

	if(nomeVendedor == null || nomeVendedor == "" || nomeFaculdade == null || nomeFaculdade == ""){
		alert("Defina o nome do vendedor e o da faculdade, na janela da extenção, antes de usar a ferramenta!");
		$("#fundo_modal").hide();

		return;
	}


	if (phoneGlobal == null || phoneGlobal == "") {
		alert('Cancelado');
	} else {
		if (nomeGlobal == null || nomeGlobal == "") {
			alert('Cancelado');
		} else {
			phoneGlobal = phoneGlobal.trim();
			nomeGlobal = nomeGlobal.trim();
			
			window.InputEvent = window.Event || window.InputEvent;

			var event = new InputEvent('input', {
				bubbles: true
			});

			openChat('55' + phoneGlobal.replace(/[^0-9]/g,''));

			$("#meu_modal").hide();

			setTimeout(function() {
				if(document.querySelector('._1LcQK .i0jNr.selectable-text.copyable-text') == null){
					var data = new Date();
					var hora = data.getHours();

					comprimento = 'bom dia'

					if(hora >= 12 && hora < 19){
					    comprimento = 'boa tarde'
					} else if(hora >= 19){
					    comprimento = 'boa noite'
					}
                    

				    document.querySelector('div.p3_M1>div>div._13NKt.copyable-text.selectable-text').textContent = 'Oii ' + primeiraLetraMaiuscula(nomeGlobal) + ', ' + comprimento + '! Prazer sou ' + nomeVendedor + ', da ' + nomeFaculdade + '. 🤝';

                    document.querySelector('div.p3_M1>div>div._13NKt.copyable-text.selectable-text').dispatchEvent(event);

                    document.querySelector("._4sWnG").click();


				    
                    document.querySelector('div.p3_M1>div>div._13NKt.copyable-text.selectable-text').textContent = objetoWhatsApp.frase_oferta;

                    document.querySelector('div.p3_M1>div>div._13NKt.copyable-text.selectable-text').dispatchEvent(event);

                    document.querySelector("._4sWnG").click();

                    contador++;
                    document.querySelector('#contador').textContent = contador;
                    chrome.storage.sync.set({'contador': contador});

                    phone = '';
										nome = '';
										$("#fundo_modal").hide();

                } else {
                    alert ('Conversa antiga')
                    phone = '';
										nome = '';
										$("#fundo_modal").hide();
                }
			}, 2000);
		}
	}
}