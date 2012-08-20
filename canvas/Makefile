all: canvas.js

canvas.js: canvas.exe
	js_of_ocaml canvas.exe

canvas.exe: canvas.ml
	ocamlfind -toolchain typerex ocamlc -annot -linkpkg -o $@ -syntax camlp4o -package js_of_ocaml,js_of_ocaml.syntax $<

clean::
	rm -f *.cmo *.cmi *.cmt *.exe *.annot
