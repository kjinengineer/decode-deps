![banner](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbnHLsQ%2FbtsKyo3HE7O%2FX0GKHoOT4yuMqMFLRsQAC1%2Fimg.png)

**DecodeDeps** is a dev-tool that analyzes and visualizes module dependencies in js, jsx, ts, tsx projects. It identifies modules using `import` and `require` statements and generates a graph to illustrate these relationships. By providing a visualization of module dependencies, it offers insights for building a more structured codebase.

## 🚀 Last Update v.1.2.2 (Feb 22, 2025)

- Bug Fix (Graph wasn't shown but now it's fixed)

## 🌟 Key Features

- **For js, jsx, ts and tsx files**: Visualizes module dependencies by analyzing `import` and `require` statements, providing a graph view.
- **Multiple folders**: Make it easy to analyze entire projects or specific subfolders.
- **Detect circular dependencies**: Automatically identifies circular dependencies within your modules.
- **Various Node Color**: Node colors vary based on module size, offering a quick visual indication.
- **Interactive Graph**: Navigate and explore the dependency graph with zoom and pan features, as well as adjustable node sizes and link distances, providing a fully interactive visualization

## 👀 Preview

Prepare your project.

![project](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FmPiRZ%2FbtsKHsR7bWb%2FkQuP3vEWbYG0UrMIdTxKG1%2Fimg.png "project")

Enter the command.

![command](https://blog.kakaocdn.net/dn/kOvD5/btsKw0tGTDb/wMqKSgaUXKEWht5YlCNkLK/img.gif "command")

Check the results on port 5001.

![result](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FcYzM1S%2FbtsKHNaym4D%2Fil4Q7ouMj3tjScoCVg6N20%2Fimg.png "result")

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
- **Performance-Critical Project Teams.** Optimize build performance with improved bundling.

## 💬 Contributing

If you'd like to contribute, feel free to submit a pull request or open an issue. Feedback to improve the project is always welcome!

## 📚 Docs

Find detailed documentation and updates in the [Docs](https://decode-deps.vercel.app/).

## 📝 License

This project is licensed under the **MIT License**.
