elem(menu_bar, menu_bar, w).
attr(menu_bar, title, "Abau").
attr(menu_bar, icon, "fa-book").

elem(menu_bar_solve, button, menu_bar).
attr(menu_bar_solve, label, "Find My Subjects").
attr(menu_bar_solve, icon, "fa-gear").
when(menu_bar_solve, click, call, next_solution).

elem(menu_bar_clean, button, menu_bar).
attr(menu_bar_clean, label, "Clean").
attr(menu_bar_clean, icon, "fa-broom").
when(menu_bar_clean, click, call, clear_assumptions).

%------------------------------
% Extension from the paper
% -----------------------------


% % Download action for instance (We can remove it and just comment that can be used)
% elem(menu_bar_download, button, menu_bar).
% attr(menu_bar_download, label, "Download instance").
% attr(menu_bar_download, icon, "fa-download").
% when(menu_bar_download, click, call, (download("#show s/3.","catdog_instance.lp"))).

% % Download action for solution and multiple actions for call
% elem(menu_bar_download_solution, button, menu_bar).
% attr(menu_bar_download_solution, label, "Download solution").
% attr(menu_bar_download_solution, icon, "fa-download").
% when(menu_bar_download_solution, click, call, download("#show assign/2.","catdog_solution.lp")).
