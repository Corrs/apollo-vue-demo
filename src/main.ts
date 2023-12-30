import { createApp, provide, h } from 'vue'
import Router from './router'
import Store from './store'
import App from './App.vue'
import { permission } from "./directives/permission";
// import { ApolloClients } from '@vue/apollo-composable'
// import { client, uploadClient } from './api/apollo'
import './mockjs'

// const app = createApp({
//   setup () {
//     provide(ApolloClients, {
//       default: client,
//       uploadClient
//     })
//   },
//   render: () => h(App),
// })
const app = createApp(App)

app.use(Store);
app.use(Router);

app.directive("permission",permission);
app.mount('#app');
