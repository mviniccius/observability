const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface Aluno {
  id: number;
  nome: string;
  data_nascimento: string;
  cpf: string;
  telefone: string;
  email: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  created_at: string;
  updated_at: string;
}

export type AlunoPayload = Omit<Aluno, 'id' | 'created_at' | 'updated_at'>;

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (res.status === 204) return undefined as T;
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro na requisição');
  return data as T;
}

export const api = {
  listarAlunos: (search?: string) =>
    request<Aluno[]>(`/api/alunos${search ? `?search=${encodeURIComponent(search)}` : ''}`),

  buscarAluno: (id: number) =>
    request<Aluno>(`/api/alunos/${id}`),

  criarAluno: (payload: AlunoPayload) =>
    request<Aluno>('/api/alunos', { method: 'POST', body: JSON.stringify(payload) }),

  atualizarAluno: (id: number, payload: AlunoPayload) =>
    request<Aluno>(`/api/alunos/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),

  removerAluno: (id: number) =>
    request<void>(`/api/alunos/${id}`, { method: 'DELETE' }),
};
