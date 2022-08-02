<template>
  <div id="container">
    <div>
      <p><em>This tool is a web form that, when filled out correctly, generates valid <a href="https://www.w3.org/RDF/">RDF</a> metadata, according to the <a href="https://linked.data.gov.au/def/idncp/spec">IDN Catalogue Profile</a>, which can then be loaded into the <a href="">IDN Dataset Catalogue</a>.</em></p>
      <p><em>Currently this tool is for testing out and understanding the IDN Catalogue Profile's requirements for metadata so it doesn't submit metadata to the IDN systems automatically - it just prints it out for review. Automated submission might be added later.</em></p>
    </div>
    <form>
      <h2>Catalogue Resource Creation <span class="tooltip">?<span class="tooltiptext">For the creation of DCAT <code>Resource</code> or <code>Dataset</code> instances</span></span></h2>
      <div class="form-group">
        <label>
        Identifiers
        <span class="tooltip">?<span class="tooltiptext">Identifiers are optional</span></span>
        </label>
        <input type="text" v-model="identifiers" />
      </div>
      <div class="form-group">
        <label>
          Title
          <span class="tooltip">?<span class="tooltiptext">A title is mandatory for a Resource/Dataset. Can be any text.</span></span>
        </label>
        <input type="text" required v-model="title" />
      </div>
      <div class="form-group">
        <label>
          Description
          <span class="tooltip">?<span class="tooltiptext">A description is mandatory for a Resource/Dataset. Can be any text.</span></span>
        </label>
        <textarea type="text" required v-model="description" style="height:150px; vertical-align:top;"></textarea>
      </div>
      <div class="form-group">
        <label>
          Created
          <span class="tooltip">?<span class="tooltiptext">The date or date & time of the data's creation. Not the time now (of metadata creation)</span></span>
        </label>
        <Datepicker v-model="created"></Datepicker>
      </div>
      <div class="form-group">
        <label>
          Modified
          <span class="tooltip">?<span class="tooltiptext">The date or date & time of the data's most recent update. Not the time now (of metadata creation)</span></span>
        </label>
        <Datepicker v-model="modified"></Datepicker>
      </div>
      <div class="form-group">
        <label>
          Agent with role
          <span class="tooltip">?<span class="tooltiptext">Any description you wish to give the graph</span></span>
        </label>
        <div class="compound" style="grid-column: 2; display: grid; grid-template-columns: 100px 100px; margin-top:20px; grid-row-gap: 20px;">
          <span style="grid-column: 1;">
            Agent
            <span class="tooltip">?<span class="tooltiptext">Select existing or add new</span></span>
          </span>
          <select style="grid-column: 2;">
            <option value="nick">Nick</option>
            <option value="sandra">Sandra</option>
          </select>
          <span style="grid-column: 1;">
            Role
            <span class="tooltip">?<span class="tooltiptext">Select from list only</span></span>
          </span>
          <select style="grid-column: 2;">
            <option value="author">Author</option>
            <option value="curator">curator</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <button @click="updateRdf">Make RDF</button>
      </div>
    </form>
    <pre id="result" style="text-align:left;">
      {{ rdf }}
    </pre>
  </div>
</template>

<script>
  import Datepicker from '@vuepic/vue-datepicker';
  import '@vuepic/vue-datepicker/dist/main.css'

  export default {
    components: { Datepicker },
    data() {
      return {
        identifiers: '',
        title: '',
        description: '',
        created: '',
        modified: '',
        agent: '',
        rdf: ''
      }
    },
    methods: {
      updateRdf(e) {
        if (this.title && this.description && this.created && this.modified) {
          console.log(this.modified)
          this.rdf = `
PREFIX dcat: <http://www.w3.org/ns/dcat#>
PREFIX dcterms: <http://purl.org/dc/terms/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

<http://example.com/recource/x>
    a dcat:Resource ;
    dcterms:title "${this.title}" ;
    dcterms:description """${this.description}"""@en ;
    dcterms:created "${this.created.toISOString().substr(0,10)}"^^xsd:date ;
    dcterms:modified "${this.modified.toISOString().substr(0,10)}"^^xsd:date ;
.`
        } else {
          this.rdf = 'INCOMPLETE FORM'
        }
        e.preventDefault()
      }
    }
  }
</script>

<style>
  #container {
    margin: 30px auto;
    max-width: 50%;
    display:grid;
    grid-template-columns: 75% 25%;
  }
  form {
    grid-column: 1 ;

    background: white;
    text-align: left;
    padding: 40px;
    border-radius: 10px;

    grid-template-columns: 30% 1fr 20px;
    float:left;
  }
  h2 {
    grid-column: 1/3;
    color: #555;
  }

  .form-group{
    display:flex;
    align-items:center;
    margin-bottom:20px;
  }
  .form-group label{
    flex:1;
  }
  .form-group input,
  .form-group textarea,
  .form-group datepicker {
    flex:2;
  }

  label {
    color: #aaa;
    display: inline;
    margin: 25px 0 15px;
    font-size: 0.8em;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: bold;
  }
  input, textarea {
    display: inline;
    padding: 10px 6px;
    box-sizing: border-box;
    border: none;
    border-bottom: 1px solid #ddd;
    color: #555;
  }
  .compound {
    color: #aaa;
    font-size: 0.8em;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: bold;
  }

  button {
    width: 100px;
  }
  /* Tooltip container */
  .tooltip {
    position: relative;
    display: inline;
    border-bottom: 1px dotted black; /* If you want dots under the hoverable text */
    color: #aaa;
  }

  /* Tooltip text */
  .tooltip .tooltiptext {
    visibility: hidden;

    background-color: white;
    color: #aaa;
    text-align: center;
    padding: 5px;
    border-radius: 10px;
    border: solid 1px #666;

    /* Position the tooltip text - see examples below! */
    position: absolute;
    z-index: 1;
  }

  /* Show the tooltip text when you mouse over the tooltip container */
  .tooltip:hover .tooltiptext {
    visibility: visible;
  }

  #result {
    padding:10px;
    grid-column: 2;
  }
</style>