<template>
  <div>
    {{msg + ", " + name}}
    <br />
    <span v-once>Span: {{msg + ", " + name}}</span>
    <br />
    {{btnDisabled ? 'The button is disabled' : 'The button is enabled'}}
    <br />

    <span v-if="btnDisabled">Span: The Button is disabled</span>
    <span v-else>Span: The button is enabled</span>
    <br />
    <button v-on:click="changeName" v-bind:disabled="btnDisabled">Change Name</button>
	<button v-on:click="toggleBtn" >Toggle Button</button>
    <br />
    <ul>
      <li v-for="(fruit) in fruits" v-bind:key="fruit">{{fruit}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Directives",
  data() {
    return {
      name: "Patrick",
      btnDisabled: false,
      fruits: ["Apple", "Orange", "Pear"]
    };
  },
  props: {
    msg: String
  },
  methods: {
    changeName() {
      if (this.name === "Patrick") {
        this.name = "John";
      } else if (this.name ==="John"){
        this.name = "Patrick";
      }
		},
		toggleBtn(){
			this.btnDisabled=!this.btnDisabled
		}
  }
};
</script>
