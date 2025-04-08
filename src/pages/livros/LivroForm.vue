<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useLivroStore } from '@/store/useLivroStore'
import { useAutorStore } from '@/store/useAutorStore'
import { useEditoraStore } from '@/store/useEditoraStore'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'

const route = useRoute()
const router = useRouter()
const { getLivroById, addLivro, updateLivro } = useLivroStore()
const { getAutores } = useAutorStore()
const { getEditoras } = useEditoraStore()

const id = route.params.id
const isEditando = id !== 'novo'
const livro = isEditando ? getLivroById(Number(id)) : null

// Schema de validação
const schema = yup.object({
  title: yup.string().required('Título obrigatório'),
  year: yup.number().typeError('Informe um número').required('Ano obrigatório'),
  cover: yup.string().url('URL inválida'),
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

// Campos
const { value: title } = useField('title')
const { value: anoPublicacao } = useField('year')
const { value: fotoCapa } = useField('cover')
const { value: authorId } = useField('authorId')
const { value: publisherId } = useField('publisherId')
const { value: sinopsis } = useField('sinopsis')

// Salvar
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

  isEditando
    ? updateLivro(Number(id), novoLivro)
    : addLivro(novoLivro)

  router.push('/livros')
})
</script>

<template>
  <div class="p-4 max-w-xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">
      {{ isEditando ? 'Editar Livro' : 'Novo Livro' }}
    </h1>

    <form @submit.prevent="salvarLivro" class="space-y-4">
      <div>
        <label class="block font-semibold">Título</label>
        <input v-model="title" class="input" placeholder="Título" />
        <span class="text-red-500 text-sm">{{ errors.title }}</span>
      </div>

      <div>
        <label class="block font-semibold">Ano de Publicação</label>
        <input v-model="anoPublicacao" type="number" class="input" placeholder="Ex: 2020" />
        <span class="text-red-500 text-sm">{{ errors.year }}</span>
      </div>

      <div>
        <label class="block font-semibold">Foto de Capa (URL)</label>
        <input v-model="fotoCapa" class="input" placeholder="URL da imagem" />
        <span class="text-red-500 text-sm">{{ errors.cover }}</span>
      </div>

      <div>
        <label class="block font-semibold">Autor</label>
        <select v-model="authorId" class="input">
          <option disabled value="">Selecione um autor</option>
          <option v-for="author in getAutores" :key="author.id" :value="author.id">
            {{ author.name }}
          </option>
        </select>
        <span class="text-red-500 text-sm">{{ errors.authorId }}</span>
      </div>

      <div>
        <label class="block font-semibold">Editora</label>
        <select v-model="publisherId" class="input">
          <option disabled value="">Selecione uma editora</option>
          <option v-for="publisher in getEditoras" :key="publisher.id" :value="publisher.id">
            {{ publisher.name }}
          </option>
        </select>
        <span class="text-red-500 text-sm">{{ errors.publisherId }}</span>
      </div>

      <div>
        <label class="block font-semibold">Sinopse</label>
        <textarea v-model="sinopsis" class="input" placeholder="Escreva a sinopse aqui"></textarea>
        <span class="text-red-500 text-sm">{{ errors.sinopsis }}</span>
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