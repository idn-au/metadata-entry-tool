# IDN Metadata Entry Tool

Visit here - [metadata.idnau.org](https://metadata.idnau.org/)

This repository contains a single page web application form that, when filled out correctly, generates valid RDF metadata, according to the [IDN Catalogue Profile](https://data.idnau.org/pid/cp), which can then be loaded into the [IDN Catalogue](https://data.idnau.org).

The tool also scores the metadata in real-time using [FAIR](https://www.go-fair.org/fair-principles/) and [CARE](https://www.gida-global.org/care) principles.

Currently this tool is for testing out and understanding the IDN Catalogue Profile's requirements for metadata so it doesn't submit metadata to the IDN systems automatically - it just prints it out for review. Automated submission might be added later.

## Developing

### Install & Run
To install dependencies, run:

```bash
pnpm install
```

To run locally, run:

```bash
pnpm dev
```

### Using the Form Builder
This app uses the [`vt-form`](https://github.com/VulpTech/vt-form) library for building dynamic forms, which uses [Zod](https://zod.dev/) for defining types & validation. Forms are generated from a top-level Zod schema, which is defined in `form.ts`. To define a new field, create a key in the schema object and call `vt-form` 's `formField()` function. For a basic example:

```typescript
schema: z.object({
    text: formField(z.string(), {
        label: "Text field",
        type: "text",
        initial: "",
        description: "The description of this field",
        tooltip: "Text for the tooltip",
        class: "custom-class",
    }),
})
```

## License & Rights

The contents of this repository is licensed under Creative Commons 4.0 International. See the LICENSE file in the repository for details.

All content is &copy; Indigenous Data Network, 2025

## Contacts

For technical enquiries:

**Jamie Feiss**  
*Data Infrastructure Developer*  
Indigenous Data Network  
University of Melbourne  
jamie.feiss@unimelb.edu.au

For policy:

**Levi Murray**  
*Strategic Data Manager*  
Indigenous Data Network  
University of Melbourne  
levi.murray@unimelb.edu.au
