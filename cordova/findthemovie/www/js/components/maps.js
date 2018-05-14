const MapsTemplate = {props: [], 
       data(){
        return{
            lat:"",
            lon:""
        }
        }, 

        methods: {
            getLocation () {
                navigator.geolocation.getCurrentPosition(this.onSuccess, this.onError);
            },

            onSuccess (position){
                this.lat = position.coords.latitude;
                this.lon = position.coords.longitude;

                var map = new google.maps.Map(document.getElementById('map'), {
                    center: {lat: this.lat, lng: this.lon},
                    zoom: 14,
                    disableDefaultUI: true
                });

                var request = $.ajax({
                    url: "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+this.lat+","+this.lon+"&radius=10000&type=movie_theater&key="+visionapi,
                    method: "GET"
                });
                request.done(function( list ) {
                    //alert(list.results[0].name);
                    for(i=0;i<10;i++){
                        var count = 0;
                        for(j=0;j<list.results[i].types.length;j++){
                            if(list.results[i].types[j]=="restaurant"){
                                count = 1;
                            }
                        }
                        if(count==0){
                            var marker = new google.maps.Marker({
                                position: {lat: list.results[i].geometry.location.lat, lng: list.results[i].geometry.location.lng},
                                title: list.results[i].name,
                                map: map
                            });
                        }
                        
                    }
                    
                });
             
                request.fail(function( jqXHR, textStatus ) {
                    alert( "Request failed: " + textStatus );
                });


                
            },

            onError (){
                alert("ERROR");
            }
        },


        created: function () {
          this.getLocation();
        },
        template:`

        <div>
            <md-toolbar class="md-primary"> 
                <h3 class="md-title">Nearby Cinemas</h3>
            </md-toolbar>     
            <div id="map">
            </div>           
        </div>
`
};
