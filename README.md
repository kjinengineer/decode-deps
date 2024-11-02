# Dep-Track

**Dep-Track** is a module that analyzes and visualizes module dependencies in JavaScript projects. It identifies interdependent modules using `import` and `require` statements and generates a graph to illustrate these relationships. By providing a visualization of module dependencies, it offers insights for building a more structured codebase.

## Features

- **Dependency Graph Creation**: Visualize how modules within a project are interconnected in a graph format.
- **Supports `import` and `require`**: Analyzes both ES modules and CommonJS structures.
- **Dynamic Graph Adjustment**: Use sliders to adjust node size and link distance, allowing for flexible viewing.
- **Detailed Module Information**: Hover over nodes to see detailed information, like module size and other attributes.

## Preview

(Picture)

## Installation

```bash
npm install dep-track
# or
yarn add dep-track
```

## How to Use

After installing, run the module with `npx` by specifying the folder names to analyze. Input values should be in array format. To analyze files within the `./src` folder, use:

```bash
npx dep-track '["./src"]'
```

To explore multiple folders, specify them as follows:

```bash
npx dep-track '["./src", "./dist"]'
```

After running the command, you can view the results at `localhost:5001`.

## Contributing

If you'd like to contribute, feel free to submit a pull request or open an issue. Feedback to improve the project is always welcome!

## Docs

Find detailed documentation and updates in the Docs.

## License

This project is licensed under the **MIT License**.
