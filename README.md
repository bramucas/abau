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



## Checking the numbers

Dejamos descomentada la modalidad que queramos contar, en el fichero `asp_data/database.lp`.
Por ejemplo, para contar los bachilleratos de artes plásticas:
```
# asp_data/database.lp
 ( ... )

modalidad("artes_plasticas").      
% modalidad("humanidades").
% modalidad("artes_musica").
% modalidad("ciencias").  % ciencia o ciencias?
% modalidad("general")    % Nunca descomentar esta modaliad, no funciona.

 ( ... )
```

Si dejamos varias sin comentar estaremos contando el cardinal de la unión.
*Nota:* ya hemos comprobado que son disjuntos.

Hay que estar en el directorio `abau_proj`
```
cd abau_proj
```

Para contar, ejecutar:
```
clingo 0 abau.lp asp_data/database.lp --project
```

Basta con descomentar otra modadlidad y volver a ejecutar para comprobar otras cuentas.
