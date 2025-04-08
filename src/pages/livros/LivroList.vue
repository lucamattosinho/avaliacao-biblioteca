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
const direcaoOrdenacao = ref('cresc')

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

    if (valA < valB) return direcaoOrdenacao.value === 'cresc' ? -1 : 1
    if (valA > valB) return direcaoOrdenacao.value === 'cresc' ? 1 : -1
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
  <div class="p-6 overflow-x-auto">
    <div class="flex justify-between items-center mb-6 border-b pb-4">
      <h1 class="text-3xl font-semibold text-gray-800">Livros</h1>
      <button @click="redirecionarPara('/livros/novo')"
        class="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition -translate-x-5">
        + Novo Livro
      </button>
    </div>

    <div class="mb-6 flex gap-4 flex-wrap">
      <input v-model="filtro" type="text" placeholder="Filtrar por título, autor, editora"
        class="px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none w-full md:w-1/3" />

      <select v-model="campoOrdenacao"
        class="px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none">
        <option value="id">ID</option>
        <option value="year">Ano</option>
        <option value="title">Título</option>
      </select>

      <select v-model="direcaoOrdenacao"
        class="px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none">
        <option value="cresc">Crescente</option>
        <option value="decr">Decrescente</option>
      </select>
    </div>

    <table class="w-full border-collapse text-sm rounded-xl overflow-hidden shadow-sm min-w-[1000px]">
      <thead class="bg-gray-100 text-gray-700">
        <tr>
          <th class="p-3 font-medium">Capa</th>
          <th class="p-3 font-medium">Título</th>
          <th class="p-3 font-medium">Ano</th>
          <th class="p-3 font-medium">Autor</th>
          <th class="p-3 font-medium">Editora</th>
          <th class="p-3 font-medium">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="livro in livrosFiltradosOrdenados" :key="livro.id"
          class="hover:bg-gray-50 border-t">
          <td class="p-3 text-center">
            <div class="flex justify-center">
              <img :src="livro.cover" alt="Capa"
              class="w-24 h-32 object-cover rounded shadow cursor-pointer transition-transform hover:scale-105 text-center"
              @click="abrirModal(livro)" />
            </div>
          </td>
          <td class="p-3 text-gray-800 text-center font-medium">{{ livro.title }}</td>
          <td class="p-3 text-center font-medium">{{ livro.year }}</td>
          <td class="p-3 text-center font-medium">
            <button class="text-blue-600 hover:underline"
              @click="redirecionarPara(`/autores/${livro.authorId}`)">
              {{ getAutorById(livro.authorId).name }}
            </button>
          </td>
          <td class="p-3 text-center font-medium">
            <button class="text-blue-600 hover:underline"
              @click="redirecionarPara(`/editoras/${livro.publisherId}`)">
              {{ getEditoraById(livro.publisherId).name }}
            </button>
          </td>
          <td class="p-3 text-center">
            <button @click="redirecionarPara(`/livros/${livro.id}`)"
              class="bg-orange-400 hover:bg-orange-500 text-white px-3 py-1 rounded-lg transition">
              Editar
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <Dialog v-model:visible="showModal" modal :header="livroSelecionado?.title" :style="{ width: '400px' }">
      <div v-if="livroSelecionado" class="space-y-3">
        <img :src="livroSelecionado.cover" alt="Capa" class="w-full h-auto mb-2 rounded shadow-md" />
        <p><span class="font-medium">Autor:</span> {{ getAutorById(livroSelecionado.authorId).name }}</p>
        <p><span class="font-medium">Editora:</span> {{ getEditoraById(livroSelecionado.publisherId).name }}</p>
        <p><span class="font-medium">Ano:</span> {{ livroSelecionado.year }}</p>
        <p class="text-gray-700 text-sm mt-2">{{ livroSelecionado.sinopsis }}</p>
      </div>
    </Dialog>
  </div>
</template>