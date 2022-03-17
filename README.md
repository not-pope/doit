# doit

youtube-dl wrapper for downloading music (mp3) in batches.

### Options

Currently, available flags/options (with examples).

```
    All flags can be used with both single and double dash ( - and -- ) 
        h, help                     - Prints this dialog
        i, index 0                  - Set starting index (and enable indexing). Default: no indexing
        f, file songs.txt           - Set file to be used as input file. Default: "./links"
        a, author "The Prodigy"     - Set author/band name to be used for all songs. Default: none ("")
        e, errors failed.txt        - Set file to be used as file for failed downloads. Default: "./failed"
        d, dir "The Prodigy"        - Set/create directory to store downloads. Default: "./songs"
        b, batch 10                 - Set number of parallel downloads. Default: 5
```
### Example usage

`./doit -i 1 -f ./the_prodigy.txt --author "The Prodigy" -d "The Prodigy" -b 10`

### Notes:
doit is created using [Deno](https://deno.land/), which supports 'compiling' typescript scripts/programs by bundling full runtime with user scripts, hence creating **huge** executables (memory-wise). If you have Deno installed already, you can compile/run it yourself.
You can use `deno compile --output doit --unstable --allow--read --allow-write --allow-run mod.ts` to compile, or `deno run --allow-read --allow-write --allow-run mod.ts [your flags]`

### Dependencies

Given the nature of the script (wrapper), doit depends on [youtube-dl](https://youtube-dl.org/).
