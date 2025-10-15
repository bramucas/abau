%%%%%%% (2.B) ESPECIFICA MODALIDAD (DE OPCIÓN) %%%%%%%
% card(C, M, T, Card) En el curso C de la modadlidad M, hay que escoger Card asignaturas del tipo T
% opcion(C, M, A)   La asignatura A, es de tipo opción en el curso C de la modalidad M
card(curso1, "ciencias", opcion, 2).
opcion(curso1, "ciencias", "fisica_y_quimica").
opcion(curso1, "ciencias", "bioloxia_e_xeoloxia_e_ciencias_ambientais").
opcion(curso1, "ciencias", "debuxo_tecnico_i").
opcion(curso1, "ciencias", "tecnoloxia_e_enxeñaria_i").

card(curso2, "ciencias", opcion, 2).
opcion(curso2, "ciencias", "fisica").
opcion(curso2, "ciencias", "quimica").
opcion(curso2, "ciencias", "bioloxia").
opcion(curso2, "ciencias", "xeoloxia_e_ciencias_ambientais").
opcion(curso2, "ciencias", "debuxo_tecnico_ii").
opcion(curso2, "ciencias", "tecnoloxia_e_enxeñaria_ii").

%%%%%%% HUMANIDADES %%%%%%%%%%%%%%%

card(curso1, "humanidades", opcion, 2).
opcion(curso1, "humanidades", "economia").
opcion(curso1, "humanidades", "grego_i").
opcion(curso1, "humanidades", "historia_conmtemporanea").
opcion(curso1, "humanidades", "latin_i").
opcion(curso1, "humanidades", "literatura_universal").
opcion(curso1, "humanidades", "matematicas_aplicadas_as_ciencias_sociais_i").

card(curso2, "humanidades", opcion, 2).
opcion(curso2, "humanidades", "empresa_e_deseño_de_modelos_de_negocio").
opcion(curso2, "humanidades", "grego_ii").
opcion(curso2, "humanidades", "historia_da_arte").
opcion(curso2, "humanidades", "latin_ii").
opcion(curso2, "humanidades", "matematicas_aplicadas_as_ciencias_sociais_ii").
opcion(curso2, "humanidades", "xeografia").

%%%%%%%%%%% ARTES PLASTICAS %%%%%%%%%%%%%

card(curso1, "artes_plasticas", opcion, 2).
opcion(curso1, "artes_plasticas", "cultura_audiovisual").
opcion(curso1, "artes_plasticas", "debuxo_tecnico_aplicado_as_artes_plasticas_e_ao_deseño_i").
opcion(curso1, "artes_plasticas", "proyectos_artisticos").
opcion(curso1, "artes_plasticas", "volumen").

card(curso2, "artes_plasticas", opcion, 2).
opcion(curso2, "artes_plasticas", "debuxo_tecnico_aplicado_as_artes_plasticas_e_ao_deseño_ii").
opcion(curso2, "artes_plasticas", "deseño").
opcion(curso2, "artes_plasticas", "fundamentos_artisticos").
opcion(curso2, "artes_plasticas", "tecnicas_de_expresion_grafico-plastica").

%%%%%%%%%%% ARTES MUSICA %%%%%%%%%%%%%

card(curso1, "artes_musica", opcion, 2).
opcion(curso1, "artes_musica", "analise_musical_i").
opcion(curso1, "artes_musica", "artes_escenicas_i").
opcion(curso1, "artes_musica", "coro_e_tecnica_vocal_i").
opcion(curso1, "artes_musica", "cultura_audiovisual").
opcion(curso1, "artes_musica", "lenguaje_musical").

card(curso2, "artes_musica", opcion, 2).
opcion(curso2, "artes_musica", "analise_musical_ii").
opcion(curso2, "artes_musica", "artes_escenicas_ii").
opcion(curso2, "artes_musica", "coro_e_tecnica_vocal_ii").
opcion(curso2, "artes_musica", "historia_da_musica_e_da_danza").
opcion(curso2, "artes_musica", "literatura_dramatica").