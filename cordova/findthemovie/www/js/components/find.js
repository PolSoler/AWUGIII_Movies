const FindTemplate = {props: {}, 
        data(){
          return{
            type: null,
            movies:[],
            showDialog: false
          }
        },
        methods:{
          getMoviesListAndDrawList: function(){//load list by popularity
              var mo=[];
               var request = $.ajax({
                    url: "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key="+moviedbapi,
                    method: "GET"
                  });
                  request.done(function( moviesList ) {
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
              },
              openCam(){
                self=this;
                  var srcType = Camera.PictureSourceType.CAMERA;

                  var options = {
                      // Some common settings are 20, 50, and 100
                      quality: 100,                   
                      targetHeight: 500,
                      targetWidth: 500,
                      destinationType: Camera.DestinationType.DATA_URL,
                      // In this app, dynamically set the picture source, Camera or photo gallery
                      sourceType: srcType,
                      encodingType: Camera.EncodingType.JPEG,
                      mediaType: Camera.MediaType.PICTURE,
                      allowEdit: false,
                      correctOrientation: true  //Corrects Android orientation quirks
                  }

                  //var func = createNewFileEntry;

                  navigator.camera.getPicture(function cameraSuccess(imageData) {
                      self.image = imageData;
                      //alert(imageData);
                      self.$parent.$options.methods.goToSearchimg(imageData);
                      // You may choose to copy the picture, save it somewhere, or upload.
                      //func(imageUri);

                  }, function cameraError(error) {
                      console.debug("Unable to obtain picture: " + error, "app");

                  }, options);
              }, 
              openGal(){
                  self=this;
                  var srcType = Camera.PictureSourceType.SAVEDPHOTOALBUM;

                  var options = {
                      // Some common settings are 20, 50, and 100
                      quality: 100,                   
                      targetHeight: 500,
                      targetWidth: 500,
                      destinationType: Camera.DestinationType.DATA_URL,
                      // In this app, dynamically set the picture source, Camera or photo gallery
                      sourceType: srcType,
                      encodingType: Camera.EncodingType.JPEG,
                      mediaType: Camera.MediaType.PICTURE,
                      allowEdit: false,
                      correctOrientation: true  //Corrects Android orientation quirks
                  }

                  //var func = createNewFileEntry;

                  navigator.camera.getPicture(function cameraSuccess(imageData) {
                     
                      self.image=imageData;
                      //alert(imageData);
                      self.$parent.$options.methods.goToSearchimg(imageData);
                      // You may choose to copy the picture, save it somewhere, or upload.
                      //func(imageUri);

                  }, function cameraError(error) {
                      console.debug("Unable to obtain picture: " + error, "app");

                  }, options);
              },
              emitSearch(){
                var newtext = textsearch.value.trim();
                if(newtext==="" || newtext==null){
                  alert("Please Insert Movie to Find");
                }else{
                  this.$parent.$options.methods.showTextSearch(newtext);                
                }
                
              }  
              
        },
        created: function () {
          this.getMoviesListAndDrawList();
        },
        template:`
        <div>
            <div id="main">
                <h1 class="md-title maintitle">Find<br>The<br>Movie</h1>
                <div id="searchfield">
                <md-field>
                  <label>Find movie by text</label>
                  <md-input v-model="type" id="textsearch"></md-input>
                </md-field>
                <md-button class="md-icon-button md-dense md-primary search" @click="emitSearch()">
                  <md-icon>search</md-icon>
                </md-button>
                </div>
                <div id="fimage">
                  <md-button class="md-fab md-primary" @click="showDialog = true">
                     <md-icon>camera_alt</md-icon>
                  </md-button>
                  <br>
                  <small>Find by image</small>
                </div>
                <div id='popularmovies'>
                  <p>Popular Movies</p>
                  <div id="popularlist">
                      <md-card md-with-hover v-for="movie in movies" :key="movie.id" @click.native="emitDetail(movie.id)">
                          <md-ripple>
                            <md-card-media>
                              <img class='poster' :src='movie.poster'>
                            </md-card-media>

                            <md-card-header>
                              <div class="md-title">{{movie.title}}</div>
                            </md-card-header>
                        </md-ripple>
                      </md-card>
                  </div>
                </div>

                  <div>
                    <md-dialog :md-active.sync="showDialog" class="md-alignment-top-center">
                      <md-dialog-title>Camera</md-dialog-title>

                        <md-button class="md-primary" @click.native="openCam()">Take a Picture</md-button>
                        <md-button class="md-primary" @click.native="openGal()">Select from Gallery</md-button>

                    </md-dialog>
                  </div>
            </div>  

        </div>
`
                     };

/**/