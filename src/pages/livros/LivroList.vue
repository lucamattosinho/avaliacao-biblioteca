<script setup>
import { ref, computed } from 'vue'
import { useLivroStore } from '@/store/useLivroStore'
import { useRouter } from 'vue-router'
import Dialog from 'primevue/dialog'
import { useAutorStore } from '@/store/useAutorStore'
import { useEditoraStore } from '@/store/useEditoraStore'

const { getAutorById } = useAutorStore()
const { getEditoraById } = useEditoraStore()
const { getLivros } = useLivroStore()
const router = useRouter()

const filtro = ref('')
const campoOrdenacao = ref('id')
const direcaoOrdenacao = ref('asc')

const livroSelecionado = ref(null)
const showModal = ref(false)

const livrosFiltradosOrdenados = computed(() => {
  let filtrados = getLivros.value.filter(livro => {
    const termo = filtro.value.toLowerCase()
    return (
      livro.title.toLowerCase().includes(termo) ||
      getAutorById(livro.authorId).name.toLowerCase().includes(termo) ||
      getEditoraById(livro.publisherId).name.toLowerCase().includes(termo)
    )
  })

  const sorted = [...filtrados].sort((a, b) => {
    const campo = campoOrdenacao.value
    let valA = a[campo]
    let valB = b[campo]

    if (valA == null) return 1
    if (valB == null) return -1

    if (typeof valA === 'string') valA = valA.toLowerCase()
    if (typeof valB === 'string') valB = valB.toLowerCase()

    if (valA < valB) return direcaoOrdenacao.value === 'asc' ? -1 : 1
    if (valA > valB) return direcaoOrdenacao.value === 'asc' ? 1 : -1
    return 0
  })

  return sorted
})

function abrirModal(livro) {
  livroSelecionado.value = livro
  showModal.value = true
}

function redirecionarPara(path) {
  router.push(path)
}
</script>

<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Livros</h1>
      <button @click="redirecionarPara('/livros/novo')" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Novo Livro
      </button>
    </div>

    <div class="mb-4 flex gap-4 flex-wrap">
      <input v-model="filtro" type="text" placeholder="Filtrar por título, autor, editora"
        class="p-2 border rounded w-full md:w-1/3" />

      <select v-model="campoOrdenacao" class="p-2 border rounded">
        <option value="id">ID</option>
        <option value="year">Ano</option>
        <option value="title">Título</option>
      </select>

      <select v-model="direcaoOrdenacao" class="p-2 border rounded">
        <option value="asc">Crescente</option>
        <option value="desc">Decrescente</option>
      </select>
    </div>

    <table class="w-full border text-left text-sm">
      <thead class="bg-gray-100">
        <tr>
          <th class="p-2">Capa</th>
          <th class="p-2">Título</th>
          <th class="p-2">Ano</th>
          <th class="p-2">Autor</th>
          <th class="p-2">Editora</th>
          <th class="p-2">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="livro in livrosFiltradosOrdenados" :key="livro.id" class="hover:bg-gray-50">
          <td class="p-2">
            <img :src="livro.cover" alt="Capa" class="w-12 h-16 object-cover cursor-pointer"
              @click="abrirModal(livro)" />
          </td>
          <td class="p-2">{{ livro.title }}</td>
          <td class="p-2">{{ livro.year }}</td>
          <td class="p-2">
            <button class="text-blue-600 underline" @click="redirecionarPara(`/autores/${livro.authorId}`)">
              {{ getAutorById(livro.authorId).name }}
            </button>
          </td>
          <td class="p-2">
            <button class="text-blue-600 underline" @click="redirecionarPara(`/editoras/${livro.publisherId}`)">
              {{ getEditoraById(livro.publisherId).name }}
            </button>
          </td>
          <td class="p-2">
            <button @click="redirecionarPara(`/livros/${livro.id}`)"
              class="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded">
              Editar
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <Dialog v-model:visible="showModal" modal header="Detalhes do Livro" :style="{ width: '400px' }">
      <div v-if="livroSelecionado">
        <img :src="livroSelecionado.cover" alt="Capa" class="w-full h-auto mb-4 rounded" />
        <h2 class="text-lg font-semibold mb-1">{{ livroSelecionado.title }}</h2>
        <p><strong>Autor:</strong> {{ livroSelecionado.authorId }}</p>
        <p><strong>Editora:</strong> {{ livroSelecionado.publisherId }}</p>
        <p><strong>Ano:</strong> {{ livroSelecionado.year }}</p>
        <p class="mt-2 text-sm text-gray-700">{{ livroSelecionado.sinopsis }}</p>
      </div>
    </Dialog>
  </div>
</template>