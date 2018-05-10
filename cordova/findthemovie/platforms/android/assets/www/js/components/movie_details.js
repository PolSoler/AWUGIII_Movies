const MovieDetailsTemplate = {props: ['idm'], 
  data: function() {
          return {
            id3: this.idm,
            fav: false,
            movie:[{
              "backdrop_path":"img/loading.gif",
              "genres":"",
              "release_date":"",
              "runtime":"",
              "overview":"Loading...",
              "vote_average":"",
              "homepage":"",
              "poster_path":"img/loading.gif",
              "title":"",
            }],
          }
        },
        methods:{
          getDetails: function(){//load movie details
              var mov=[];
               var request = $.ajax({
                    url: "https://api.themoviedb.org/3/movie/"+id+"?api_key="+moviedbapi,
                    method: "GET"
                  });
                  request.done(function( result ) {
                    mov.push({
                                "backdrop_path":"http://image.tmdb.org/t/p/w500//"+result.backdrop_path,
                                "genres":result.genres,
                                "release_date":result.release_date,
                                "runtime":result.runtime,
                                "overview":result.overview,
                                "vote_average":result.vote_average,
                                "homepage":result.homepage,
                                "poster_path":"http://image.tmdb.org/t/p/w342//"+result.poster_path,
                                "title":result.original_title,
                                
                              });
                      });
                  request.fail(function( jqXHR, textStatus ) {
                    alert( "Request failed: " + textStatus );
                  });
                  this.movie=mov;
          },
          favclick: function () {
            var vm = this;
            if (!vm.fav) {
              var smovie=[id, this.movie[0].backdrop_path, this.movie[0].genres, this.movie[0].release_date, this.movie[0].runtime, this.movie[0].overview, this.movie[0].vote_average, this.movie[0].homepage, this.movie[0].poster_path, this.movie[0].title];
              db.transaction(function (tx) {
                tx.executeSql('INSERT INTO favorites (id, backdrop_path, genres, release_date, runtime, overview, vote_average, homepage, poster_path, title) VALUES (?,?,?,?,?,?,?,?,?,?)',smovie,function (resultSet) {
                    vm.fav=true;
                    console.log("inserted, fav: "+vm.fav);
                }, function(error) {
                  console.log('INSERT error: ' + error.message);
                });
              });
              //this.fav=fav;
            }else{
              db.transaction(function (tx) {
                tx.executeSql('DELETE FROM favorites WHERE id=?',[id],function (resultSet) {
                    vm.fav=false;
                    console.log("deleted, fav: "+vm.fav);
                }, function(error) {
                  console.log('DELETE error: ' + error.message);
                });
              });
              //this.fav=fav;
            }
            
          }
        },
        created: function () {
          var vm = this;
            this.getDetails();
            db.transaction(function (tx) {
              //check if movie is in db
              console.log("id: "+id);
                tx.executeSql('SELECT * FROM favorites WHERE id=?', [id], function(tx, results){
                    if (results.rows.length==0) {
                      vm.fav=false;
                    }else{
                      vm.fav=true;
                    }
                  console.log("fav: "+vm.fav);
                }, function (error) {
                  console.log('transaction error: ' + error.message);
              });
            });
            //this.fav=fav;
        },
        template:`
        <div>
          <div id="main">
          <img id='backdrop' :src='movie[0].backdrop_path'>
            <div id='maindata'>
              <md-button class="favbutton md-fab md-primary" v-on:click.native='favclick()' >
                <md-icon v-if="this.fav==true">favorite</md-icon>
                <md-icon v-else>favorite_border</md-icon>
              </md-button>
              <img id='poster' :src='movie[0].poster_path'>
              <div id="lateral">
                <h2 id='title'>{{movie[0].title}}</h2>
                <p id='vote' title='vote average'><md-icon>stars</md-icon> {{movie[0].vote_average}}</p>
                <p id='release' title='release date'><md-icon>event</md-icon> {{movie[0].release_date}}</p>
                <p id='runtime' title='runtime'><md-icon>access_time</md-icon> {{movie[0].runtime}} min.</p>
                
              </div>
              <div id='genres'>
                <md-chip class="md-primary" v-for="chip in movie[0].genres" :key="chip.id">{{ chip.name }}</md-chip>
              </div>
              <p id='overview'>{{movie[0].overview}}</p>
            </div>
          </div>
        </div>
        `
                     };
