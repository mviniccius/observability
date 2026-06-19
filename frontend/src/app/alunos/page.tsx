'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Aluno, api } from '@/lib/api';
import AlunoModal from '@/components/AlunoModal';

const PAGE_SIZE = 10;

export default function AlunosPage() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState<Aluno | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Aluno | null>(null);
  const [page, setPage] = useState(1);
  const [error, setError] = useState('');

  const fetchAlunos = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.listarAlunos(search || undefined);
      setAlunos(data);
      setPage(1);
    } catch {
      setError('Erro ao carregar alunos. Verifique se a API está online.');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(fetchAlunos, 400);
    return () => clearTimeout(t);
  }, [fetchAlunos]);

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await api.removerAluno(confirmDelete.id);
      setConfirmDelete(null);
      fetchAlunos();
    } catch {
      setError('Erro ao remover aluno.');
    }
  };

  const openCreate = () => { setEditando(null); setModalOpen(true); };
  const openEdit = (a: Aluno) => { setEditando(a); setModalOpen(true); };

  const totalPages = Math.ceil(alunos.length / PAGE_SIZE);
  const paginated = alunos.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const formatDate = (d: string) => {
    if (!d) return '—';
    const [y, m, day] = d.slice(0, 10).split('-');
    return `${day}/${m}/${y}`;
  };

  return (
    <div className="p-4 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-slate-800">Gerenciamento de Alunos</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {alunos.length} aluno{alunos.length !== 1 ? 's' : ''} cadastrado{alunos.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-3 sm:py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          Novo Aluno
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por nome, CPF ou e-mail…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 sm:py-2 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            />
          </div>
        </div>

        {error && (
          <div className="mx-4 sm:mx-6 mt-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[320px]">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="px-4 sm:px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nome</th>
                <th className="hidden md:table-cell px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">CPF</th>
                <th className="hidden sm:table-cell px-4 sm:px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">E-mail</th>
                <th className="hidden lg:table-cell px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Telefone</th>
                <th className="hidden md:table-cell px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Cidade / UF</th>
                <th className="hidden md:table-cell px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nascimento</th>
                <th className="px-4 sm:px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 sm:px-6 py-4">
                        <div className="h-4 bg-slate-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    {search ? 'Nenhum aluno encontrado para essa busca.' : 'Nenhum aluno cadastrado ainda.'}
                  </td>
                </tr>
              ) : (
                paginated.map(aluno => (
                  <tr key={aluno.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 sm:px-6 py-4">
                      <p className="font-medium text-slate-800">{aluno.nome}</p>
                      <p className="sm:hidden text-slate-500 text-xs mt-0.5">{aluno.email}</p>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 text-slate-600 font-mono text-xs">{aluno.cpf}</td>
                    <td className="hidden sm:table-cell px-4 sm:px-6 py-4 text-slate-600">{aluno.email}</td>
                    <td className="hidden lg:table-cell px-6 py-4 text-slate-600">{aluno.telefone || '—'}</td>
                    <td className="hidden md:table-cell px-6 py-4 text-slate-600">
                      {aluno.cidade ? `${aluno.cidade} / ${aluno.estado}` : '—'}
                    </td>
                    <td className="hidden md:table-cell px-6 py-4 text-slate-600">{formatDate(aluno.data_nascimento)}</td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEdit(aluno)}
                          className="p-2.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-primary transition-colors cursor-pointer"
                          aria-label={`Editar ${aluno.nome}`}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(aluno)}
                          className="p-2.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                          aria-label={`Remover ${aluno.nome}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-t border-slate-100">
            <p className="text-sm text-slate-500">
              Página {page} de {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer"
                aria-label="Página anterior"
              >
                <ChevronLeft className="w-4 h-4 text-slate-600" />
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer"
                aria-label="Próxima página"
              >
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>
        )}
      </div>

      {modalOpen && (
        <AlunoModal
          aluno={editando}
          onClose={() => setModalOpen(false)}
          onSaved={fetchAlunos}
        />
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setConfirmDelete(null)} />
          <div className="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl p-6 w-full sm:max-w-sm">
            <h3 className="text-base font-semibold text-slate-800 mb-2">Confirmar exclusão</h3>
            <p className="text-sm text-slate-600 mb-6">
              Tem certeza que deseja remover o aluno <strong>{confirmDelete.nome}</strong>? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 border border-slate-300 text-slate-700 rounded-lg py-3 text-sm font-medium hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-lg py-3 text-sm font-medium transition-colors cursor-pointer"
              >
                Remover
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
