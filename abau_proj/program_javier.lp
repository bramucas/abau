modalidad(ciencia).      % puedes cambiar
modalidad(humanidades).
modalidad(musica).
modalidad(artes).
% modalidad(general).

% escoger 5 grados por orden
% coeficiente(grado,asignatura,coeficiente). % asignatura segundo grado=0.1,0.2
% 
coeficiente(ia,mate2,2).

% comun(modalidad,curso,asignatura)

% escoger modalidad
{ mod(M) : modalidad(M) } = 1.


% cardinalidad
{ s(S,A) : conjunto(S,A) } = C :- card(M,S,C), mod(M). 

:- conjunto(_,A), 2 { s(S,A) }.

% dependencia
% escoger_una(C) :- :- dep(A,C), s(A). % not 1 { s(X) : conjunto(C,X) }.

% comunes 
card(ciencia,3,1).
conjunto(3,matematicas).


% modalidad (coger 2) (some from one set)
card(ciencia,1,2). % (modalidad,conjunto,cardinalidad)
conjunto(1,fyq).
conjunto(1,bio).
conjunto(1,dibujo).
conjunto(1,tecno).


% mas una optativas (no repetir?)
card(ciencia,2,1).
conjunto(2,estadistica).
% ...

% dependencia de segundo con primero
dep(mate2,4).
conjunto(4,mate1).
conjunto(4,estat).

% 
orden(5,inf).
orden(4,filosofia).
orden(3,fisica).
% ...

% 
peso(2,inf).
peso(2,filosofia).
peso(1,fisica).

% #maximize{ C,A@G : orden(O,G), s(A), coeficiente(G,A,C) }.

#maximize{ C*O,G,A : peso(O,G), s(A), coeficiente(G,A,C) }.

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

