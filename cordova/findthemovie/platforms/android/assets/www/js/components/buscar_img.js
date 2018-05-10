const buscar_img = {props: [], 
        data(){
          return{
            spinner: true,
            data:'',
            results:[],
            showres: false,
            counter:0,
            ids:[],
            movies:[],
            guess:10,
            newguess:10
          }
        },
        watch:{
            counter: function(){
                //alert(this.counter);
                if(this.counter>=newguess){
                    //alert(this.ids[0]);

                    var count=[];              
                    var copy = this.ids.slice(0);
     
                    // first loop goes over every element
                    for (var i = 0; i < this.ids.length; i++) {
                 
                        var myCount = 0;    
                        // loop over every element in the copy and see if it's the same
                        for (var w = 0; w < copy.length; w++) {
                            if (this.ids[i] == copy[w]) {
                                // increase amount of times duplicate is found
                                myCount++;
                                // sets item to undefined
                                delete copy[w];
                            }
                        }
                 
                        if (myCount > 0) {
                            var a = new Object();
                            a.id = this.ids[i];
                            a.count = myCount;
                            count.push(a);
                        }
                    }

                    count.sort(function(a, b) {
                        const countA = a.count;
                        const countB = b.count;

                        let comparison = 0;
                        if (countA > countB) {
                            comparison = 1;
                        } else if (countA < countB) {
                            comparison = -1;
                        }
                        return comparison * -1;
                    });

                    for(i=0;i<6;i++){
                        self=this;
                        var mo=[];
                        var request = $.ajax({
                            url: "https://api.themoviedb.org/3/movie/"+count[i].id+"?api_key="+moviedbapi,
                            method: "GET"
                        });
                        request.done(function( moviesList ) {
                            mo.push({
                                "id":moviesList.id,
                                "poster":"http://image.tmdb.org/t/p/w342//"+moviesList.poster_path,
                                'title':moviesList.original_title
                            });                            
                        });
                        request.fail(function( jqXHR, textStatus ) {
                            alert( "Request failed: " + textStatus );
                        });
                    }

                    this.movies=mo;


                }
            }
        },
        methods:{
            searchvision(){
                self=this;
                    var info = `{ 
                     "requests": [ 
                       {  
                         "image": { 
                           "content":"`+image_new+`"
                         }, 
                         "features": [ 
                             { 
                               "type": "WEB_DETECTION", 
                               "maxResults": 20 
                             } 
                         ] 
                       } 
                    ] 
                    }`;

                var request = $.ajax({
                    url: "https://vision.googleapis.com/v1/images:annotate?key="+visionapi,
                    data: info,
                    contentType: 'application/json',
                    method:"POST",
                  })
                request.done(function( data ) {
                    self.showresults(data);
                });
                request.fail(function( jqXHR, textStatus, errorThrown ) {
                   alert( "Request failed: " + jqXHR.status );
                });

                },
            showresults: function(data){
                
                this.spinner=false;
                this.showres=true;
                self=this;

                var blacklist = ["", null, "Film", "Cinema", "Trailer", "Poster", "Film Director", "Film director", "Movie", "Film Poster", "Film poster", "Actor", "Image"];

                //SEARCH HIGH CHANCE MOVIES
                guess = Math.max(5,data.responses[0].webDetection.webEntities.length);
                newguess = Math.max(5,data.responses[0].webDetection.webEntities.length);
                //alert(guess);
                for (i=0;i<guess;i++){

                    if(blacklist.includes(data.responses[0].webDetection.webEntities[i].description)){
                        newguess = newguess-1;
                    }else{
                        var request = $.ajax({
                            url: "https://api.themoviedb.org/3/search/movie?sort_by=popularity.desc&language=en-US&query="+data.responses[0].webDetection.webEntities[i].description+"&api_key="+moviedbapi,
                            method: "GET"
                        });
                        request.done(function( moviesList ) {
                            var minim = Math.min(5,moviesList.results.length);
                            self.counter = self.counter+1;
                            for (j=0;j<minim;j++){
                                    self.ids.push(
                                        moviesList.results[j].id
                                    );
                            }

                            
                        });
                        request.fail(function( jqXHR, textStatus ) {
                            alert( "Request failed: " + textStatus );
                        });
                    }
                    
                    
                }
                
                
                //PRINT TEXT RESULTS

                var moviesrep = [];
                for (i=0;i<data.responses[0].webDetection.webEntities.length;i++){
                       
                    if(blacklist.includes(data.responses[0].webDetection.webEntities[i].description) || data.responses[0].webDetection.webEntities[i].description==="" || data.responses[0].webDetection.webEntities[i].description==null || moviesrep.includes(data.responses[0].webDetection.webEntities[i].description)){
                    }else{
                        self.results.push({
                            "id":i,
                            "desc":data.responses[0].webDetection.webEntities[i].description
                        }); 

                        moviesrep.push(data.responses[0].webDetection.webEntities[i].description);      
                    }
                } 
            },

            emitSearch(desc){

                this.$parent.$options.methods.showTextSearch(desc)
            },
            emitDetail(id){
                //this.$emit('clicked-show-detail', id);
                this.$parent.$options.methods.clickedShowDetailModal(id)
            }


        },
        created: function () {
          this.searchvision();
        },
        template:`
        <div>
            <div id="main">
                <md-toolbar class="md-primary"> 
                    <h3 class="md-title">Image Results</h3>
                </md-toolbar>
                    <md-progress-spinner class="md-primary" md-mode="indeterminate" v-if="spinner"></md-progress-spinner>
                    <div id="filmresults" v-if="showres">
                    <div id="textres">
                        <h2 class="md-title resultdiv">Possible Films</h2>
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
                        <h2 class="md-title resultdiv">Text Results</h2>
                        <md-list>
                            <div v-for="item in results" :key="results.id">
                                <md-list-item @click="emitSearch(item.desc)">
                                <span class="md-list-item-text">{{item.desc}}</span>
                                </md-list-item>
                                <md-divider class="md-inset"></md-divider>
                            </div>
                        </md-list>
                    </div>
            </div>  
        </div>
`
                     };

/**/