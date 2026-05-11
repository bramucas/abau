
%%%%%%% (2.A) ESPECIFICA MODALIDAD (OBLIGATORIAS) %%%%%%%
% card(C, M, T, Card) En el curso C de la modadlidad M, hay que escoger Card asignaturas del tipo T
% oblig(C, M, A)   La asignatura A, es de tipo obligatoria en el curso C de la modalidad M
%
% card(curso1, ciencia, oblig, 1).
% oblig(curso1, ciencia, mate1).

% card(curso2, ciencia, oblig, 1).
% oblig(curso2, ciencia, mate2).
% oblig(curso2, ciencia, mate_aplicada).

{s_oblig(Curso, Asig): oblig(Curso, Modalidad, Asig)} = Cardinalidad :-
    curso(Curso),
    s_mod(Modalidad),
    card(Curso, Modalidad, oblig, Cardinalidad).

%%%%%%% (2.B) ESPECIFICA MODALIDAD (DE OPCIÓN) %%%%%%%
% card(C, M, T, Card) En el curso C de la modadlidad M, hay que escoger Card asignaturas del tipo T
% opcion(C, M, A)   La asignatura A, es de tipo opción en el curso C de la modalidad M
% card(curso1, ciencia, opcion, 2).
% opcion(curso1, ciencia, fyq).
% opcion(curso1, ciencia, bio_y_xeo).
% opcion(curso1, ciencia, dibujo1).
% opcion(curso1, ciencia, tecnologia_e_ing_1).

% card(curso2, ciencia, opcion, 2).
% opcion(curso2, ciencia, fisica).
% opcion(curso2, ciencia, quimica).
% opcion(curso2, ciencia, bio2).
% opcion(curso2, ciencia, xeoloxia).
% opcion(curso2, ciencia, dibujo2).
% opcion(curso2, ciencia, tecnologia_e_ing_2).

{s_opcion(Curso, Asig): opcion(Curso, Modalidad, Asig)} = Cardinalidad :- 
    curso(Curso),
    s_mod(Modalidad),
    card(Curso, Modalidad, opcion, Cardinalidad).

% No se puede elegir una asignatura de opción (2.b) si ya se eligió como obligatoria (2.a)
:- s_opcion(Curso, Asig), s_oblig(Curso, Asig).

%%%%%%% (3) OPTATIVA %%%%%%%
% Hay una oferta de asignaturas optativas que pueden ser incluso de otras modalidades.
% Son ESPECÍFICAS DEL CURSO (primero/segundo) y no de la modalidad en particular.
% Hay que elegir 1 (DOGA).  %% cuidado: ¿es elegir 1 o elegir 2?
% Ejemplo modalidad de ciencias:
%     optativa(curso1, anatomia_aplicada).
%     optativa(curso1, antropologia).
%     optativa(curso1, cultura_cientifica).
%     optativa(curso1, segunda_lengua_extranjera_1).
%     optativa(curso1, lit_galega_siglo20).
%     optativa(curso1, tic1).
%     
%     optativa(curso2, metodos_estadisticos).
%     optativa(curso2, psicologia).
%     optativa(curso2, segunda_lengua_extranjera_2).
%     optativa(curso2, tic2).
%     optativa(curso2, xeografia_y_arte).
% % Cualquiera especifica de modalidad puede ser optativa (2.a y 2.b)
% optativa(Curso, Asig) :- 
%     curso(Curso),
%     oblig(Curso, _, Asig). % Cualquiera "OBLIGATORIA" (2.a)
% optativa(Curso, Asig) :-
%     curso(Curso),
%     opcion(Curso, _, Asig). % Cualquiera "DE OPCION" (2.b)

{s_optativa(Curso, Asig): optativa(Curso, Asig)} = 1 :- curso(Curso).

% La elección optativa no puede coincidir con: 
:- s_optativa(Curso, Asig), s_opcion(Curso, Asig). % Una elección "de opción"
:- s_optativa(Curso, Asig), s_oblig(Curso, Asig).  % Una elección "obligatoria"

% Alias
s(Curso, oblig, Asig) :- s_oblig(Curso, Asig).
s(Curso, opcion, Asig) :- s_opcion(Curso, Asig).
s(Curso, optativa, Asig) :- s_optativa(Curso, Asig).

s(Curso, Asig) :- s(Curso, _, Asig).

%%%%%%%% DEPENDENCIAS %%%%%%%%%%%%

% dependencias obligatorias de segundo con primero
% Ejemplo ciencias:
%     dependencia(bio2, bio_y_xeo).
%     dependencia(xeoloxia, bio_y_xeo).
%     dependencia(fisica, fyq).
%     dependencia(quimica, fyq).
%     dependencia(mate2,mate1).
%     dependencia(tic2, tic1).
%     dependencia(tecnologia_e_ing_2, tecnologia_e_ing_1).

% dependencias de segundo con primero
% No puedes cursar la 2 si no has cursado la 1
% :- dependencia(A2, A1), s(curso2, _, A2), not s(curso1, _, A1).
:- s(curso2, _, A2), dependencia(A2, _), {s(curso1, _, A1): s(curso1, _, A1), dependencia(A2, A1)} < 1.
% :- s(curso2, _, A2), dependencia(A2, _), not s(curso1, _, A1) : dependencia(A2, A1).


{ s_mod(M) : modalidad(M) } = 1.


% #show s/3.
% #show s_mod/1.

#show s/2.