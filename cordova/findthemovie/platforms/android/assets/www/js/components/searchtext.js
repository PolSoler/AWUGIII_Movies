const searchtext = {props: [], 
        data(){
          return{
            spinner: true,
            movies:[]
          }
        },
        methods:{
            textmoviedb(){
                self=this;
                var mo=[];
                var request = $.ajax({
                    url: "https://api.themoviedb.org/3/search/movie?sort_by=popularity.desc&language=en-US&query="+title+"&api_key="+moviedbapi,
                    method: "GET"
                });
                request.done(function( moviesList ) {
                    self.spinner=false;
                    for (i=0;i<9;i++){
                            mo.push({
                                "id":moviesList.results[i].id,
                                "poster":"http://image.tmdb.org/t/p/w342//"+moviesList.results[i].poster_path,
                                'title':moviesList.results[i].original_title
                            });
                    }
                    
                });
                request.fail(function( jqXHR, textStatus ) {
                    alert( "Request failed: " + textStatus );
                });
                this.movies=mo;
            },
            emitDetail(id){
                //this.$emit('clicked-show-detail', id);
                this.$parent.$options.methods.clickedShowDetailModal(id)
            }
            


        },
        created: function () {
          this.textmoviedb();
        },
        template:`
        <div id="textres">
            <div id="main">
            <md-toolbar class="md-primary"> 
                <h3 class="md-title">Search Results</h3>
            </md-toolbar>
                <md-progress-spinner class="md-primary" md-mode="indeterminate" v-if="spinner"></md-progress-spinner>

                <div id='resultmovies'>
                    <div id="resultlist">
                    <div v-if="spinner==false">
                        <div v-if="movies.length==0">
                            <h2 class="md-title resultdiv">No Results</h2>
                        </div>
                    </div>
                        <md-card md-with-hover v-for="movie in movies" :key="movie.id" @click.native="emitDetail(movie.id)">
                            <md-ripple>
                                <md-card-media>
                                    <img class='poster' :src='movie.poster'>
                                </md-card-media>

                                <md-card-header>
                                    <div class="md-title mtitle">{{movie.title}}</div>
                                </md-card-header>
                            </md-ripple>
                        </md-card>
                    </div>
                </div>
            </div>  
        </div>
`
                     };

/**/