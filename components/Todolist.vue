<template>
  <div>
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h1 class="card-title text-2xl">To Do List</h1>
        <div>
          <form @submit.prevent="addTodo">
            <div class="join mt-3 w-full">
              <input
                type="text"
                class="input input-bordered join-item flex-1"
                v-model="newTodoDescription"
                placeholder="Add new task here"
              />
              <button class="btn btn-primary join-item" type="submit">
                Add Item
              </button>
            </div>
          </form>

          <div class="overflow-x-auto">
            <table class="table table-zebra mt-3">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="todo in todos" :key="todo.id">
                  <td v-if="todo.done">
                    <span class="line-through">{{ todo.description }}</span>
                  </td>
                  <td v-else>{{ todo.description }}</td>
                  <td>
                    <span v-if="todo.done" class="badge badge-success"
                      >Done</span
                    >
                    <span v-else class="badge badge-warning">Pending</span>
                  </td>
                  <td>
                    <div class="flex gap-2">
                      <button
                        class="btn btn-error btn-sm"
                        @click="deleteToDo(todo)"
                      >
                        Delete
                      </button>
                      <button
                        class="btn btn-success btn-sm"
                        v-show="!todo.done"
                        @click="markDone(todo)"
                      >
                        Done
                      </button>
                      <button
                        class="btn btn-info btn-sm"
                        @click="openEditModal(todo)"
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <!-- Edit Modal -->
    <dialog ref="editModalRef" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg">Edit Task</h3>
        <div class="py-4">
          <input
            type="text"
            placeholder="Task description"
            class="input input-bordered w-full"
            v-model="editingTodo.description"
          />
        </div>
        <div class="modal-action">
          <button class="btn btn-error" @click="closeEditModal">Cancel</button>
          <button class="btn btn-success" @click="saveEdit">Save</button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button @click="closeEditModal">close</button>
      </form>
    </dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useCookie } from "#app";

//// เก็บค่าใน cookie เป็นเวลา 1 วัน
const newTodoDescription = useCookie("todo-description", {
  maxAge: 60 * 60 * 24, // 1 day expiration
  watch: true,
  default: () => "",
});

const todos = ref([]);
const editModalRef = ref(null);
const editingTodo = reactive({
  num: null,
  description: "",
  done: 0
});

async function fetchTodos() {
  todos.value = await $fetch("/api/todos");
}

onMounted(async () => {
  fetchTodos();
});

async function markDone(todo) {
  const body = {
    num: todo.num,
    description: todo.description,
    done: 1,
  };
  putTodo(body);
  await fetchTodos();
}

function openEditModal(todo) {
  // Copy todo data to editing state
  editingTodo.num = todo.num;
  editingTodo.description = todo.description;
  editingTodo.done = todo.done;
  
  // Open the modal
  editModalRef.value.showModal();
}

function closeEditModal() {
  editModalRef.value.close();
}

async function saveEdit() {
  await putTodo({
    num: editingTodo.num,
    description: editingTodo.description,
    done: editingTodo.done
  });
  
  closeEditModal();
  await fetchTodos();
}

async function editDesc(todo, newTodoDescription) {
  const body = {
    num: todo.num,
    description: newTodoDescription,
    done: todo.done,
  };
  putTodo(body);
  await fetchTodos();
}

async function putTodo(body) {
  await $fetch("/api/todos", {
    method: "PUT",
    body: {
      num: body.num,
      description: body.description,
      done: body.done,
    },
  });
}

async function deleteToDo(todo) {
  await $fetch("/api/todos?num=" + todo.num, {
    method: "DELETE",
  });
  await fetchTodos();
}

async function addTodo() {
  await $fetch("/api/todos", {
    method: "POST",
    body: {
      num: todos.value.length + 1,
      description: newTodoDescription.value,
      done: 0,
    },
  });
  await fetchTodos();
  newTodoDescription.value = "";
}
</script>
