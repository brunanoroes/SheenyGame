new Vue({
  el: "#app",
  data: {
    totalJogadores: 4,
    numeroJogador: 1
  },
  methods: {
    iniciar() {
      localStorage.setItem("totalJogadores", this.totalJogadores);
      localStorage.setItem("numeroJogador", this.numeroJogador);

      // inicializa jogo só uma vez (mestre)
      if (!localStorage.getItem("jogo")) {
        localStorage.setItem(
          "jogo",
          JSON.stringify({
            rodada: 1,
            pontos: {},
            historico: []
          })
        );
      }

      window.location.href = "game.html";
    }
  }
});
