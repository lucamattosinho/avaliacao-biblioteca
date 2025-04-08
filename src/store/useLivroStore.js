import { reactive, computed } from 'vue'
import data from '@/data.json'


// Salvando em memória os dados de livros em data.json


const state = reactive({
  livros: [...data.books], // fazendo cópia para não alterar o original
})

export function useLivroStore() {
  // GET all
  const getLivros = computed(() => state.livros)

  // POST 
  function addLivro(livro) {
    const novoId = Math.max(...state.livros.map(l => l.id)) + 1
    state.livros.push({ ...livro, id: novoId })
  }

  // PUT
  function updateLivro(id, dadosAtualizados) {
    const index = state.livros.findIndex(l => l.id === id)
    if (index !== -1) {
      state.livros[index] = { ...state.livros[index], ...dadosAtualizados }
    }
  }

  // DELETE
  function deleteLivro(id) {
    state.livros = state.livros.filter(l => l.id !== id)
  }

  // GET por id
  function getLivroById(id) {
    return state.livros.find(l => l.id === id)
  }

  return {
    getLivros,
    addLivro,
    updateLivro,
    deleteLivro,
    getLivroById,
  }
}