import { reactive, computed } from 'vue'
import data from '@/data.json'


// Salvando em memória os dados de autores em data.json


const state = reactive({
    autores: [...data.authors]
})

export function useAutorStore(){

    // GET all
    const getAutores = computed(() => state.autores)

    // GET por id
    const getAutorById = (id) =>
        state.autores.find(a => Number(a.id) === Number(id))

    // POST
    const addAutor = (autor) => {
        const novoId = Math.max(...state.autores.map(a => a.id)) + 1
        state.autores.push({...autor, id: novoId})
    }

    // PUT
    const updateAutor = (id, dados) => {
        const index = state.autores.findIndex(a => a.id === id)
        if (index !== -1)
            state.autores[index] = { ...state.autores[index], ...dados }
    }

    return{
        getAutores,
        getAutorById,
        addAutor,
        updateAutor,
    }
}