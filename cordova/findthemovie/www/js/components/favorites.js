
const FavoritesTemplate = {props: [], 
  data: function() {
          return {
            none:false,
            favouriteMovies: [
              {title: 'Avengers: Infinity War', id: '8'}
            ]
          }
        },
        methods:{
            emitDetail(id){
              //this.$emit('clicked-show-detail', id);
              this.$parent.$options.methods.clickedShowDetailModal(id)
            }
        },
        created: function(){
          var self=this;
          console.log("favorites created");
          var fmov=[];
          db.transaction(function (tx) {
            //select all rows to show the list
              tx.executeSql('SELECT * FROM favorites', [], function(tx, results){
                console.log("results: "+results.rows.length);
                  for (i=0; i<results.rows.length; i++){
                    fmov.push({
                      'id':results.rows.item(i).id,
                      'poster_path':results.rows.item(i).poster_path,
                      'title':results.rows.item(i).title
                    });
                    
                  }

                  if (results.rows.length==0) {
                    self.none=true;//rows = "There are no favourite movies.";
                  }else{
                    self.none=false;
                  }
                
              }, function (error) {
                alert('transaction error: ' + error.message);
            });
          });
          this.favouriteMovies=fmov;
        },
  template:`
  <div id='favlist'>
    <md-toolbar class="md-primary"> 
        <h3 class="md-title">Find The Movie</h3>
    </md-toolbar>
    <div id="favs">

      
        <md-card class="favmovie" md-with-hover v-for="movie in favouriteMovies" :key="movie.id" @click.native="emitDetail(movie.id)">
            <md-ripple>
              <md-card-media>
                <img :src='movie.poster_path'>
              </md-card-media>

              <md-card-header>
                <div class="md-title mtitle">{{movie.title}}</div>
              </md-card-header>
          </md-ripple>
        </md-card>
        <div v-if="none" class="none">You have no favourite movies...</div>
      
    </div>
  </div>

`
                     };
