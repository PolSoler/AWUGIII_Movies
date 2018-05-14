    Vue.use(VueMaterial.default);
    Vue.use(VueRouter);
    var db;
 /*   Vue.material.registerTheme('principal', {
          primary: {
            color: 'orange',
            hue: 'A200'
          },
          accent: {
            color: 'grey',
            hue: 'A200'
          }
        });

Vue.material.setCurrentTheme('principal');*/


function init(){
    db = window.sqlitePlugin.openDatabase({ name: 'movie.db', location: 'default' }, function (db) {

      db.transaction(function (tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS favorites (id INTEGER PRIMARY KEY, backdrop_path TEXT, genres TEXT, release_date TEXT, runtime TEXT, overview TEXT, vote_average TEXT, homepage TEXT, poster_path INTEGER, title REAL)');
      }, function (error) {
          console.log('db transaction error: ' + error.message);
      }, function () {
          console.log('db creation ok');
      });

      }, function (error) {
         console.log('Open database ERROR: ' + JSON.stringify(error));
      });
    
    const routes = [
                {path: '/find', name: 'find',  component: FindTemplate}
            ,{path: '/maps', name: 'maps',  component: MapsTemplate}
            ,{path: '/movie_details:idm', name: 'moviedetails', component: MovieDetailsTemplate}
            ,{path: '/simplelist', name: 'simplelist', component: SimpleListTemplate}
            ,{path: '/buscar_img', name: 'buscar_img', component: buscar_img}
            ,{path: '/searchtext', name: 'searchtext', component: searchtext}
            
            ];

        const router = new VueRouter({
                routes // short for `routes: routes`
            });

    const app = new Vue({
        el: '#app',
        router,
        data: { showNavigation: false,
                showSidepanel: false,
                movies: [],
                id: 0,
                fav: false,
                image:'',
                image_new:''
            },
        methods: {
            goToFind: function(){
                this.showNavigation = false;
                    //this.$refs.sidebar.toggle();
                    router.push({ name: 'find'});
                },
            goToMaps: function(){
                this.showNavigation = false;
                    //this.$refs.sidebar.toggle();
                    router.push({ name: 'maps'})
                },
            goToSimpleList: function(){
                this.showNavigation = false;
                    //this.$refs.sidebar.toggle();
                    router.push('simplelist');
                },
            clickedShowDetailModal: function(idm){
                this.showNavigation = false;
                    //this.$refs.sidebar.toggle();
                    //console.log("id: "+idm);
                    id=idm;
                    router.push({ name: 'moviedetails', params: {'idm': id}});
                },
            goToSearchimg: function(img_src){
                this.showNavigation = false;
                    //this.$refs.sidebar.toggle();
                    //console.log("id: "+idm);
                    //alert(this.image);
                    image_new=img_src;
                    router.push({ name: 'buscar_img', params: {'img_src': image_new}});
                },
            showTextSearch: function(desc){
                this.showNavigation = false;
                    //this.$refs.sidebar.toggle();
                    //console.log("id: "+idm);
                    //alert(this.image);
                    title=desc;
                    router.push({ name: 'searchtext', params: {'desc': title}});
                }
        }
            
      }).$mount('#app');
        
    
    router.replace({ name: 'find'})
}


        

