<script lang="ts" setup>
const WKT_TYPES = [
    "POINT",
    "LINESTRING",
    "POLYGON",
    "MULTIPOINT",
    "MULTILINESTRING",
    "MULTIPOLYGON",
    "GEOMETRYCOLLECTION",
    // circle, triangle, etc.  
];

type SpatialObj = {
    type: "geo:Geometry";
    asWKT?: {
        type: "geo:wktLiteral";
        value: string;
    };
    asGeoJSON?: {
        type: "geo:geoJSONLiteral";
        value: string;
    };
}
const model = defineModel<string | SpatialObj>({ required: true });

const iri = ref("");
const geom = ref<SpatialObj>({
    type: "geo:Geometry",
});
const data = ref("");

const emit = defineEmits<{
    clear: [];
}>();

watch(data, (newValue) => {
    if (newValue === "") {
        iri.value = "";
        geom.value = {
            type: "geo:Geometry",
        };
        model.value = "";
    } else if (newValue.startsWith("http")) {
        iri.value = newValue;
        geom.value = {
            type: "geo:Geometry",
        };
    } else if (newValue.startsWith("{")) {
        geom.value.asGeoJSON = {
            type: "geo:geoJSONLiteral",
            value: newValue,
        };
        iri.value = "";
        delete geom.value.asWKT;
    } else if (WKT_TYPES.some(t => newValue.startsWith(t))) {
        geom.value.asWKT = {
            type: "geo:wktLiteral",
            value: newValue,
        };
        iri.value = "";
        delete geom.value.asGeoJSON;
    }
});

watch(iri, (newValue) => {
    if (newValue !== "") {
        model.value = newValue;
    }
});

watch(geom, (newValue) => {
    if (Object.keys(newValue).length > 1) {
        model.value = newValue;
    }
}, { deep: true });

watch(model, (newValue) => {
    if (typeof newValue === "string") {
        data.value = newValue;
    } else if (typeof newValue === "object") {
        data.value = (newValue.asGeoJSON || newValue.asWKT)!.value;
    }
}, { deep: true })
</script>

<template>
    <div>
        <pre>{{ model }}</pre>
        <CustomInput type="text" v-model="data" @clear="data = ''; emit('clear')" />
    </div>
</template>
