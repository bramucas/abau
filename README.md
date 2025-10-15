# abau
Elixe as túas materias de Bacharelato para acadar a carreira que desexas!

```
.
├── abau_proj           # ASP specification
│   ├── abau.lp            # Encoding
│   ├── asp_data/          # ASP facts encoding data
│   ├── asp_data_MOCK/     # ASP facts encoding data (mocked, reduced data for tests)
│   ├── ui/                # clinguin files for rendering a ui
│   ├── instance.lp        # Example of user's input.
│   ├── order_choice.lp    # Choice rule over user's input (used for clinguin assumptions)
│   ├── program_javier.lp  # First version
│   └── README.md
├── data
│   ├── docs                          # Data in xmls
│   └── generate_ponderations.ipynb   # Encodes the data as ASP facts.
```


### running the ui
```
clinguin client-server --domain-files {abau.lp,order_choice.lp,asp_data/database.lp} --ui-files ui-*
```