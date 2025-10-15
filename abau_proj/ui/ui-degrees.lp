elem(w, window, root).
attr(w, flex_direction, column).

elem(degrees, container, w).
attr(degrees, min_width, 600).
attr(degrees, min_height, 200).
attr(degrees, class, ("bg-primary";"bg-opacity-25";"rounded";
                      "d-flex";"flex-column";"align-items-start";
                      "p-2";"m-2"
                    )).

elem(degrees_label, label, degrees).
attr(degrees_label, order, 1).
attr(degrees_label, label, "Select degrees in order").

elem(degree_selector(N), container, degrees) :- n(N).
attr(degree_selector(N), order, N+1) :- n(N).
attr(degree_selector(N), class, ("d-flex";"flex-row";"mt-1"; "px-2")) :- n(N).
attr(degree_selector(N), align_items, center) :- n(N).
attr(degree_selector(N), width, "100%") :- n(N).
attr(degree_selector(N), min_width,  550) :- n(N).


elem(degree_selector_label(N), label, degree_selector(N)) :- n(N).
attr(degree_selector_label(N), order, 1) :- n(N).
attr(degree_selector_label(N), label, @concat("",N)) :- n(N).

elem(degree_dd(N), dropdown_menu, degree_selector(N)) :- n(N).
attr(degree_dd(N), order, 2):- n(N).
attr(degree_dd(N), width, "100%") :- n(N).
attr(degree_dd(N), class, ("btn-sm";"btn-primary";"m-2")) :- n(N).
attr(degree_dd(N), selected, D):- _clinguin_assume(orden(N,D),true).

elem(degree_ddi(N,D), dropdown_menu_item, degree_dd(N)) :- degree(D), n(N).
attr(degree_ddi(N,D), label, D):- degree(D), n(N).
when(degree_ddi(N,D), click, call, add_assumption(orden(N, D), true)):- degree(D), n(N).


elem(output, container, w).
attr(output, class, ("bg-primary";"bg-opacity-25";"rounded";"p-2";"m-2")).

%%% en element to show the selected modalidad
elem(selected_modalidad_container, container, output).
attr(modalidad, class, ("bg-secondary";"bg-opacity-25";"d-flex";"flex-column"; "mt-1"; "p-2"; "align-items-center")).
attr(selected_modalidad_container, order, -100).

elem(selected_modalidad_value, label, selected_modalidad_container).
attr(selected_modalidad_value, label, @concat("",M)) :- s_mod(M), _clinguin_browsing.

% TODO: fix courser to be a number
curso(curso1, 1).
curso(curso2, 2).
elem(selected_subjects_for_course(Curso), container, output) :- curso(Curso,_).
attr(selected_subjects_for_course(Curso), class, ("bg-secondary";"bg-opacity-25"; "mt-1"; "p-2"; "align-items-center")) :- curso(Curso).
attr(selected_subjects_for_course(Curso), order, N) :- curso(Curso,N).

% % %%% elements to show the selected subjects
elem(selected_subject(s(Curso, Type, Subject)), label, selected_subjects_for_course(Curso)) :- s(Curso, Type, Subject), _clinguin_browsing.
attr(selected_subject(s(Curso, Type, Subject)), label, @concat("",Subject)) :- s(Curso, Type, Subject), _clinguin_browsing.
% attr(selected_subject(s(Curso, Type, Subject)), order, 20) :- s(Curso, Type, Subject), _clinguin_browsing.