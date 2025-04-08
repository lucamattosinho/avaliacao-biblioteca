import { reactive, computed } from 'vue'
import data from '@/data.json'


// Salvando em memória os dados de editoras em data.json

const state = reactive({
    editoras: [...data.publishers]
})

export function useEditoraStore(){

    // GET all
    const getEditoras = computed(() => state.editoras)

    // GET por id
    const getEditoraById = (id) =>
        state.editoras.find(e => Number(e.id) === Number(id))

    // POST
    const addEditora = (editora) => {
        const novoId = Math.max(...state.editoras.map(e => e.id)) + 1
        state.editoras.push({...editora, id: novoId})
    }

    // PUT
    const updateEditora = (id, dados) => {
        const index = state.editoras.findIndex(e => e.id === id)
        if (index !== -1)
            state.editoras[index] = { ...state.editoras[index], ...dados }
    }

    return{
        getEditoras,
        getEditoraById,
        addEditora,
        updateEditora,
    }
}