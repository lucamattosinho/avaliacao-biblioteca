<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useLivroStore } from '@/store/useLivroStore'
import { useAutorStore } from '@/store/useAutorStore'
import { useEditoraStore } from '@/store/useEditoraStore'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useToast } from 'primevue/usetoast'

const route = useRoute()
const router = useRouter()
const { getLivroById, addLivro, updateLivro } = useLivroStore()
const { getAutores } = useAutorStore()
const { getEditoras } = useEditoraStore()

const toast = useToast()

const id = route.params.id

// Necessário para distinção de um form que está editando
// para um form que está criando um novo item
const isEditando = id !== 'novo'

// Se estiver editando, pegar o livro pelo id
// senão, ainda não há id.
const livro = isEditando ? getLivroById(Number(id)) : null

// Validação
const schema = yup.object({
  title: yup.string().required('Título obrigatório'),
  year: yup.number().typeError('Informe um número').required('Ano obrigatório'),
  cover: yup.string().url('URL inválida').required('Capa obrigatória'),
  authorId: yup.string().required('Autor obrigatório'),
  publisherId: yup.string().required('Editora obrigatória'),
  sinopsis: yup.string().required('Sinopse obrigatória'),
})

const { handleSubmit, errors } = useForm({
  validationSchema: schema,
  initialValues: livro ?? {
    title: '',
    year: '',
    cover: '',
    authorId: '',
    publisherId: '',
    sinopsis: '',
  },
})

// Campos de books no json
const { value: title } = useField('title')
const { value: anoPublicacao } = useField('year')
const { value: fotoCapa } = useField('cover')
const { value: authorId } = useField('authorId')
const { value: publisherId } = useField('publisherId')
const { value: sinopsis } = useField('sinopsis')

// Salvar na memória
const salvarLivro = handleSubmit(values => {
  const author = getAutores.value.find(a => a.id === Number(values.authorId))
  const publisher = getEditoras.value.find(e => e.id === Number(values.publisherId))

  const novoLivro = {
    ...values,
    author: author.name,
    publisher: publisher.name,
    authorId: Number(values.authorId),
    publisherId: Number(values.publisherId),
    anoPublicacao: Number(values.year),
  }

  try{
    isEditando
    ? updateLivro(Number(id), novoLivro)
    : addLivro(novoLivro)

    toast.add({severity: 'success', summary: "Sucesso!", detail: "Livro salvo com sucesso."})
    router.push('/livros')
  } catch(error){
    toast.add({severity: 'error', summary: "Erro!", detail: "Não foi possível salvar o livro."})
  }
  
})
</script>

<template>
  <div class="p-6 max-w-2xl mx-auto bg-white shadow-md rounded-xl">
    <h1 class="text-3xl font-semibold text-gray-800 mb-6">
      {{ isEditando ? 'Editar Livro' : 'Novo Livro' }}
    </h1>

    <form @submit.prevent="salvarLivro" class="space-y-5">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Título</label>
        <input v-model="title" placeholder="Título"
          class="input" />
        <p class="text-red-500 text-sm mt-1">{{ errors.title }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Ano de Publicação</label>
        <input v-model="anoPublicacao" type="number" placeholder="Ex: 2020"
          class="input" />
        <p class="text-red-500 text-sm mt-1">{{ errors.year }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Foto de Capa (URL)</label>
        <input v-model="fotoCapa" placeholder="URL da imagem"
          class="input" />
        <p class="text-red-500 text-sm mt-1">{{ errors.cover }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Autor</label>
        <select v-model="authorId" class="input">
          <option disabled value="">Selecione um autor</option>
          <option v-for="author in getAutores" :key="author.id" :value="author.id">
            {{ author.name }}
          </option>
        </select>
        <p class="text-red-500 text-sm mt-1">{{ errors.authorId }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Editora</label>
        <select v-model="publisherId" class="input">
          <option disabled value="">Selecione uma editora</option>
          <option v-for="publisher in getEditoras" :key="publisher.id" :value="publisher.id">
            {{ publisher.name }}
          </option>
        </select>
        <p class="text-red-500 text-sm mt-1">{{ errors.publisherId }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Sinopse</label>
        <textarea v-model="sinopsis" rows="4" placeholder="Escreva a sinopse aqui"
          class="input resize-none"></textarea>
        <p class="text-red-500 text-sm mt-1">{{ errors.sinopsis }}</p>
      </div>

      <div class="flex justify-end">
        <button type="submit"
          class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg transition">
          Salvar
        </button>
      </div>
    </form>
    <Toast/>
  </div>
</template>

<style scoped>
.input {
  @apply p-2 border rounded w-full;
}
</style>