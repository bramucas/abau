%%%%%%% (2.A) ESPECIFICA MODALIDAD (OBLIGATORIAS) %%%%%%%
% card(C, M, T, Card) En el curso C de la modadlidad M, hay que escoger Card asignaturas del tipo T
% oblig(C, M, A)   La asignatura A, es de tipo obligatoria en el curso C de la modalidad M
% OJO: la cardinalidad de las obligatorias siempre es 1.
%       esto se puede aprovechar para mejorar los tiempos.

%%% "ciencias"S %%%%
card(curso1, "ciencias", oblig, 1).
oblig(curso1, "ciencias", "matematicas_i").

card(curso2, "ciencias", oblig, 1).
oblig(curso2, "ciencias", "matematicas_ii").
oblig(curso2, "ciencias", "matematicas_aplicadas_as_ciencias_sociais_ii").

%%%%%% ARTES PLASTICAS %%%%%

card(curso1, "artes_plasticas", oblig, 1).
oblig(curso1, "artes_plasticas", "debuxo_artistico_i").

card(curso2, "artes_plasticas", oblig, 1).
oblig(curso2, "artes_plasticas", "debuxo_artistico_ii").

%%%ARTES MUSICA %%%%%

card(curso1, "artes_musica", oblig, 1).
oblig(curso1, "artes_musica", "analise_musical_i").
oblig(curso1, "artes_musica", "artes_escenicas_i").

card(curso2, "artes_musica", oblig, 1).
oblig(curso2, "artes_musica", "analise_musical_ii").
oblig(curso2, "artes_musica", "artes_escenicas_ii").

%% HUMANIDADES %%%%%

card(curso1, "humanidades", oblig, 1).
oblig(curso1, "humanidades", "latin_i").
oblig(curso1, "humanidades", "matematicas_aplicadas_as_ciencias_sociais_i").

card(curso2, "humanidades", oblig, 1).
oblig(curso2, "humanidades", "latin_ii").
oblig(curso2, "humanidades", "matematicas_aplicadas_as_ciencias_sociais_ii").

