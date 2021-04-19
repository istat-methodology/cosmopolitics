<template>
    <div class="col-4">
        <form>            
            
            <label  class="lbl" for="InputBox">{{label}}</label>
            <input  class="chk" type="checkbox" />
            <input  class="form-control" type="number" id="InputBox" name="InputBox" value="0" @mousewheel="mousewheel"/>             
        </form>
    </div>
</template>

<script>
   export default {   
        props: {
         label: { required: true, type: String },   
         value: { required: true, type: String },   
         done: { default: false, type: Boolean },

        },
        data: () => ({   
            counter: 0            
        }),
        methods:{
            mousewheel(){
                this.counter = this.counter +1;
                return this.counter;
            }
        }
    }
</script>