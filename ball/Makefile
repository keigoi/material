all: ball.js

ball.js: ball.exe
	js_of_ocaml ball.exe

ball.exe: ball.ml
	ocamlfind -toolchain typerex ocamlc -annot -linkpkg -o $@ -syntax camlp4o -package js_of_ocaml,js_of_ocaml.syntax $<

clean::
	rm -f *.cmo *.cmi *.cmt *.exe *.annot
