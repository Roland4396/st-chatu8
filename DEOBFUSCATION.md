# st-chatu8 deobfuscated fork

This fork keeps the SillyTavern extension id and install directory name as
`st-chatu8`, because the plugin code and assets reference:

```text
scripts/extensions/third-party/st-chatu8
```

The business JavaScript files were deobfuscated with `webcrack@2.16.0` under
Node.js 22.

Vendor/minified libraries are intentionally kept as-is:

- `crypto-js.min.js`
- `jszip.min.js`
- `msgpack.min.js`

Validation performed after deobfuscation:

```bash
find . -path '*/.git/*' -prune -o -type f -name '*.js' -printf '%p\n' |
  while read -r f; do
    case "${f#./}" in
      crypto-js.min.js|jszip.min.js|msgpack.min.js) continue ;;
    esac
    node --check "$f"
  done
```

All checked business JavaScript files passed syntax validation.

Note: this is a deobfuscated baseline, not yet a full manual rewrite. Some
generated local variable names may remain machine-like, but strings, control
flow, imports, exports, and function bodies are now readable enough for normal
maintenance and optimization work.
