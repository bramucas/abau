% #show s/3.
#show s_mod/1.
#show s/2.

selected_weight(D, Asig, W) :- s(_, _, Asig), orden(_, D), weight(D, Asig, W).
#show selected_weight/3.
