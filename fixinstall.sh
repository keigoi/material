#!/bin/sh
cd `dirname $0`

# put bookmark links on the desktop
cp *.desktop ~/Desktop

# fetch our mutated js_of_ocaml (Toplevel and docs)
wget http://proofcafe.org/~keigoi/js_of_ocaml-1.2-mutated.tar.bz2
tar jxf js_of_ocaml-1.2-mutated.tar.bz2

# for eclipse (OcaIDE) import
cd ..
ln -s material/ball .
ln -s material/canvas .

# fix lwt
echo ""
echo 'renaming duplicate .so of lwt...'
set -v # verbose
sudo mv /usr/local/lib/ocaml/3.12.1/stublibs/dlllwt-unix.so /usr/local/lib/ocaml/3.12.1/stublibs/dlllwt-unix.so.bak

