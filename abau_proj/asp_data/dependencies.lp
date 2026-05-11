% dependencias obligatorias de segundo con primero
% dependencia(A2, A1) la asignatura de segundo A2, depende obligatoriamente de la de primero A1
dependencia("lingua_castela_e_literatura_ii", "lingua_castela_e_literatura_i").
dependencia("lingua_galega_e_literatura_ii", "lingua_galega_e_literatura_i").
dependencia("lingua_extranxeira_ii", "lingua_extranxeira_i").

% ciencias %%%

%% 2A
dependencia("matematicas_ii", "matematicas_i").
% ojo también de humanidades
dependencia("matematicas_aplicadas_as_ciencias_sociais_ii", "matematicas_aplicadas_as_ciencias_sociais_i").
dependencia("matematicas_aplicadas_as_ciencias_sociais_ii", "matematicas_i").
%% 2B
dependencia("bioloxia", "bioloxia_e_xeoloxia_e_ciencias_ambientais").
dependencia("xeoloxia_e_ciencias_ambientais", "bioloxia_e_xeoloxia_e_ciencias_ambientais").
dependencia("fisica", "fisica_y_quimica").
dependencia("debuxo_tecnico_ii", "debuxo_tecnico_i").
dependencia("quimica", "fisica_y_quimica").
dependencia("tecnoloxia_e_enxeñaria_ii", "tecnoloxia_e_enxeñaria_i").


% visual arts %%%
%% 2A
dependencia("debuxo_artistico_ii", "debuxo_artistico_i").

%% 2B
dependencia("debuxo_tecnico_aplicado_as_artes_plasticas_e_ao_deseño_ii", "debuxo_tecnico_aplicado_as_artes_plasticas_e_ao_deseño_i").
dependencia("debuxo_tecnico_aplicado_as_artes_plasticas_e_ao_deseño_ii", "debuxo_tecnico_i").


% musical arts %%%
%% 2A
dependencia("analise_musical_ii", "analise_musical_i").
dependencia("artes_escenicas_ii", "artes_escenicas_i").
%% 2B
dependencia("coro_e_tecnica_vocal_ii", "coro_e_tecnica_vocal_i").


% type 3 %%%
dependencia("2ª_lingua_estranxeira_ii", "2ª_lingua_estranxeira_i").
dependencia("tecnoloxia_da_informacion_e_da_comunicacion_ii", "tecnoloxia_da_informacion_e_da_comunicacion_i").


% humanities %%
dependencia("grego_ii", "grego_i").
dependencia("latin_ii", "latin_i").


% OR
% dependencia(mate_aplicada2, mate1).
% dependencia(mate_aplicada2, mate_aplicada1).