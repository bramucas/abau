#include "degrees.lp".
#include "dependencies.lp".
#include "oblig.lp".
#include "optativa.lp".
#include "option.lp".
% #include "recommendations.lp".
#include "subjects.lp".
#include "weights.lp".

modalidad("artes_plasticas").      
modalidad("humanidades").
modalidad("artes_musica").
modalidad("ciencias").  % ciencia o ciencias?
% modalidad("general")    % confirmar?

curso(curso1).
curso(curso2).

%%%%%%% (1) COMUNES A CUALQUIER MODALIDAD %%%%%%%
% NO HAY ELECCIÓN, SON OBLIGATORIAS
% POR LO TANTO NO PROCEDE INCLUIRLAS EN LA OPTIMIZACIÓN.
% comun(curso1, lengua_esp).
% comun(curso1, lengua_gal).
% comun(curso1, lengua_extranjera_1).
% comun(curso1, educacion_fisica).
% comun(curso1, filosofia).
% (...)