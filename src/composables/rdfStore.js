import { ref } from "vue";
import { Store, Writer, DataFactory, Parser } from "n3";

const { namedNode, literal, blankNode } = DataFactory;

const defaultPrefixes = {
    "dcat": "http://www.w3.org/ns/dcat#",
    "dcterms": "http://purl.org/dc/terms/",
    "geo": "http://www.opengis.net/ont/geosparql#",
    "prov": "http://www.w3.org/ns/prov#",
    "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    "role": "https://w3id.org/idn/def/idn-role-codes/",
    "sdo": "https://schema.org/",
    "xsd": "http://www.w3.org/2001/XMLSchema#",
};

export function useRdfStore() {
    const store = ref(new Store());
    const prefixes = ref(defaultPrefixes);

    /**
     * Parses an RDF string in Turtle format into a store
     * 
     * @param {String} s RDF Turtle string
     */
    function parseIntoStore(s, format="text/turtle") {
        const parser = new Parser({ format });
        const p = parser.parse(s);
        store.value.addQuads(p);
        const defaultPrefixValues = Object.values(defaultPrefixes);
        const newPrefixes = Object.keys(parser._prefixes).filter(key => !defaultPrefixValues.includes(parser._prefixes[key]));
        prefixes.value = {...prefixes.value, ...newPrefixes};
    }

    /**
     * Interprets a predicate qname into its full IRI
     * 
     * Note: must be called after `parseIntoStore()`
     * 
     * @param {String} s qname string
     * @returns Predicate IRI string
     */
    function qname(s) {
        if (s === "a") { // special handling for "a" as rdf:type
            return prefixes.value.rdf + "type";
        } else {
            const [prefix, pred] = s.split(":");
            return prefixes.value[prefix] + pred;
        }
    }

    function clearStore() {
        // clear store
        store.value = new Store();

        // clear prefixes
        prefixes.value = defaultPrefixes;
    }

    function serialize() {
        const writer = new Writer({ format: "text/turtle", prefixes: prefixes.value });
        let s = "";
        for (const quad of store.value) {
            writer.addQuad(quad);
        }
        // writer.addQuad(namedNode("https://example.com/hello"), namedNode(qname("rdfs:something")), writer.blank([{predicate: namedNode(qname("rdfs:thisPred")), object: namedNode("https://something.com/else")}]))
        writer.end((error, result) => s = result);
        return s;
    }

    return { store, prefixes, parseIntoStore, qname, clearStore, serialize };
};