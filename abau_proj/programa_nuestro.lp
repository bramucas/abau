% 
modalidad(ciencia).      % puedes cambiar
modalidad(humanidades).
modalidad(musica).
modalidad(artes).
% modalidad(general).

% LOS SIGUIENTES COEFICIENTES NO SON REALES
coeficiente(ia,mate2,2).
coeficiente(ia,mateapl2,2).
coeficiente(ia,bio,2).
coeficiente(ia,dib2,2).
coeficiente(ia,fis,2).
coeficiente(ia,qui,2).
coeficiente(ia,tecno2,2).
coeficiente(ia,dise,2).
coeficiente(ia,empr,2).

coeficiente(datos,mate2,2).
coeficiente(datos,bio,2).
coeficiente(datos,fis,2).
coeficiente(datos,qui,2).
coeficiente(datos,tecno2,2).
coeficiente(datos,dise,2).
coeficiente(datos,empr,2).

coeficiente(gei,mate2,2).
coeficiente(gei,fis,2).
coeficiente(gei,dib2,2).
coeficiente(gei,qui,2).
coeficiente(gei,tecno2,2).
coeficiente(gei,mateapl2,1).
coeficiente(gei,dise,1).
coeficiente(gei,empr,1).

coeficiente(gei,pintura, 1).
coeficiente(gei,escultura, 1).
coeficiente(gei,historiadelarte, 1).
coeficiente(gei,teatro, 1).

%%%%%%% (1) COMUNES A CUALQUIER MODALIDAD %%%%%%%
% NO HAY ELECCIÓN, SON OBLIGATORIAS
% POR LO TANTO NO PROCEDE INCLUIRLAS EN LA OPTIMIZACIÓN.
% comun(curso1, lengua_esp).
% comun(curso1, lengua_gal).
% comun(curso1, lengua_extranjera_1).
% comun(curso1, educacion_fisica).
% comun(curso1, filosofia).
% (...)

%%%%%%% (2.A) ESPECIFICA MODALIDAD (OBLIGATORIAS) %%%%%%%
% oblig(Curso, Modalidad, IDConjunto, Cardinalidad)
% OJO: la cardinalidad de las obligatorias siempre es 1.
%       esto se puede aprovechar para mejorar los tiempos.
oblig(curso1, ciencia, ciencia_1_1, 1).
conjunto(ciencia_1_1, mate1).

oblig(curso2, ciencia, ciencia_2_1, 1).
conjunto(ciencia_2_1, mate2).
conjunto(ciencia_2_1, mate_aplicada).

{s_oblig(Curso, Asig): conjunto(Conjunto, Asig)} = Cardinalidad :-
    curso(Curso),
    modalidad(Modalidad),
    oblig(Curso, Modalidad, Conjunto, Cardinalidad).

%%%%%%% (2.B) ESPECIFICA MODALIDAD (DE OPCIÓN) %%%%%%%
opcion(curso1, ciencia, ciencias_1_1, 2). % (modalidad,conjunto,cardinalidad)
conjunto(ciencias_1_1,fyq).
conjunto(ciencias_1_1,bio_y_xeo).
conjunto(ciencias_1_1,dibujo1).
conjunto(ciencias_1_1,tecnologia_e_ing_1).

opcion(curso2, ciencia, ciencias_2_1, 2).
conjunto(ciencias_2_1,fisica).
conjunto(ciencias_2_1,quimica).
conjunto(ciencias_2_1,bio2).
conjunto(ciencias_2_1,xeoloxia).
conjunto(ciencias_2_1,dibujo2).
conjunto(ciencias_2_1,tecnologia_e_ing_2).

{s_opcion(Curso, Asig): conjunto(Conjunto, Asig)} = Cardinalidad :- 
    curso(Curso),
    modalidad(Modalidad),
    opcion(Curso, Modalidad, Conjunto, Cardinalidad).

%%%%%%% (3) OPTATIVA %%%%%%%
% Hay una oferta de asignaturas optativas que pueden ser incluso de otras modalidades.
% Son ESPECÍFICAS DEL CURSO (primero/segundo) y no de la modalidad en particular.
% Hay que elegir 1 (DOGA).  %% cuidado: ¿es elegir 1 o elegir 2?
optativa(curso1, anatomia_aplicada).
optativa(curso1, antropologia).
optativa(curso1, cultura_cientifica).
optativa(curso1, segunda_lengua_extranjera_1).
optativa(curso1, lit_galega_siglo20).
optativa(curso1, tic1).

optativa(curso2, metodos_estadisticos).
optativa(curso2, psicologia).
optativa(curso2, segunda_lengua_extranjera_2).
optativa(curso2, tic2).
optativa(curso2, xeografia_y_arte).

% Cualquiera especifica de modalidad puede ser optativa (2.a y 2.b)
optativa(Curso, Asig) :- 
    curso(Curso),
    oblig(Curso, _, Conjunto, _).
    conjunto(Conjunto, Asig). % Cualquiera "OBLIGATORIA" (2.a)
optativa(Curso, Asig) :-
    curso(Curso),
    opcion(Curso, _, Conjunto, _).
    conjunto(Conjunto, Asig). % Cualquiera "DE OPCION" (2.b)

{s_optativa(Curso, Asig): optativa(Curso, Asig)} = 1 :- curso(Curso).

% La elección optativa no puede coincidir con: 
:- s_optativa(Curso, Asig), s_opcion(Curso, Asig). % Una elección "de opción"
:- s_optativa(Curso, Asig), s_oblig(Curso, Asig).  % Una elección "obligatoria"

% Alias
s(Curso, Asig) :- s_oblig(Curso, Asig).
s(Curso, Asig) :- s_opcion(Curso, Asig).
s(Curso, Asig) :- s_optativa(Curso, Asig).

% dependencias obligatorias de segundo con primero
dependencia(bio2, bio_y_xeo).
dependencia(xeoloxia, bio_y_xeo).
dependencia(fisica, fyq).
dependencia(quimica, fyq).
dependencia(mate2,mate1).
dependencia(tic2, tic1).
dependencia(tecnologia_e_ing_2, tecnologia_e_ing_1).

% dependencias de segundo con primero
% No puedes cursar la 2 si no has cursado la 1
:- dependencia(A2, A1), s(_, A2). not s(_, A1).

% recomendaciones de orden
%   por ejemplo, es recomendable haber cursado estadistica antes de mate2
% recomendable(mate2,estat).
% !! POR AHORA NO LAS INCLUIMOS EN LA OPTIMIZACIÓN




%%%%%%%%%%%%%% PROGRAMA %%%%%%%%%%%%%%

% escoger modalidad
% casos de cambio de modalidad no se controlan
{ mod(M) : modalidad(M) } = 1.

% Orden de preferencia del alumno respecto a las carreras
orden(5,gei).        % mayor preferencia GEI
orden(4,filosofia).
orden(3,fisica).     % menor preferencia FISICA

% #maximize{ C,A@G : orden(O,G), s(A), coeficiente(G,A,C) }.

#maximize{ Coef*O,Grado,Asig : orden(O,Grado), s(_, Asig), coeficiente(Grado,Asig,Coef) }.

% coeficiente(grado,asignatura,coeficiente). % asignatura segundo grado=0.1,0.2

%*
%
% SEGUNDO
%

% comunes


% modalidad
escoger una entre 2
coger 2 de entre X
y asi mas...

% optativas
coger una...
*%

#show s/2.
#show mod/1.