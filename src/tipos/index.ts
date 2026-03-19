export interface Aluno {
  id?: number;
  nome: string;
  email: string;
  dataNascimento: string;
}

export interface Explicador {
  id?: number;
  nome: string;
  especialidade: string;
}

export interface Disciplina {
  id?: number;
  nome: string;
  explicadorId: number;
}