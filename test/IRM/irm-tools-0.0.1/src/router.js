/* Example
*/

/* Index */
// import Index from './views/index.vue';
/* View */
import Home from 'VIEWS/home.vue';
import Autoreload from 'VIEWS/autoreload.vue';


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
    path: '/',
    component: Home,
    children: [{
      path: '',
      component: Autoreload,
    },{
      path: 'autoreload',
      component: Autoreload,
    }]
  },

]
