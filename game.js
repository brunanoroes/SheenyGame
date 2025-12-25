new Vue({
  el: "#game",
  data: {
    rodada: 1,
    palavra: "",
    numeroJogador: null,
    tempoRestante: 120, // 2 minutos
    timerInterval: null
  },

  async created() {
    this.numeroJogador = Number(localStorage.getItem("numeroJogador"));

    let jogo = JSON.parse(localStorage.getItem("jogo"));
    this.rodada = jogo.rodada;

    if (!jogo.palavra || !jogo.impostor) {
      await this.iniciarRodada();
      jogo = JSON.parse(localStorage.getItem("jogo"));
    }

    this.palavra =
      jogo.impostor === this.numeroJogador
        ? jogo.palavra.palavraImpostor
        : jogo.palavra.palavra;

    this.iniciarTimer();
  },

  computed: {
    tempoFormatado() {
      const min = String(Math.floor(this.tempoRestante / 60)).padStart(2, "0");
      const sec = String(this.tempoRestante % 60).padStart(2, "0");
      return `${min}:${sec}`;
    }
  },

  methods: {
    iniciarTimer() {
      this.timerInterval = setInterval(() => {
        if (this.tempoRestante > 0) {
          this.tempoRestante--;
        } else {
          clearInterval(this.timerInterval);
          alert("⏰ Tempo esgotado!");
        }
      }, 1000);
    },

    async iniciarRodada() {
      const jogo = JSON.parse(localStorage.getItem("jogo"));
      const totalJogadores = Number(localStorage.getItem("totalJogadores"));

      const res = await fetch("words.json");
      const palavras = await res.json();

      const palavraSorteada =
        palavras[Math.floor(Math.random() * palavras.length)];

      const impostor =
        Math.floor(Math.random() * totalJogadores) + 1;

      jogo.impostor = impostor;
      jogo.palavra = palavraSorteada;

      localStorage.setItem("jogo", JSON.stringify(jogo));
    },

    resultado(ganhou) {
      clearInterval(this.timerInterval);

      const jogo = JSON.parse(localStorage.getItem("jogo"));

      if (!jogo.pontos[this.numeroJogador]) {
        jogo.pontos[this.numeroJogador] = 0;
      }

      if (ganhou) {
        if (jogo.impostor === this.numeroJogador) {
          jogo.pontos[this.numeroJogador] += 2;
        } else {
          jogo.pontos[this.numeroJogador] += 1;
        }
      }

      jogo.rodada++;
      delete jogo.impostor;
      delete jogo.palavra;

      localStorage.setItem("jogo", JSON.stringify(jogo));

      if (jogo.rodada > 10) {
        alert("Fim de jogo! Veja quem ganhou presencialmente 😄");
      } else {
        window.location.reload();
      }
    }
  }
});
