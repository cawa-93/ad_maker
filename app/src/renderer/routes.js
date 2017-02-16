export default [
  {
    path: '/',
    name: 'View',
    component: require('components/View')
  },
  {
    path: '*',
    redirect: '/'
  }
]
