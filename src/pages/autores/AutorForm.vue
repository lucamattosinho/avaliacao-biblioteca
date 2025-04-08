<script setup>
import { useAutorStore } from '@/store/useAutorStore';
import { useField, useForm } from 'vee-validate';
import { useRoute, useRouter } from 'vue-router';
import { computed, ref } from 'vue'
import * as yup from 'yup'

const { getAutorById, addAutor, updateAutor, getAutores } = useAutorStore()
const route = useRoute()
const router = useRouter()

const id = route.params.id


// Necessário para distinção de um form que está editando
// para um form que está criando um novo item
const isEditando =  computed(() => {
  return id && id !== 'novo'
})

// Se estiver editando, pegar o autor pelo id
// senão, ainda não há id.
const autor = isEditando ? getAutorById(Number(id)) : null


// Validações
const schema = yup.object({
    name: yup.string().required('Nome obrigatório.'),
    birthYear: yup.number().required('Ano de nascimento obrigatório.').typeError('O valor inserido deve ser um número.')
})

const { handleSubmit, errors } = useForm({
    validationSchema: schema,
    initialValues: autor ?? { name: '', birthYear: null }
})

const { value: nome } = useField('name')
const { value: nascimento } = useField('birthYear')

// Salva o autor na memória
const salvarAutor = handleSubmit(values => {

    const novoAutor = {
      ...values,
      name: values.name,
      birthYear: values.birthYear,
    }

    if(isEditando.value){
      updateAutor(Number(id), novoAutor)
      router.push(`/autores/${id}`)
    }
    else{
      addAutor(novoAutor)
      router.push(`/autores/${Math.max(...getAutores.value.map(a => a.id))}`)
    }
})



</script>

<template>
    <div class="p-6 max-w-2xl mx-auto bg-white shadow-md rounded-xl">
      <h1 class="text-3xl font-semibold text-gray-800 mb-6">
        {{ isEditando ? 'Editar Autor' : 'Novo Autor' }}
      </h1>
  
      <form @submit.prevent="salvarAutor" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nome</label>
          <input v-model="nome" class="input" placeholder="Nome do autor" />
          <span class="text-red-500 text-sm">{{ errors.name }}</span>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Ano de nascimento</label>
          <input v-model="nascimento" class="input" placeholder="Ano de nascimento do autor" />
          <span class="text-red-500 text-sm">{{ errors.birthYear }}</span>
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