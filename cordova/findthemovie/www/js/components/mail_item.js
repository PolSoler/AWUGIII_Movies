Vue.component('mail-item', {
    props: ['title','text','from','id'],
    
    template: `
<div class="mi-item" @click="">
        
                    <p>{{title}}</p>
                
                    <p>{{ from }}</p>
                
                    <span>{{ text }}</span>
                </div>
            </div>
        </a>
</div> 
`,  
    
})


