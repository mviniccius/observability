'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Aluno, AlunoPayload, api } from '@/lib/api';

interface Props {
  aluno?: Aluno | null;
  onClose: () => void;
  onSaved: () => void;
}

const EMPTY: AlunoPayload = {
  nome: '', data_nascimento: '', cpf: '', telefone: '', email: '',
  logradouro: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '', cep: '',
};

const ESTADOS = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO',
  'MA','MT','MS','MG','PA','PB','PR','PE','PI',
  'RJ','RN','RS','RO','RR','SC','SP','SE','TO',
];

export default function AlunoModal({ aluno, onClose, onSaved }: Props) {
  const [form, setForm] = useState<AlunoPayload>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (aluno) {
      const { id, created_at, updated_at, ...rest } = aluno;
      setForm({ ...rest, data_nascimento: rest.data_nascimento?.slice(0, 10) });
    } else {
      setForm(EMPTY);
    }
  }, [aluno]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (aluno) {
        await api.atualizarAluno(aluno.id, form);
      } else {
        await api.criarAluno(form);
      }
      onSaved();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally {
      setLoading(false);
    }
  };

  const field = (name: keyof AlunoPayload, label: string, type = 'text', placeholder = '') => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={form[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">
            {aluno ? 'Editar Aluno' : 'Novo Aluno'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">{field('nome', 'Nome completo *')}</div>
            {field('data_nascimento', 'Data de nascimento *', 'date')}
            {field('cpf', 'CPF *', 'text', '000.000.000-00')}
            {field('email', 'E-mail *', 'email')}
            {field('telefone', 'Telefone', 'tel', '(00) 00000-0000')}
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Endereço
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">{field('logradouro', 'Logradouro')}</div>
              {field('numero', 'Número')}
              {field('complemento', 'Complemento')}
              {field('bairro', 'Bairro')}
              {field('cidade', 'Cidade')}
              <div>
                <label htmlFor="estado" className="block text-sm font-medium text-slate-700 mb-1">Estado</label>
                <select
                  id="estado"
                  name="estado"
                  value={form.estado}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors bg-white cursor-pointer"
                >
                  <option value="">Selecione</option>
                  {ESTADOS.map(uf => (
                    <option key={uf} value={uf}>{uf}</option>
                  ))}
                </select>
              </div>
              {field('cep', 'CEP', 'text', '00000-000')}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-slate-300 text-slate-700 rounded-lg py-2.5 text-sm font-medium hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary hover:bg-primary-dark text-white rounded-lg py-2.5 text-sm font-medium transition-colors cursor-pointer disabled:opacity-60"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
