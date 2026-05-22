#include "asp_data/database.lp".
#include "base_encoding.lp".         % Generates valid plans only

#include "utils/optimize_course.lp". 
% Optimizes plans according to user prefs
%   Input: orden(Importance, Degree)

#include "utils/default_show.lp".    
% Shows:
% - selected modality
% - selected 1st and 2nd course subjects
% - weights of the 2nd course subjects for any Degree in orden/2.
