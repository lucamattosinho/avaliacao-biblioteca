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

const isEditando =  computed(() => {
  return id && id !== 'novo'
})

const autor = isEditando ? getAutorById(Number(id)) : null

const schema = yup.object({
    name: yup.string().required('Nome obrigatório.'),
    birthYear: yup.number().required('Ano de nascimento obrigatório')
})

const { handleSubmit, errors } = useForm({
    validationSchema: schema,
    initialValues: autor ?? { name: '', birthYear: '' }
})

const { value: nome } = useField('name')
const { value: nascimento } = useField('birthYear')


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
    <div class="p-4 max-w-xl mx-auto">
      <h1 class="text-2xl font-bold mb-4">
        {{ isEditando ? 'Editar Autor' : 'Novo Autor' }}
      </h1>
  
      <form @submit.prevent="salvarAutor" class="space-y-4">
        <div>
          <label class="block font-semibold">Nome</label>
          <input v-model="nome" class="input" placeholder="Nome do autor" />
          <span class="text-red-500 text-sm">{{ errors.name }}</span>
          <label class="block font-semibold">Ano de nascimento</label>
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