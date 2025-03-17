import init, * as oxigraph from "oxigraph/web";

export interface OxiStore {
    _store: oxigraph.Store;
    /**
     * The count of operations performed
     */
    ops: number;
    /**
     * The number of triples
     */
    size: number;
    add: (quad: oxigraph.Quad) => void;
    load: (data: string, format?: Format, graph?: string) => void;
    query: (query: string, results_format?: string, default_union_graph?: boolean) => Map<string, any>[] | oxigraph.Quad[] | boolean | string;
    update: (query: string) => void;
    delete: (quad: oxigraph.Quad) => void;
    has: (quad: oxigraph.Quad) => boolean;
    dump: (format?: Format, graph?: oxigraph.NamedNode | oxigraph.BlankNode | oxigraph.DefaultGraph | null) => string;
    match: (s?: oxigraph.Term | null, p?: oxigraph.Term | null, o?: oxigraph.Term | null, g?: oxigraph.Term | null) => oxigraph.Quad[];
};

export function useOxiStore() {
    let _store: oxigraph.Store;
    const store = ref<OxiStore>({
        ops: 0,
        size: 0,
    } as OxiStore);

    onBeforeMount(() => {
        init().then(() => {
            _store = new oxigraph.Store();

            function updateStore() {
                store.value.size = _store.size;
                store.value.ops += 1;
            }

            store.value = {
                ...store.value,
                _store,
                add: function (quad: oxigraph.Quad) {
                    _store.add(quad);
                    updateStore();
                },
                load: function (data: string, format: Format = "text/turtle", graph?: string) {
                    _store.load(data, { format, to_graph_name: graph ? oxigraph.namedNode(graph) : undefined });
                    updateStore();
                },
                query: function (query: string, results_format: string = "application/sparql-results+json", default_union_graph: boolean = true) {
                    return _store.query(query, { results_format, use_default_graph_as_union: default_union_graph });
                },
                update: function (query: string) {
                    _store.update(query);
                    updateStore();
                },
                delete: function (quad: oxigraph.Quad) {
                    _store.delete(quad);
                    updateStore();
                },
                has: function (quad: oxigraph.Quad) {
                    return _store.has(quad);
                },
                dump: function (format: Format = "text/turtle", graph: oxigraph.NamedNode | oxigraph.BlankNode | oxigraph.DefaultGraph | null = null) {
                    return _store.dump({ format, from_graph_name: graph == null ? oxigraph.defaultGraph() : graph });
                },
                match: function (s?: oxigraph.Term | null, p?: oxigraph.Term | null, o?: oxigraph.Term | null, g?: oxigraph.Term | null) {
                    return _store.match(s, p, o, g);
                }
            }
        });
    });

    return { store };
}