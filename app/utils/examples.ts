import metExample from "~/data/metExample.ttl?raw";
// import extraDataExample from "~/data/extraDataExample.ttl?raw";

export const exampleData: Example[] = [
    {
        label: "Example 1",
        description: "A description of a metadata record example",
        data: metExample,
        format: "text/turtle",
    },
    // {
    //     label: "Example 2",
    //     data: extraDataExample,
    //     format: "text/turtle",
    // },
];