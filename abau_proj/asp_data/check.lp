
% que las asignaturas de segundo que tienen peso
% estén en el conjunto de asignaturas
comprobar_2dopesos_subject(Subject) :- 
    weight(_, Subject, _),
    not subject(curso2, Subject).

comprobar_subject2do_pesos(Subject) :-
    subject(curso2, Subject),
    not optativa(curso2, Subject),
    not weight(_, Subject, _).

%%%%%%%% Obligatorias   %%%%%%%%

comprobar_oblig(Subject) :-
    oblig(_, _, Subject),
    not subject(_, Subject).

comprobar_oblig2do_pesos(Subject) :-
    oblig(curso2, _, Subject),
    not weight(_, Subject, _).

%%%%%%%% opcion   %%%%%%%%

comprobar_opcion(Subject) :-
    opcion(_, _, Subject),
    not subject(_, Subject).

comprobar_opcion2do_pesos(Subject) :-
    opcion(curso2, _, Subject),
    not weight(_, Subject, _).


%%%%%%%% optativa   %%%%%%%%
comprobar_optativa(Subject) :-
    optativa(_, Subject),
    not subject(_, Subject).



comprobar_dependencia_1ero(Subject) :-
    dependencia(_, Subject),
    not subject(curso1, Subject).

comprobar_dependencia_2do(Subject) :-
    dependencia(Subject, _),
    not subject(curso2, Subject).

comprobar_dependencia_2do_pesos(Subject) :-
    dependencia(Subject, _),
    not weight(_, Subject, _).

% #show comprobar_2dopesos_subject/1.
% #show comprobar_subject2do_pesos/1.
% #show comprobar_oblig/1.
% #show comprobar_oblig2do_pesos/1.
% #show comprobar_opcion/1.
% #show comprobar_opcion2do_pesos/1.
% #show comprobar_optativa/1.
% #show comprobar_dependencia_1ero/1.
% #show comprobar_dependencia_2do/1.
#show comprobar_dependencia_2do_pesos/1.