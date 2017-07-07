/* Example
*/

/* Index */
// import Index from './views/index.vue';
/* View */
import Home from 'VIEWS/home.vue';
import Autoreload from 'VIEWS/autoreload.vue';
import About from 'VIEWS/about.vue';


export default [
  /* Example
  */
  // {
  //   path: '/components/:id?',
  //   component: Components,
  //   children: [
  //     {
  //       path: 'bar',
  //       components: {
  //         default: Bar,
  //         foo: Foo
  //       }
  //     }
  //   ]
  // }
  // {
  //   path: '/',
  //   component: Index,
  // },
  {
    path: '/home',
    component: Home,
    children: [{
      path: '',
      component: Autoreload,
    },{
      path: 'autoreload',
      component: Autoreload,
    }]
  },
  {
    path: '/about',
    alias: '/',
    component: About,
  }
]
