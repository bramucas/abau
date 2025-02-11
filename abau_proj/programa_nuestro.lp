modalidad(ciencia).      % puedes cambiar
modalidad(humanidades).
modalidad(musica).
modalidad(artes).
% modalidad(general).

% escoger 5 grados por orden
% coeficiente(grado,asignatura,coeficiente). % asignatura segundo grado=0.1,0.2
% 
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
% comun(modalidad,curso,asignatura)

% escoger modalidad
{ mod(M) : modalidad(M) } = 1.


% cardinalidad
% card(Modalidad,Conjunto,Cardinalidad)
%  Para la modalidad M, el conjunto de asignaturas S tiene cardinalidad C
{ s(S,A) : conjunto(S,A) } = C :- card(M,S,C), mod(M). 
s(A) :- s(S,A).

% No se puede seleccionar una asignatura en más de un conjunto distinto?
% Revisar: esto está bien?
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

card(artes,1,2). % (modalidad,conjunto,cardinalidad)
conjunto(1,pintura).
conjunto(1,escultura).
conjunto(1,historiadelarte).
conjunto(1,teatro).

% mas una optativas (no repetir?)
card(ciencia,2,1).
conjunto(2,estadistica).
% ...

% dependencia de segundo con primero
dep(mate2,4).
conjunto(4,mate1).
conjunto(4,estat).

% 
orden(5,gei).
orden(4,filosofia).
orden(3,fisica).
% ...

% 
peso(3,gei).
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

#show s/2.
#show mod/1.