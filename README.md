# DecodeDeps

![header](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2F30VYZ%2FbtsKw0hpge4%2F1kYksoiCRl5eNNnRBqsTY1%2Fimg.png)

**DecodeDeps** is a dev-tool that analyzes and visualizes module dependencies in js, jsx, ts, tsx projects. It identifies modules using `import` and `require` statements and generates a graph to illustrate these relationships. By providing a visualization of module dependencies, it offers insights for building a more structured codebase.

## 🚀 Last Update v.1.1.1 (November 5, 2024)

- Fix Circular Dependency Error.
- Update new UI about Circulr Dependency Error.

## 🌟 Features

- **JS, JSX, TS, TSX Support**: Works seamlessly with projects using JavaScript, JSX, TypeScript, and TSX. Visualizes module dependencies by analyzing `import` and `export` statements, providing a comprehensive graph view.
- **Import & Require Support**: Analyzes both `import` and `require` statements to capture all dependencies across ES and CommonJS modules.
- **Flexible Folder Input**: Input folders as an array to scan one or multiple directories, making it easy to analyze entire projects or specific subfolders.
- **Dynamic Node Color**: Node colors vary based on module size, offering a quick visual indication of module weight. Hover over a node to view precise module size information.
- **Interactive Graph Customization**: Adjust node size and link distance with intuitive sliders. Supports drag-and-drop functionality to explore dependencies interactively.

## 👀 Preview

Prepare your project.

![project](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FMLYe5%2FbtsKwt4gA1g%2F3W1k70jiJzRERGuBrLDik0%2Fimg.png "project")

Enter the command.

![command](https://blog.kakaocdn.net/dn/kOvD5/btsKw0tGTDb/wMqKSgaUXKEWht5YlCNkLK/img.gif "command")

Check the results on port 5001.

![result](https://blog.kakaocdn.net/dn/ciGNzZ/btsKvgZc0Fi/PO2mGfz1BfO0Rbcifakx41/img.gif "result")

## 📥 Installation

```bash
npm install decode-deps
```

or

```bash
yarn add decode-deps
```

## 💡 How to use

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

## 🔍 Who Should Use This Library?

- **Refactoring Teams.** Easily identify optimization points during routine refactoring.
- **Large Codebase Managers.** Efficiently handle complex module dependencies.
- **Junior Developers.** Quickly understand the overall code structure.
- **Performance-Critical Project Teams.** Optimize build performance with improved bundling and loading speeds.

## 💬 Contributing

If you'd like to contribute, feel free to submit a pull request or open an issue. Feedback to improve the project is always welcome!

## 📚 Docs

Find detailed documentation and updates in the [Docs](https://decode-deps.vercel.app/).

## 🛠 Planned Updates

The following features are planned for **future updates**:

- Duplicate Dependency Tracking
- File/Folder Search Function
- Unused Code Detection

## 📝 License

This project is licensed under the **MIT License**.
