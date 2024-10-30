declare module "dep-track" {
  export function depTrack(options: {
    sourceDir: string[];
    rootModule: string;
  }): void;
}
