<template>
  <div></div>
</template>

<script>
export default {
  watch: {
   /**
     * @hjtvuese
     * Stores paths in store
     * @arg val - the value
     */
    watchArrow : (val) => {
      this.val.doSomething()
    },
    /**
     * @hjtvuese
     * Sets the current page to 1
     * @arg variable - does something
     */
    watchFunction: function(variable) {
      this.otherVariable = variable
    },
    /**
     * @hjtvuese
     * Sets the current page to 1
     */
    noArgument: function() {
      this.isFunctionUseless = true;
    },
    undocumentedWatch() {
      return true
    }
  }
}
</script>
