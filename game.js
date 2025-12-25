new Vue({
  el: "#game",

  data: {
    tela: "passe", // passe | palavra | timer | final
    palavras: [],
    palavraAtual: "",

    tempo: 120,
    intervalo: null,

    maxRodadas: 10,

    jogo: {
      totalJogadores: 0,
      impostor: 0,
      palavra: null,
      jogadorAtual: 1,
      rodada: 1,
      pontos: {}
    },
    nomesJogadores: {}
  },

  computed: {
    timerFormatado() {
      const m = String(Math.floor(this.tempo / 60)).padStart(2, "0");
      const s = String(this.tempo % 60).padStart(2, "0");
      return `${m}:${s}`;
    }
  },

  async created() {
    this.nomesJogadores =
      JSON.parse(localStorage.getItem("nomesJogadores")) || {};
    await this.iniciarJogo();
  },

  methods: {
    /* ==========================
       INICIALIZAÇÃO
    ========================== */
    async iniciarJogo() {
      const totalJogadores = Number(localStorage.getItem("totalJogadores"));

      const res = await fetch("words.json");
      this.palavras = await res.json();

      this.jogo.totalJogadores = totalJogadores;

      // inicializa placar
      for (let i = 1; i <= totalJogadores; i++) {
        this.$set(this.jogo.pontos, i, 0);
      }

      this.novaRodada(true);
    },

    /* ==========================
       SORTEIO DE RODADA
    ========================== */
    sortearRodada() {
      // palavra aleatória
      this.jogo.palavra =
        this.palavras[Math.floor(Math.random() * this.palavras.length)];

      // impostor aleatório
      this.jogo.impostor =
        Math.floor(Math.random() * this.jogo.totalJogadores) + 1;

      this.jogo.jogadorAtual = 1;
    },

    /* ==========================
       TELAS
    ========================== */
    verPalavra() {
      this.palavraAtual =
        this.jogo.jogadorAtual === this.jogo.impostor
          ? this.jogo.palavra.palavraImpostor
          : this.jogo.palavra.palavra;

      this.tela = "palavra";
    },

    proximoJogador() {
      this.jogo.jogadorAtual++;

      if (this.jogo.jogadorAtual > this.jogo.totalJogadores) {
        this.iniciarRodada();
      } else {
        this.tela = "passe";
      }
    },

    /* ==========================
       TIMER
    ========================== */
    iniciarRodada() {
      this.tela = "timer";
      this.tempo = 120;

      this.intervalo = setInterval(() => {
        this.tempo--;
        if (this.tempo <= 0) {
          clearInterval(this.intervalo);
        }
      }, 1000);
    },

    /* ==========================
       RESULTADOS
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
       NOVA RODADA / FIM
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
       REINICIAR
    ========================== */
    reiniciarJogo() {
      localStorage.clear();
      window.location.href = "index.html";
    }
  }
});

