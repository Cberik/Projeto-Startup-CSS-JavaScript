// Aguarda todo o HTML carregar antes de executar o script
document.addEventListener('DOMContentLoaded', () => {
  
    // 1. SELEÇÃO DOS ELEMENTOS PELAS CLASSES E IDs DO SEU HTML
    const formCadastro = document.querySelector('.ad-form');
    const formBusca = document.querySelector('.header__search-form');
    
    const inputFotos = document.getElementById('item-fotos');
    const inputTelefone = document.getElementById('anunciante-telefone');
  
    // 2. CONTROLE DA BARRA DE PESQUISA DO TOPO (.header__search-form)
    if (formBusca) {
      formBusca.addEventListener('submit', (evento) => {
        evento.preventDefault();
        const termoBusca = formBusca.querySelector('.header__search-input').value.trim();
        
        if (termoBusca) {
          // Redireciona para a página inicial ou de anúncios levando o termo pesquisado na URL
          window.location.href = `startup.html?busca=${encodeURIComponent(termoBusca)}`;
        }
      });
    }
  
    // 3. VALIDAÇÃO DE QUANTIDADE DE FOTOS (MÁX. 5)
    inputFotos.addEventListener('change', function () {
      if (this.files.length > 5) {
        alert('Atenção: Você pode enviar no máximo 5 fotos por desapego.');
        this.value = ''; // Limpa os arquivos selecionados
      }
    });
  
    // 4. MÁSCARA AUTOMÁTICA DE TELEFONE / WHATSAPP
    inputTelefone.addEventListener('input', (evento) => {
      let numero = evento.target.value.replace(/\D/g, ''); // Remove letras e símbolos
      numero = numero.substring(0, 11); // Limita a 11 dígitos
  
      if (numero.length > 2) {
        numero = numero.replace(/^(\d{2})(\d)/g, '($1) $2');
      }
      if (numero.length > 7) {
        numero = numero.replace(/(\d)(\d{4})$/, '$1-$2');
      }
  
      evento.target.value = numero;
    });
  
    // 5. PROCESSAMENTO DO FORMULÁRIO DE CADASTRO (.ad-form)
    formCadastro.addEventListener('submit', async (evento) => {
      evento.preventDefault(); // Evita o recarregamento da página
  
      // Converte as fotos selecionadas para texto (Base64) para poder exibir em outras páginas
      const imagensConvertidas = await converterFotosParaBase64(inputFotos.files);
  
      // Monta o objeto completo do anúncio
      const novoAnuncio = {
        id: Date.now(), // Gera um código único baseado no horário atual
        titulo: document.getElementById('item-titulo').value.trim(),
        categoria: document.getElementById('item-categoria').value,
        conservacao: document.getElementById('item-conservacao').value,
        valor: parseFloat(document.getElementById('item-valor').value),
        negociavel: document.getElementById('item-negociavel').checked,
        descricao: document.getElementById('item-descricao').value.trim(),
        fotos: imagensConvertidas,
        anunciante: {
          nome: document.getElementById('anunciante-nome').value.trim(),
          telefone: inputTelefone.value,
          cidade: document.getElementById('item-cidade').value.trim(),
          bairro: document.getElementById('item-bairro').value.trim()
        },
        dataCriacao: new Date().toLocaleDateString('pt-BR')
      };
  
      // Salva o anúncio no navegador
      salvarAnuncio(novoAnuncio);
  
      // Avisa o usuário e redireciona para a página "Meus Anúncios"
      alert('Seu desapego foi publicado com sucesso no Brike Place!');
      window.location.href = 'anuncios.html';
    });
  
    // --- FUNÇÕES AUXILIARES ---
  
    // Salva a lista de anúncios no LocalStorage do navegador
    function salvarAnuncio(anuncio) {
      const anunciosSalvos = JSON.parse(localStorage.getItem('brike_anuncios')) || [];
      anunciosSalvos.push(anuncio);
      localStorage.setItem('brike_anuncios', JSON.stringify(anunciosSalvos));
    }
  
    // Transforma os arquivos de imagem em strings para salvar sem precisar de servidor
    function converterFotosParaBase64(arquivos) {
      const promessas = Array.from(arquivos).map((arquivo) => {
        return new Promise((resolve) => {
          const leitor = new FileReader();
          leitor.onload = (e) => resolve(e.target.result);
          leitor.readAsDataURL(arquivo);
        });
      });
      return Promise.all(promessas);
    }
  
  });
  