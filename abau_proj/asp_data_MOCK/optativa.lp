%%%%%%% (3) OPTATIVA %%%%%%%
% Hay una oferta de asignaturas optativas que pueden ser incluso de otras modalidades.
% Son ESPECÍFICAS DEL CURSO (primero/segundo) y no de la modalidad en particular.
% Hay que elegir 1 (DOGA).  %% cuidado: ¿es elegir 1 o elegir 2?
% Ejemplo modalidad de ciencias:optativa(curso1, anatomia_aplicada).
optativa(curso1, "anatomia_aplicada").
optativa(curso1, "antropologia").
optativa(curso1, "cultura_cientifica").
optativa(curso1, "literatura_galega").
optativa(curso1, "2ª_lingua_estranxeira_i").
optativa(curso1, "tecnoloxia_da_informacion_e_da_comunicacion_i").
optativa(curso1, "tecnoloxias_intelixentes").

optativa(curso2, "metodos_estatisticos").
optativa(curso2, "psicoloxia").
optativa(curso2, "2ª_lingua_estranxeira_ii").
optativa(curso2, "tecnoloxia_da_informacion_e_da_comunicacion_ii").
optativa(curso2, "xeografia_e_arte_de_galicia").

% Cualquiera especifica de modalidad puede ser optativa (2.a y 2.b)
optativa(Curso, Asig) :- 
    curso(Curso),
    oblig(Curso, _, Asig). % Cualquiera "OBLIGATORIA" (2.a)
optativa(Curso, Asig) :-
    curso(Curso),
    opcion(Curso, _, Asig). % Cualquiera "DE OPCION" (2.b)