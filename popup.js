window.onload = function(){ 
   document.querySelector("#btnOk").onclick = function() {salvarValores()};

   chrome.storage.sync.get(['nome_vendedor', 'nome_faculdade', 'frase_oferta'], function(resultado) {
      document.querySelector("#nome_vendedor").value = resultado.nome_vendedor == null ? "" : resultado.nome_vendedor;
      document.querySelector("#nome_faculdade").value = resultado.nome_faculdade == null ? "" : resultado.nome_faculdade;
      document.querySelector("#frase_oferta").value = resultado.frase_oferta == null ? "" : resultado.frase_oferta;
   });
}; 

function salvarValores(){
   var nomeVendedor = document.querySelector('#nome_vendedor').value;
   var nomeFaculdade = document.querySelector('#nome_faculdade').value;
   var frase_oferta = document.querySelector('#frase_oferta').value;

   chrome.storage.sync.set({'nome_vendedor': nomeVendedor, 'nome_faculdade': nomeFaculdade, 'frase_oferta': frase_oferta}, function(){
      alert("Sucesso!");
   });
}
