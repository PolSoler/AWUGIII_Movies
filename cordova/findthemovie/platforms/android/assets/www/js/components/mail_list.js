const MailListTemplate = {props: [], 
                      template:`
    <md-list class=""  id="maillist">
            <div 
                is="mail-item" 
                v-for="(shop, index) in tiendas"
                v-bind:key="shop.google_id"
                v-bind:name="shop.name"
                v-bind:adress="shop.adress"
                v-bind:distance="shop.distance"
                v-bind:google_id="shop.google_id"></div>
    </md-list>`
                     };