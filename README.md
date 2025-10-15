# abau
Elixe as túas materias de Bacharelato para acadar a carreira que desexas!

```
.
├── abau_proj           # ASP specification
│   ├── abau.lp            # Encoding
│   ├── asp_data/          # ASP facts encoding data
│   ├── input.lp           # Input from the user in form of ASP facts
│   ├── program_javier.lp  # First version
│   └── README.md
├── data
│   ├── docs                          # Data in xmls
│   └── generate_ponderations.ipynb   # Encodes the data as ASP facts.
```

```
clinguin client-server --domain-files {abau.lp,order_choice.lp,asp_data/database.lp} --ui-files ui-*
```