% #maximize{ Coef@O,     Grado,Asig : orden(O,Grado), s(_, _, Asig),   weight(Grado,Asig,Coef) }.
% #maximize{ Coef@(-O), Grado, Asig : orden(O,Grado), s(curso2, Asig), weight(Grado,Asig,Coef) }.

#maximize{ Coef*O, Grado, Asig : orden(O,Grado), s(curso2, Asig), weight(Grado,Asig,Coef) }.
% #maximize{ C*O,G,A : peso(O,G), s(A), coeficiente(G,A,C) }.