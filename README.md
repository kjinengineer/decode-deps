# DecodeDeps

**DecodeDeps** is a dev-tool that analyzes and visualizes module dependencies in js, jsx, ts, tsx projects. It identifies modules using `import` and `require` statements and generates a graph to illustrate these relationships. By providing a visualization of module dependencies, it offers insights for building a more structured codebase.

## 🚀 Last Updated v.1.0.3 (November 4, 2024)
- Graph **zoom-in** and **zoom-out** features are now available!
- You can customize the font size.

## 🌟 Features

- **JS, JSX, TS, TSX Support**: Works seamlessly with projects using JavaScript, JSX, TypeScript, and TSX. Visualizes module dependencies by analyzing `import` and `export` statements, providing a comprehensive graph view.
- **Import & Require Support**: Analyzes both `import` and `require` statements to capture all dependencies across ES and CommonJS modules.
- **Flexible Folder Input**: Input folders as an array to scan one or multiple directories, making it easy to analyze entire projects or specific subfolders.
- **Dynamic Node Color**: Node colors vary based on module size, offering a quick visual indication of module weight. Hover over a node to view precise module size information.
- **Interactive Graph Customization**: Adjust node size and link distance with intuitive sliders. Supports drag-and-drop functionality to explore dependencies interactively.

## 👀 Preview

![example](https://blog.kakaocdn.net/dn/yJ4aw/btsKuI1usiC/Vz6FOaxntAr6cehdlPSxD1/img.gif "example")

## 📥 Installation

```bash
npm install decode-deps
```

or

```bash
yarn add decode-deps
```

## 💡 How to use (with example)

**Step 1.** Install `decode-deps`.

**Step 2.** Run the command, `npx decode-deps` with input array. You can put folder names that you want to scan. For example, to analyze files within the `./src` folder, use:

```bash
npx decode-deps '["./src"]'
```

To explore multiple folders, specify them as follows:

```bash
npx decode-deps '["./src", "./dist"]'
```

**Step 3.** After running the command, you can see the results at `localhost:5001`.

## 🛠 Contributing

If you'd like to contribute, feel free to submit a pull request or open an issue. Feedback to improve the project is always welcome!

## 📚 Docs

Find detailed documentation and updates in the [Docs](https://decode-deps.vercel.app/).

## 📝 License

This project is licensed under the **MIT License**.
