<script setup>

import { useEditoraStore } from '@/store/useEditoraStore';
import { useField, useForm } from 'vee-validate';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import * as yup from 'yup'
import { useToast } from 'primevue/usetoast'

const { getEditoraById, addEditora, updateEditora, getEditoras } = useEditoraStore()
const route = useRoute()
const router = useRouter()

const id = route.params.id

const toast = useToast()

// Necessário para distinção de um form que está editando
// para um form que está criando um novo item
const isEditando =  computed(() => {
  return id && id !== 'novo'
})

// Se estiver editando, pegar a editora pelo id
// senão, ainda não há id.
const editora = isEditando ? getEditoraById(Number(id)) : null

// Validações
const schema = yup.object({
    name: yup.string().required('Nome obrigatório.'),
})

const { handleSubmit, errors } = useForm({
    validationSchema: schema,
    initialValues: editora ?? { name: '' }
})

const { value: name } = useField('name')

// Salva a editora na memória
const salvarEditora = handleSubmit(values => {

  try{
    isEditando.value
    ? updateEditora(Number(id), values)
    : addEditora(values)
    toast.add({severity: 'success', summary: "Sucesso!", detail: "Editora salva com sucesso."})
    router.push(`/editoras/${isEditando.value ? id : Math.max(...getEditoras.value.map(e => e.id))}`)
  } catch(error){
    toast.add({severity: 'error', summary: "Erro!", detail: "Não foi possível salvar a editora."})
  }
  
})



</script>

<template>
    <div class="p-6 max-w-2xl mx-auto bg-white shadow-md rounded-xl">
      <h1 class="text-3xl font-semibold text-gray-800 mb-6">
        {{ isEditando ? 'Editar Editora' : 'Nova Editora' }}
      </h1>
  
      <form @submit.prevent="salvarEditora" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nome</label>
          <input v-model="name" class="input" placeholder="Nome da editora" />
          <span class="text-red-500 text-sm">{{ errors.name }}</span>
        </div>
  
        <div class="flex justify-end">
          <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg transition">
            Salvar
          </button>
        </div>
      </form>
    </div>
  </template>
  
  <style scoped>
  .input {
    @apply p-2 border rounded w-full;
  }
  </style>