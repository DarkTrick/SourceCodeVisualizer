#!/bin/sh

# This script will build the vp system and
# outputs it to a location specified in 
# the first parameter.
#  E.g.
#     `build.sh ../vp`
#  Will create 
#     vp.js
#     vp.css
#
#  IMPORTANT
#    This script must be called from withing the directory
#     where it's located.
#    Also, the output file will then be relative to that 
#     directory.



if [ -n "$1" ]; then
   out_basename=${1}
else
   out_basename=./out_vpsystem   
fi

jsstitcher ./main.js > ${out_basename}.js

# merge css:
cat `find ./ -type f -name "*.css" -not -path ${out_basename}.css` > ${out_basename}.css
