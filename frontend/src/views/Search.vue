<template>
   <div class="search_centre" >
      <input v-on:input="(inputEl) => search(inputEl.srcElement.value)" type="text"/>
   </div>
</template>

<script>
import { Document } from "flexsearch"

export default {
   data: function () {
      return {
         flexDocument: new Document({
            tokenize: "forward", 
            document: {
               index: ["title"],
               store: true
            }
         })
      }
   },
   methods: {
      search: function (searchValue) {
         const results = this.flexDocument.search(searchValue, { enrich: true });
         results[0].result.forEach(result => {
            console.log(result);
         })
      }
   },
   created: function () {
      this.flexDocument.add({
         id: 1,
         title: "song 1",
      });
      this.flexDocument.add({
         id: 2,
         title: "abba babba",
      });
      this.flexDocument.add({
         id: 3,
         title: "abba",
      });
   }
}
</script>


<style scoped>
.search_centre {
   display: flex;
   justify-content: center;
   align-items: center;
   height: 100vh;
}

</style>