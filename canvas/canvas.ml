(* pp: -parser o -parser op -I /usr/local/lib/ocaml/3.12.1/js_of_ocaml pa_js.cmo *)
module Html = Dom_html

(* utility functions *)
let fmt = Printf.sprintf
let js = Js.string
let doc = Html.document
let log (s:string) = Firebug.console##log(js s)

let handle_drag element f =
  element##onmousedown <- Html.handler
    (fun ev ->
       let prev = ref (ev##clientX, ev##clientY) in
       let movehandler =
         Html.addEventListener Html.document Html.Event.mousemove
           (Html.handler
              (fun ev ->
                 let now = (ev##clientX, ev##clientY) in
                 f !prev now;
                 prev := now;
                 Js._true))
           Js._true
       in
       let uphandler = ref Js.null in
       uphandler := Js.some
         (Html.addEventListener Html.document Html.Event.mouseup
            (Html.handler
               (fun ev ->
                  f !prev (ev##clientX, ev##clientY);
                  Html.removeEventListener movehandler;
                  Js.Opt.iter !uphandler Html.removeEventListener;
                  Js._true))
            Js._true);
       Js._true)

let create_canvas () =
  let c = Html.createCanvas doc in
  c##width <- 640;
  c##height <- 480;
  c
;;

let start _ = 
  let canvas = create_canvas () in
  Dom.appendChild doc##body canvas;
  handle_drag canvas (fun (x1,y1) (x2,y2) ->
    let cxt = canvas##getContext(Html._2d_) in
    cxt##beginPath();
    cxt##strokeStyle <- js"#000000";
    cxt##lineWidth <- 1.;
    cxt##moveTo(float_of_int x1, float_of_int y1);
    cxt##lineTo(float_of_int x2, float_of_int y2);
    cxt##stroke();
    cxt##closePath();
    log(fmt "%d,%d" x2 y2));
  Js._false
;;

Html.window##onload <- Html.handler start
