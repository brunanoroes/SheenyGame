new Vue({
  el: "#game",

  data() {
    return {
      // telas: passe | palavra | timer | final
      tela: "passe",

      palavras: [],
      palavraAtual: "",

      intervalo: null,
      maxRodadas: 10,

      tempoRodada: 2, // minutos
      tempoRestante: 0,

      nomesJogadores: {},

      jogo: {
        totalJogadores: 0,
        impostor: 0,
        palavra: null,
        jogadorAtual: 1,
        rodada: 1,
        pontos: {}
      }
    };
  },

  async created() {
    this.nomesJogadores =
      JSON.parse(localStorage.getItem("nomesJogadores")) || {};

    this.tempoRodada =
      Number(localStorage.getItem("tempoRodada")) || 2;

    await this.iniciarJogo();
  },

  methods: {
    /* ==========================
       INÍCIO DO JOGO
    ========================== */
    async iniciarJogo() {
      this.jogo.totalJogadores =
        Number(localStorage.getItem("totalJogadores"));

      const res = await fetch("words.json");
      this.palavras = await res.json();

      // inicia pontuação
      for (let i = 1; i <= this.jogo.totalJogadores; i++) {
        this.$set(this.jogo.pontos, i, 0);
      }

      this.novaRodada(true);
    },

    /* ==========================
       RODADA
    ========================== */
    sortearRodada() {
      // sorteia palavra
      this.jogo.palavra =
        this.palavras[Math.floor(Math.random() * this.palavras.length)];

      // sorteia impostor
      this.jogo.impostor =
        Math.floor(Math.random() * this.jogo.totalJogadores) + 1;

      // começa do jogador 1
      this.jogo.jogadorAtual = 1;
    },

    verPalavra() {
      // impostor vê apenas "IMPOSTOR"
      if (this.jogo.jogadorAtual === this.jogo.impostor) {
        this.palavraAtual = "IMPOSTOR";
      } else {
        this.palavraAtual = this.jogo.palavra.palavra;
      }

      this.tela = "palavra";
    },

    proximoJogador() {
      this.jogo.jogadorAtual++;

      if (this.jogo.jogadorAtual > this.jogo.totalJogadores) {
        this.iniciarTimer();
      } else {
        this.tela = "passe";
      }
    },

    /* ==========================
       TIMER
    ========================== */
    iniciarTimer() {
      this.tela = "timer";
      this.tempoRestante = this.tempoRodada * 60;

      this.intervalo = setInterval(() => {
        this.tempoRestante--;

        if (this.tempoRestante <= 0) {
          clearInterval(this.intervalo);
        }
      }, 1000);
    },

    /* ==========================
       RESULTADO DA RODADA
    ========================== */
    impostorGanhou() {
      clearInterval(this.intervalo);

      this.jogo.pontos[this.jogo.impostor] += 2;

      this.novaRodada();
    },

    tripulacaoGanhou() {
      clearInterval(this.intervalo);

      for (let i = 1; i <= this.jogo.totalJogadores; i++) {
        if (i !== this.jogo.impostor) {
          this.jogo.pontos[i] += 1;
        }
      }

      this.novaRodada();
    },

    /* ==========================
       NOVA RODADA
    ========================== */
    novaRodada(primeira = false) {
      if (!primeira) {
        this.jogo.rodada++;
      }

      if (this.jogo.rodada > this.maxRodadas) {
        this.tela = "final";
        return;
      }

      this.sortearRodada();
      this.tela = "passe";
    },

    /* ==========================
       RESET
    ========================== */
    reiniciarJogo() {
      localStorage.clear();
      window.location.href = "index.html";
    }
  }
});