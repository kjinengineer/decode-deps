const depTrack = (rootFolder: string, rootFile: string) => {
  const folder = rootFolder || "src";
  const file = rootFile || "App.tsx";

  console.log(folder, file);
};

export default depTrack;
