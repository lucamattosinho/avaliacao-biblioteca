<script setup>

import { useEditoraStore } from '@/store/useEditoraStore';
import { useField, useForm } from 'vee-validate';
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import * as yup from 'yup'

const { getEditoraById, addEditora, updateEditora, getEditoras } = useEditoraStore()
const route = useRoute()
const router = useRouter()

const id = route.params.id

const isEditando =  computed(() => {
  return id && id !== 'novo'
})

const editora = isEditando ? getEditoraById(Number(id)) : null

const schema = yup.object({
    name: yup.string().required('Nome obrigatório.'),
})

const { handleSubmit, errors } = useForm({
    validationSchema: schema,
    initialValues: editora ?? { name: '' }
})

const { value: name } = useField('name')

const salvarEditora = handleSubmit(values => {
    isEditando.value
    ? updateEditora(Number(id), values)
    : addEditora(values)

    router.push(`/editoras/${isEditando.value ? id : Math.max(...getEditoras.value.map(e => e.id))}`)
})



</script>

<template>
    <div class="p-4 max-w-xl mx-auto">
      <h1 class="text-2xl font-bold mb-4">
        {{ isEditando ? 'Editar Editora' : 'Nova Editora' }}
      </h1>
  
      <form @submit.prevent="salvarEditora" class="space-y-4">
        <div>
          <label class="block font-semibold">Nome</label>
          <input v-model="name" class="input" placeholder="Nome da editora" />
          <span class="text-red-500 text-sm">{{ errors.name }}</span>
        </div>
  
        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Salvar
        </button>
      </form>
    </div>
  </template>
  
  <style scoped>
  .input {
    @apply p-2 border rounded w-full;
  }
  </style>