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
       (* マウスキーを押した座標でprevを初期化 *)
       let prev = ref (ev##clientX, ev##clientY) in
       (* マウスが動かされる度にfを呼ぶため、mousemoveを監視する *)
       let movehandler =
         Html.addEventListener Html.document Html.Event.mousemove
           (Html.handler
              (fun ev ->
                 (* TODO: 1.マウスポインタの現在位置をclientX/clientYで得る *)
                 (* 2: コールバック関数に、直前の位置(prev), 現在位置を渡す *)
                 (* 3: prevを現在位置で更新する *)
                 Js._true))
           Js._true
       in
      (* ドラッグが終わったタイミングでmousemoveの監視をやめるようにする *)
       let uphandler = ref Js.null in
       uphandler := Js.some
         (Html.addEventListener Html.document Html.Event.mouseup
            (Html.handler
               (fun ev ->
                  f !prev (ev##clientX, ev##clientY);
                  (* TODO：movehandler, uphandlerの登録をHtml.removeEventListenerで解除 *)
                  Js._true))
            Js._true);
       Js._true)

let create_canvas () =
  let c = Html.createCanvas doc in
  c##width <- 640;
  c##height <- 480;
  c
;;

let draw_line canvas (x1,y1) (x2,y2) =
  let cxt = canvas##getContext(Html._2d_) in
  cxt##beginPath();
  cxt##strokeStyle <- js"#000000";
  cxt##lineWidth <- 1.;
  cxt##moveTo(float_of_int x1, float_of_int y1);
  cxt##lineTo(float_of_int x2, float_of_int y2);
  cxt##stroke();
  cxt##closePath();
   ()

let start _ = 
  let canvas = create_canvas () in
  Dom.appendChild doc##body canvas;
  handle_drag canvas (fun p1 p2 ->
    draw_line canvas p1 p2);
  Js._false
;;

Html.window##onload <- Html.handler start
