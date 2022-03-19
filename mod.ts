import { parse } from "https://deno.land/std@0.130.0/flags/mod.ts";

const args = parse(Deno.args, {
  alias: {
    "h": "help",
    "i": "index",
    "f": "file",
    "a": "author",
    "e": "errors",
    "d": "dir",
    "b": "batch",
  },
  default: {
    "help": false,
    "index": undefined,
    "file": "links",
    "author": "",
    "errors": "failed",
    "dir": "songs",
    "batch": 5,
  },
  boolean: ["help"],
});

if (args.help) {
  console.log(`
    All flags can be used with both single and double dash ( - and -- ) 
        h, help                     - Prints this dialog
        i, index 0                  - Set starting index (and enable indexing). Default: no indexing
        f, file songs.txt           - Set file to be used as input file. Default: "./links"
        a, author "The Prodigy"     - Set author/band name to be used for all songs. Default: none ("")
        e, errors failed.txt        - Set file to be used as file for failed downloads. Default: "./failed"
        d, dir "The Prodigy"        - Set/create directory to store downloads. Default: "./songs"
        b, batch 10                 - Set number of parallel downloads. Default: 5
`);
  Deno.exit();
}
let index: number | undefined = args.index;
const file = args.file;
const author = args.author;
const errors = args.errors;
const dir = args.dir;
const batch = args.batch;
try {
  await Deno.stat(dir); //folder exists
} catch (_) {
  Deno.mkdirSync(dir);
}

const songs = Deno.readTextFileSync(file).trim().split("\n");
const failed: Array<string> = new Array<string>();
const pad_len = String(songs.length).length;

for (let j = 0; j < songs.length; j += batch) {
  const downloads: Array<Promise<void | Deno.ProcessStatus>> = new Array<
    Promise<void | Deno.ProcessStatus>
  >();
  for (let k = j; (k < (j + batch)) && (k < songs.length); k++) {
    const parts = songs[k].split("https://");
    const url = ("https://" + parts[1]).trim();
    const title_elements: Array<string> = new Array<string>();
    if (index !== undefined) {
      title_elements.push(String(index++).padStart(pad_len, "0"));
    }
    if (author.length > 0) {
      title_elements.push(author);
    }
    title_elements.push(parts[0].trim());
    const title = dir + title_elements.join("-") + ".mp3";
    const download_process = Deno.run({
      cmd: [
        "youtube-dl",
        "-f",
        "bestaudio",
        "--extract-audio",
        "--audio-format",
        "mp3",
        url,
        "-o",
        title,
      ],
      stdout: "piped",
    });
    console.log(title + " started");
    downloads.push(
      download_process.status().then((stat) => {
        if (stat.success === true) {
          console.log(title + " finished");
        } else {
          console.log(title + " failed");
          failed.push(songs[k]);
        }
      }).catch((err) => {
        console.log("idk\n", err);
      }),
    );
  }
  await Promise.all(downloads);
}

if (failed.length > 0) {
  Deno.writeTextFileSync(errors, failed.join("\n"));
}
console.log("done");
