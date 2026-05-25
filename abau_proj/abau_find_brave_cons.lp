% Intended to be used with --enum-mode=brave
% Given a set of fixed 2nd course subjects, this will  find which other 1st course
% subjects you could pick and under which types.

#include "asp_data/database.lp".
#include "base_encoding.lp".  

% Needs some input to work with
% For example, a degree and 2bach subjects
% importancia(1, "administracion e direccion de empresas").
% importancia(2, "arquitectura tecnica").

% :- not s(curso2, "quimica").
% :- not s(curso2, "matematicas_ii").
% :- not s(curso2, "fisica").
% :- not s(curso2, "empresa_e_deseño_de_modelos_de_negocio").

open_pick(Asig, T) :- s(curso1, T, Asig).
#show open_pick/2.
